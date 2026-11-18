import { WOOD_COLORS, type WoodColor } from '../data/woodData';

export type WoodImplementation = 'WIDE PLANK' | 'HERRINGBONE' | 'CHEVRON';

export interface WoodRenderAsset {
  src: string;
  filename: string;
  color: WoodColor;
  implementation: WoodImplementation;
  tag: string | null;
  sceneNumber: number | null;
}

export type WoodRenderTag = 'HEROO' | `SCENE${number}` | '3D' | null;

interface SupabaseImage {
  filename: string;
  src: string;
  bucketName: string;
  storagePath: string;
}

let supabaseImages: SupabaseImage[] = [];
let closeUpSources = new Map<number, string>();
let publicStorageUrl:
  | ((bucketName: string, storagePath: string) => string)
  | undefined;

export const woodRenderAssets: WoodRenderAsset[] = [];

export const setSupabaseCloseUpSources = (
  images: Array<{ name: string; src: string }>,
): void => {
  closeUpSources = new Map(
    images.flatMap(({ name, src }) => {
      const number = name.match(/^0*(\d+)\s+/)?.[1];
      return number ? [[Number(number), src] as const] : [];
    }),
  );
};

const normalizeImageFilename = (filename: string) =>
  filename.split('/').pop()?.toUpperCase() ?? filename.toUpperCase();

const normalizePatternFilename = (filename: string) =>
  filename
    .toUpperCase()
    .replace(/\bPLABK\b/g, 'PLANK')
    .replace(/\bHERRINGBONR\b/g, 'HERRINGBONE')
    .replace(/\bHERRONGBONE\b/g, 'HERRINGBONE')
    .replace(/\bEIDE PLANK\b/g, 'WIDE PLANK')
    .replace(/\bSCNE(\d+)\b/g, 'SCENE$1');

export const setSupabaseImageSources = (
  images: SupabaseImage[],
  getPublicStorageUrl: (bucketName: string, storagePath: string) => string,
): void => {
  publicStorageUrl = getPublicStorageUrl;
  supabaseImages = images;
  woodRenderAssets.splice(0, woodRenderAssets.length);

  for (const image of images) {
    const colorMatch = image.storagePath.match(/^16 Colours\/([^/]+)\/([^/]+)$/i);
    if (!colorMatch || /^close up shots$/i.test(colorMatch[1])) continue;

    const folder = colorMatch[1];
    const colorName = folder.replace(/^\d+\s*/, '').toUpperCase();
    const normalizedFilename = normalizePatternFilename(image.filename);
    const color = WOOD_COLORS.find(({ name }) => name === colorName);
    const implementation = (['WIDE PLANK', 'HERRINGBONE', 'CHEVRON'] as const).find(
      (pattern) => normalizedFilename.includes(pattern),
    );
    if (!color || !implementation) continue;

    const tag = normalizedFilename.match(/\b(HEROO|SCENE\d+|3D)\b/)?.[1] ?? null;
    const sceneNumber = image.filename.match(/^(\d+)\s+/)?.[1];
    const transparentFilename = tag === '3D' && implementation !== 'CHEVRON'
      ? image.filename.replace(/\.[^.]+$/, '.png')
      : image.filename;
    const transparentPath = `transparent-3d/${folder}/${transparentFilename}`;
    woodRenderAssets.push({
      src: tag === '3D'
        ? getPublicStorageUrl(image.bucketName, transparentPath)
        : image.src,
      filename: image.filename,
      color,
      implementation,
      tag,
      sceneNumber: sceneNumber ? Number(sceneNumber) : null,
    });
  }
};

export const getSupabaseAssetUrl = (storagePath: string): string | undefined => {
  const existingImage = supabaseImages.find(
    (image) => image.storagePath.toUpperCase() === storagePath.toUpperCase(),
  );
  if (existingImage) return existingImage.src;
  if (publicStorageUrl) return publicStorageUrl('Images', storagePath);

  const projectUrl = import.meta.env.VITE_SUPABASE_URL
    ?.replace(/\/rest\/v1\/?$/i, '')
    .replace(/\/+$/, '');
  if (!projectUrl) return undefined;

  const encodedPath = storagePath.split('/').map(encodeURIComponent).join('/');
  return `${projectUrl}/storage/v1/object/public/Images/${encodedPath}`;
};

export const getSupabaseAssetEntries = (prefix: string) =>
  supabaseImages
    .filter((image) => image.storagePath.toUpperCase().startsWith(prefix.toUpperCase()))
    .map((image) => ({
      path: image.storagePath,
      filename: image.filename,
      src: image.src,
    }));

export const findWoodRender = (
  colorName: string,
  implementation: WoodImplementation,
  tag: WoodRenderTag,
): WoodRenderAsset | undefined => findWoodRenders(colorName, implementation, tag)[0];

export const findWoodRenders = (
  colorName: string,
  implementation: WoodImplementation,
  tag: WoodRenderTag,
): WoodRenderAsset[] => {
  const color = WOOD_COLORS.find(
    (wood) => wood.name === colorName.toUpperCase() || wood.id === colorName.toLowerCase(),
  );
  return woodRenderAssets.filter(
    (asset) =>
      asset.color.id === color?.id &&
      asset.implementation === implementation &&
      asset.tag === tag,
  );
};

export const findSceneRender = (
  sceneNumber: string | number,
  colorName: string,
  implementation: WoodImplementation,
): WoodRenderAsset | undefined => {
  const color = WOOD_COLORS.find(
    (wood) => wood.name === colorName.toUpperCase() || wood.id === colorName.toLowerCase(),
  );
  if (!color) return undefined;
  const matches = woodRenderAssets.filter(
    (asset) =>
      asset.sceneNumber === Number(sceneNumber) &&
      asset.color.id === color.id &&
      asset.implementation === implementation &&
      asset.tag !== '3D' &&
      !/\bOPTION\b|\(\s*\d+\s*\)\s*\.[^.]+$/i.test(asset.filename),
  );
  return matches.length === 1 ? matches[0] : undefined;
};

export const findCloseUpRender = (sceneNumber: string | number): string | undefined =>
  closeUpSources.get(Number(sceneNumber));

const prefetchedImageUrls = new Set<string>();

export const prefetchColorImages = (
  colorName: string,
  implementation: WoodImplementation,
): void => {
  if (typeof Image === 'undefined') return;

  const hero = findWoodRender(colorName, implementation, 'HEROO') ??
    findWoodRender(colorName, implementation, null);
  const board = findWoodRender(colorName, implementation, '3D') ??
    findWoodRender(colorName, implementation, null);
  const patternPreviews = (['WIDE PLANK', 'HERRINGBONE', 'CHEVRON'] as const)
    .map((pattern) => findWoodRender(colorName, pattern, 'SCENE2')?.src)
    .filter((src): src is string => Boolean(src));
  const scenePreviews = woodRenderAssets
    .filter((asset) =>
      asset.color.name === colorName.toUpperCase() &&
      asset.implementation === implementation &&
      asset.sceneNumber !== null &&
      asset.tag !== '3D',
    )
    .slice(0, 3)
    .map(({ src }) => src);

  [...new Set([hero?.src, board?.src, ...patternPreviews, ...scenePreviews])]
    .filter((src): src is string => Boolean(src))
    .forEach((src) => {
      if (prefetchedImageUrls.has(src)) return;
      prefetchedImageUrls.add(src);
      const image = new Image();
      image.decoding = 'async';
      image.src = src;
    });
};
