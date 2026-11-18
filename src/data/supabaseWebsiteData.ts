import {
  setSupabaseCloseUpSources,
  setSupabaseImageSources,
} from '../assets/images';
import { getSupabaseClient } from '../lib/supabase';
import {
  replaceParquetryEntries,
  type ParquetryEntry,
} from './parquetryContent';
import {
  replaceTimberScenes,
  type TimberScene,
} from './timberContent';
import {
  replaceInteriorScenes,
  replaceProductSpecifications,
  type InteriorSceneRecord,
  type ProductSpecification,
} from './siteContent';
import { replacePatterns, replaceWoodColors } from './woodData';

type ColorRow = {
  colour_id: string;
  name: string;
  colour_code: string;
  colour_tag: string | null;
  inspiration: string | null;
  wood_species: string | null;
  construction: string | null;
  wear_layer: string | null;
  plank_profile: string | null;
  grain_character: string | null;
  texture_treatment: string | null;
  expected_finish: string | null;
  uv_treatment: string | null;
  surface_finish: string | null;
  wood_grade: string | null;
  sort_order: number;
};

type ProductRow = {
  product_id: string;
  colour_id: string | null;
  pattern_id: string | null;
  product_code: string;
  is_active: boolean;
};

type PatternRow = {
  pattern_id: string;
  code: string;
  name: string;
  dimensions: string;
  angle: string | null;
  expression: string | null;
  description: string | null;
  sort_order: number;
};

type SceneRow = {
  scene_number: string;
  colour_id: string | null;
  pattern_id: string | null;
  space: string | null;
  sector: string | null;
  location: string | null;
  installation: string | null;
  product_code: string | null;
  hero_title: string | null;
  hero_micro_script: string | null;
  website_copy: string | null;
};

type ImageRow = {
  bucket_name: string;
  storage_path: string;
  original_filename: string;
};

type ParquetryRow = {
  class_name: string;
  name: string;
  tw_code: string;
  inspiration: string | null;
  geometry: string | null;
  wood_species: string | null;
  construction: string | null;
  surface_texture: string | null;
  wood_grade: string | null;
  uv_surface: string | null;
  headline: string | null;
  tagline: string | null;
  description: string | null;
  sort_order: number;
};

type TimberSceneRow = {
  scene_code: string;
  subject: string;
  title: string;
  hero_text: string;
  material_description: string;
  is_hero: boolean;
};

const normalizePatternCode = (code: string): string => {
  const normalized = code.toUpperCase().replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim();
  const aliases: Record<string, string> = {
    WP: 'WIDE PLANK',
    HB: 'HERRINGBONE',
    CH: 'CHEVRON',
  };
  return aliases[normalized] ?? normalized;
};

let colourIdsByName = new Map<string, string>();
let patternIdsByImplementation = new Map<string, string>();

const checkQuery = <T>(table: string, result: { data: T | null; error: { message: string } | null }): T => {
  if (result.error) {
    throw new Error(`Could not load ${table} from Supabase: ${result.error.message}`);
  }
  if (result.data === null) {
    throw new Error(`Supabase returned no data for ${table}.`);
  }
  return result.data;
};

const loadWebsiteDataOnce = async (): Promise<void> => {
  const supabase = getSupabaseClient();
  const [
    coloursResult,
    productsResult,
    patternsResult,
    scenesResult,
    imagesResult,
    parquetryResult,
    timberScenesResult,
  ] =
    await Promise.all([
      supabase
        .from('colour_variants')
        .select(
          'colour_id,name,colour_code,colour_tag,inspiration,wood_species,construction,wear_layer,plank_profile,grain_character,texture_treatment,expected_finish,uv_treatment,surface_finish,wood_grade,sort_order',
        )
        .order('sort_order'),
      supabase
        .from('products')
        .select('product_id,colour_id,pattern_id,product_code,is_active')
        .eq('is_active', true),
      supabase
        .from('pattern_types')
        .select('pattern_id,code,name,dimensions,angle,expression,description,sort_order')
        .order('sort_order'),
      supabase
        .from('interior_scenes')
        .select(
          'scene_number,colour_id,pattern_id,space,sector,location,installation,product_code,hero_title,hero_micro_script,website_copy',
        )
        .order('scene_number'),
      supabase
        .from('product_images')
        .select('bucket_name,storage_path,original_filename')
        .order('display_order'),
      supabase
        .from('parquetry_designs')
        .select(
          'class_name,name,tw_code,inspiration,geometry,wood_species,construction,surface_texture,wood_grade,uv_surface,headline,tagline,description,sort_order',
        )
        .order('sort_order'),
      supabase
        .from('timber_scenes')
        .select('scene_code,subject,title,hero_text,material_description,is_hero')
        .order('scene_code'),
    ]);

  const colours = checkQuery<ColorRow[]>('colour_variants', coloursResult);
  const products = checkQuery<ProductRow[]>('products', productsResult);
  const patterns = checkQuery<PatternRow[]>('pattern_types', patternsResult);
  const scenes = checkQuery<SceneRow[]>('interior_scenes', scenesResult);
  const images = checkQuery<ImageRow[]>('product_images', imagesResult);
  const parquetryRows = checkQuery<ParquetryRow[]>('parquetry_designs', parquetryResult);
  const timberRows = checkQuery<TimberSceneRow[]>('timber_scenes', timberScenesResult);

  if (!colours.length || !patterns.length || !images.length || !parquetryRows.length || !timberRows.length) {
    throw new Error('One or more Supabase product, scene, parquetry, timber, or image tables are empty.');
  }

  const colorById = new Map(colours.map((colour) => [colour.colour_id, colour]));
  const patternById = new Map(patterns.map((pattern) => [pattern.pattern_id, pattern]));
  colourIdsByName = new Map(colours.map((colour) => [colour.name.toUpperCase(), colour.colour_id]));
  patternIdsByImplementation = new Map(
    patterns.map((pattern) => [normalizePatternCode(pattern.code), pattern.pattern_id]),
  );

  const productsByColour = new Map<string, ProductRow[]>();
  for (const product of products) {
    if (!product.colour_id || !product.pattern_id) continue;
    const entries = productsByColour.get(product.colour_id) ?? [];
    entries.push(product);
    productsByColour.set(product.colour_id, entries);
  }

  const specifications: ProductSpecification[] = colours.map((colour) => {
    const productCodes: ProductSpecification['productCodes'] = {
      'WIDE PLANK': '',
      HERRINGBONE: '',
      CHEVRON: '',
    };
    for (const product of productsByColour.get(colour.colour_id) ?? []) {
      const pattern = patternById.get(product.pattern_id ?? '');
      const implementation = pattern ? normalizePatternCode(pattern.code) : '';
      if (implementation in productCodes) {
        productCodes[implementation as keyof typeof productCodes] = product.product_code;
      }
    }

    return {
      sortOrder: colour.sort_order,
      name: colour.name.toUpperCase(),
      colourCode: colour.colour_code,
      colourTag: colour.colour_tag ?? '',
      inspiration: colour.inspiration ?? '',
      woodSpecies: colour.wood_species ?? '',
      construction: colour.construction ?? '',
      wearLayer: colour.wear_layer ?? '',
      plankProfile: colour.plank_profile ?? '',
      grainCharacter: colour.grain_character ?? '',
      textureTreatment: colour.texture_treatment ?? '',
      expectedFinish: colour.expected_finish ?? '',
      uvTreatment: colour.uv_treatment ?? '',
      surfaceFinish: colour.surface_finish ?? '',
      grade: colour.wood_grade ?? '',
      productCodes,
    };
  });

  const sceneRecords: InteriorSceneRecord[] = scenes.flatMap((scene) => {
    const colour = scene.colour_id ? colorById.get(scene.colour_id) : undefined;
    const pattern = scene.pattern_id ? patternById.get(scene.pattern_id) : undefined;
    if (!colour || !pattern) return [];
    const implementation = normalizePatternCode(pattern.code);
    if (!['WIDE PLANK', 'HERRINGBONE', 'CHEVRON'].includes(implementation)) return [];

    return [{
      number: scene.scene_number,
      colourName: colour.name.toUpperCase(),
      implementation: implementation as InteriorSceneRecord['implementation'],
      space: scene.space ?? '',
      sector: scene.sector ?? '',
      location: scene.location ?? '',
      installation: scene.installation ?? '',
      productCode: scene.product_code ?? '',
      heroTitle: scene.hero_title ?? '',
      heroMicroScript: scene.hero_micro_script ?? '',
      websiteCopy: scene.website_copy ?? '',
    }];
  });

  if (!sceneRecords.length) {
    throw new Error('Supabase interior scenes are missing valid colour or pattern associations.');
  }

  replaceProductSpecifications(specifications);
  replaceInteriorScenes(sceneRecords);
  replaceWoodColors(specifications);
  replacePatterns(patterns.map((pattern) => ({
    code: normalizePatternCode(pattern.code),
    name: pattern.name,
    dimensions: pattern.dimensions,
    angle: pattern.angle ?? '',
    expression: pattern.expression ?? '',
    description: pattern.description ?? '',
  })));
  replaceParquetryEntries(parquetryRows.map((row): ParquetryEntry => ({
    name: row.name,
    classKey: row.class_name,
    fields: [
      { label: 'TW CODE', value: row.tw_code },
      { label: 'INSPIRATION', value: row.inspiration ?? '' },
      { label: 'GEOMETRY', value: row.geometry ?? '' },
      { label: 'WOOD SPECIES', value: row.wood_species ?? '' },
      { label: 'CONSTRUCTION', value: row.construction ?? '' },
      { label: 'SURFACE / TEXTURE', value: row.surface_texture ?? '' },
      { label: 'WOOD GRADE', value: row.wood_grade ?? '' },
      { label: 'UV SURFACE', value: row.uv_surface ?? '' },
    ].filter(({ value }) => value !== ''),
    headline: row.headline ?? '',
    tagline: row.tagline ?? '',
    description: row.description ?? '',
  })));
  replaceTimberScenes(timberRows.map((row): TimberScene => ({
    id: row.scene_code,
    subject: row.subject,
    title: row.title,
    heroText: row.hero_text,
    description: row.material_description,
  })));

  const getPublicStorageUrl = (bucketName: string, storagePath: string) =>
    supabase.storage.from(bucketName).getPublicUrl(storagePath).data.publicUrl;
  const { data: closeUpObjects, error: closeUpError } = await supabase.storage
    .from('Images')
    .list('16 Colours/Close Up Shots', { limit: 1000 });
  if (closeUpError) {
    throw new Error(`Could not load close-up images from Supabase Storage: ${closeUpError.message}`);
  }
  if (!closeUpObjects?.length) {
    throw new Error(
      'No close-up images were listed. Re-run supabase/website-access.sql in the Supabase SQL Editor to enable close-up listing.',
    );
  }
  setSupabaseCloseUpSources(
    (closeUpObjects ?? []).map(({ name }) => ({
      name,
      src: getPublicStorageUrl('Images', `16 Colours/Close Up Shots/${name}`),
    })),
  );
  setSupabaseImageSources(
    images.map((image) => ({
      filename: image.original_filename,
      src: getPublicStorageUrl(image.bucket_name, image.storage_path),
      bucketName: image.bucket_name,
      storagePath: image.storage_path,
    })),
    getPublicStorageUrl,
  );
};

let websiteDataPromise: Promise<void> | null = null;

export const loadWebsiteData = (): Promise<void> => {
  if (!websiteDataPromise) {
    websiteDataPromise = loadWebsiteDataOnce().catch((error: unknown) => {
      websiteDataPromise = null;
      throw error;
    });
  }
  return websiteDataPromise;
};

export const getSupabaseSelectionIds = (
  colourName: string,
  implementation: string,
): { colourId: string; patternId: string } => {
  const colourId = colourIdsByName.get(colourName.toUpperCase());
  const patternId = patternIdsByImplementation.get(normalizePatternCode(implementation));
  if (!colourId || !patternId) {
    throw new Error('The selected colour or pattern is not available in Supabase.');
  }
  return { colourId, patternId };
};

export interface SampleRequestInput {
  fullName: string;
  email: string;
  phone: string;
  company?: string;
  city: string;
  moreDetails: string;
  selectedFlooringProducts: Array<{ colorName: string; patternName: string }>;
  additionalProducts: string[];
}

export const submitSampleRequest = async (input: SampleRequestInput): Promise<void> => {
  const productInterests = [
    ...input.selectedFlooringProducts.map(
      ({ colorName, patternName }) => `Flooring: ${colorName} — ${patternName}`,
    ),
    ...input.additionalProducts.map((productId) => {
      const [category, ...nameParts] = productId.split(':');
      const name = nameParts.join(':');
      const label = category === 'parquetry' ? 'Parquetry' : 'Timber Solutions';
      return `${label}: ${name}`;
    }),
  ];
  if (!productInterests.length) {
    throw new Error('Select at least one product before submitting your quote request.');
  }
  const selections = input.selectedFlooringProducts.map(({ colorName, patternName }) => ({
    ...getSupabaseSelectionIds(colorName, patternName),
  }));
  const { error } = await getSupabaseClient().rpc('submit_sample_request', {
    payload: {
      fullName: input.fullName,
      email: input.email,
      phone: input.phone,
      company: input.company ?? '',
      city: input.city,
      message: [
        `Requested products: ${productInterests.join('; ')}`,
        input.moreDetails.trim() ? `Additional details: ${input.moreDetails.trim()}` : '',
      ].filter(Boolean).join('\n'),
      selections,
    },
  });
  if (error) {
    throw new Error(`Could not submit sample request: ${error.message}`);
  }
};
