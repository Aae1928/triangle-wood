// Usage: node --env-file=.env.local scripts/upload-to-supabase.mjs [folder]
// Defaults to the close-up folder; use src/assets to upload all image assets.
// Needs SUPABASE_SERVICE_ROLE_KEY; SUPABASE_URL can use VITE_SUPABASE_URL.
// The service role key is secret: run this locally only, never in frontend code.
import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';
import path from 'node:path';

const {
  SUPABASE_URL: configuredUrl,
  VITE_SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  SUPABASE_BUCKET = 'Images',
} = process.env;
const SUPABASE_URL = (configuredUrl ?? VITE_SUPABASE_URL)?.replace(/\/rest\/v1\/?$/i, '');
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing Supabase URL or SUPABASE_SERVICE_ROLE_KEY in .env.local.');
  process.exit(1);
}

const assetsRoot = path.resolve('src/assets');
const rootFolder = path.resolve(
  process.argv[2] ?? path.join(assetsRoot, '16 Colours', 'Close Up Shots'),
);
if (!fs.existsSync(rootFolder)) {
  console.error(`Folder not found: ${rootFolder}`);
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const contentTypes = {
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
};

const listImages = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return listImages(fullPath);
    return contentTypes[path.extname(entry.name).toLowerCase()] ? [fullPath] : [];
  });

// Spaces and brackets in object keys can break URLs, so replace them.
const toObjectKey = (filePath) => {
  const relativeToAssets = path.relative(assetsRoot, filePath);
  const relativePath = !relativeToAssets.startsWith('..')
    ? relativeToAssets
    : path.relative(rootFolder, filePath);
  return relativePath.split(path.sep).join('/');
};

const files = listImages(rootFolder);
console.log(`Found ${files.length} images in ${rootFolder}`);

let failed = 0;
const queue = [...files];
const bucket = supabase.storage.from(SUPABASE_BUCKET);
const closeUpFolder = '16 Colours/Close Up Shots';
const { data: existingCloseUps, error: listError } = await bucket.list(closeUpFolder, {
  limit: 1000,
});
if (listError) {
  console.error(`Could not check existing close-up objects: ${listError.message}`);
  process.exit(1);
}
const existingCloseUpNames = new Set((existingCloseUps ?? []).map(({ name }) => name));

const worker = async () => {
  while (queue.length) {
    const filePath = queue.shift();
    const relativePath = path.relative(assetsRoot, filePath).split(path.sep).join('/');
    const key = toObjectKey(filePath);
    if (relativePath.startsWith(`${closeUpFolder}/`) && existingCloseUpNames.has(path.basename(filePath))) {
      console.log(`Already uploaded: ${relativePath}`);
      continue;
    }

    const { error } = await bucket.upload(key, fs.readFileSync(filePath), {
      upsert: true,
      contentType: contentTypes[path.extname(filePath).toLowerCase()],
      cacheControl: '31536000',
    });
    if (error) {
      failed += 1;
      console.error(`FAILED ${key}: ${error.message}`);
    } else {
      console.log(`Uploaded ${relativePath}`);
    }
  }
};

await Promise.all(Array.from({ length: 4 }, worker));
console.log(`Done: ${files.length - failed} uploaded or already present, ${failed} failed.`);
process.exit(failed ? 1 : 0);
