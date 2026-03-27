import { getCollection } from 'astro:content';

export async function GET() {
    const allPosts = await getCollection('blog');

    const posts = allPosts
        .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
        .map(post => {
            // Generate SVG OG image as data URL
            const title = post.data.title;
            const description = post.data.description || '';
            const date = new Date(post.data.pubDate).toLocaleDateString('id-ID', {
                day: 'numeric', month: 'long', year: 'numeric'
            });
            const tags = post.data.tags || [];

            // Escape HTML entities
            const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

            // Truncate title if too long
            const truncTitle = title.length > 60 ? title.slice(0, 57) + '...' : title;
            const truncDesc = description.length > 100 ? description.slice(0, 97) + '...' : description;

            const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#1a1a2e;stop-opacity:1" />
                        <stop offset="50%" style="stop-color:#16213e;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#0f3460;stop-opacity:1" />
                    </linearGradient>
                </defs>
                <rect width="1200" height="630" fill="url(#bg)"/>
                <rect x="0" y="590" width="1200" height="40" fill="#F4D03F" opacity="0.9"/>
                <circle cx="100" cy="100" r="200" fill="#F4D03F" opacity="0.05"/>
                <circle cx="1100" cy="530" r="150" fill="#F4D03F" opacity="0.05"/>
                <text x="80" y="80" font-family="system-ui, sans-serif" font-size="20" font-weight="600" fill="#F4D03F" letter-spacing="3">PADLI</text>
                <text x="80" y="280" font-family="system-ui, sans-serif" font-size="52" font-weight="800" fill="#FFFFFF" width="1040">
                    ${esc(truncTitle)}
                </text>
                <text x="80" y="370" font-family="system-ui, sans-serif" font-size="24" fill="#94a3b8" width="1040">
                    ${esc(truncDesc)}
                </text>
                <text x="80" y="450" font-family="system-ui, sans-serif" font-size="18" fill="#64748b">${esc(date)}</text>
                ${tags.slice(0, 3).map((tag, i) => `<rect x="${80 + i * 120}" y="480" width="110" height="30" rx="15" fill="#F4D03F" opacity="0.15"/><text x="${135 + i * 120}" y="500" font-family="system-ui, sans-serif" font-size="14" fill="#F4D03F" text-anchor="middle">${esc(tag)}</text>`).join('')}
                <text x="1120" y="618" font-family="system-ui, sans-serif" font-size="16" font-weight="700" fill="#1a1a2e" text-anchor="end">padli</text>
            </svg>`;

            return {
                slug: post.slug,
                svg: svg,
            };
        });

    return new Response(JSON.stringify(posts.map(p => ({ slug: p.slug }))), {
        headers: { 'Content-Type': 'application/json' },
    });
}
