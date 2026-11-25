// Renders art/front-page.html to entry.png with headless Chrome or Edge, then checks the contest's limits:
// a whole PNG, at most 1024 x 1024 pixels and at most 1 MiB.
//
//   node tools/render.mjs                 render entry.png
//   node tools/render.mjs --preview <png> also write a 300 px wide preview, to judge legibility

import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const page = join(root, 'art', 'front-page.html');
const out = join(root, 'entry.png');
const SIZE = 1024;
const MAX_BYTES = 1024 * 1024;

const browsers = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean);
const browser = browsers.find((p) => existsSync(p));
if (!browser) throw new Error('no Chrome or Edge found; set CHROME_PATH');

function screenshot(url, file, width, height) {
  const profile = mkdtempSync(join(tmpdir(), 'render-'));
  try {
    const run = spawnSync(browser, [
      '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run',
      '--force-device-scale-factor=1', `--user-data-dir=${profile}`,
      `--window-size=${width},${height}`, `--screenshot=${file}`, url,
    ], { encoding: 'utf8', timeout: 60_000 });
    if (!existsSync(file)) throw new Error(`screenshot failed:\n${run.stderr}`);
  } finally {
    rmSync(profile, { recursive: true, force: true });
  }
}

function checkPng(file) {
  const bytes = readFileSync(file);
  const signature = '89504e470d0a1a0a';
  if (bytes.subarray(0, 8).toString('hex') !== signature) throw new Error('not a PNG');
  if (bytes.subarray(12, 16).toString('latin1') !== 'IHDR') throw new Error('IHDR is not the first chunk');
  const width = bytes.readUInt32BE(16);
  const height = bytes.readUInt32BE(20);
  if (bytes.subarray(bytes.length - 8, bytes.length - 4).toString('latin1') !== 'IEND') throw new Error('no IEND chunk at the end');
  if (width > SIZE || height > SIZE) throw new Error(`too large: ${width}x${height}`);
  if (bytes.length > MAX_BYTES) throw new Error(`too heavy: ${bytes.length} bytes`);
  return { width, height, bytes: bytes.length };
}

rmSync(out, { force: true });
screenshot(pathToFileURL(page).href, out, SIZE, SIZE);
const info = checkPng(out);
console.log(`entry.png ${info.width}x${info.height}, ${info.bytes} bytes (limit ${MAX_BYTES})`);

const previewAt = process.argv.indexOf('--preview');
if (previewAt !== -1) {
  const preview = resolve(process.argv[previewAt + 1]);
  const holder = join(dirname(preview), 'preview-300.html');
  writeFileSync(holder, `<!doctype html><body style="margin:0;background:#fff">` +
    `<img src="${pathToFileURL(out).href}" style="width:300px;height:300px;display:block"></body>`);
  rmSync(preview, { force: true });
  screenshot(pathToFileURL(holder).href, preview, 300, 300);
  console.log(`preview ${preview}`);
}
