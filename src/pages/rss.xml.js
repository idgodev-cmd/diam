import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
	const posts = await getCollection('blog');
	
    // ERROR FIX: "site is required"
    // Ini terjadi kalau lu lupa set 'site' di astro.config.mjs.
    // Kita kasih fallback manual di sini biar tetep jalan.
    const siteUrl = context.site ?? 'https://catatan-pinggir.vercel.app';

	return rss({
		title: 'Catatan Pinggir',
		description: 'Menulis untuk merayakan kebingungan quarter-life crisis.',
		site: siteUrl,
		items: posts.map((post) => ({
			title: post.data.title,
			pubDate: post.data.pubDate,
			description: post.data.description,
			link: `/blog/${post.slug}/`,
		})),
		customData: `<language>id-id</language>`,
	});
}