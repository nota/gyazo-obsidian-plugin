import * as React from "react";
import { createRoot } from "react-dom/client";
import { GyazoImage } from "../types/index";
import { Translations } from "../i18n/index";
import GyazoPlugin from "../../main";
import { Editor, ItemView, MenuItem, WorkspaceLeaf } from "obsidian";

export const GYAZO_VIEW_TYPE = "gyazo-view";

export class GyazoView extends ItemView {
	private plugin: GyazoPlugin;
	private reactComponent: React.ReactNode;
	private root: any;
	private images: GyazoImage[] = [];
	private loading = true;
	private error: string | null = null;

	constructor(leaf: WorkspaceLeaf, plugin: GyazoPlugin) {
		super(leaf);
		this.plugin = plugin;
	}

	getViewType(): string {
		return GYAZO_VIEW_TYPE;
	}

	getDisplayText(): string {
		return this.plugin.getTranslation().ribbonTooltip;
	}

	async onOpen(): Promise<void> {
		this.contentEl.empty();
		this.contentEl.addClass("gyazo-view-container");

		const container = this.contentEl.createDiv({
			cls: "gyazo-react-container",
		});
		this.root = createRoot(container);

		this.loading = true;
		this.renderComponent();

		try {
			this.images = await this.plugin.getGyazoImages();
			this.loading = false;
			this.error = null;
		} catch (err) {
			this.loading = false;
			this.error = "Error loading images";
			console.error("Failed to load Gyazo images:", err);
		}

		this.renderComponent();
	}

	async onClose(): Promise<void> {
		if (this.root) {
			this.root.unmount();
		}
	}

	private renderComponent(): void {
		this.reactComponent = (
			<GyazoGallery
				images={this.images}
				loading={this.loading}
				error={this.error}
				translations={this.plugin.getTranslation()}
				onImageClick={this.handleImageClick.bind(this)}
				onContextMenu={this.handleContextMenu.bind(this)}
			/>
		);

		this.root.render(this.reactComponent);
	}

	private handleImageClick(image: GyazoImage): void {
		// Markdown を生成
		const markdown = `![](${image.url})`;

		// クリップボードにコピー
		navigator.clipboard.writeText(markdown);

		// 成功メッセージを表示
		this.showToast(this.plugin.getTranslation().imageCopiedToClipboard);
	}

	private showToast(message: string): void {
		// トースト要素を作成
		const toast = document.createElement("div");
		toast.className = "gyazo-toast";
		toast.textContent = message;
		document.body.appendChild(toast);

		// 表示アニメーション
		setTimeout(() => {
			toast.classList.add("show");
		}, 10);

		// 一定時間後に消す
		setTimeout(() => {
			toast.classList.remove("show");
			setTimeout(() => {
				document.body.removeChild(toast);
			}, 300);
		}, 2000);
	}

	private handleContextMenu(
		event: React.MouseEvent,
		image: GyazoImage
	): void {
		event.preventDefault();

		const menu = new this.plugin.Menu();
		const t = this.plugin.getTranslation();

		menu.addItem((item: MenuItem) => {
			item.setTitle(t.copyUrl)
				.setIcon("link")
				.onClick(() => {
					navigator.clipboard.writeText(image.permalink_url);
				});
		});

		menu.addItem((item: MenuItem) => {
			item.setTitle(t.openInBrowser)
				.setIcon("external-link")
				.onClick(() => {
					window.open(image.permalink_url, "_blank");
				});
		});

		menu.showAtMouseEvent(event.nativeEvent);
	}

	private embedImage(editor: Editor, image: GyazoImage): void {
		editor.replaceSelection(`![](${image.url})`);
	}
}

interface GyazoGalleryProps {
	images: GyazoImage[];
	loading: boolean;
	error: string | null;
	translations: Translations;
	onImageClick: (image: GyazoImage) => void;
	onContextMenu: (event: React.MouseEvent, image: GyazoImage) => void;
}

const GyazoGallery: React.FC<GyazoGalleryProps> = ({
	images,
	loading,
	error,
	translations,
	onImageClick,
	onContextMenu,
}) => {
	const [showProModal, setShowProModal] = React.useState(false);
	// クリックされた画像IDを管理する状態
	const [clickedId, setClickedId] = React.useState<string | null>(null);

	// クリックフィードバックを処理する関数
	const handleCardClick = (image: GyazoImage) => {
		if (!image.image_id || !image.permalink_url || !image.url) {
			setShowProModal(true);
			return;
		}

		// クリックされた画像のIDを設定
		setClickedId(image.image_id);

		// フィードバックアニメーション後にIDをリセット
		setTimeout(() => {
			setClickedId(null);
			onImageClick(image);
		}, 150);
	};

	if (loading) {
		return (
			<div className="gyazo-loading">{translations.loadingImages}</div>
		);
	}

	if (error) {
		return (
			<div className="gyazo-error">{translations.errorLoadingImages}</div>
		);
	}

	const plugin = (window as any).gyazoPlugin;
	const hasAccessToken = plugin && plugin.settings && plugin.settings.accessToken;
	
	if (!hasAccessToken) {
		return (
			<div className="gyazo-login-container">
				<h2>{translations.noAccessToken}</h2>
				<p>{translations.loginRequiredDesc}</p>
				
				<div className="gyazo-button-container">
					<button
						className="gyazo-login-button"
						onClick={() => {
							if (plugin) {
								plugin.openSettings();
							}
						}}
					>
						{translations.openSettings}
					</button>
					<p className="gyazo-button-desc">{translations.openSettingsDesc}</p>
					
					<button
						className="gyazo-login-button"
						onClick={() => {
							window.open('https://gyazo.com/oauth/applications', '_blank');
						}}
					>
						{translations.openApiDashboard}
					</button>
					<p className="gyazo-button-desc">{translations.openApiDashboardDesc}</p>
					
					<button
						className="gyazo-login-button"
						onClick={() => {
							window.open('https://gyazo.com/download', '_blank');
						}}
					>
						{translations.downloadGyazo}
					</button>
					<p className="gyazo-button-desc">{translations.downloadGyazoDesc}</p>
				</div>
			</div>
		);
	}
	
	if (!images.length) {
		return <div className="gyazo-empty">{translations.noImages}</div>;
	}

	const displayImages = images;

	return (
		<div className="gyazo-gallery">
			<div className="gyazo-grid">
				{displayImages.map((image, index) => {
					const isLocked =
						!image.image_id || !image.permalink_url || !image.url;
					const isClicked = clickedId === image.image_id;

					return (
						<div
							key={image.image_id || `locked-${index}`}
							className={`gyazo-card ${
								isLocked ? "gyazo-locked" : ""
							} ${isClicked ? "clicked" : ""}`}
							onClick={() => handleCardClick(image)}
							onContextMenu={(e) => {
								if (isLocked) {
									setShowProModal(true);
								} else {
									onContextMenu(e, image);
								}
							}}
						>
							<div className="gyazo-thumbnail">
								<img src={image.thumb_url} alt="" />
								{image.type !== "png" && (
									<div className="gyazo-type-badge">
										{image.type.toUpperCase()}
									</div>
								)}
							</div>
							<div className="gyazo-hover-overlay">
								<div
									className="gyazo-copy-button"
									onClick={(e) => {
										e.stopPropagation();
										if (!isLocked) {
											const markdown = `![](${image.url})`;
											navigator.clipboard.writeText(
												markdown
											);
										} else {
											setShowProModal(true);
										}
									}}
								>
									<svg
										viewBox="0 0 24 24"
										width="16"
										height="16"
									>
										<path
											fill="currentColor"
											d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"
										/>
									</svg>
								</div>
							</div>
						</div>
					);
				})}
			</div>

			{showProModal && (
				<div className="gyazo-pro-modal">
					<div className="gyazo-pro-modal-content">
						<h2>{translations.upgradeToProTitle}</h2>
						<p>{translations.upgradeToProDesc}</p>
						<button
							className="gyazo-pro-button"
							onClick={() =>
								window.open("https://gyazo.com/pro", "_blank")
							}
						>
							{translations.upgradeToProButton}
						</button>
						<button
							className="gyazo-close-button"
							onClick={() => setShowProModal(false)}
						>
							✕
						</button>
					</div>
				</div>
			)}
		</div>
	);
};
