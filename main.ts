import {
	App,
	Editor,
	MarkdownView,
	Menu,
	Notice,
	Plugin,
	WorkspaceLeaf,
} from "obsidian";
import {
	GyazoPluginSettings,
	DEFAULT_SETTINGS,
	GyazoImage,
} from "./src/types/index";
import { translations, Translations } from "./src/i18n/index";
import { GyazoApi } from "./src/api/index";
import { GyazoSettingTab } from "./src/settings/index";
import { GyazoView, GYAZO_VIEW_TYPE } from "./src/ui/GyazoView";
import { GyazoDetailView, GYAZO_DETAIL_VIEW_TYPE } from "./src/ui/GyazoDetailView";

declare global {
	interface Window {
		gyazoPlugin: GyazoPlugin;
	}
}

export default class GyazoPlugin extends Plugin {
	settings: GyazoPluginSettings;
	api: GyazoApi;
	Menu: typeof Menu;

	async onload() {
		await this.loadSettings();

		this.api = new GyazoApi(this.settings.accessToken);

		(window as any).gyazoPlugin = this;

		this.Menu = Menu;

		this.registerView(
			GYAZO_VIEW_TYPE,
			(leaf: WorkspaceLeaf) => new GyazoView(leaf, this)
		);

		this.registerView(
			GYAZO_DETAIL_VIEW_TYPE,
			(leaf: WorkspaceLeaf) => new GyazoDetailView(leaf, this)
		);

		const ribbonIconEl = this.addRibbonIcon(
			"camera",
			this.getTranslation().ribbonTooltip,
			async () => {
				await this.activateView();
			}
		);

		this.addSettingTab(new GyazoSettingTab(this.app, this));

		this.registerObsidianProtocolHandler("gyazo-oauth", async (params) => {
			if (params.code) {
				try {
					const accessToken = await this.api.getAccessToken(
						params.code
					);
					this.settings.accessToken = accessToken;
					this.api = new GyazoApi(accessToken);
					await this.saveSettings();
					new Notice(
						this.getTranslation().loginButton +
							" " +
							this.getTranslation().save
					);

					const leaves =
						this.app.workspace.getLeavesOfType(GYAZO_VIEW_TYPE);
					if (leaves.length > 0) {
						const view = leaves[0].view as GyazoView;
						await view.onOpen();
					}
				} catch (error) {
					console.error("Error getting access token:", error);
					new Notice("Failed to authenticate with Gyazo");
				}
			}
		});

		this.registerDomEvent(document, "dragover", (evt: DragEvent) => {
			evt.preventDefault();
		});

		this.registerDomEvent(document, "drop", async (evt: DragEvent) => {
			evt.preventDefault();

			const activeLeaf = this.app.workspace.activeLeaf;
			if (!activeLeaf) return;

			const view = activeLeaf.view;
			if (!(view instanceof MarkdownView)) return;

			const editor = view.editor;

			if (evt.dataTransfer?.getData("gyazo/image")) {
				const imageId = evt.dataTransfer.getData("gyazo/image");
				const images = await this.getGyazoImages();
				const image = images.find((img) => img.image_id === imageId);

				if (image) {
					editor.replaceSelection(`![](${image.url})`);
				}
			}
		});
	}

	onunload() {
		this.app.workspace.detachLeavesOfType(GYAZO_VIEW_TYPE);
		this.app.workspace.detachLeavesOfType(GYAZO_DETAIL_VIEW_TYPE);
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	getTranslation(): Translations {
		return translations[this.settings.language];
	}
	
	openSettings(): void {
		const settings = (this.app as any)?.setting;
		if (settings?.open && settings?.openTabById) {
			settings.open();
			setTimeout(() => {
				settings.openTabById('obsidian-gyazo-plugin');
			}, 100);
		} else {
			console.error("Failed to open settings: 'setting' API is unavailable.");
			new Notice("Unable to open settings. Please check if the plugin is compatible with your Obsidian version.");
		}
	}

	async getGyazoImages(): Promise<GyazoImage[]> {
		if (!this.settings.accessToken) {
			new Notice(
				"Please set your Gyazo access token in the plugin settings"
			);
			return [];
		}

		try {
			return await this.api.getImages(100);
		} catch (error) {
			console.error("Error fetching Gyazo images:", error);
			new Notice(
				"Failed to fetch Gyazo images. Check your access token and try again."
			);
			return [];
		}
	}

	getActiveEditor(): Editor | null {
		const activeLeaf = this.app.workspace.activeLeaf;
		if (!activeLeaf) return null;

		const view = activeLeaf.view;
		if (!(view instanceof MarkdownView)) return null;

		return view.editor;
	}

	async activateView() {
		const { workspace } = this.app;

		let leaf: WorkspaceLeaf | null =
			workspace.getLeavesOfType(GYAZO_VIEW_TYPE)[0];

		if (!leaf) {
			const rightLeaf = workspace.getRightLeaf(false);
			if (rightLeaf) {
				leaf = rightLeaf;
				await leaf.setViewState({ type: GYAZO_VIEW_TYPE });
			}
		}

		if (leaf) {
			workspace.revealLeaf(leaf);
		}
	}
}
