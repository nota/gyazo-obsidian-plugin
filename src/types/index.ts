export interface GyazoPluginSettings {
  accessToken: string;
  language: 'en' | 'ja';
  oauthState?: string;
}

export const DEFAULT_SETTINGS: GyazoPluginSettings = {
  accessToken: '',
  language: 'en',
  oauthState: ''
};

export interface GyazoImage {
  image_id: string;
  permalink_url: string;
  thumb_url: string;
  url: string;
  mp4_url?: string;  // Added mp4_url property
  type: 'png' | 'gif' | 'mp4';
  created_at: string;
  metadata?: {
      title?: string;
      app?: string;
      desc?: string;
  };
}
