import React, { useEffect, useState } from 'react';
import { TechnicalInfoFooter } from './TechnicalInfoFooter';
import { timberScenes, TimberScene } from '../data/timberContent';
import { getSupabaseAssetEntries } from '../assets/images';
import type { SitePage } from './Navbar';
import walkwaysHero from '../assets/Walkways Hero.jpeg';
import timberStructuresHero from '../assets/Timber Structures Hero.jpeg';
import hero01 from '../assets/01 HERO.png';
import hero02 from '../assets/02 HERO.png';
import hero03 from '../assets/03 HERO.png';
import hero04 from '../assets/04 HERO.png';
import hero05 from '../assets/05 HERO.png';
import hero06 from '../assets/06 HERO.png';
import hero07 from '../assets/07 HERO.png';
import hero08 from '../assets/08 HERO.png';
import hero09 from '../assets/09 HERO.png';
import homeButtonImage from '../assets/Footer/Home button.png';

interface TimberSolutionsPageProps {
  initialProductName?: string | null;
  onOpenSpecs: () => void;
  onOpenSustainability: () => void;
  onOpenSampleModal: () => void;
  onOpenArchitectPortal: () => void;
  onNavigate: (page: SitePage) => void;
}

interface GalleryImage {
  src: string;
  caption: string;
  scene?: TimberScene;
}

interface TimberItem {
  order: number;
  name: string;
  cover: string;
  hero?: string;
  heroName?: string;
  heroScene?: TimberScene;
  gallery: GalleryImage[];
}

const toTitle = (text: string) =>
  text.toLowerCase().replace(/(^|[\s&-])([a-z])/g, (_, sep: string, c: string) => sep + c.toUpperCase());

// Cover and folder names contain typos (OUTDOR, LANDCAPE), so match on normalised letters only.
const normalise = (text: string) =>
  text
    .toUpperCase()
    .replace(/OUTDOR(?!O)/g, 'OUTDOOR')
    .replace(/LANDCAPE/g, 'LANDSCAPE')
    .replace(/[^A-Z]/g, '');

const naturalSort = (a: string, b: string) => a.localeCompare(b, undefined, { numeric: true });

const numberedName = /^\d[a-z]-\d\d/i;
const colourSuffix = /-\s*([A-Z]+)$/;
const isGalleryName = (name: string) =>
  numberedName.test(name) || (!/^H?\d+-/.test(name) && colourSuffix.test(name));

const createTimberItems = (): Record<'Indoor' | 'Outdoor', TimberItem[]> => {
  const scenesById: Record<string, TimberScene> = {};
  const scenesByName: Record<string, TimberScene> = {};
  const heroScenesBySubject: Record<string, TimberScene> = {};
  timberScenes.forEach((scene) => {
    scenesById[scene.id] ??= scene;
    scenesByName[normalise(scene.subject)] ??= scene;
    if (scene.id.startsWith('H-')) heroScenesBySubject[normalise(scene.subject)] = scene;
  });

  const entries = getSupabaseAssetEntries('TIMBER SOLUTIONS/');
  const folderImages: Record<string, { name: string; src: string }[]> = {};
  const coverFiles = entries.filter((entry) => entry.path.split('/').length === 2);
  entries
    .filter((entry) => entry.path.split('/').length === 3)
    .forEach((entry) => {
      const parts = entry.path.split('/');
      const key = normalise(parts[parts.length - 2]);
      (folderImages[key] ??= []).push({
        name: entry.filename.replace(/\.webp$/i, ''),
        src: entry.src,
      });
    });

  const items: Record<'Indoor' | 'Outdoor', TimberItem[]> = { Indoor: [], Outdoor: [] };
  coverFiles.forEach(({ filename, src: cover }) => {
    const base = filename.replace(/\.webp$/i, '');
    const match = base.match(/^(\d+)-\s*(.+?)\s+-\s+(.+)$/);
    if (!match) return;
    const files = folderImages[normalise(base)] ?? [];
    const heroImage = files.find((file) => !isGalleryName(file.name));
    const hero = heroImage?.src;
    const gallery = files
      .filter((file) => isGalleryName(file.name))
      .sort((a, b) => naturalSort(a.name, b.name))
      .map((file) => {
        const id = file.name.match(/^(\d[a-e]-\d\d)/i)?.[1].toLowerCase();
        return {
          src: file.src,
          caption: numberedName.test(file.name) ? '' : toTitle(file.name.match(colourSuffix)![1]),
          scene: id ? scenesById[id] : scenesByName[normalise(file.name)],
        };
      });
    items[match[2].startsWith('INTERIOR') ? 'Indoor' : 'Outdoor'].push({
      order: Number(match[1]),
      name: toTitle(match[3].replace(/OUTDOR /g, 'OUTDOOR ')),
      cover,
      hero,
      heroName: heroImage?.name,
      heroScene: heroScenesBySubject[normalise(match[3])],
      gallery,
    });
  });
  (Object.keys(items) as (keyof typeof items)[]).forEach((key) =>
    items[key].sort((a, b) => a.order - b.order || a.name.localeCompare(b.name)),
  );
  return items;
};

const SECTIONS = ['Outdoor', 'Indoor'] as const;
const ImagePlaceholder: React.FC<{ label: string; className?: string }> = ({
  label,
  className = '',
}) => (
  <div
    role="img"
    aria-label={label}
    className={`flex items-center justify-center border border-dashed border-[#c9c6c0] bg-[#f1f1ef] text-[0.6875rem] font-mono uppercase tracking-[0.2em] text-[#9ca3af] ${className}`}
  >
    {label}
  </div>
);

const ArrowButton: React.FC<{ direction: 'prev' | 'next'; onClick: () => void }> = ({
  direction,
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={direction === 'prev' ? 'Previous images' : 'Next images'}
    className={`absolute top-1/2 z-10 -translate-y-1/2 p-3 text-white drop-shadow-lg transition-transform hover:scale-110 ${
      direction === 'prev' ? 'left-1' : 'right-1'
    }`}
  >
    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      {direction === 'prev' ? <path d="M16 4v16L5 12z" /> : <path d="M8 4v16l11-8z" />}
    </svg>
  </button>
);

const TimberProduct: React.FC<{
  item: TimberItem;
  onBack: () => void;
  onQuote: () => void;
  onNavigateHome: () => void;
}> = ({ item, onBack, onQuote, onNavigateHome }) => {
  const { gallery } = item;
  const [selected, setSelected] = useState(0);

  const slide = (direction: 1 | -1) => {
    setSelected((current) => (current + direction + gallery.length) % gallery.length);
  };
  const current = gallery[selected];
  const productName = normalise(item.name);
  const heroSrc = productName.includes('WALKWAY')
    ? walkwaysHero
    : productName.includes('TIMBERSTRUCTURES')
      ? timberStructuresHero
      : item.hero ?? item.cover;

  return (
    <>
      <div className="h-[100svh] w-full bg-black">
        <img
          src={heroSrc}
          alt={`${item.name} hero`}
          className="h-full w-full object-cover md:object-contain"
        />
      </div>

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-6 py-10 sm:px-10 md:grid-cols-2 md:gap-12 md:px-14">
        <div>
          <h1 className="text-xl font-medium text-[#171717] sm:text-2xl">
            {item.heroScene?.title ?? item.name}
          </h1>
          <p className="italic text-[#4b5563]">{item.heroScene?.heroText ?? item.name}</p>
        </div>
        <div className="text-xs leading-relaxed text-[#171717]">
          <h2 className="mb-1 font-semibold uppercase">Material Description</h2>
          <p className={item.heroScene ? '' : 'text-[#9ca3af]'}>
            {item.heroScene?.description ?? 'Description coming soon.'}
          </p>
          <button
            type="button"
            onClick={onQuote}
            className="mt-3 w-full bg-[#ba8c62] px-6 py-3 text-[18px] font-light uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#a97d55] sm:py-4 sm:text-[20px]"
          >
            Request a Quote
          </button>
        </div>
      </section>

      {gallery.length > 0 && (
        <>
          <section className="relative" aria-label={`${item.name} gallery`}>
            <div
              className="overflow-hidden"
            >
              <div className="flex w-max animate-timber-gallery-marquee motion-reduce:animate-none">
                {[...gallery, ...gallery].map((image, index) => {
                  const galleryIndex = index % gallery.length;
                  const isDuplicate = index >= gallery.length;
                  return (
                <button
                  type="button"
                  key={`${image.src}-${index}`}
                  onClick={() => setSelected(galleryIndex)}
                  aria-label={`Show image ${galleryIndex + 1}`}
                  aria-pressed={!isDuplicate && galleryIndex === selected}
                  aria-hidden={isDuplicate}
                  tabIndex={isDuplicate ? -1 : 0}
                  className="aspect-[4/3] w-[50vw] flex-none overflow-hidden sm:w-[25vw]"
                >
                  <img
                    src={image.src}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover transition-opacity hover:opacity-70"
                  />
                </button>
                  );
                })}
              </div>
            </div>
            {gallery.length > 2 && (
              <>
                <ArrowButton direction="prev" onClick={() => slide(-1)} />
                <ArrowButton direction="next" onClick={() => slide(1)} />
              </>
            )}
          </section>

          <section className="grid h-[100svh] min-h-[100svh] w-full content-center gap-8 px-6 py-10 sm:px-10 md:grid-cols-[2fr_1fr] md:items-center md:px-14">
            <div className="min-w-0">
              <img
                src={current.src}
                alt={current.caption || item.name}
                className="max-h-[65svh] w-full object-contain"
              />
              <div className="px-6 pt-4 sm:px-10">
                <p className="text-xl font-medium text-[#171717] sm:text-2xl">
                  {current.scene?.title ?? item.name}
                </p>
                <p className="italic text-[#4b5563]">
                  {[current.caption, current.scene?.heroText].filter(Boolean).join(' — ') ||
                    item.name}
                </p>
              </div>
            </div>
            <div className="min-w-0 text-xs leading-relaxed text-[#171717]">
              <h2 className="mb-2 text-base font-medium uppercase">Material Description</h2>
              <p className={`text-[17px] font-light ${current.scene ? '' : 'text-[#9ca3af]'}`}>
                {current.scene?.description ?? 'Description coming soon.'}
              </p>
              <button
                type="button"
                onClick={onQuote}
                className="mt-4 w-full bg-[#ba8c62] px-6 py-3 text-[18px] font-light uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#a97d55] sm:py-4 sm:text-[20px]"
              >
                REQUEST A QUOTE
              </button>
              <div className="mt-4 flex flex-col items-center">
                <button
                  type="button"
                  onClick={onBack}
                  className="py-2 text-xs uppercase tracking-[0.18em] text-[#8b7252] transition-colors hover:text-[#171717]"
                >
                  ← Back to Timber Solutions
                </button>
                <button
                  type="button"
                  aria-label="Home"
                  onClick={onNavigateHome}
                  className="flex translate-y-5 items-center justify-center transition-opacity hover:opacity-75"
                >
                  <img src={homeButtonImage} alt="" className="h-10 w-10 object-contain" />
                </button>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
};

export const TimberSolutionsPage: React.FC<TimberSolutionsPageProps> = ({
  initialProductName = null,
  onOpenSpecs,
  onOpenSustainability,
  onOpenSampleModal,
  onOpenArchitectPortal,
  onNavigate,
}) => {
  const [selectedName, setSelectedName] = useState<string | null>(initialProductName);
  const items = createTimberItems();
  const heroOptions = [
    hero01,
    hero02,
    hero03,
    hero04,
    hero05,
    hero06,
    hero07,
    hero08,
    hero09,
  ];
  const [overviewHeroIndex, setOverviewHeroIndex] = useState(() => {
    if (!heroOptions.length) return 0;
    return Math.floor(Math.random() * heroOptions.length);
  });
  useEffect(() => {
    if (heroOptions.length < 2) return;
    const timer = window.setInterval(() => {
      setOverviewHeroIndex((index) => (index + 1) % heroOptions.length);
    }, 1500);
    return () => window.clearInterval(timer);
  }, [heroOptions.length]);
  const overviewHero = heroOptions[overviewHeroIndex] ?? '';
  const selected = [...items.Outdoor, ...items.Indoor].find((item) => item.name === selectedName);

  const select = (name: string | null) => {
    setSelectedName(name);
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="w-full bg-white">
      {selected ? (
        <TimberProduct
          key={selected.name}
          item={selected}
          onBack={() => select(null)}
          onQuote={onOpenSampleModal}
          onNavigateHome={() => onNavigate('home')}
        />
      ) : (
        <>
          <div className="h-[100svh] w-full overflow-hidden bg-black">
            <div
              className="flex h-full transition-transform duration-700 ease-in-out motion-reduce:transition-none"
              style={{ transform: `translateX(-${overviewHeroIndex * 100}%)` }}
            >
              {heroOptions.map((src, index) => (
                <img
                  key={src}
                  src={src}
                  alt={index === overviewHeroIndex ? 'Timber Solutions' : ''}
                  aria-hidden={index !== overviewHeroIndex}
                  className="h-full w-full flex-none object-cover md:object-contain"
                />
              ))}
            </div>
          </div>
          <main className="mx-auto w-full max-w-6xl space-y-20 px-4 pb-24 pt-24 sm:px-6">
            {SECTIONS.map((title) => (
              <section key={title} aria-label={title}>
                <h2 className="mb-12 text-center text-sm font-semibold uppercase tracking-[0.2em] text-[#171717] sm:text-base">
                  {title}
                </h2>
                <div className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-5">
                  {items[title].map(({ name, cover }) => (
                    <button
                      type="button"
                      key={name}
                      onClick={() => select(name)}
                      aria-label={`View ${name}`}
                      className="group flex flex-col items-center gap-3 text-center"
                    >
                      <img
                        src={cover}
                        alt={name}
                        loading="lazy"
                        className="aspect-square w-full object-cover transition-opacity group-hover:opacity-80"
                      />
                      <span className="text-xs uppercase tracking-wider text-[#171717]">{name}</span>
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </main>
        </>
      )}
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
