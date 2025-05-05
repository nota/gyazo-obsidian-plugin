import axios from 'axios';
import { GyazoImage } from '../types/index';

export class GyazoApi {
    private accessToken: string;

    constructor(accessToken: string) {
        this.accessToken = accessToken;
    }

    async getImages(limit = 100): Promise<GyazoImage[]> {
        try {
            const response = await axios.get('https://api.gyazo.com/api/images', {
                params: {
                    access_token: this.accessToken,
                    per_page: limit
                }
            });
            
            return response.data.map((image: any) => ({
                image_id: image.image_id,
                permalink_url: image.permalink_url,
                thumb_url: image.thumb_url,
                url: image.url,
                type: this.determineType(image),
                created_at: image.created_at,
                metadata: image.metadata || {}
            }));
        } catch (error) {
            console.error('Error fetching Gyazo images:', error);
            throw error;
        }
    }

    private determineType(image: any): 'png' | 'gif' | 'mp4' {
        if (image.type === 'gif' || (image.url && image.url.endsWith('.gif'))) {
            return 'gif';
        } else if (image.type === 'mp4' || (image.url && image.url.endsWith('.mp4'))) {
            return 'mp4';
        }
        return 'png';
    }
}
