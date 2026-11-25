// The world's news of Tuesday 24 November 2026 in one picture.
// entry.png is rendered ahead of time from art/front-page.html by tools/render.mjs, because the grader
// runs this program with no network; here it is only written to the output folder.
//
// Local run: mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { chmodSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const target = join(outputDir, 'entry.png');
const picture = readFileSync(new URL('./entry.png', import.meta.url));

// Never hand over a file the gate would refuse: a PNG of at most 1024 x 1024 pixels and 1 MiB.
const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const width = picture.readUInt32BE(16);
const height = picture.readUInt32BE(20);
if (!picture.subarray(0, 8).equals(signature) || width > 1024 || height > 1024 || picture.length > 1048576) {
  throw new Error(`entry.png is outside the limits: ${width}x${height}, ${picture.length} bytes`);
}

// The grader reads /output as another user, so the picture must be readable by all.
writeFileSync(target, picture, { mode: 0o644 });
chmodSync(target, 0o644);
