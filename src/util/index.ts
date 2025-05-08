import { GyazoImage, GyazoPluginSettings } from "../types/index";

/**
 * Generates markdown code for a Gyazo image with optional link to its permalink page
 * @param image The Gyazo image object
 * @param settings The plugin settings
 * @returns Markdown string with image and optional link
 */
export function generateGyazoMarkdown(image: GyazoImage, settings?: GyazoPluginSettings): string {
	const altText = image.alt_text ?? "";
	
	if (settings && settings.includePermalinkLinks === false) {
		return `![${altText}](${image.url})`;
	}
	
	return `[![${altText}](${image.url})](${image.permalink_url})`;
}
