// Proxies https://hire-score-fawn.vercel.app/api/scores/... and adds the
// CORS headers that upstream API is missing, so browsers on other origins
// (e.g. GitHub Pages) are allowed to read the response.
//
// Matches:
//   /api/scores            -> upstream /api/scores/
//   /api/scores/           -> upstream /api/scores/
//   /api/scores/25MCA023   -> upstream /api/scores/25MCA023

const UPSTREAM_BASE = 'https://hire-score-fawn.vercel.app/api/scores/';

export default async function handler(req, res) {
  // --- CORS headers ---
  // Swap '*' for your exact site origin (e.g. 'https://face-prep-campus-cloud.github.io')
  // once you've confirmed everything works, to lock this down to just your dashboard.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Only GET is supported' });
  }

  const segments = Array.isArray(req.query.path) ? req.query.path : [];
  const upstreamUrl = UPSTREAM_BASE + segments.map(encodeURIComponent).join('/');

  try {
    const upstream = await fetch(upstreamUrl);
    const bodyText = await upstream.text();

    res.status(upstream.status);
    res.setHeader('Content-Type', upstream.headers.get('content-type') || 'application/json');
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    return res.send(bodyText);
  } catch (err) {
    return res.status(502).json({
      error: 'Failed to reach upstream HIRE API',
      message: err.message
    });
  }
}
