import test from 'node:test';
import assert from 'node:assert/strict';
import helpers from '../email-random.js';
const { shuffleEmails } = helpers;

test('all six three-email orderings are reachable exactly once across equal swap choices', () => {
  const results = new Set();
  for (let first = 0; first < 3; first++) {
    for (let second = 0; second < 2; second++) {
      const draws = [(first + 0.5) / 3, (second + 0.5) / 2];
      results.add(shuffleEmails(['A', 'B', 'C'], () => draws.shift()).join(''));
    }
  }
  assert.equal(results.size, 6);
});

test('a ten-email selection has no duplicates and leaves the source order unchanged', () => {
  const emails = Array.from({ length: 21 }, (_, id) => ({ id }));
  const original = [...emails];
  const selected = shuffleEmails(emails, () => 0).slice(0, 10);
  assert.equal(selected.length, 10);
  assert.equal(new Set(selected).size, 10);
  assert.deepEqual(emails, original);
  assert.notDeepEqual(selected, original.slice(0, 10));
  assert.deepEqual(shuffleEmails([]), []);
  assert.deepEqual(shuffleEmails(['only']), ['only']);
});
