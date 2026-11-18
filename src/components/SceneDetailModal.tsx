import React, { useEffect, useState } from 'react';
import { SceneItem } from './SceneGallery';
import { findCloseUpRender, findWoodRender } from '../assets/images';
import { useModalBehavior } from '../hooks/useModalBehavior';
import homeButtonImage from '../assets/Footer/Home button.png';

interface SceneDetailModalProps {
  scene: SceneItem | null;
  currentColorName: string;
  onClose: () => void;
  onRequestSample: () => void;
  onNavigateHome: () => void;
}

export const SceneDetailModal: React.FC<SceneDetailModalProps> = ({
  scene,
  currentColorName,
  onClose,
  onRequestSample,
  onNavigateHome,
}) => {
  const [lightingMode, setLightingMode] = useState<'day' | 'evening'>('day');
  const [activeMaterialScene, setActiveMaterialScene] = useState(0);

  useEffect(() => {
    setActiveMaterialScene(0);
  }, [scene?.id, scene?.imageUrl]);

  useModalBehavior(Boolean(scene), onClose);

  if (!scene) return null;

  const sceneImages = [
    scene.imageUrl,
    findCloseUpRender(scene.num),
    ...([1, 2, 3]
      .map((number) =>
        findWoodRender(
          currentColorName,
          scene.category,
          `SCENE${number}`,
        )?.src,
      )
      .filter((imageUrl): imageUrl is string => Boolean(imageUrl))
      .filter((imageUrl) => imageUrl !== scene.imageUrl)),
  ];
  const changeMaterialScene = (direction: -1 | 1) => {
    setActiveMaterialScene((current) =>
      (current + direction + sceneImages.length) % sceneImages.length,
    );
  };
  const materialScene = sceneImages[activeMaterialScene];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-2 backdrop-blur-md animate-in fade-in sm:p-3"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="relative grid h-full max-h-full w-full max-w-none min-w-0 grid-cols-1 grid-rows-[minmax(0,1.05fr)_minmax(0,0.95fr)] overflow-hidden rounded-xl border border-[#e5e2dd] bg-white text-[#171717] shadow-2xl md:grid-cols-[minmax(0,1.6fr)_minmax(20rem,0.9fr)] md:grid-rows-1">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-white/80 hover:text-white p-2 rounded-full bg-black/60 backdrop-blur-sm hover:bg-black/80 transition-colors cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Big Image Viewer with Day/Evening Lighting Filter */}
        <div className="relative min-h-0 w-full overflow-hidden bg-black">
          {materialScene ? (
            <img
              key={materialScene}
              src={materialScene}
              alt={`${currentColorName} ${scene.title}`}
              className={`product-image-fade h-full w-full object-cover transition-all duration-700 ease-out ${
                lightingMode === 'evening'
                  ? 'brightness-90 contrast-105 hue-rotate-[-10deg] saturate-125'
                  : 'brightness-100'
              }`}
            />
          ) : (
            <div
              role="img"
              aria-label={`${scene.title}; image unavailable`}
              className="flex h-full items-center justify-center text-xs uppercase tracking-widest text-slate-500"
            >
              IMAGE UNAVAILABLE
            </div>
          )}
          <button
            type="button"
            onClick={() => changeMaterialScene(-1)}
            aria-label="Show previous material scene"
            className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/65 p-3 text-white transition-colors hover:bg-black/85 sm:left-5"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="m15 18-6-6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => changeMaterialScene(1)}
            aria-label="Show next material scene"
            className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/65 p-3 text-white transition-colors hover:bg-black/85 sm:right-5"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="m9 18 6-6-6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {/* Lighting Mode Toggle Bar */}
          <div className="absolute left-3 top-3 flex items-center gap-1 rounded-lg border border-white/10 bg-black/70 p-1 text-[0.6875rem] backdrop-blur-md sm:left-4 sm:top-4 sm:gap-1.5 sm:text-xs">
            <button
              onClick={() => setLightingMode('day')}
              className={`rounded px-2 py-1 font-medium transition-colors cursor-pointer sm:px-3 ${
                lightingMode === 'day'
                  ? 'bg-white text-black font-semibold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Daylight 5000K
            </button>
            <button
              onClick={() => setLightingMode('evening')}
              className={`rounded px-2 py-1 font-medium transition-colors cursor-pointer sm:px-3 ${
                lightingMode === 'evening'
                  ? 'bg-[#E4D5BE] text-black font-semibold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Warm 2700K
            </button>
          </div>

          <div className="absolute bottom-5 left-5 right-5 z-10 sm:bottom-7 sm:left-7">
            <h3 className="text-xl font-serif-luxury font-light uppercase tracking-wider text-white drop-shadow-md sm:text-2xl">
              {scene.title}
            </h3>
          </div>
        </div>

        <aside className="font-display-brand font-light min-h-0 min-w-0 overflow-y-auto overscroll-contain bg-white p-4 sm:p-5">
          <div className="space-y-4">
            <div className="space-y-3">
              <h4 className="text-sm font-semibold tracking-wider uppercase text-[#171717]">
                {scene.subtitle}
              </h4>
              {scene.kind === 'interior' && (
                <p className="text-[0.6875rem] text-[#D8BD8F] uppercase tracking-wider">
                  {scene.details.microScript.replace(/[\uFFFD?]/g, '-')}
                </p>
              )}
              <p className="text-xs text-[#4b5563] leading-relaxed">
                {scene.description}
              </p>
              <div className="space-y-1.5 border-t border-[#e5e2dd] pt-3 text-xs text-[#6b7280]">
                <div className="mb-2 text-[#374151] uppercase tracking-wider text-[0.6875rem]">
                  {scene.kind === 'interior' ? 'Project Information:' : 'Installed Specifications:'}
                </div>
                {scene.kind === 'interior' ? (
                  <>
                    <div>Colour: <span className="text-[#D8BD8F]">{currentColorName}</span></div>
                    <div>Sector: <span className="text-[#171717]">{scene.details.sector}</span></div>
                    <div>Location: <span className="text-[#171717]">{scene.details.location}</span></div>
                    <div>
                      Installation:{' '}
                      <span className="text-[#171717]">
                        {scene.details.installation.replace(/[\uFFFD?]/g, 'X')}
                      </span>
                    </div>
                    <div>Product Code: <span className="text-[#171717]">{scene.details.productCode}</span></div>
                    {scene.details.productSpecification && (
                      <>
                        <div>Colour Tag: <span className="text-[#171717]">{scene.details.productSpecification.colourTag}</span></div>
                        <div>Wood Species: <span className="text-[#171717]">{scene.details.productSpecification.woodSpecies}</span></div>
                        <div>Texture: <span className="text-[#171717]">{scene.details.productSpecification.textureTreatment}</span></div>
                        <div>Surface Finish: <span className="text-[#171717]">{scene.details.productSpecification.surfaceFinish}</span></div>
                        <div>Grade: <span className="text-[#171717]">{scene.details.productSpecification.grade} (provisional; confirm factory grade)</span></div>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <div>Room Type: <span className="text-[#171717]">{scene.details.roomType}</span></div>
                    <div>Lighting: <span className="text-[#171717]">{scene.details.lighting}</span></div>
                    <div>Finish: <span className="text-[#171717]">{scene.details.finishShown}</span></div>
                    <div>Colour Expression: <span className="text-[#D8BD8F]">{currentColorName}</span></div>
                    <div>Pattern Architecture: <span className="text-[#171717]">{scene.details.boardPattern}</span></div>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-3 border-t border-[#e5e2dd] pt-4">
              <div>
                <span className="text-[0.6875rem] uppercase tracking-wider text-[#8b7252]">
                  SPECIFY THIS SPACE
                </span>
                <div className="text-sm font-light text-[#171717] mt-1">
                  Ready to test {currentColorName}?
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    onClose();
                    onRequestSample();
                  }}
                  className="w-full bg-[#ba8c62] px-4 py-2.5 text-sm font-light uppercase tracking-[0.15em] text-white transition-colors hover:bg-[#a97d55]"
                >
                  REQUEST A QUOTE
                </button>
                <div className="flex flex-col items-center">
                  <button
                    type="button"
                    onClick={onClose}
                    className="py-2 text-xs uppercase tracking-wider text-[#6b7280] transition-colors hover:text-[#171717] cursor-pointer"
                  >
                    Back to Gallery
                  </button>
                  <button
                    type="button"
                    aria-label="Home"
                    onClick={() => {
                      onClose();
                      onNavigateHome();
                    }}
                    className="flex translate-y-5 items-center justify-center gap-2 transition-opacity hover:opacity-75"
                  >
                    <img src={homeButtonImage} alt="" className="h-10 w-10 object-contain" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
