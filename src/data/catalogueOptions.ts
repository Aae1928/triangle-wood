import {
  findWoodRender,
  getSupabaseAssetEntries,
  type WoodImplementation,
} from '../assets/images';
import { parquetryEntries } from './parquetryContent';
import { PATTERNS, WOOD_COLORS, type WoodColor } from './woodData';

export interface CatalogueOption {
  id: string;
  name: string;
  imageUrl?: string;
}

export interface FlooringOption extends CatalogueOption {
  color: WoodColor;
  colorId: string;
  colorName: string;
  patternId: string;
  patternName: string;
}

export const getFlooringOptions = (): FlooringOption[] =>
  WOOD_COLORS.flatMap((color) =>
    PATTERNS.map((pattern) => ({
      id: `${color.id}:${pattern.id}`,
      color,
      colorId: color.id,
      colorName: color.name,
      patternId: pattern.id,
      patternName: pattern.name,
      name: `${color.name} — ${pattern.name}`,
      imageUrl: findWoodRender(color.name, pattern.name as WoodImplementation, '3D')?.src,
    })),
  );

export const getParquetryOptions = (): CatalogueOption[] => {
  const imageUrls = new Map(
    getSupabaseAssetEntries('PARQUETRY/PARQUETRY 3D/')
      .filter(({ filename }) => / 3D_nobg\.webp$/i.test(filename))
      .map(({ filename, src }) => [
        filename.replace(/ 3D_nobg\.webp$/i, '').toUpperCase(),
        src,
      ]),
  );

  return parquetryEntries.map(({ name }) => ({
    id: `parquetry:${name}`,
    name,
    imageUrl: imageUrls.get(name.toUpperCase()),
  }));
};

const toTitle = (text: string) =>
  text.toLowerCase().replace(/(^|[\s&-])([a-z])/g, (_, separator: string, letter: string) =>
    separator + letter.toUpperCase(),
  );

export const getTimberOptions = (): CatalogueOption[] => {
  const names = getSupabaseAssetEntries('TIMBER SOLUTIONS/')
    .filter(({ path: storagePath }) => storagePath.split('/').length === 2)
    .flatMap(({ filename }) => {
      const base = filename.replace(/\.webp$/i, '');
      const match = base.match(/^\d+-\s*(.+?)\s+-\s+(.+)$/);
      return match
        ? [toTitle(match[2].replace(/OUTDOR /g, 'OUTDOOR '))]
        : [];
    });

  return [...new Set(names)].map((name) => ({
    id: `timber:${name}`,
    name,
  }));
};
