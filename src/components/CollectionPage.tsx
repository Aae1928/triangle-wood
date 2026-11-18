import React from 'react';
import { WoodColor, WOOD_COLORS, PATTERNS } from '../data/woodData';
import { ColorSidebar } from './ColorSidebar';
import { SceneGallery, SceneItem } from './SceneGallery';
import { TechnicalInfoFooter } from './TechnicalInfoFooter';
import { findWoodRender, type WoodImplementation } from '../assets/images';
import type { SitePage } from './Navbar';

interface CollectionPageProps {
  currentColor: WoodColor;
  selectedPatternId: string;
  onSelectPattern: (patternId: string) => void;
  onSelectColor: (color: WoodColor) => void;
  onOpenSpecs: () => void;
  onOpenSustainability: () => void;
  onOpenSampleModal: () => void;
  onOpenArchitectPortal: () => void;
  onOpenSceneModal: (scene: SceneItem) => void;
  onNavigate: (page: SitePage) => void;
  isHeroImageOnly: boolean;
  onHeroImageOnlyChange: (isImageOnly: boolean) => void;
}

export const CollectionPage: React.FC<CollectionPageProps> = ({
  currentColor,
  selectedPatternId,
  onSelectPattern,
  onSelectColor,
  onOpenSpecs,
  onOpenSustainability,
  onOpenSampleModal,
  onOpenArchitectPortal,
  onNavigate,
  onOpenSceneModal,
  isHeroImageOnly,
  onHeroImageOnlyChange,
}) => {
  const activePatternId = selectedPatternId;
  const activeImplementation = (
    PATTERNS.find(({ id }) => id === activePatternId)?.name ?? 'WIDE PLANK'
  ) as WoodImplementation;
  const heroRender =
    findWoodRender(currentColor.name, activeImplementation, 'HEROO') ??
    findWoodRender(currentColor.name, activeImplementation, null);

  return (
    <div key={currentColor.id} className="page-ease-out w-full min-h-[100svh] bg-white text-[#171717]">
      {/* Main Container */}
      <div className="relative w-full">
        {/* Floating / Sticky Sidebar for 16 Colours (Desktop) */}
        <div
          aria-hidden={isHeroImageOnly}
          onMouseEnter={() => onHeroImageOnlyChange(false)}
          className={`pointer-events-none absolute left-6 top-0 bottom-16 z-30 hidden xl:block transition-opacity duration-500 ${
            isHeroImageOnly ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <ColorSidebar
            selectedColorId={currentColor.id}
            onSelectColor={onSelectColor}
            className="pointer-events-auto sticky top-28"
          />
        </div>

        {/* Hero Section */}
        <section className="relative w-full h-[100svh] min-h-[100svh] overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              key={heroRender?.src}
              src={heroRender?.src}
              alt={`${currentColor.name} ${activeImplementation} architectural render`}
              fetchPriority="high"
              decoding="async"
              className="absolute inset-0 block h-full w-full object-cover object-center"
            />
          </div>

          <div className="absolute bottom-6 right-6 z-20 flex items-center gap-3 sm:bottom-8 sm:right-8">
            {PATTERNS.map((pattern) => {
              const isSelected = activePatternId === pattern.id;
              const patternRender = findWoodRender(
                currentColor.name,
                pattern.name as WoodImplementation,
                'SCENE2',
              );

              return (
                <button
                  key={pattern.id}
                  type="button"
                  onClick={() => onSelectPattern(pattern.id)}
                  aria-label={`Select ${pattern.name} pattern`}
                  title={pattern.name}
                  className={`group relative h-16 w-16 overflow-hidden rounded-full border shadow-xl transition-all duration-300 sm:h-20 sm:w-20 ${
                    isSelected
                      ? 'border-[#D8BD8F] ring-2 ring-[#D8BD8F]/50'
                      : 'border-white/40 bg-white/10 hover:border-[#D8BD8F] hover:bg-white/15'
                  }`}
                >
                  {patternRender?.src && (
                    <img
                      src={patternRender.src}
                      alt={`${currentColor.name} ${pattern.name}`}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  )}
                  {!patternRender?.src && (
                    <div className="flex h-full w-full items-center justify-center bg-black/20 text-[0.6875rem] font-mono uppercase tracking-[0.22em] text-white">
                      {pattern.name.split(' ')[0].slice(0, 2)}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        <div className="w-full bg-white pb-10 pt-6">
          <div className="w-full px-4 sm:px-6 lg:px-8 xl:pl-64">
            <div className="grid items-end gap-6 md:grid-cols-[minmax(0,1.3fr)_minmax(220px,0.7fr)]">
              <div className="space-y-1 text-left">
                <h2 className="text-left text-4xl font-light uppercase tracking-[0.14em] text-[#171717] sm:text-5xl">
                  {currentColor.name}
                </h2>
                <p className="text-left text-xs uppercase tracking-[0.18em] text-[#8b7252] sm:text-sm">
                  {activeImplementation}
                </p>
              </div>

              <button
                type="button"
                onClick={onOpenSampleModal}
                className="mt-3 w-full bg-[#ba8c62] px-6 py-3 text-[18px] font-light uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#a97d55] sm:py-4 sm:text-[20px]"
              >
                REQUEST A QUOTE
              </button>
            </div>
          </div>
        </div>

        {/* Mobile / Tablet Horizontal 16 Colours Strip */}
        <div className="xl:hidden w-full bg-white border-y border-[#e5e2dd] px-4 py-3 overflow-x-auto hide-scrollbar">
          <div className="flex items-center gap-3 min-w-max">
            <span className="text-[0.6875rem] font-mono uppercase tracking-widest text-[#D8BD8F] mr-2">
              COLOURS:
            </span>
            {WOOD_COLORS.map((w) => (
              <button
                key={w.id}
                onClick={() => onSelectColor(w)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider transition-colors cursor-pointer ${
                  currentColor.id === w.id
                      ? 'bg-[#f5f1ea] text-[#171717] ring-1 ring-[#D8BD8F]'
                      : 'text-[#4b5563] hover:text-[#171717] bg-[#f7f6f3]'
                }`}
              >
                <span
                  className="w-3.5 h-3.5 rounded-sm"
                  style={{ backgroundColor: w.hex }}
                />
                <span>{w.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Body Sections */}
        <main className="w-full py-16 xl:pl-64 space-y-24">
          {PATTERNS.map((pattern, index) => {
            const implementation = pattern.name as WoodImplementation;
            const boardRender =
              findWoodRender(currentColor.name, implementation, '3D') ??
              findWoodRender(currentColor.name, implementation, null);
            const boardSectionId =
              index === 0 ? 'the-board-section' : `the-board-section-${pattern.id}`;
            const gallerySectionId =
              index === 0 ? 'scenes-section' : `scenes-section-${pattern.id}`;

            return (
              <div key={pattern.id} className="space-y-6">
                <section id={boardSectionId} className="space-y-6 scroll-mt-28">
                  <div className="flex flex-col gap-4 border-b border-[#e5e2dd] pb-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-serif-luxury tracking-[0.2em] uppercase text-[#171717]">
                        THE BOARD — {pattern.name}
                      </h2>
                      <p className="text-xs tracking-[0.2em] uppercase text-[#8b7252] mt-1 font-mono">
                        {['KHUFU HORIZON', 'OSIRIS RYTHM', 'HORUS VECTOR'][index]}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={onOpenSampleModal}
                      className="w-full bg-[#ba8c62] px-6 py-3 text-[18px] font-light uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#a97d55] sm:mr-[30px] sm:w-auto sm:py-4 sm:text-[20px]"
                    >
                      REQUEST A QUOTE
                    </button>
                  </div>
                  <div className="rounded-2xl bg-white py-3">
                    {boardRender && (
                      <img
                        src={boardRender.src}
                        alt={`${currentColor.name} ${implementation.toLowerCase()} flooring board`}
                        loading="lazy"
                        decoding="async"
                        className="collection-board-float board-float block h-[70svh] max-h-[42rem] w-full object-contain"
                      />
                    )}
                  </div>
                </section>

                <section id={gallerySectionId} className="min-w-0 scroll-mt-28">
                  <SceneGallery
                    currentColorName={currentColor.name}
                    currentImplementation={implementation}
                    onOpenSceneModal={onOpenSceneModal}
                  />
                </section>
              </div>
            );
          })}
        </main>
      </div>

      {/* Technical Info & Footer */}
      <TechnicalInfoFooter
        onOpenSpecs={onOpenSpecs}
        onOpenSustainability={onOpenSustainability}
        onOpenSampleModal={onOpenSampleModal}
        onOpenArchitectPortal={onOpenArchitectPortal}
        onNavigate={onNavigate}
      />
    </div>
  );
};
