import { GyazoImage, GyazoPluginSettings } from "../types/index";

/**
 * Generates markdown code for a Gyazo image with optional link to its permalink page
 * @param image The Gyazo image object
 * @param settings The plugin settings
 * @returns Markdown string with image and optional link
 */
export function generateGyazoMarkdown(
	image: GyazoImage,
	settings?: GyazoPluginSettings,
): string {
	const altText = image.alt_text ?? "";
	const imageWidth = settings?.enableImageWidth ? settings.imageWidth : 0;

	const imageEmbeddingContentArray = [];
	if (altText) {
		imageEmbeddingContentArray.push(altText);
	}
	if (imageWidth > 0) {
		imageEmbeddingContentArray.push(imageWidth.toString());
	}

	const imageEmbeddingContent = imageEmbeddingContentArray.join("|");

	const imageEmbedding = `![${imageEmbeddingContent}](${image.url})`;
	if (settings && settings.includePermalinkLinks === false) {
		return imageEmbedding;
	}

	return `[${imageEmbedding}](${image.permalink_url})`;
}
