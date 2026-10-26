const headers = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff'
};
const reply = (status, body) => new Response(JSON.stringify(body), { status, headers });
const validPlayer = player => player && typeof player.name === 'string' &&
  player.name.trim().length > 0 && player.name.length <= 20 &&
  /^[\p{L}\p{M}\p{N} ._'\-]+$/u.test(player.name) &&
  Number.isInteger(player.score) && player.score >= 0 && player.score <= 100 && player.score % 10 === 0;

export default async function scoreboard(request) {
  if (!['GET', 'POST'].includes(request.method)) return reply(405, { error: 'Method not allowed' });
  let player;
  if (request.method === 'POST') {
    const origin = request.headers.get('origin');
    if (origin && origin !== new URL(request.url).origin) return reply(403, { error: 'Origin not allowed' });
    if (!request.headers.get('content-type')?.startsWith('application/json')) return reply(415, { error: 'JSON required' });
    const body = await request.text();
    if (body.length > 1024) return reply(413, { error: 'Submission too large' });
    try { player = JSON.parse(body); } catch { return reply(400, { error: 'Invalid JSON' }); }
    if (!validPlayer(player)) return reply(400, { error: 'Invalid name or score' });
    player = { name: player.name.trim(), score: player.score };
  }
  const key = process.env.JSONBIN_API_KEY;
  const bin = process.env.JSONBIN_BIN_ID;
  if (!key || !bin || !/^[a-f\d]{24}$/i.test(bin)) return reply(503, { error: 'Scoreboard is not configured' });
  const url = `https://api.jsonbin.io/v3/b/${bin}`;
  try {
    const result = await fetch(`${url}/latest`, {
      headers: { 'X-Master-Key': key }, signal: AbortSignal.timeout(8000)
    });
    if (!result.ok) throw new Error('Read failed');
    const data = await result.json();
    const scores = Array.isArray(data.record) ? data.record : data.record?.scores;
    if (!Array.isArray(scores)) throw new Error('Invalid board');
    const records = scores.filter(validPlayer).map(({ name, score }) => ({ name, score }));
    if (request.method === 'POST') {
      const nameKey = name => name.normalize('NFKC').trim().toLowerCase();
      const taken = new Set(records.map(record => nameKey(record.name)));
      const originalName = player.name;
      let suffixNumber = 2;
      while (taken.has(nameKey(player.name))) {
        const suffix = `-${suffixNumber++}`;
        player.name = originalName.slice(0, 20 - suffix.length) + suffix;
      }
      records.push(player);
      records.sort((a, b) => b.score - a.score);
      const saved = await fetch(url, {
        method: 'PUT',
        headers: { 'X-Master-Key': key, 'Content-Type': 'application/json' },
        body: JSON.stringify({ scores: records.slice(0, 100) }), signal: AbortSignal.timeout(8000)
      });
      if (!saved.ok) throw new Error('Write failed');
      return reply(200, { saved: true, name: player.name });
    }
    return reply(200, records.sort((a, b) => b.score - a.score).slice(0, 100));
  } catch {
    return reply(502, { error: 'Scoreboard service unavailable' });
  }
}
