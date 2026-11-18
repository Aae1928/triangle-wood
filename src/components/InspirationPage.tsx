import React from 'react';
import { useProximitySnap } from '../hooks/useProximitySnap';
import rootsVideo from '../assets/Videos Inspiration/OUR ROOTS.mp4';
import namesVideo from '../assets/Videos Inspiration/THE NAMES WE CARRY.mp4';
import timberVideo from '../assets/Videos Inspiration/THE DEVOTION THAT TAKES WOOD FURTHER.mp4';
import rootsImage from '../assets/Inspiration Images/A BEGINNING WE CARRY WITH US.webp';
import enduringImage from '../assets/Inspiration Images/INSPIRED BY WHAT ENDURES.webp';
import rootsBackdrop from '../assets/Inspiration Images/roots-hero.webp';
import namesBackdrop from '../assets/Inspiration Images/ancient-names-hero.webp';
import timberBackdrop from '../assets/Inspiration Images/timber-solutions-hero.webp';
import rusticBalconyHouseImage from '../assets/Inspiration Images/Monochrome Sketch of a Rustic Balcony House.png';
import { TechnicalInfoFooter } from './TechnicalInfoFooter';
import type { SitePage } from './Navbar';

interface InspirationPageProps {
  onOpenSpecs: () => void;
  onOpenSustainability: () => void;
  onOpenSampleModal: () => void;
  onOpenArchitectPortal: () => void;
  onNavigate: (page: SitePage) => void;
}

interface InspirationVideoSectionProps {
  video: string;
  backdrop: string;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

const InspirationVideoSection: React.FC<InspirationVideoSectionProps> = ({
  video,
  backdrop,
  title,
  subtitle,
  children,
}) => (
  <section className="proximity-snap-section relative h-[100svh] min-h-[100svh] w-full overflow-hidden bg-[#171717]">
    <img
      src={backdrop}
      alt=""
      aria-hidden="true"
      className="absolute inset-0 h-full w-full object-cover"
    />
    <video
      src={video}
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
      aria-label={`${title} video`}
      className="absolute inset-0 h-full w-full object-cover"
    />
    <div className="absolute inset-0 bg-black/35" />
    <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
      <h1 className="text-2xl font-light uppercase leading-[1.05] tracking-[0.04em] sm:text-4xl lg:text-5xl">
        {title}
      </h1>
      {subtitle && <p className="mt-3 text-sm font-light italic tracking-wide sm:text-lg">{subtitle}</p>}
    </div>
    {children && (
      <div className="absolute inset-x-0 bottom-8 z-10 flex justify-center px-6 text-center text-white">
        {children}
      </div>
    )}
  </section>
);

interface InspirationStorySectionProps {
  eyebrow?: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  onOpenSampleModal: () => void;
}

const InspirationStorySection: React.FC<InspirationStorySectionProps> = ({
  eyebrow,
  title,
  description,
  image,
  imageAlt,
  onOpenSampleModal,
}) => (
  <section className="proximity-snap-section grid h-[100svh] min-h-[100svh] w-full grid-rows-[50%_50%] bg-white lg:grid-rows-1 lg:grid-cols-2">
    <div className="flex min-h-0 flex-col justify-center px-6 py-6 sm:px-12 lg:px-[12%]">
      {eyebrow && (
        <span className="mb-3 text-[0.65rem] font-light uppercase tracking-[0.22em] text-[#8b7252] sm:text-xs">
          {eyebrow}
        </span>
      )}
      <h2 className="max-w-xl text-2xl font-semibold leading-[1.05] tracking-[0.04em] text-[#171717] sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      <p className="mt-0 max-w-xl text-[28px] font-light leading-relaxed text-[#4b5563] sm:mt-2 sm:text-[30px] sm:leading-8 lg:text-[32px]">
        {description}
      </p>
    </div>

    <div className="flex min-h-0 flex-col items-center px-6 pb-6 sm:px-12 sm:pb-10 lg:justify-center lg:px-[8%] lg:py-10">
      <img src={image} alt={imageAlt} className="min-h-0 w-full flex-1 object-contain py-3 sm:py-6" />
      <button
        type="button"
        onClick={onOpenSampleModal}
        className="mt-3 w-full bg-[#171717] px-6 py-3 text-[18px] font-light uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#8b7252] sm:py-4 sm:text-[20px]"
      >
        REQUEST A QUOTE
      </button>
    </div>
  </section>
);

export const InspirationPage: React.FC<InspirationPageProps> = ({
  onOpenSpecs,
  onOpenSustainability,
  onOpenSampleModal,
  onOpenArchitectPortal,
  onNavigate,
}) => {
  useProximitySnap();

  return (
  <main className="w-full bg-white text-[#171717]">
    <InspirationVideoSection
      video={rootsVideo}
      backdrop={rootsBackdrop}
      title="OUR ROOTS"
      subtitle="The Lineage of the Atelier"
    />
    <InspirationStorySection
      title="A BEGINNING WE CARRY WITH US"
      description="Our story begins in Bulaq, Cairo, where Mostafa, our founder's father, spent a lifetime shaping wood by hand, with care and dedication that never left us. Today, that same spirit guides TRIANGLE WOOD, in the way we work with natural timber and the care we put into every floor we create."
      image={rootsImage}
      imageAlt="Illustration of a craftsman shaping wood by hand"
      onOpenSampleModal={onOpenSampleModal}
    />
    <InspirationVideoSection
      video={namesVideo}
      backdrop={namesBackdrop}
      title="THE NAMES WE CARRY"
      subtitle="Inspired by the language, places and legacy of Ancient Egypt."
    >
      <p className="mt-0 max-w-4xl text-[0.6rem] font-light uppercase leading-relaxed tracking-[0.12em] text-white/90 sm:text-xs sm:tracking-[0.18em]">
        TEFNUT · GURNAH · AMARNA · NAPATA · BADARI · SIA · KUSH · NUBIA · ATUM
        <br />
        MENTUHOTEP · KIYA · MAYET · DESHRET · MENFE · PEPI · EDFU
      </p>
    </InspirationVideoSection>
    <InspirationStorySection
      title="INSPIRED BY WHAT ENDURES"
      description="There is something about the beauty of ancient Egypt that has always stayed with us — the care of its craftsmen, the patience behind every detail and the desire to create things that stand the test of time. It is a spirit we share as a team at TRIANGLE WOOD, and one we love to bring into every detail of our work, even in the names and natural character of the woods we choose."
      image={enduringImage}
      imageAlt="Illustration inspired by the architecture and hieroglyphs of ancient Egypt"
      onOpenSampleModal={onOpenSampleModal}
    />
    <InspirationVideoSection
      video={timberVideo}
      backdrop={timberBackdrop}
      title="THE DEVOTION THAT TAKES WOOD FURTHER"
      subtitle="Timber Solutions"
    />
    <InspirationStorySection
      title="WHERE OUR LOVE FOR TIMBER TAKES US"
      description="Our love for timber has always taken us further, beyond the floor and into the spaces around us, inspiring us to create pergolas, bridges, staircases, outdoor seating, timber houses and much more, because we believe that wherever life meets architecture, there is a place for wood."
      image={rusticBalconyHouseImage}
      imageAlt="Monochrome sketch of a rustic balcony house"
      onOpenSampleModal={onOpenSampleModal}
    />
    <TechnicalInfoFooter
      onOpenSpecs={onOpenSpecs}
      onOpenSustainability={onOpenSustainability}
      onOpenSampleModal={onOpenSampleModal}
      onOpenArchitectPortal={onOpenArchitectPortal}
      onNavigate={onNavigate}
    />
  </main>
  );
};
