import { getCollection } from 'astro:content';

export async function GET() {
  // 1. Ambil semua data
  const allPosts = await getCollection('blog');
  
  // 2. Sortir (Logic harus sama persis kayak di index.astro biar urutannya nyambung)
  const sortedPosts = allPosts.sort((a, b) => {
    return new Date(b.data.pubDate).valueOf() - new Date(a.data.pubDate).valueOf();
  });

  // 3. AMBIL SEMUA SISA (Skip 4 artikel pertama)
  // Karena di static hosting query param (?page=2) itu gak jalan,
  // jadi kita kirim semua sisa artikelnya ke client, nanti client yang potong-potong.
  const remainingPosts = sortedPosts.slice(4);

  // 4. Return JSON
  return new Response(JSON.stringify(remainingPosts), {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    }
  });
}