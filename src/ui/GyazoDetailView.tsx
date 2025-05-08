import * as React from "react";
import { createRoot } from "react-dom/client";
import { GyazoImage } from "../types/index";
import { Translations } from "../i18n/index";
import GyazoPlugin from "../../main";
import { ItemView, WorkspaceLeaf } from "obsidian";

export const GYAZO_DETAIL_VIEW_TYPE = "gyazo-detail-view";

export class GyazoDetailView extends ItemView {
	private plugin: GyazoPlugin;
	private reactComponent: React.ReactNode;
	private root: any;
	private image: GyazoImage | null = null;

	constructor(leaf: WorkspaceLeaf, plugin: GyazoPlugin) {
		super(leaf);
		this.plugin = plugin;
	}

	getViewType(): string {
		return GYAZO_DETAIL_VIEW_TYPE;
	}

	getDisplayText(): string {
		return this.plugin.getTranslation().detailViewTitle;
	}

	async onOpen(): Promise<void> {
		this.contentEl.empty();
		this.contentEl.addClass("gyazo-detail-view-container");

		const container = this.contentEl.createDiv({
			cls: "gyazo-detail-react-container",
		});
		this.root = createRoot(container);

		this.renderComponent();
	}

	async onClose(): Promise<void> {
		if (this.root) {
			this.root.unmount();
		}
	}

	setImage(image: GyazoImage): void {
		this.image = image;
		this.renderComponent();
	}

	private renderComponent(): void {
		this.reactComponent = (
			<GyazoDetailComponent
				image={this.image}
				translations={this.plugin.getTranslation()}
			/>
		);

		this.root.render(this.reactComponent);
	}
}

interface GyazoDetailComponentProps {
	image: GyazoImage | null;
	translations: Translations;
}

const GyazoDetailComponent: React.FC<GyazoDetailComponentProps> = ({
	image,
	translations,
}) => {
	if (!image) {
		return (
			<div className="gyazo-detail-empty">
				{translations.selectImageToView}
			</div>
		);
	}

	const formatDate = (dateString: string) => {
		try {
			const date = new Date(dateString);
			return date.toLocaleString();
		} catch (e) {
			return dateString;
		}
	};

	const handleCopyMarkdown = () => {
		const markdown = `![](${image.url})`;
		navigator.clipboard.writeText(markdown);
		
		const toast = document.createElement("div");
		toast.className = "gyazo-toast";
		toast.textContent = translations.imageCopiedToClipboard;
		document.body.appendChild(toast);
		
		setTimeout(() => {
			toast.classList.add("show");
		}, 10);
		
		setTimeout(() => {
			toast.classList.remove("show");
			setTimeout(() => {
				document.body.removeChild(toast);
			}, 300);
		}, 2000);
	};

	return (
		<div className="gyazo-detail-view">
			<div className="gyazo-detail-header">
				<h2 className="gyazo-detail-title">
					{translations.detailViewTitle}
				</h2>
			</div>
			
			<div className="gyazo-detail-image-container">
				<img src={image.url} alt="" className="gyazo-detail-image" />
			</div>
			
			<div className="gyazo-detail-actions">
				<button 
					className="gyazo-detail-action-button"
					onClick={handleCopyMarkdown}
					title={translations.copyMarkdown}
				>
					<svg viewBox="0 0 24 24" width="16" height="16">
						<path
							fill="currentColor"
							d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"
						/>
					</svg>
					{translations.copyMarkdown}
				</button>
				
				<button 
					className="gyazo-detail-action-button"
					onClick={() => window.open(image.permalink_url, "_blank")}
					title={translations.openInBrowser}
				>
					<svg viewBox="0 0 24 24" width="16" height="16">
						<path
							fill="currentColor"
							d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"
						/>
					</svg>
					{translations.openInBrowser}
				</button>
			</div>
			
			<div className="gyazo-metadata">
				<div className="gyazo-metadata-item">
					<span className="gyazo-metadata-label">{translations.uploadDate}:</span> 
					{formatDate(image.created_at)}
				</div>
				
				{image.metadata?.desc && (
					<div className="gyazo-metadata-item">
						<span className="gyazo-metadata-label">{translations.description}:</span> 
						{image.metadata.desc}
					</div>
				)}
				
				{image.metadata?.title && (
					<div className="gyazo-metadata-item">
						<span className="gyazo-metadata-label">{translations.title}:</span> 
						{image.metadata.title}
					</div>
				)}
				
				{image.metadata?.app && (
					<div className="gyazo-metadata-item">
						<span className="gyazo-metadata-label">{translations.app}:</span> 
						{image.metadata.app}
					</div>
				)}
				
				<div className="gyazo-metadata-item">
					<span className="gyazo-metadata-label">{translations.type}:</span> 
					{image.type.toUpperCase()}
				</div>
			</div>
		</div>
	);
};
