import React, { useState } from 'react';
import { TechnicalInfoFooter } from './TechnicalInfoFooter';
import { parquetryEntries } from '../data/parquetryContent';
import { getSupabaseAssetEntries, getSupabaseAssetUrl } from '../assets/images';
import type { SitePage } from './Navbar';

interface ParquetryPageProps {
  initialProductName?: string | null;
  onOpenSpecs: () => void;
  onOpenSustainability: () => void;
  onOpenSampleModal: () => void;
  onOpenArchitectPortal: () => void;
  onNavigate: (page: SitePage) => void;
}

interface ProductImages {
  threeD?: string;
  k1?: string;
  k2?: string;
  material?: string;
}

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

export const ParquetryPage: React.FC<ParquetryPageProps> = ({
  initialProductName = null,
  onOpenSpecs,
  onOpenSustainability,
  onOpenSampleModal,
  onOpenArchitectPortal,
  onNavigate,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(initialProductName);

  const product = parquetryEntries.find((entry) => entry.name === selectedProduct);
  const classes = [...new Set(parquetryEntries.map((entry) => entry.classKey))].map((key) => ({
    key,
    title: key,
    products: parquetryEntries.filter((entry) => entry.classKey === key),
  }));
  const parquetryAssets = getSupabaseAssetEntries('PARQUETRY/');
  const imagesByName: Record<string, ProductImages> = {};
  for (const asset of parquetryAssets) {
    const base = asset.filename.replace(/\.webp$/i, '');
    const isThreeD = / 3D_nobg$/i.test(base);
    if (isThreeD) {
      const name = base.replace(/ 3D_nobg$/i, '');
      (imagesByName[name] ??= {}).threeD = asset.src;
      continue;
    }

    if (asset.path.split('/').length < 4) continue;
    const match = base.match(/^(.+?)(?: (1K|2K))?$/i);
    if (!match) continue;
    const entry = (imagesByName[match[1]] ??= {});
    if (match[2]?.toUpperCase() === '1K') entry.k1 = asset.src;
    else if (match[2]?.toUpperCase() === '2K') entry.k2 = asset.src;
    else entry.material = asset.src;
  }
  const images: ProductImages = (selectedProduct && imagesByName[selectedProduct]) || {};
  const parquetryHero = parquetryAssets.find(
    (asset) => asset.path.split('/').length === 2 && /HERO\.webp$/i.test(asset.filename),
  )?.src ?? getSupabaseAssetUrl('PARQUETRY/PARQUETRY HERO.webp');

  const showProduct = (name: string) => {
    setSelectedProduct(name);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showCatalog = () => {
    setSelectedProduct(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full bg-white">
      {product ? (
        <>
          {images.k2 ? (
            <img
              src={images.k2}
              alt={`${product.name} parquetry hero`}
              className="h-[100svh] w-full object-cover"
            />
          ) : (
            <ImagePlaceholder label="Hero image" className="h-[100svh] w-full border-x-0 border-t-0" />
          )}

          <main className="mx-auto grid min-h-[100svh] w-full max-w-7xl content-center gap-8 px-6 py-10 sm:px-10 md:grid-cols-2 md:items-center md:gap-12 md:px-14 md:py-12">
            {images.threeD ? (
              <img
                src={images.threeD}
                alt={`${product.name} parquetry`}
                className="board-float h-[50vh] w-full object-contain [backface-visibility:hidden] sm:h-[65vh] md:h-[75vh]"
              />
            ) : (
              <ImagePlaceholder
                label="Parquetry product image"
                className="h-[50vh] w-full -rotate-3 sm:h-[65vh] md:h-[75vh]"
              />
            )}

            <section aria-labelledby="parquetry-product-title">
              <button
                type="button"
                onClick={showCatalog}
                className="mb-6 text-xs uppercase tracking-[0.18em] text-[#8b7252] hover:text-[#171717]"
              >
                ← Back to Parquetry
              </button>
              <h1
                id="parquetry-product-title"
                className="mb-3 text-2xl font-semibold tracking-[0.12em] text-[#171717] sm:text-3xl"
              >
                {product.name}
              </h1>
              <div className="space-y-3 text-sm leading-relaxed text-[#171717] sm:text-base">
                {product.fields.map(({ label, value }) => (
                  <p key={label}>
                    {label}: {value}
                  </p>
                ))}
                {product.headline && (
                  <p className="pt-2 font-semibold uppercase tracking-[0.08em]">
                    {product.headline}
                  </p>
                )}
                {product.tagline && <p>{product.tagline}</p>}
                {product.description && <p>{product.description}</p>}
              </div>
              <button
                type="button"
                onClick={onOpenSampleModal}
                className="mt-3 w-full bg-[#ba8c62] px-6 py-3 text-[18px] font-light uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#a97d55] sm:py-4 sm:text-[20px]"
              >
                Request a Quote
              </button>
            </section>
          </main>
          <section className="grid h-[100svh] grid-cols-1 grid-rows-2 md:grid-cols-2 md:grid-rows-1">
            {images.k1 ? (
              <img
                src={images.k1}
                alt={`${product.name} interior`}
                className="h-full w-full object-cover"
              />
            ) : (
              <ImagePlaceholder
                label="Interior image"
                className="h-full w-full border-x-0"
              />
            )}
            {images.material ? (
              <img
                src={images.material}
                alt={`${product.name} material`}
                className="h-full w-full object-cover"
              />
            ) : (
              <ImagePlaceholder
                label="Material image"
                className="h-full w-full border-x-0"
              />
            )}
          </section>
        </>
      ) : (
        <>
          <section className="relative h-[100svh] w-full overflow-hidden">
            {parquetryHero ? (
              <img src={parquetryHero} alt="Parquetry hero" className="h-full w-full object-cover" />
            ) : (
              <ImagePlaceholder label="Hero image" className="h-full w-full border-x-0 border-t-0" />
            )}
            <div className="font-display-brand absolute bottom-8 left-8 flex flex-col items-start gap-0 text-left text-white drop-shadow-md sm:bottom-10 sm:left-10">
              <p className="text-lg font-light italic leading-tight sm:text-2xl">
                Heritage Geometry. Crafted Symmetry. Timeless Architecture.
              </p>
              <p className="text-lg font-light italic leading-tight sm:text-2xl">
                Contemporary Geometry. Spatial Rythm. Architectural Expression.
              </p>
            </div>
          </section>
          <main className="mx-auto w-full max-w-6xl space-y-20 px-4 pb-24 pt-24 sm:px-6">
            {classes.map((group, groupIndex) => (
              <section key={group.key} aria-label={group.title}>
                <h2 className="mb-12 text-center text-sm font-semibold uppercase tracking-[0.2em] text-[#171717] sm:text-base">
                  {group.title}
                </h2>
                <div className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-5">
                  {group.products.map(({ name, fields }, productIndex) => {
                    const motionIndex = groupIndex * group.products.length + productIndex;
                    const duration = 5 + (motionIndex % 9) * 0.45;
                    const delay = -((motionIndex * 1.3) % duration);

                    return (
                    <button
                      type="button"
                      key={name}
                      onClick={() => showProduct(name)}
                      className="group flex flex-col items-center gap-1 text-center"
                      aria-label={`View ${name} parquetry details`}
                    >
                      {imagesByName[name]?.threeD ? (
                        <img
                          src={imagesByName[name].threeD}
                          alt={`${name} parquetry`}
                          loading="lazy"
                          className="board-float aspect-square w-full object-contain transition-opacity group-hover:opacity-80"
                          style={{
                            animationDuration: `${duration}s`,
                            animationDelay: `${delay}s`,
                          }}
                        />
                      ) : (
                        <ImagePlaceholder label="Image" className="aspect-square w-full" />
                      )}
                      <span className="text-xs uppercase tracking-wider text-[#171717]">
                        {name}
                      </span>
                      <span className="text-xs text-[#6b7280]">
                        {fields.find(({ label }) => label === 'INSPIRATION')?.value}
                      </span>
                    </button>
                    );
                  })}
                </div>
              </section>
            ))}
          </main>
          <TechnicalInfoFooter
            onOpenSpecs={onOpenSpecs}
            onOpenSustainability={onOpenSustainability}
            onOpenSampleModal={onOpenSampleModal}
            onOpenArchitectPortal={onOpenArchitectPortal}
            onNavigate={onNavigate}
          />
        </>
      )}
    </div>
  );
};
