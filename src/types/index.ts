export interface GyazoPluginSettings {
  accessToken: string;
  language: 'en' | 'ja';
  isPro: boolean;
  oauthState?: string;
}

export const DEFAULT_SETTINGS: GyazoPluginSettings = {
  accessToken: '',
  language: 'en',
  isPro: false,
  oauthState: ''
};

export interface GyazoImage {
  image_id: string;
  permalink_url: string;
  thumb_url: string;
  url: string;
  type: 'png' | 'gif' | 'mp4';
  created_at: string;
  metadata?: {
      title?: string;
      app?: string;
      desc?: string;
  };
}
