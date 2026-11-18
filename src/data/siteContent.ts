import type { WoodImplementation } from '../assets/images';

export interface ProductSpecification {
  sortOrder: number;
  name: string;
  colourCode: string;
  colourTag: string;
  inspiration: string;
  woodSpecies: string;
  construction: string;
  wearLayer: string;
  plankProfile: string;
  grainCharacter: string;
  textureTreatment: string;
  expectedFinish: string;
  uvTreatment: string;
  surfaceFinish: string;
  grade: string;
  productCodes: Record<WoodImplementation, string>;
}

export interface InteriorSceneRecord {
  number: string;
  colourName: string;
  implementation: WoodImplementation;
  space: string;
  sector: string;
  location: string;
  installation: string;
  productCode: string;
  heroTitle: string;
  heroMicroScript: string;
  websiteCopy: string;
}

export const PRODUCT_SPECIFICATIONS: ProductSpecification[] = [];
export const INTERIOR_SCENES: InteriorSceneRecord[] = [];

export const replaceProductSpecifications = (specifications: ProductSpecification[]): void => {
  PRODUCT_SPECIFICATIONS.splice(0, PRODUCT_SPECIFICATIONS.length, ...specifications);
};

export const replaceInteriorScenes = (scenes: InteriorSceneRecord[]): void => {
  INTERIOR_SCENES.splice(0, INTERIOR_SCENES.length, ...scenes);
};

export const getProductSpecification = (productCode: string): ProductSpecification | undefined =>
  PRODUCT_SPECIFICATIONS.find(({ productCodes }) =>
    Object.values(productCodes).includes(productCode),
  );

export const getInteriorScenes = (
  colourName: string,
  implementation: WoodImplementation,
): InteriorSceneRecord[] =>
  INTERIOR_SCENES.filter(
    (scene) =>
      scene.colourName === colourName.toUpperCase() &&
      scene.implementation === implementation,
  );
