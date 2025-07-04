export interface Translations {
  ribbonTooltip: string;
  accessTokenLabel: string;
  accessTokenDesc: string;
  openApiDashboard: string;
  openApiDashboardDesc: string;
  languageLabel: string;
  languageDesc: string;
  includePermalinkLinksLabel: string;
  includePermalinkLinksDesc: string;
  imageWidthLabel: string;
  imageWidthDesc: string;
  save: string;
  copyUrl: string;
  openInBrowser: string;
  copyMarkdown: string;
  copyMarkdownGif: string;
  copyMarkdownMp4: string;
  detailViewTitle: string;
  selectImageToView: string;
  uploadDate: string;
  description: string;
  title: string;
  app: string;
  source: string;
  ocr: string;
  upgradeToProTitle: string;
  upgradeToProDesc: string;
  upgradeToProButton: string;
  noImages: string;
  loadingImages: string;
  errorLoadingImages: string;
  loginRequired: string;
  loginRequiredDesc: string;
  loginButton: string;
  revokeToken: string;
  revokeTokenDesc: string;
  tokenRevoked: string;
  imageCopiedToEditor: string; // 追加: エディタに画像が挿入された時のメッセージ
  imageCopiedToClipboard: string; // 追加: クリップボードにコピーされた時のメッセージ
  imageOpenedInBrowser: string; // 追加: ブラウザで画像が開かれた時のメッセージ
  openSettings: string; // 追加: 設定画面を開くボタンのテキスト
  openSettingsDesc: string; // 追加: 設定画面を開く説明テキスト
  downloadGyazo: string; // 追加: Gyazoをダウンロードするボタンのテキスト
  downloadGyazoDesc: string; // 追加: Gyazoをダウンロードする説明テキスト
  noAccessToken: string; // 追加: アクセストークンがない場合のメッセージ
  refreshButton: string; // 追加: 更新ボタンのテキスト
}

export const translations: Record<"en" | "ja", Translations> = {
  en: {
    ribbonTooltip: "Gyazo viewer",
    accessTokenLabel: "Access token",
    accessTokenDesc: "Enter your Gyazo API access token",
    openApiDashboard: "Open API dashboard",
    openApiDashboardDesc:
      "Open Gyazo API dashboard to create a new application",
    languageLabel: "Language",
    languageDesc: "Select your preferred language",
    includePermalinkLinksLabel: "Image with link",
    includePermalinkLinksDesc: "Add links to Gyazo pages when embedding images",
    imageWidthLabel: "Image width",
    imageWidthDesc: "Set default width for embedded images",
    save: "Save",
    copyUrl: "Copy URL",
    openInBrowser: "Open in browser",
    copyMarkdown: "Copy markdown",
    copyMarkdownGif: "Copy GIF markdown",
    copyMarkdownMp4: "Copy MP4 markdown",
    detailViewTitle: "Image details",
    selectImageToView: "Select an image to view details",
    uploadDate: "Uploaded at",
    description: "Description",
    title: "Title",
    app: "App",
    source: "Source",
    ocr: "OCR",
    upgradeToProTitle: "Upgrade to Gyazo Pro",
    upgradeToProDesc: "Upgrade to Gyazo Pro to access all your captures",
    upgradeToProButton: "Upgrade now",
    noImages: "No captures found",
    loadingImages: "Loading captures...",
    errorLoadingImages: "Error loading captures",
    loginRequired: "Gyazo account required",
    loginRequiredDesc:
      "Please sign up or log in to continue using Gyazo Viewer",
    loginButton: "Sign up / log in",
    revokeToken: "Revoke access",
    revokeTokenDesc: "Revoke Gyazo access token",
    tokenRevoked: "Access token has been revoked",
    imageCopiedToEditor: "Image inserted into editor",
    imageCopiedToClipboard: "Image copied to clipboard",
    imageOpenedInBrowser: "Image opened in browser",
    openSettings: "Open plugin settings",
    openSettingsDesc:
      "Configure your Gyazo API access token in the plugin settings",
    downloadGyazo: "Download Gyazo",
    downloadGyazoDesc: "New to Gyazo? Download and install it to get started",
    noAccessToken: "Please log in or sign up to start using Gyazo",
    refreshButton: "Refresh",
  },
  ja: {
    ribbonTooltip: "Gyazo ビューワ",
    accessTokenLabel: "アクセストークン",
    accessTokenDesc: "Gyazo APIのアクセストークンを入力してください",
    openApiDashboard: "APIダッシュボードを開く",
    openApiDashboardDesc:
      "Gyazo APIダッシュボードを開いて新しいアプリケーションを作成",
    languageLabel: "言語",
    languageDesc: "表示言語を選択してください",
    includePermalinkLinksLabel: "リンクつき画像",
    includePermalinkLinksDesc:
      "画像埋め込み時にGyazoページへのリンクを追加する",
    imageWidthLabel: "画像の幅",
    imageWidthDesc: "埋め込み画像のデフォルト幅を設定",
    save: "保存",
    copyUrl: "URLをコピー",
    openInBrowser: "ブラウザで開く",
    copyMarkdown: "マークダウンをコピー",
    copyMarkdownGif: "GIF形式でマークダウンをコピー",
    copyMarkdownMp4: "MP4形式でマークダウンをコピー",
    detailViewTitle: "画像詳細",
    selectImageToView: "詳細を表示する画像を選択してください",
    uploadDate: "アップロード日時",
    description: "説明",
    title: "タイトル",
    app: "アプリケーション",
    source: "キャプチャ元",
    ocr: "OCR",
    upgradeToProTitle: "Gyazo Proにアップグレード",
    upgradeToProDesc:
      "Gyazo Proにアップグレードして全てのキャプチャにアクセスしましょう",
    upgradeToProButton: "今すぐアップグレード",
    noImages: "キャプチャが見つかりません",
    loadingImages: "キャプチャを読み込み中...",
    errorLoadingImages: "キャプチャの読み込みに失敗しました",
    loginRequired: "Gyazoアカウントが必要です",
    loginRequiredDesc:
      "Gyazoキャプチャを利用するにはサインアップまたはログインしてください",
    loginButton: "サインアップ / ログイン",
    revokeToken: "アクセス取り消し",
    revokeTokenDesc: "Gyazoアクセストークンを取り消す",
    tokenRevoked: "アクセストークンが取り消されました",
    imageCopiedToEditor: "エディタに画像を挿入しました",
    imageCopiedToClipboard: "画像をクリップボードにコピーしました",
    imageOpenedInBrowser: "ブラウザで画像が開かれました",
    openSettings: "プラグイン設定を開く",
    openSettingsDesc:
      "プラグイン設定でGyazo APIアクセストークンを設定してください",
    downloadGyazo: "Gyazoをダウンロード",
    downloadGyazoDesc:
      "Gyazoを初めて使用する場合は、ダウンロードしてインストールしてください",
    noAccessToken: "Gyazoを使用するにはログインまたはサインアップが必要です",
    refreshButton: "更新",
  },
};
