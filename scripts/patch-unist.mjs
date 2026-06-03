// Patch for unist-util-visit-parents v6.0.x — color.node.js and color.js
// were omitted from the published package but are referenced in its exports map.
// Node.js v22+ selects the "node" condition and crashes on the missing file.
import { existsSync, writeFileSync } from 'fs';

const dir = 'node_modules/unist-util-visit-parents/lib/';

if (!existsSync(dir + 'color.node.js')) {
  writeFileSync(dir + 'color.node.js', 'export function color(d) {\n  return "\\u001B[33m" + d + "\\u001B[39m"\n}\n');
}

if (!existsSync(dir + 'color.js')) {
  writeFileSync(dir + 'color.js', 'export function color(d) {\n  return d\n}\n');
}
