const fs = require('node:fs');
const path = require('node:path');
// Copy only public game files; environment files and server code stay out of hosting.
const output = path.resolve('dist');
if (output !== path.join(process.cwd(), 'dist')) throw new Error('Unexpected build directory');
fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });
for (const file of fs.readdirSync('.').filter(file => /\.(html|css|js)$/.test(file))) {
  fs.copyFileSync(file, path.join('dist', file));
}
fs.cpSync('assets', 'dist/assets', { recursive: true });
