import test from 'node:test';
import assert from 'node:assert/strict';
import scoreboard from '../netlify/functions/scoreboard.mjs';

test('scoreboard validates requests and keeps credentials server-side', async () => {
  const originalFetch = globalThis.fetch;
  const originalKey = process.env.JSONBIN_API_KEY;
  const originalBin = process.env.JSONBIN_BIN_ID;
  const request = (body, origin = 'https://game.example') => new Request('https://game.example/.netlify/functions/scoreboard', {
    method: 'POST', headers: { 'Content-Type': 'application/json', origin }, body: JSON.stringify(body)
  });
  try {
    delete process.env.JSONBIN_API_KEY;
    delete process.env.JSONBIN_BIN_ID;
    assert.equal((await scoreboard(new Request('https://game.example/api'))).status, 503);
    assert.equal((await scoreboard(request({ name: '<img>', score: 20 }))).status, 400);
    assert.equal((await scoreboard(request({ name: 'Alex', score: 999 }))).status, 400);
    assert.equal((await scoreboard(request({ name: 'Alex', score: 15 }))).status, 400);
    assert.equal((await scoreboard(request({ name: 'Alex', score: 20 }, 'https://other.example'))).status, 403);
    process.env.JSONBIN_API_KEY = 'test-secret';
    process.env.JSONBIN_BIN_ID = '1234567890abcdef12345678';
    let stored = [{ name: 'Alex', score: 70 }, { name: '<img>', score: 100 }];
    let writes = 0;
    globalThis.fetch = async (url, options) => {
      assert.equal(options.headers['X-Master-Key'], 'test-secret');
      assert.ok(url.startsWith('https://api.jsonbin.io/v3/b/1234567890abcdef12345678'));
      if (options.method === 'PUT') { stored = JSON.parse(options.body); writes++; }
      return Response.json({ record: stored });
    };
    assert.equal((await scoreboard(request({ name: 'Alex', score: 20 }))).status, 200);
    assert.deepEqual(stored, { scores: [{ name: 'Alex', score: 70 }] });
    assert.equal((await scoreboard(request({ name: 'Taylor', score: 100 }))).status, 200);
    const read = await scoreboard(new Request('https://game.example/api'));
    assert.deepEqual(await read.json(), [{ name: 'Taylor', score: 100 }, { name: 'Alex', score: 70 }]);
    assert.equal(writes, 2);
    stored = { scores: [] };
    const empty = await scoreboard(new Request('https://game.example/api'));
    assert.deepEqual(await empty.json(), []);
    assert.equal((await scoreboard(request({ name: 'Alex', score: 30 }))).status, 200);
    assert.deepEqual(stored, { scores: [{ name: 'Alex', score: 30 }] });
    globalThis.fetch = async () => Response.json({ error: 'test-secret' }, { status: 401 });
    const failure = await scoreboard(new Request('https://game.example/api'));
    assert.equal(failure.status, 502);
    assert.equal((await failure.text()).includes('test-secret'), false);
    globalThis.fetch = async (url, options) => options.method === 'PUT'
      ? new Response('', { status: 500 }) : Response.json({ record: [] });
    assert.equal((await scoreboard(request({ name: 'Alex', score: 30 }))).status, 502);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalKey === undefined) delete process.env.JSONBIN_API_KEY; else process.env.JSONBIN_API_KEY = originalKey;
    if (originalBin === undefined) delete process.env.JSONBIN_BIN_ID; else process.env.JSONBIN_BIN_ID = originalBin;
  }
});
