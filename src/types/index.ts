export interface GyazoPluginSettings {
	accessToken: string;
	language: "en" | "ja";
	oauthState?: string;
}

export const DEFAULT_SETTINGS: GyazoPluginSettings = {
	accessToken: "",
	language: "en",
	oauthState: "",
};

export interface GyazoImage {
	image_id: string;
	permalink_url: string;
	thumb_url: string;
	url: string;
	type: "png" | "gif" | "jpg" | "png" | "webp" | "heic";
	created_at: string;
	desc: string;
	metadata?: {
		app?: string;
		title?: string;
		url?: string;
		original_title?: string;
		original_url?: string;
	};
}
