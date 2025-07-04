import { render, createRef, RefObject, VNode } from "preact";
import { useState } from "preact/hooks";
import { GyazoImage } from "../types/index";
import { Translations } from "../i18n/index";
import { generateGyazoMarkdown } from "../util/index";
import GyazoPlugin from "../../main";
import { ItemView, MenuItem, WorkspaceLeaf } from "obsidian";
import { GYAZO_DETAIL_VIEW_TYPE, GyazoDetailView } from "./GyazoDetailView";

export const GYAZO_VIEW_TYPE = "gyazo-view";

export class GyazoView extends ItemView {
  private plugin: GyazoPlugin;
  private reactComponent: VNode;
  private galleryRef: RefObject<HTMLDivElement> = createRef();
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
    this.galleryRef.current = container;

    this.loading = true;
    this.renderComponent();

    await this.loadImages();
  }

  async onClose(): Promise<void> {
    if (this.galleryRef.current) {
      render(null, this.galleryRef.current);
    }
  }

  async refreshImages(): Promise<void> {
    this.loading = true;
    this.renderComponent();

    await this.loadImages();
  }

  private async loadImages(): Promise<void> {
    try {
      this.images = await this.plugin.getGyazoImages();
      this.loading = false;
      this.error = null;
    } catch (err) {
      this.loading = false;
      this.error = this.plugin.getTranslation().errorLoadingImages;
      console.error("Failed to load Gyazo images:", err);
    }

    this.renderComponent();
  }

  private renderComponent(): void {
    this.reactComponent = (
      <GyazoGallery
        images={this.images}
        loading={this.loading}
        error={this.error}
        translations={this.plugin.getTranslation()}
        onImageClick={this.handleImageClick.bind(this)}
        onCopyButtonClick={this.onCopyButtonClick.bind(this)}
        onContextMenu={this.handleContextMenu.bind(this)}
        onRefresh={this.refreshImages.bind(this)}
        plugin={this.plugin}
      />
    );

    if (this.galleryRef.current) {
      render(this.reactComponent, this.galleryRef.current);
    }
  }

  private handleImageClick(image: GyazoImage): void {
    this.openDetailView(image);
  }

  private onCopyButtonClick(image: GyazoImage): void {
    // Markdown を生成
    const markdown = generateGyazoMarkdown(image, this.plugin.settings);

    // クリップボードにコピー
    navigator.clipboard.writeText(markdown);

    // 成功メッセージを表示
    this.showToast(this.plugin.getTranslation().imageCopiedToClipboard);
  }

  private openDetailView(image: GyazoImage): void {
    let detailLeaf = this.app.workspace
      .getLeavesOfType(GYAZO_DETAIL_VIEW_TYPE)
      .first();

    if (!detailLeaf) {
      detailLeaf = this.app.workspace.getLeaf("split", "vertical");
      detailLeaf.setViewState({
        type: GYAZO_DETAIL_VIEW_TYPE,
        active: true,
      });
    } else {
      this.app.workspace.revealLeaf(detailLeaf);
    }

    if (detailLeaf.view instanceof GyazoDetailView) {
      const detailView = detailLeaf.view as GyazoDetailView;
      if (typeof detailView.setImage === "function") {
        detailView.setImage(image);
      }
    }
  }

  private showToast(message: string): void {
    // トースト要素を作成
    const toast = createDiv({
      cls: "gyazo-toast",
      text: message,
    });
    document.body.appendChild(toast);

    // 表示アニメーション
    window.setTimeout(() => {
      toast.classList.add("show");
    }, 10);

    // 一定時間後に消す
    window.setTimeout(() => {
      toast.classList.remove("show");
      window.setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 2000);
  }

  private handleContextMenu(event: MouseEvent, image: GyazoImage): void {
    event.preventDefault();

    const menu = new this.plugin.Menu();
    const t = this.plugin.getTranslation();

    menu.addItem((item: MenuItem) => {
      item
        .setTitle(t.copyUrl)
        .setIcon("link")
        .onClick(() => {
          navigator.clipboard.writeText(image.permalink_url);
        });
    });

    menu.addItem((item: MenuItem) => {
      item
        .setTitle(t.openInBrowser)
        .setIcon("external-link")
        .onClick(() => {
          window.open(image.permalink_url, "_blank");
        });
    });

    menu.showAtMouseEvent(event);
  }
}

interface GyazoGalleryProps {
  images: GyazoImage[];
  loading: boolean;
  error: string | null;
  translations: Translations;
  onImageClick: (image: GyazoImage) => void;
  onCopyButtonClick: (image: GyazoImage) => void;
  onContextMenu: (event: MouseEvent, image: GyazoImage) => void;
  onRefresh: () => void;
  plugin: GyazoPlugin;
}

const GyazoGallery = ({
  images,
  loading,
  error,
  translations,
  onImageClick,
  onCopyButtonClick,
  onContextMenu,
  onRefresh,
  plugin,
}: GyazoGalleryProps) => {
  const [showProModal, setShowProModal] = useState(false);
  // クリックされた画像IDを管理する状態
  const [clickedId, setClickedId] = useState<string | null>(null);

  // クリックフィードバックを処理する関数
  const handleCardClick = (image: GyazoImage) => {
    if (!image.image_id || !image.permalink_url || !image.url) {
      setShowProModal(true);
      return;
    }

    // クリックされた画像のIDを設定
    setClickedId(image.image_id);

    // フィードバックアニメーション後にIDをリセット
    window.setTimeout(() => {
      setClickedId(null);
      onImageClick(image);
    }, 150);
  };

  if (loading) {
    return <div className="gyazo-loading">{translations.loadingImages}</div>;
  }

  if (error) {
    return <div className="gyazo-error">{translations.errorLoadingImages}</div>;
  }

  const hasAccessToken =
    plugin && plugin.settings && plugin.settings.accessToken;

  if (!hasAccessToken) {
    return (
      <div className="gyazo-login-container">
        <h2>{translations.noAccessToken}</h2>

        <div className="gyazo-button-container">
          <p className="gyazo-button-desc">{translations.openSettingsDesc}</p>
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

          <p className="gyazo-button-desc">
            {translations.openApiDashboardDesc}
          </p>
          <button
            className="gyazo-login-button"
            onClick={() => {
              window.open("https://gyazo.com/oauth/applications", "_blank");
            }}
          >
            {translations.openApiDashboard}
          </button>

          <p className="gyazo-button-desc">{translations.downloadGyazoDesc}</p>
          <button
            className="gyazo-login-button"
            onClick={() => {
              window.open("https://gyazo.com/download", "_blank");
            }}
          >
            {translations.downloadGyazo}
          </button>
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
      <div className="gyazo-header">
        <button
          className="gyazo-refresh-button"
          onClick={onRefresh}
          title={translations.refreshButton}
        >
          <svg viewBox="0 0 24 24" width="14" height="14">
            <path
              fill="currentColor"
              d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 9h7V2l-2.35 4.35z"
            />
          </svg>
          {translations.refreshButton}
        </button>
      </div>
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
              <div
                className="gyazo-thumbnail"
                style={{
                  backgroundImage: `url(${image.thumb_url})`,
                  backgroundSize: "cover",
                }}
                role="img"
                draggable={true}
                onDragStart={(e) => {
                  if (!isLocked && e.dataTransfer) {
                    e.dataTransfer.setData(
                      "text/plain",
                      generateGyazoMarkdown(image, plugin.settings),
                    );
                  } else {
                    setShowProModal(true);
                  }
                }}
              >
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
                      onCopyButtonClick(image);
                    } else {
                      setShowProModal(true);
                    }
                  }}
                >
                  <svg viewBox="0 0 24 24" width="16" height="16">
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
              onClick={() => window.open("https://gyazo.com/pro", "_blank")}
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
