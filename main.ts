import {
  addIcon,
  Editor,
  MarkdownView,
  Menu,
  Notice,
  Plugin,
  WorkspaceLeaf,
} from "obsidian";
import { generateGyazoMarkdown } from "./src/util/index";
import {
  GyazoPluginSettings,
  DEFAULT_SETTINGS,
  GyazoImage,
} from "./src/types/index";
import { translations, Translations } from "./src/i18n/index";
import { GyazoApi } from "./src/api/index";
import { GyazoSettingTab } from "./src/settings/index";
import { GyazoView, GYAZO_VIEW_TYPE } from "./src/ui/GyazoView";
import {
  GyazoDetailView,
  GYAZO_DETAIL_VIEW_TYPE,
} from "./src/ui/GyazoDetailView";

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
      (leaf: WorkspaceLeaf) => new GyazoView(leaf, this),
    );

    this.registerView(
      GYAZO_DETAIL_VIEW_TYPE,
      (leaf: WorkspaceLeaf) => new GyazoDetailView(leaf, this),
    );

    addIcon(
      "gyazo",
      `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100" fill="none" data-__embeded-gyazo-content-j-s-teams="5.11.2" data-__gyazo-expander-enabled="true" data-__embeded-gyazo-content-j-s-dev="5.12.7500.23415">
<path fill-rule="evenodd" clip-rule="evenodd" d="M87.5000 42.8921H65.2313L82.0867 76.4725C82.0796 76.5017 82.0650 76.5309 82.0580 76.5667L82.0208 76.6625C82.0062 76.6975 81.9917 76.7325 81.9846 76.7608L81.9630 76.8258L81.9110 76.9433C81.9110 76.9433 81.8817 77.0192 81.8746 77.0400C81.8601 77.0750 81.8455 77.1083 81.8310 77.1442L81.7938 77.2329C81.7722 77.2883 81.7506 77.3383 81.7290 77.3937C81.7145 77.4229 81.6660 77.5225 81.6660 77.5225C81.6589 77.5442 81.6443 77.5658 81.6373 77.5808L81.5925 77.6575L81.5854 77.6650L81.5407 77.7525C81.5261 77.7800 81.5045 77.8150 81.4900 77.8433C81.4754 77.8650 81.4609 77.8942 81.4463 77.9208C81.4463 77.9208 81.4025 77.9942 81.3954 78.0108L81.3367 78.1037C81.2995 78.1625 81.2703 78.2150 81.2411 78.2592L81.1900 78.3383L81.1528 78.3883L81.0817 78.5067C81.0671 78.5350 81.0455 78.5642 81.0239 78.5875C81.0239 78.5875 80.9876 78.6392 80.9730 78.6608C80.9514 78.6900 80.9338 78.7192 80.9193 78.7475L80.8673 78.8250C80.2092 79.6900 79.4096 80.4433 78.4925 81.0437L67.7763 59.6967L23.2677 81.9275L23.2532 81.9204C23.2240 81.9133 23.1948 81.8996 23.1656 81.8850C23.1363 81.8704 23.1071 81.8633 23.0779 81.8487C23.0412 81.8342 23.0120 81.8196 22.9827 81.8050L22.9010 81.7667C22.8642 81.7521 22.8270 81.7375 22.7978 81.7229L22.7091 81.6863C22.6567 81.6654 22.6042 81.6354 22.5517 81.6146L22.4420 81.5629C22.4128 81.5483 22.3835 81.5412 22.3543 81.5267C22.3326 81.5196 22.2792 81.4883 22.2792 81.4883C22.2792 81.4883 22.2058 81.4521 22.1767 81.4375C22.1475 81.4230 22.1183 81.4084 22.0891 81.3938C22.0600 81.3792 22.0308 81.3646 22.0016 81.3429L21.9130 81.2883L21.8200 81.2275C21.7808 81.1992 21.7283 81.1700 21.6758 81.1417L21.5871 81.0900L21.5196 81.0458L21.4163 80.9800C21.3871 80.9583 21.3579 80.9437 21.3287 80.9192C21.3071 80.9046 21.2483 80.8613 21.2483 80.8613C21.2191 80.8396 21.1975 80.8250 21.1683 80.8092L21.0900 80.7521C20.2310 80.1213 19.4829 79.3483 18.8887 78.4321L40.2188 67.7775L17.9132 23.4400C18.5587 21.5825 19.8056 20.0000 21.4193 18.9200L32.0843 40.1130L87.3021 12.5000H26.5391C18.7861 12.5000 12.5000 18.7671 12.5000 26.4967V73.5033C12.5000 81.2329 18.7861 87.5000 26.5391 87.5000H73.4609C81.2139 87.5000 87.5000 81.2329 87.5000 73.5033V42.8921Z" fill="currentColor"/>
</svg>`,
    );

    this.addRibbonIcon(
      "gyazo",
      this.getTranslation().ribbonTooltip,
      async () => {
        await this.activateView();
      },
    );

    this.addSettingTab(new GyazoSettingTab(this.app, this));

    this.registerObsidianProtocolHandler("gyazo-oauth", async (params) => {
      if (params.code) {
        try {
          const accessToken = await this.api.getAccessToken(params.code);
          this.settings.accessToken = accessToken;
          this.api = new GyazoApi(accessToken);
          await this.saveSettings();
          new Notice(
            this.getTranslation().loginButton +
              " " +
              this.getTranslation().save,
          );

          const leaves = this.app.workspace.getLeavesOfType(GYAZO_VIEW_TYPE);
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
          editor.replaceSelection(generateGyazoMarkdown(image, this.settings));
        }
      }
    });
  }

  onunload() {
    // Obsidian handles view cleanup automatically
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
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
        settings.openTabById("obsidian-gyazo-plugin");
      }, 100);
    } else {
      console.error("Failed to open settings: 'setting' API is unavailable.");
      new Notice(
        "Unable to open settings. Please check if the plugin is compatible with your Obsidian version.",
      );
    }
  }

  async getGyazoImages(): Promise<GyazoImage[]> {
    if (!this.settings.accessToken) {
      new Notice("Please set your Gyazo access token in the plugin settings");
      return [];
    }

    try {
      return await this.api.getImages(100);
    } catch (error) {
      console.error("Error fetching Gyazo images:", error);
      new Notice(
        "Failed to fetch Gyazo images. Check your access token and try again.",
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
