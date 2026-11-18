import React, { useEffect, useRef, useState } from 'react';
import { TechnicalInfoFooter } from './TechnicalInfoFooter';
import type { SitePage } from './Navbar';
import { useProximitySnap } from '../hooks/useProximitySnap';
import homeVideo from '../assets/website-video-optimized.mp4';
import woodNextToLogo from '../assets/Home Images/WOOD NEXT TO TITLE LOGO NO BACKGROUND.webp';
import homePageLogo from '../assets/Trianglwood.png';
import clickSystemLogo from '../assets/Titles/CLICK SYSTEM LOGO NO BACKGROUND.webp';
import uvSurfaceLogo from '../assets/Titles/UV SURFACE LOGO NO BACKGROUND.webp';
import precisionVideo from '../assets/Videos/VIDEO PRECISION IN EVERY FIT.mp4';
import balanceVideo from '../assets/Videos/BALANCE IN EVERY LAYER.mp4';
import connectionVideo from '../assets/Videos/A CONNECTION YOU CAN TRUST.mp4';
import togetherVideo from '../assets/Videos/MADE TO COME TOGETHER.mp4';
import continuousVideo from '../assets/Videos/ONE CONTINUOUS SURFACE.mp4';
import finishVideo from '../assets/Videos/A FINISH MADE WITH CARE.mp4';
import beautyVideo from '../assets/Videos/BEAUTY THAT LASTS.mp4';
import grainVideo from '../assets/Videos/EVERY GRAIN HAS A STORY.mp4';
import lifeVideo from '../assets/Videos/FOR THE LIFE YOU LIVE.mp4';
import precisionImage from '../assets/Home Images/PRECISION IN EVERY FIT.webp';
import balanceImage from '../assets/Home Images/BALANCE IN EVERY LAYER.webp';
import connectionImage from '../assets/Home Images/A CONNECTION YOU CAN TRUST.jpg';
import togetherImage from '../assets/Home Images/MADE TO COME TOGETHER.webp';
import continuousImage from '../assets/Home Images/ONE CONTINUOUS SURFACE.webp';
import finishImage from '../assets/Home Images/A FINISH MADE WITH CARE.webp';
import beautyImage from '../assets/Home Images/BEAUTY THAT LASTS.webp';
import grainImage from '../assets/Home Images/EVERY GRAIN HAS A STORY.webp';
import lifeImage from '../assets/Home Images/FOR THE LIFE YOU LIVE.webp';
import clickSystemLineArtVideo from '../assets/Videos/VIDEO CLICK SYSTEM LINE ART.mp4';
import clockLineArtVideo from '../assets/Videos/VIDEO CLOCK LINE ART.mp4';
import fingersClickVideo from '../assets/Videos/VIDEO FINGERS CLICK.mp4';
import onePlankLineArtVideo from '../assets/Videos/VIDEO ONE PLANK LINE ART.mp4';
import solidSurfaceLineArtVideo from '../assets/Videos/VIDEO ONE SOLID SURFACE LINE ART.mp4';

interface HomePageProps {
  onOpenSpecs: () => void;
  onOpenSustainability: () => void;
  onOpenSampleModal: () => void;
  onOpenArchitectPortal: () => void;
  onNavigate: (page: SitePage) => void;
}

interface HomeStory {
  title: string;
  description: string;
  video: string;
  imageVideo?: string;
  image: string;
  imageAlt: string;
  logo: string;
}

const clickSystemStories: HomeStory[] = [
  {
    title: 'PRECISION IN EVERY FIT',
    description:
      'Every plank is carefully machined to meet the next with accuracy, creating a beautifully aligned floor where every detail finds its place.',
    video: precisionVideo,
    imageVideo: onePlankLineArtVideo,
    image: precisionImage,
    imageAlt: 'Precision-machined engineered wood floorboards',
    logo: clickSystemLogo,
  },
  {
    title: 'BALANCE IN EVERY LAYER',
    description:
      "Wood has a natural character and movement. By arranging each layer in alternating grain directions, we create a carefully balanced construction that helps maintain the floor's dimensional stability over time.",
    video: balanceVideo,
    imageVideo: clickSystemLineArtVideo,
    image: balanceImage,
    imageAlt: 'Engineered wood layers arranged for stability',
    logo: clickSystemLogo,
  },
  {
    title: 'A CONNECTION YOU CAN TRUST',
    description:
      'The TRIANGLE WOOD Click System™ brings each board securely together, creating a dependable connection designed to stay beautifully in place.',
    video: connectionVideo,
    imageVideo: fingersClickVideo,
    image: connectionImage,
    imageAlt: 'Wood flooring boards arranged to show their connection',
    logo: clickSystemLogo,
  },
  {
    title: 'MADE TO COME TOGETHER',
    description:
      'Thoughtfully engineered profiles make installation smoother and more consistent, allowing each plank to find its place with ease.',
    video: togetherVideo,
    imageVideo: clockLineArtVideo,
    image: togetherImage,
    imageAlt: 'Engineered wood flooring during installation',
    logo: clickSystemLogo,
  },
  {
    title: 'ONE CONTINUOUS SURFACE',
    description:
      'As each plank meets the next, individual pieces become one harmonious surface, bringing a natural sense of flow and continuity to your space.',
    video: continuousVideo,
    imageVideo: solidSurfaceLineArtVideo,
    image: continuousImage,
    imageAlt: 'A continuous surface of engineered wood floorboards',
    logo: clickSystemLogo,
  },
];

const uvSurfaceStories: HomeStory[] = [
  {
    title: 'A FINISH\nMADE WITH CARE',
    description:
      'We give every floor the attention it deserves, using European UV curing technology to create the smooth, consistent finish of TRIANGLE WOOD UV Surface™.',
    video: finishVideo,
    image: finishImage,
    imageAlt: 'Wood flooring treated by a UV finishing machine',
    logo: uvSurfaceLogo,
  },
  {
    title: 'BEAUTY THAT LASTS',
    description:
      "We want you to enjoy the beauty of your wood for years to come, and that's why TRIANGLE WOOD UV Surface™ gives it the care and protection it deserves.",
    video: beautyVideo,
    image: beautyImage,
    imageAlt: 'UV-cured finish applied to a wood floor',
    logo: uvSurfaceLogo,
  },
  {
    title: 'EVERY GRAIN HAS A STORY',
    description:
      'It is the natural color, the grain and the little details that make you fall in love with wood, and TRIANGLE WOOD UV Surface™ helps preserve the character that makes each floor special.',
    video: grainVideo,
    image: grainImage,
    imageAlt: 'Natural character and grain in a wood floor',
    logo: uvSurfaceLogo,
  },
  {
    title: 'FOR THE LIFE YOU LIVE',
    description:
      'From busy mornings to evenings with family and friends, TRIANGLE WOOD UV Surface™ helps your floors stand up to everyday wear, so you can simply enjoy living in your space.',
    video: lifeVideo,
    image: lifeImage,
    imageAlt: 'Everyday care of an engineered wood floor',
    logo: uvSurfaceLogo,
  },
];

interface StorySectionProps {
  eyebrow: string;
  story: HomeStory;
  onOpenSampleModal: () => void;
}

interface StoryArtworkProps {
  image: string;
  imageAlt: string;
  video?: string;
}

const StoryArtwork: React.FC<StoryArtworkProps> = ({ image, imageAlt, video }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const visibilityRoot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!video || !visibilityRoot.current || !videoRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const videoElement = videoRef.current;
        if (!entry || !videoElement) return;

        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          void videoElement.play().catch((error: unknown) => {
            console.error(`Unable to play the ${imageAlt} illustration video.`, error);
          });
        } else {
          videoElement.pause();
          videoElement.currentTime = 0;
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(visibilityRoot.current);
    return () => {
      observer.disconnect();
      videoRef.current?.pause();
    };
  }, [imageAlt, video]);

  if (!video) {
    return <img src={image} alt={imageAlt} className="min-h-0 w-full flex-1 object-contain py-4 sm:py-8" />;
  }

  return (
    <div ref={visibilityRoot} className="relative min-h-0 w-full flex-1 py-4 sm:py-8">
      <video
        ref={videoRef}
        src={video}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={`${imageAlt} animated illustration`}
        className="absolute inset-0 h-full w-full object-contain"
      />
    </div>
  );
};

const StoryVideoSection: React.FC<StorySectionProps> = ({ story }) => (
  <section className="proximity-snap-section relative h-[100svh] min-h-[100svh] w-full overflow-hidden bg-black">
    <video
      src={story.video}
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
      aria-label={`${story.title} video`}
      className="absolute inset-0 h-full w-full object-cover"
    />
    <div className="absolute inset-0 bg-black/15" />
    <img
      src={story.logo}
      alt=""
      aria-hidden="true"
      className="absolute left-1/2 top-1/2 w-[72%] max-w-4xl -translate-x-1/2 -translate-y-1/2"
    />
  </section>
);

const StorySection: React.FC<StorySectionProps> = ({
  eyebrow,
  story,
  onOpenSampleModal,
}) => (
  <section className="proximity-snap-section grid h-[100svh] min-h-[100svh] w-full grid-rows-[50%_50%] bg-white lg:grid-rows-1 lg:grid-cols-2">
    <div className="flex min-h-0 flex-col justify-center px-6 py-5 sm:px-12 lg:px-[12%] lg:py-12">
      <span className="text-[0.62rem] uppercase tracking-[0.24em] text-[#8b7252] sm:text-xs">
        TW PREMIUM {eyebrow === 'CLICK SYSTEM™' ? 'ENGINEERED WOOD FLOOR' : 'CURED WOOD FLOOR'}
        {eyebrow === 'UV SURFACE™' ? ' · UV SURFACE™' : ''}
      </span>
      <h2 className="mt-3 max-w-xl whitespace-pre-line text-2xl font-semibold leading-[1.05] tracking-[0.04em] text-[#171717] sm:text-4xl lg:text-5xl">
        {story.title}
      </h2>
      <p className="mt-0 max-w-md text-xl font-light leading-relaxed text-[#4b5563] sm:mt-2 sm:text-[22px] sm:leading-7 lg:text-2xl">
          {story.description}
      </p>
    </div>

    <div className="flex min-h-0 flex-col items-center px-6 pb-6 sm:px-12 sm:pb-10 lg:justify-center lg:px-[8%] lg:py-10">
      <StoryArtwork image={story.image} imageAlt={story.imageAlt} video={story.imageVideo} />
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

const ProductStory: React.FC<StorySectionProps> = (props) => (
  <>
    <StoryVideoSection {...props} />
    <StorySection {...props} />
  </>
);

export const HomePage: React.FC<HomePageProps> = ({
  onOpenSpecs,
  onOpenSustainability,
  onOpenSampleModal,
  onOpenArchitectPortal,
  onNavigate,
}) => {
  useProximitySnap();

  return (
  <div className="home-page w-full bg-white text-[#171717]">
    <section className="proximity-snap-section relative h-[100svh] min-h-[100svh] w-full overflow-hidden">
      <video
        src={homeVideo}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        className="absolute inset-0 block h-full w-full object-cover object-center"
      />
    </section>

    <section className="proximity-snap-section grid h-[100svh] min-h-[100svh] w-full grid-rows-[50%_50%] bg-white lg:grid-rows-1 lg:grid-cols-2">
      <div className="flex min-h-0 flex-col justify-center px-6 py-6 sm:px-12 lg:px-[12%]">
        <img
          src={homePageLogo}
          alt="Triangle Wood"
          className="max-h-28 w-auto max-w-full object-contain object-left sm:max-h-44 lg:max-h-56"
        />
        <p className="mt-0 max-w-xl text-xl font-light leading-relaxed text-[#4b5563] sm:mt-2 sm:text-[22px] sm:leading-7 lg:text-2xl">
          The finest things in life are often felt in the smallest details. At TRIANGLE WOOD, we
          bring together the spirit of Egyptian craftsmanship, inspired by a timeless appreciation
          for architecture and precision, with carefully selected woods and advanced European
          engineering. From our sophisticated click system to our UV-cured surfaces, every detail
          is considered, so you can simply enjoy the moments that make a place yours.
        </p>
      </div>
      <div className="flex min-h-0 flex-col items-center px-6 pb-6 sm:px-12 sm:pb-10 lg:justify-center lg:px-[4%] lg:py-8">
        <img
          src={woodNextToLogo}
          alt="Engineered wood floorboards beside the Triangle Wood logo"
          className="board-float min-h-0 w-full flex-1 object-contain"
        />
        <button
          type="button"
          onClick={onOpenSampleModal}
          className="mt-3 w-full bg-[#171717] px-6 py-3 text-[18px] font-light uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#8b7252] sm:py-4 sm:text-[20px]"
        >
          REQUEST A QUOTE
        </button>
      </div>
    </section>

    {clickSystemStories.map((story) => (
      <ProductStory
        key={story.title}
        eyebrow="CLICK SYSTEM™"
        story={story}
        onOpenSampleModal={onOpenSampleModal}
      />
    ))}

    {uvSurfaceStories.map((story) => (
      <ProductStory
        key={story.title}
        eyebrow="UV SURFACE™"
        story={story}
        onOpenSampleModal={onOpenSampleModal}
      />
    ))}

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


