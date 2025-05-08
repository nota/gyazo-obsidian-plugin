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
	type: "png" | "gif" | "jpg" | "webp" | "heic";
	created_at: string;
	alt_text?: string;
	ocr?: {
		locale: string;
		description: string;
	};
	metadata: {
		app?: string;
		title?: string;
		url?: string;
		desc: string;
		original_title?: string;
		original_url?: string;
	};
}
