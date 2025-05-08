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

	return (
		<div className="gyazo-detail-view">
			<div className="gyazo-detail-image-container">
				<a
					href={`https://gyazo.com/${image.image_id}`}
					onClick={(e) => {
						e.preventDefault();
						window.open(
							`https://gyazo.com/${image.image_id}`,
							"_blank"
						);
					}}
				>
					<img
						src={image.url}
						alt=""
						className="gyazo-detail-image"
					/>
				</a>
			</div>

			{image.metadata.desc && (
				<h2 className="gyazo-image-description">
					{image.metadata.desc}
				</h2>
			)}

			<div className="gyazo-metadata">
				<div className="gyazo-metadata-item">
					<div className="gyazo-metadata-label">
						{translations.uploadDate}
					</div>
					<div className="gyazo-metadata-value">
						<a
							href={`https://gyazo.com/captures?jump=${image.image_id}`}
							onClick={(e) => {
								e.preventDefault();
								window.open(
									`https://gyazo.com/captures?jump=${image.image_id}`,
									"_blank"
								);
							}}
							className="gyazo-source-link"
						>
							{formatDate(image.created_at)}
						</a>
					</div>
				</div>

				{image.metadata?.app && (
					<div className="gyazo-metadata-item">
						<div className="gyazo-metadata-label">
							{translations.app}
						</div>
						<div className="gyazo-metadata-value">
							{image.metadata.app}
						</div>
					</div>
				)}

				{image.metadata?.url && (
					<div className="gyazo-metadata-item">
						<div className="gyazo-metadata-label">
							{translations.source}
						</div>
						<div className="gyazo-metadata-value">
							{image.metadata?.url ? (
								<a
									href={image.metadata.url}
									onClick={(e) => {
										e.preventDefault();
										window.open(
											image.metadata?.url,
											"_blank"
										);
									}}
									className="gyazo-source-link"
								>
									{image.metadata?.title}
								</a>
							) : (
								<span>{image.metadata?.title}</span>
							)}
						</div>
					</div>
				)}

				{image.ocr?.description && (
					<div className="gyazo-metadata-item">
						<div className="gyazo-metadata-label">
							{translations.ocr}
						</div>
						<div className="gyazo-metadata-value">
							{image.ocr.description}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};
