# SuperDevs phishing awareness game

A static training game with a shared scoreboard served by a Netlify Function.

## Hosting setup

1. Create a JSONBin bin containing `{"scores": []}` in your own account.
2. Set `JSONBIN_API_KEY` and `JSONBIN_BIN_ID` in Netlify environment variables, with Functions scope (or all scopes).
3. Connect the GitHub repository to Netlify. `netlify.toml` supplies the build command, publish directory, and function directory.
4. Deploy again after setting or changing environment variables.

Never put a real key in HTML, browser JavaScript, or `netlify.toml`. The previously exposed key must be revoked by its owner.

## Development

Use Node 22 or newer. `npm run build` copies only public assets into `dist`. `npm test` runs isolated function checks with mocked JSONBin responses and no external requests.

For local function development, copy `.env.example` to `.env`, fill it privately, and run Netlify CLI's `netlify dev`. Opening HTML directly will not run the scoreboard function.

## Scoreboard limits

This is a casual, anonymous leaderboard. The server validates names and score ranges, but cannot prove a score was earned in the browser. Players sharing a name share a record. JSONBin updates replace the board, so simultaneous submissions can overwrite one another. For prizes, verified results, or heavy traffic, use authenticated server-verified games and a database with atomic updates. The board retains the top 100 records.
