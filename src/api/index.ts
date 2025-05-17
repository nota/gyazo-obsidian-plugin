import { GyazoImage } from "../types/index";
import { RequestUrlParam, requestUrl } from "obsidian";

const API_HOST = "https://api.gyazo.com";
const REDIRECT_URL = "https://gyazo.com/oauth/obsidian/callback";
const CLIENT_ID = "YOUR_CLIENT_ID"; // This would be replaced with actual client ID
const CLIENT_SECRET = "YOUR_CLIENT_SECRET"; // This would be replaced with actual client secret

export class GyazoApi {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  async getImages(limit = 100): Promise<GyazoImage[]> {
    if (!this.accessToken) {
      throw new Error("No access token provided");
    }

    try {
      // Construct URL with query parameters
      const url = new URL(`${API_HOST}/api/images`);
      url.searchParams.append("access_token", this.accessToken);
      url.searchParams.append("per_page", limit.toString());

      const response = await requestUrl({
        url: url.toString(),
        method: "GET",
      });

      return response.json;
    } catch (error) {
      console.error("Error fetching Gyazo images:", error);
      throw error;
    }
  }

  /**
   * Generate the authorization URL for OAuth
   */
  generateAuthorizeUrl(): string {
    const state = this.generateRandomState();
    const url = new URL(`${API_HOST}/oauth/authorize`);
    url.searchParams.append("client_id", CLIENT_ID);
    url.searchParams.append("redirect_uri", REDIRECT_URL);
    url.searchParams.append("response_type", "code");
    url.searchParams.append("scope", "public upload");
    url.searchParams.append("state", state);

    return url.toString();
  }

  /**
   * Generate a random state for OAuth security
   */
  private generateRandomState(): string {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }

  /**
   * Extract code from redirect URL
   */
  getCodeFromUrl(url: string): string | null {
    try {
      const params = new URL(url).searchParams;
      return params.get("code");
    } catch (error) {
      console.error("Error parsing URL:", error);
      return null;
    }
  }

  /**
   * Exchange code for access token
   */
  async getAccessToken(code: string): Promise<string> {
    try {
      const params: RequestUrlParam = {
        url: `${API_HOST}/oauth/token`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          redirect_uri: REDIRECT_URL,
          grant_type: "authorization_code",
          code,
        }),
      };

      const response = await requestUrl(params);
      return response.json.access_token;
    } catch (error) {
      console.error("Error getting access token:", error);
      throw error;
    }
  }

  /**
   * Validate the access token
   */
  async validateAccessToken(): Promise<boolean> {
    if (!this.accessToken) {
      return false;
    }

    try {
      // Construct URL with query parameters
      const url = new URL(`${API_HOST}/api/users/me`);
      url.searchParams.append("access_token", this.accessToken);

      const response = await requestUrl({
        url: url.toString(),
        method: "GET",
      });

      return response.status === 200;
    } catch (error) {
      console.error("Error validating access token:", error);
      return false;
    }
  }
}
