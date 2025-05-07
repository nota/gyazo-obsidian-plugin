export interface Translations {
	ribbonTooltip: string;
	settingsTitle: string;
	accessTokenLabel: string;
	accessTokenDesc: string;
	openApiDashboard: string;
	openApiDashboardDesc: string;
	languageLabel: string;
	languageDesc: string;
	save: string;
	copyUrl: string;
	openInBrowser: string;
	copyMarkdownGif: string;
	copyMarkdownMp4: string;
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
}

export const translations: Record<"en" | "ja", Translations> = {
	en: {
		ribbonTooltip: "Gyazo Captures",
		settingsTitle: "Gyazo Plugin Settings",
		accessTokenLabel: "Access Token",
		accessTokenDesc: "Enter your Gyazo API access token",
		openApiDashboard: "Open API Dashboard",
		openApiDashboardDesc:
			"Open Gyazo OAuth applications page to get your access token",
		languageLabel: "Language",
		languageDesc: "Select your preferred language",
		save: "Save",
		copyUrl: "Copy URL",
		openInBrowser: "Open in Browser",
		copyMarkdownGif: "Copy GIF Markdown",
		copyMarkdownMp4: "Copy MP4 Markdown",
		upgradeToProTitle: "Upgrade to Gyazo Pro",
		upgradeToProDesc: "Upgrade to Gyazo Pro to access all your captures",
		upgradeToProButton: "Upgrade Now",
		noImages: "No captures found",
		loadingImages: "Loading captures...",
		errorLoadingImages: "Error loading captures",
		loginRequired: "Gyazo Account Required",
		loginRequiredDesc:
			"Please sign up or log in to continue using Gyazo captures",
		loginButton: "Sign up / Log in",
		revokeToken: "Revoke Access",
		revokeTokenDesc: "Revoke Gyazo access token",
		tokenRevoked: "Access token has been revoked",
		imageCopiedToEditor: "Image inserted into editor",
		imageCopiedToClipboard: "Image copied to clipboard",
		imageOpenedInBrowser: "Image opened in browser",
	},
	ja: {
		ribbonTooltip: "Gyazoキャプチャ",
		settingsTitle: "Gyazoプラグイン設定",
		accessTokenLabel: "アクセストークン",
		accessTokenDesc: "Gyazo APIのアクセストークンを入力してください",
		openApiDashboard: "APIダッシュボードを開く",
		openApiDashboardDesc:
			"Gyazo OAuthアプリケーションページを開いてアクセストークンを取得する",
		languageLabel: "言語",
		languageDesc: "表示言語を選択してください",
		save: "保存",
		copyUrl: "URLをコピー",
		openInBrowser: "ブラウザで開く",
		copyMarkdownGif: "GIF形式でマークダウンをコピー",
		copyMarkdownMp4: "MP4形式でマークダウンをコピー",
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
	},
};
