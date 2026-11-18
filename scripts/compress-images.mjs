import { access, readdir, rename, stat, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const assetsDirectory = path.resolve('src/assets');

async function findPngFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => findPngFiles(path.join(directory, entry.name))),
  );

  return [
    ...entries
      .filter((entry) => entry.isFile() && /\.png$/i.test(entry.name))
      .map((entry) => path.join(directory, entry.name)),
    ...nested.flat(),
  ];
}

const pngFiles = await findPngFiles(assetsDirectory);
if (pngFiles.length === 0) {
  console.log('No PNG images found in src/assets.');
  process.exit(0);
}

const conversions = [];
let originalBytes = 0;
let finalBytes = 0;

for (const pngPath of pngFiles) {
  const webpPath = pngPath.replace(/\.png$/i, '.webp');
  const temporaryPath = `${webpPath}.tmp.webp`;
  for (const outputPath of [webpPath, temporaryPath]) {
    try {
      await access(outputPath);
      throw new Error(`Refusing to overwrite existing file: ${outputPath}`);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }
}

try {
  for (const pngPath of pngFiles) {
    const webpPath = pngPath.replace(/\.png$/i, '.webp');
    const temporaryPath = `${webpPath}.tmp.webp`;
    const originalSize = (await stat(pngPath)).size;
    const original = await sharp(pngPath).raw().toBuffer({ resolveWithObject: true });
    const candidate = await sharp(pngPath)
      .keepMetadata()
      .webp({ lossless: true, effort: 6 })
      .toBuffer();
    const decoded = await sharp(candidate).raw().toBuffer({ resolveWithObject: true });
    const channelCount = original.info.channels;
    const alphaChannel = channelCount === 2 || channelCount === 4 ? channelCount - 1 : -1;
    let pixelsMatch =
      original.info.width === decoded.info.width &&
      original.info.height === decoded.info.height &&
      channelCount === decoded.info.channels;

    for (let offset = 0; pixelsMatch && offset < original.data.length; offset += channelCount) {
      const transparent = alphaChannel >= 0 && original.data[offset + alphaChannel] === 0;
      for (let channel = 0; channel < channelCount; channel += 1) {
        if (channel === alphaChannel || (transparent && alphaChannel >= 0)) continue;
        if (original.data[offset + channel] !== decoded.data[offset + channel]) {
          pixelsMatch = false;
          break;
        }
      }
    }

    if (!pixelsMatch) {
      throw new Error(`Lossless pixel verification failed for ${pngPath}`);
    }

    originalBytes += originalSize;
    if (candidate.length < originalSize) {
      await writeFile(temporaryPath, candidate, { flag: 'wx' });
      conversions.push({ pngPath, webpPath, temporaryPath });
      finalBytes += candidate.length;
    } else {
      finalBytes += originalSize;
    }
  }
} catch (error) {
  await Promise.all(
    conversions.map(({ temporaryPath }) => unlink(temporaryPath).catch(() => {})),
  );
  throw error;
}

const publishedFiles = [];
try {
  for (const { webpPath, temporaryPath } of conversions) {
    await rename(temporaryPath, webpPath);
    publishedFiles.push(webpPath);
  }
} catch (error) {
  await Promise.all(
    [
      ...conversions.map(({ temporaryPath }) => temporaryPath),
      ...publishedFiles,
    ].map((filePath) => unlink(filePath).catch(() => {})),
  );
  throw error;
}

for (const { pngPath } of conversions) {
  await unlink(pngPath);
}

const savedBytes = originalBytes - finalBytes;
const savedPercent = originalBytes === 0 ? 0 : (savedBytes / originalBytes) * 100;
console.log(
  `Converted ${conversions.length} of ${pngFiles.length} PNGs; saved ` +
    `${(savedBytes / 1024 / 1024).toFixed(2)} MiB (${savedPercent.toFixed(1)}%).`,
);
