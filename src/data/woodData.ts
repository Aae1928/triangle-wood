import { PRODUCT_SPECIFICATIONS, type ProductSpecification } from './siteContent';

export interface WoodColor {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  tone: string;
  hex: string;
  sampleHex: string;
  secondaryHex: string;
  grainColor: string;
}

const baseWoodColors: WoodColor[] = [
  {
    id: 'tefnut',
    name: 'TEFNUT',
    subtitle: 'WARM NATURAL OAK',
    description: 'A timeless oak with a warm, natural character, bringing authenticity, balance and quiet elegance to contemporary spaces.',
    tone: 'Warm Natural Honey',
    hex: '#C59A6F',
    sampleHex: '#BDA37F',
    secondaryHex: '#AF8356',
    grainColor: '#8E6740',
  },
  {
    id: 'gurnah',
    name: 'GURNAH',
    subtitle: 'SUNBLEACHED RAW OAK',
    description: 'Soft bleached tones capturing the pale glow of desert sandstone, reflecting natural daylight with effortless serenity.',
    tone: 'Sunbleached Sand',
    hex: '#D6C0A0',
    sampleHex: '#9D9E9A',
    secondaryHex: '#BEA784',
    grainColor: '#9B8462',
  },
  {
    id: 'amarna',
    name: 'AMARNA',
    subtitle: 'CLASSIC GOLDEN OAK',
    description: 'Radiant golden amber hues that evoke timeless heritage, emphasizing deep grain depth and organic natural warmth.',
    tone: 'Classic Warm Amber',
    hex: '#C89B5F',
    sampleHex: '#C78550',
    secondaryHex: '#AE8245',
    grainColor: '#8C632F',
  },
  {
    id: 'napata',
    name: 'NAPATA',
    subtitle: 'SMOKED CARAMEL OAK',
    description: 'Warm, smoked undertones steeped in roasted caramel tones, providing rich contrast for bold modern architectural layouts.',
    tone: 'Smoked Caramel',
    hex: '#A77D54',
    sampleHex: '#4C352D',
    secondaryHex: '#8E643E',
    grainColor: '#6B4725',
  },
  {
    id: 'badari',
    name: 'BADARI',
    subtitle: 'CHALK RAW OAK',
    description: 'Light parchment tones gently limed for an airy Nordic ambience that harmonizes seamlessly with minimalist travertine stone.',
    tone: 'Raw Chalk Limestone',
    hex: '#DDD2B8',
    sampleHex: '#C5B49A',
    secondaryHex: '#C5BA9E',
    grainColor: '#A3997F',
  },
  {
    id: 'sia',
    name: 'SIA',
    subtitle: 'WEATHERED DRIFTWOOD',
    description: 'Sophisticated silvery mineral tones inspired by weathered coastal driftwood, striking the perfect balance between cool and warm.',
    tone: 'Mineral Silver Gray',
    hex: '#B2AAA0',
    sampleHex: '#E6DCCB',
    secondaryHex: '#999187',
    grainColor: '#787167',
  },
  {
    id: 'deshret',
    name: 'DESHRET',
    subtitle: 'TERRACOTTA SANGUINE OAK',
    description: 'Deep earthy auburn and roasted cinnamon undertones creating an inviting, opulent grounding for dramatic living environments.',
    tone: 'Sanguine Auburn',
    hex: '#985F3D',
    sampleHex: '#743C30',
    secondaryHex: '#7E492B',
    grainColor: '#5C3219',
  },
  {
    id: 'menfe',
    name: 'MENFE',
    subtitle: 'SMOKED TOBACCO',
    description: 'Rich dark tobacco and cured chestnut depths with dramatic wood grain movement, evocative of private libraries and grand salons.',
    tone: 'Smoked Havana Brown',
    hex: '#6B5239',
    sampleHex: '#9A6D4C',
    secondaryHex: '#523C27',
    grainColor: '#382615',
  },
  {
    id: 'kush',
    name: 'KUSH',
    subtitle: 'ESPRESSO NOIR',
    description: 'Velvety espresso tones with subtle charcoal highlights, delivering unapologetic luxury and strong architectural definitions.',
    tone: 'Dark Roasted Espresso',
    hex: '#4A3728',
    sampleHex: '#B8895B',
    secondaryHex: '#352518',
    grainColor: '#20150D',
  },
  {
    id: 'nubia',
    name: 'NUBIA',
    subtitle: 'BASALT MINERAL CHARCOAL',
    description: 'Deep volcanic basalt charcoal that lets the organic grain pattern shimmer subtly under ambient illumination.',
    tone: 'Basalt Mineral Charcoal',
    hex: '#3D3A37',
    sampleHex: '#292A2A',
    secondaryHex: '#2B2926',
    grainColor: '#1A1816',
  },
  {
    id: 'atum',
    name: 'ATUM',
    subtitle: 'NORDIC MORNING MIST',
    description: 'Ultra-pure ethereal pale blonde oak with gentle neutral hues, illuminating contemporary spaces with a serene morning glow.',
    tone: 'Nordic Pale Blonde',
    hex: '#D9D1C3',
    sampleHex: '#49382D',
    secondaryHex: '#C0B7A8',
    grainColor: '#9D9586',
  },
  {
    id: 'mentuhotep',
    name: 'MENTUHOTEP',
    subtitle: 'ANTIQUE BARK WALNUT',
    description: 'Regal dark oak with nuanced walnut-like depth, showcasing organic grain whirls of old-growth European forestry.',
    tone: 'Antique Forest Bark',
    hex: '#5E432E',
    sampleHex: '#A09081',
    secondaryHex: '#46301E',
    grainColor: '#2F1E11',
  },
  {
    id: 'kiya',
    name: 'KIYA',
    subtitle: 'HONEY WHEAT OAK',
    description: 'Luminous honey wheat that radiates comforting warmth, pairing harmoniously with linen textiles and dark bronze metal accents.',
    tone: 'Honey Wheat Warmth',
    hex: '#D1A361',
    sampleHex: '#E2D5BF',
    secondaryHex: '#B98A47',
    grainColor: '#93692E',
  },
  {
    id: 'mayet',
    name: 'MAYET',
    subtitle: 'BLEACHED BONE OAK',
    description: 'Clean Scandinavian aesthetic with subtle mineral pigments, creating an expansive feeling of light and unbounded volume.',
    tone: 'Bleached Bone Ivory',
    hex: '#E0D8CB',
    sampleHex: '#CBB49C',
    secondaryHex: '#C9C0B2',
    grainColor: '#A79E90',
  },
  {
    id: 'pepi',
    name: 'PEPI',
    subtitle: 'TOASTED CHESTNUT',
    description: 'Mid-century toasted chestnut tone that offers timeless vintage prestige, perfect for residential sanctuaries and executive suites.',
    tone: 'Toasted Warm Chestnut',
    hex: '#845C3E',
    sampleHex: '#754B32',
    secondaryHex: '#6D492E',
    grainColor: '#4F311C',
  },
  {
    id: 'edfu',
    name: 'EDFU',
    subtitle: 'MIDNIGHT OBSIDIAN',
    description: 'Monolithic deep obsidian black engineered oak, providing high contrast and museum-grade dramatic presentation.',
    tone: 'Midnight Obsidian',
    hex: '#282524',
    sampleHex: '#A04E2E',
    secondaryHex: '#1C1A19',
    grainColor: '#0E0D0C',
  },
];

const productSpecificationsByName = new Map(
  PRODUCT_SPECIFICATIONS.map((specification) => [specification.name, specification]),
);

export const WOOD_COLORS: WoodColor[] = baseWoodColors.map((wood) => {
  const specification = productSpecificationsByName.get(wood.name);
  if (!specification) return wood;

  return {
    ...wood,
    subtitle: specification.colourTag.toUpperCase(),
    description: specification.inspiration,
  };
});

export const replaceWoodColors = (specifications: ProductSpecification[]): void => {
  const specificationsByName = new Map(
    specifications.map((specification) => [specification.name.toUpperCase(), specification]),
  );
  const refreshedColors = baseWoodColors.map((wood) => {
    const specification = specificationsByName.get(wood.name);
    if (!specification) return wood;
    return {
      ...wood,
      subtitle: specification.colourTag.toUpperCase(),
      description: specification.inspiration,
    };
  });
  WOOD_COLORS.splice(0, WOOD_COLORS.length, ...refreshedColors);
};

export interface PatternInfo {
  id: 'wide-plank' | 'herringbone' | 'chevron';
  name: string;
  expression: string;
  dimensions: string;
  description: string;
  angle: string;
}

export const PATTERNS: PatternInfo[] = [
  {
    id: 'wide-plank',
    name: 'WIDE PLANK',
    expression: 'Expansive. Calm. Contemporary.',
    dimensions: '2200 × 180 × 13 mm',
    description: 'Continuous long boards that broaden spatial perception, accentuating natural grain flow across expansive living layouts.',
    angle: 'Straight parallel layout',
  },
  {
    id: 'herringbone',
    name: 'HERRINGBONE',
    expression: 'Rhythmic. Elegant. Timeless.',
    dimensions: '750 × 125 × 13 mm',
    description: 'Classic 90-degree interlocking parquet geometry that imparts dynamic symmetry and architectural prestige to any salon.',
    angle: '90° Right Angle Parquet',
  },
  {
    id: 'chevron',
    name: 'CHEVRON',
    expression: 'Directional. Refined. Architectural.',
    dimensions: '750 × 125 × 13 mm',
    description: 'French 45-degree angle chevron with continuous directional arrows that lead the gaze through grand passageways and dining suites.',
    angle: '45° French Point Chevron',
  },
];

export const replacePatterns = (
  patterns: Array<Omit<PatternInfo, 'id'>>,
): void => {
  const patternIds: Record<string, PatternInfo['id']> = {
    'WIDE PLANK': 'wide-plank',
    HERRINGBONE: 'herringbone',
    CHEVRON: 'chevron',
  };
  const refreshedPatterns = patterns.flatMap((pattern) => {
    const id = patternIds[pattern.name.toUpperCase()];
    return id ? [{ ...pattern, id }] : [];
  });
  if (refreshedPatterns.length) {
    PATTERNS.splice(0, PATTERNS.length, ...refreshedPatterns);
  }
};
