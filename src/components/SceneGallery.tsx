import React, { useState } from 'react';
import {
  findSceneRender,
  findWoodRender,
  type WoodImplementation,
} from '../assets/images';
import {
  getInteriorScenes,
  getProductSpecification,
  type ProductSpecification,
} from '../data/siteContent';

interface SceneBase {
  id: string;
  num: string;
  category: WoodImplementation;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
}

export type SceneItem = SceneBase & (
  | {
    kind: 'material';
    details: {
      roomType: string;
      lighting: string;
      finishShown: string;
      boardPattern: string;
    };
  }
  | {
    kind: 'interior';
    details: {
      sector: string;
      location: string;
      installation: string;
      productCode: string;
      microScript: string;
      productSpecification: ProductSpecification | undefined;
    };
  }
);

interface SceneGalleryProps {
  currentColorName: string;
  currentImplementation: WoodImplementation;
  onOpenSceneModal?: (scene: SceneItem) => void;
}

export const SceneGallery: React.FC<SceneGalleryProps> = ({
  currentColorName,
  currentImplementation,
  onOpenSceneModal,
}) => {
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);

  const interiorScenes: SceneItem[] = getInteriorScenes(currentColorName, currentImplementation).map(
    (record) => ({
      kind: 'interior',
      id: record.number,
      num: record.number,
      category: record.implementation,
      title: record.space,
      subtitle: record.heroTitle,
      description: record.websiteCopy,
      imageUrl:
        findSceneRender(record.number, record.colourName, record.implementation)?.src ?? '',
      details: {
        sector: record.sector,
        location: record.location,
        installation: record.installation,
        productCode: record.productCode,
        microScript: record.heroMicroScript,
        productSpecification: getProductSpecification(record.productCode),
      },
    }),
  );

  const scenes = interiorScenes.slice(0, 3);

  return (
    <div className="w-full min-w-0 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
        {scenes.map((scene, idx) => {
          const isActive = activeSceneIndex === idx;

          return (
            <div
              key={scene.id}
              onClick={() => {
                setActiveSceneIndex(idx);
                onOpenSceneModal?.(scene);
              }}
              className={`group relative min-w-0 cursor-pointer overflow-hidden bg-white transition-all duration-200 ${
                isActive ? 'opacity-100' : 'opacity-100'
              }`}
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-white">
                {scene.imageUrl ? (
                  <img
                    key={scene.imageUrl}
                    src={scene.imageUrl}
                    alt={`${currentColorName} ${scene.title}`}
                    loading="lazy"
                    decoding="async"
                    className="product-image-fade h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                  />
                ) : (
                  <div
                    role="img"
                    aria-label={`${scene.title}; image unavailable`}
                    className="flex h-full items-center justify-center text-[0.6875rem] font-mono uppercase tracking-widest text-slate-500"
                  >
                    IMAGE UNAVAILABLE
                  </div>
                )}

                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 lg:p-6">
                  <h4 className="break-words text-xs font-light uppercase tracking-[0.12em] text-white drop-shadow-md sm:text-sm">
                    {scene.subtitle}
                  </h4>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
