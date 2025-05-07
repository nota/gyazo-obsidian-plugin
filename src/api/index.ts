import axios from 'axios';
import { GyazoImage } from '../types/index';

const API_HOST = 'https://api.gyazo.com';
const REDIRECT_URL = 'https://gyazo.com/oauth/obsidian/callback';
const CLIENT_ID = 'YOUR_CLIENT_ID'; // This would be replaced with actual client ID
const CLIENT_SECRET = 'YOUR_CLIENT_SECRET'; // This would be replaced with actual client secret

export class GyazoApi {
    private accessToken: string;

    constructor(accessToken: string) {
        this.accessToken = accessToken;
    }

    async getImages(limit = 100): Promise<GyazoImage[]> {
        if (!this.accessToken) {
            throw new Error('No access token provided');
        }
        
        try {
            const response = await axios.get(`${API_HOST}/api/images`, {
                params: {
                    access_token: this.accessToken,
                    per_page: limit
                }
            });
            
            return response.data;
        } catch (error) {
            console.error('Error fetching Gyazo images:', error);
            throw error;
        }
    }

    /**
     * Generate the authorization URL for OAuth
     */
    generateAuthorizeUrl(): string {
        const state = this.generateRandomState();
        const url = new URL(`${API_HOST}/oauth/authorize`);
        url.searchParams.append('client_id', CLIENT_ID);
        url.searchParams.append('redirect_uri', REDIRECT_URL);
        url.searchParams.append('response_type', 'code');
        url.searchParams.append('scope', 'public upload');
        url.searchParams.append('state', state);
        
        return url.toString();
    }
    
    /**
     * Generate a random state for OAuth security
     */
    private generateRandomState(): string {
        return Math.random().toString(36).substring(2, 15) + 
               Math.random().toString(36).substring(2, 15);
    }
    
    /**
     * Extract code from redirect URL
     */
    getCodeFromUrl(url: string): string | null {
        try {
            const params = new URL(url).searchParams;
            return params.get('code');
        } catch (error) {
            console.error('Error parsing URL:', error);
            return null;
        }
    }
    
    /**
     * Exchange code for access token
     */
    async getAccessToken(code: string): Promise<string> {
        try {
            const response = await axios.post(`${API_HOST}/oauth/token`, {
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                redirect_uri: REDIRECT_URL,
                grant_type: 'authorization_code',
                code
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            return response.data.access_token;
        } catch (error) {
            console.error('Error getting access token:', error);
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
            await axios.get(`${API_HOST}/api/users/me`, {
                params: {
                    access_token: this.accessToken
                }
            });
            return true;
        } catch (error) {
            console.error('Error validating access token:', error);
            return false;
        }
    }
}
