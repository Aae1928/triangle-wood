import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from 'dotenv';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
config({ path: path.join(root, '.env.local'), quiet: true });
const source = fs.readFileSync(
  path.join(root, 'src/data/TRIANGLE_WOOD_WEBSITE_CONTENT_MASTER_CORRECTED_CODES.txt'),
  'utf8',
).replace(/\r\n?/g, '\n');
const errors = [];

const readField = (block, name) =>
  block.match(new RegExp(`^${name}:\\s*(.*)$`, 'm'))?.[1]?.trim() ?? '';

const sceneHeaders = [...source.matchAll(/^(\d{3}) - ([A-Z]+) - (WIDE PLANK|HERRINGBONE|CHEVRON)\s*$/gm)];
const scenes = sceneHeaders.map((header, index) => {
  const block = source.slice(header.index, sceneHeaders[index + 1]?.index ?? source.length);
  return {
    number: header[1],
    colour: header[2],
    pattern: header[3],
    productCode: readField(block, 'CORRECTED PRODUCT CODE'),
  };
});

const productSection = source
  .split(/^2\. Sixteen colour product specifications\s*$/m)[1]
  ?.split(/^3\. The 144 numbered interior scenes/m)[0] ?? '';
const productHeaders = [...productSection.matchAll(/^(\d{2})\.\s+([A-Z]+)\s+\|\s+(TW\d{4})\s*$/gm)];
const products = productHeaders.map((header, index) => {
  const block = productSection.slice(header.index, productHeaders[index + 1]?.index ?? productSection.length);
  const correctedCodes = readField(block, 'CORRECTED PRODUCT CODES');
  const productCodes = Object.fromEntries(
    [...correctedCodes.matchAll(/(Wide Plank|Herringbone|Chevron)\s*-\s*([A-Z0-9-]+)/g)]
      .map((match) => [match[1].toUpperCase(), match[2]]),
  );
  return { name: header[2], code: header[3], productCodes };
});

const normalizeRenderName = (filename) =>
  filename.toUpperCase()
    .replace(/\bPLABK\b/g, 'PLANK')
    .replace(/\bHERRINGBONR\b/g, 'HERRINGBONE')
    .replace(/\bHERRONGBONE\b/g, 'HERRINGBONE')
    .replace(/\bEIDE PLANK\b/g, 'WIDE PLANK');

const getSupabaseImageRows = async () => {
  const projectUrl = process.env.VITE_SUPABASE_URL?.replace(/\/rest\/v1\/?$/i, '').replace(/\/+$/, '');
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
  if (!projectUrl || !anonKey) {
    throw new Error('Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local to verify remote images.');
  }

  const response = await fetch(
    `${projectUrl}/rest/v1/product_images?select=storage_path,original_filename&limit=1000`,
    { headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` } },
  );
  if (!response.ok) {
    throw new Error(`Could not read Supabase product_images: HTTP ${response.status} ${await response.text()}`);
  }
  return response.json();
};

const uniqueSceneNumbers = new Set(scenes.map(({ number }) => number));
const uniqueProductCodes = new Set(products.map(({ code }) => code));
if (scenes.length !== 144 || uniqueSceneNumbers.size !== 144) {
  errors.push(`Expected 144 unique scene records; found ${scenes.length} records and ${uniqueSceneNumbers.size} unique numbers.`);
}
if (products.length !== 16 || uniqueProductCodes.size !== 16) {
  errors.push(`Expected 16 unique product specifications; found ${products.length} records and ${uniqueProductCodes.size} unique codes.`);
}

for (const scene of scenes) {
  const product = products.find(({ name }) => name === scene.colour);
  const expectedCode = product?.productCodes[scene.pattern];
  if (!product || expectedCode !== scene.productCode) {
    errors.push(`${scene.number}: product code ${scene.productCode || '(missing)'} does not match ${scene.colour} ${scene.pattern}.`);
  }
}

const missingImages = [];
const imageRows = await getSupabaseImageRows();
for (const scene of scenes) {
  const matches = imageRows.filter(({ storage_path, original_filename }) => {
    const pathParts = storage_path.split('/');
    if (pathParts.length !== 3 || pathParts[0] !== '16 Colours') return false;
    const folder = pathParts[1].replace(/^\d+\s*/, '').toUpperCase();
    const prefix = original_filename.match(/^(\d+)\s+/);
    const normalizedName = normalizeRenderName(original_filename);
    const excluded = /\b3D\b|\bOPTION\b|\(\s*\d+\s*\)\s*\.[^.]+$/i.test(original_filename);

    return prefix &&
      Number(prefix[1]) === Number(scene.number) &&
      folder === scene.colour &&
      normalizedName.includes(scene.pattern) &&
      !excluded;
  });
  if (matches.length === 0) missingImages.push(scene.number);
  if (matches.length > 1) errors.push(`${scene.number}: found ${matches.length} eligible base images.`);
}

console.log(`Scene records: ${scenes.length}; product specifications: ${products.length}`);
console.log(`Supabase catalog image rows: ${imageRows.length}`);
console.log(`Eligible numbered base images in Supabase: ${scenes.length - missingImages.length}/${scenes.length}`);
if (missingImages.length) {
  errors.push(`No eligible numbered base image in Supabase (3D/options excluded): ${missingImages.join(', ')}`);
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log('Product-code and image-uniqueness checks passed.');
}