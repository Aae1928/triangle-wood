import React from 'react';
import type { SitePage } from './Navbar';
import triangleWoodLogo from '../assets/Trianglwood3.png';
import footerBackground from '../assets/Footer/Timber Crew in Motion.png';
import productMarks from '../assets/Footer/13.webp';
import linkedInIcon from '../assets/Footer/14.webp';
import facebookIcon from '../assets/Footer/15.webp';
import instagramIcon from '../assets/Footer/16.webp';
import youtubeIcon from '../assets/Footer/17.webp';
import pinterestIcon from '../assets/Footer/18.webp';
import tiktokIcon from '../assets/Footer/19.webp';
import snapchatIcon from '../assets/Footer/20.webp';
import xIcon from '../assets/Footer/21.webp';
import telegramIcon from '../assets/Footer/22.webp';

interface TechnicalInfoFooterProps {
  onOpenSpecs: () => void;
  onOpenSustainability: () => void;
  onOpenSampleModal: () => void;
  onOpenArchitectPortal: () => void;
  onNavigate: (page: SitePage) => void;
}

const navigationLinks: { label: string; page: SitePage }[] = [
  { label: 'INSPIRATION', page: 'inspiration' },
  { label: 'ENG WOOD FLOOR', page: 'collection' },
  { label: 'PARQUETRY', page: 'parquetry' },
  { label: 'TIMBER SOLUTIONS', page: 'timber' },
];

const socialIcons = [
  { label: 'LinkedIn', src: linkedInIcon },
  { label: 'Facebook', src: facebookIcon },
  { label: 'Instagram', src: instagramIcon },
  { label: 'YouTube', src: youtubeIcon },
  { label: 'Pinterest', src: pinterestIcon },
  { label: 'TikTok', src: tiktokIcon },
  { label: 'Snapchat', src: snapchatIcon },
  { label: 'X', src: xIcon },
  { label: 'Telegram', src: telegramIcon },
];

export const TechnicalInfoFooter: React.FC<TechnicalInfoFooterProps> = ({
  onOpenSpecs,
  onOpenSustainability,
  onOpenSampleModal,
  onOpenArchitectPortal,
  onNavigate,
}) => (
  <footer className="relative isolate w-full overflow-hidden bg-[#fffaf4] text-[#3d332b]">
    <img
      src={footerBackground}
      alt=""
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover object-center opacity-[0.07]"
    />

    <div className="relative z-10 mx-auto max-w-[90rem] px-5 pt-12 pb-5 sm:px-8 sm:pt-16 sm:pb-5 lg:px-14 lg:pt-20 lg:pb-5">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div>
          <h2 className="max-w-3xl text-[clamp(2rem,6vw,5.5rem)] font-light uppercase leading-[0.98] tracking-[-0.04em] text-[#B8895D]">
            LET&apos;S TALK ABOUT
            <br />
            YOUR PROJECT.
          </h2>
          <p className="mt-4 max-w-2xl text-sm font-light leading-relaxed sm:text-base lg:text-lg">
            Have something in mind?
            <br />
            We&apos;d love to hear about it. Whether you have a clear vision
            or are still exploring ideas, we&apos;re here to help you bring it to life.
          </p>
        </div>

        <div className="flex items-start justify-start lg:justify-end">
          <img
            src={productMarks}
            alt="Click System and UV Surface"
            className="w-full max-w-2xl object-contain lg:-translate-y-[37%]"
          />
        </div>
      </div>

      <div className="mt-2">
        <button
          type="button"
          onClick={onOpenSampleModal}
          className="w-full max-w-2xl bg-[#B8895D] px-6 py-3 text-[18px] font-light uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#a57951] sm:py-4 sm:text-[20px]"
        >
          TELL US WHAT YOU&apos;RE THINKING
        </button>
      </div>

      <div className="mt-12 grid gap-0 border-t border-[#B8895D]/25 pt-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="text-left text-3xl font-light uppercase tracking-[-0.03em] text-[#B8895D] transition-colors hover:text-[#8b5e3c]"
          >
            <img src={triangleWoodLogo} alt="Triangle Wood" className="h-[58px] w-auto object-contain sm:h-[74px]" />
          </button>
          <p className="-mt-4 text-sm font-light italic sm:text-base lg:text-lg">
            Good spaces start with good conversations.
          </p>
          <address className="mt-2 not-italic text-[10px] uppercase leading-[1.5] tracking-[0.1em] text-[#66574a] sm:text-[11px]">
            <span className="lg:whitespace-nowrap">
              HEAD OFFICE & SHOWROOM: 6 MOEZ ELDAWLA OFF MAKRAM EBEID | NASR CITY | CAIRO | EGYPT.
            </span>
            <br />
            <span className="lg:whitespace-nowrap">
              MANUFACTURING: 566G + PRR ALEXANDRIA AGRICULTURAL ROAD | QALYUB | AL QALYUBIA | EGYPT.
            </span>
            <br />
            COMMERCIAL REGISTER NO. 100100700411479
            <br />
            TAX/VAT ID NO. 2526486262624636
            <br />
            T: +226 70 69 70 | M: +201 002 510 403
            <br />
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="text-[19px] font-light normal-case tracking-[0.2em] hover:underline"
            >
              trianglewood.eg
            </button>
          </address>
        </div>

        <div className="flex flex-col gap-7 lg:items-end">
          <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-6 gap-y-3">
            {navigationLinks.map(({ label, page }) => (
              <button
                key={page}
                type="button"
                onClick={() => onNavigate(page)}
                className="text-xs font-light uppercase tracking-[0.1em] text-[#3d332b] transition-colors hover:text-[#B8895D] sm:text-sm"
              >
                {label}
              </button>
            ))}
          </nav>

          <div aria-label="Social media" className="flex flex-wrap gap-2">
            {socialIcons.map(({ label, src }) => (
              <img
                key={label}
                src={src}
                alt={label}
                className="h-9 w-9 object-contain sm:h-10 sm:w-10"
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col items-start gap-0 border-t border-[#B8895D]/25 pt-4 text-left text-[0.62rem] leading-relaxed text-[#66574a] sm:text-xs">
        <p>
          Visuals are accurate reproductions presented with appropriate permissions from our
          business partners as part of TRIANGLE WOOD&apos;s creative portfolio. Materials and
          finishes may vary by project.
        </p>
        <p className="leading-[1.5]">
          © 2026 TRIANGLE WOOD. ALL RIGHTS RESERVED. | Designed &amp; Developed by OR, Ehab &amp;
          Mobdy
        </p>
      </div>
    </div>
  </footer>
);
