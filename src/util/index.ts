import { GyazoImage } from "../types/index";

/**
 * Generates markdown code for a Gyazo image with a link to its permalink page
 * @param image The Gyazo image object
 * @returns Markdown string with image and link
 */
export function generateGyazoMarkdown(image: GyazoImage): string {
	const altText = image.alt_text ?? "";
	return `[![${altText}](${image.url})](${image.permalink_url})`;
}
