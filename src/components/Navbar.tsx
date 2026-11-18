import React, { useState } from 'react';
import headerLogo from '../assets/logo.png';

export type SitePage = 'home' | 'collection' | 'parquetry' | 'timber' | 'inspiration';

interface NavbarProps {
  currentPage: SitePage;
  onNavigate: (page: SitePage, sectionId?: string) => void;
  onOpenSampleModal: () => void;
  onOpenSearchModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onOpenSampleModal,
  onOpenSearchModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed left-0 top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#e5e2dd]">
      <div className="flex h-[60px] w-full min-w-0 items-center justify-between gap-2 px-1 sm:h-[76px] sm:gap-6 sm:px-3 lg:h-[92px] lg:px-5">
        <button
          onClick={() => onNavigate('home')}
          className="flex shrink-0 cursor-pointer items-center justify-start transition-opacity hover:opacity-90"
        >
          <img
            src={headerLogo}
            alt="Triangle Wood Logo"
            className="h-14 w-auto max-w-[clamp(6rem,30vw,10rem)] object-contain object-left sm:h-16 sm:max-w-none lg:h-20"
          />
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden xl:flex items-center gap-8 text-sm tracking-[0.2em] uppercase font-light xl:text-[20px]">
          <button
            onClick={() => onNavigate('collection')}
            className={`transition-colors cursor-pointer py-1 relative ${
              currentPage === 'collection'
                ? 'text-[#171717] font-semibold'
                : 'text-[#4b5563] hover:text-[#171717]'
            }`}
          >
            <span>ENG WOOD FLOOR</span>
            {currentPage === 'collection' && (
              <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#D8BD8F]" />
            )}
          </button>

          <button
            onClick={() => onNavigate('parquetry')}
            className={`transition-colors cursor-pointer py-1 relative ${
              currentPage === 'parquetry'
                ? 'text-[#171717] font-semibold'
                : 'text-[#4b5563] hover:text-[#171717]'
            }`}
          >
            <span>PARQUETRY</span>
            {currentPage === 'parquetry' && (
              <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#D8BD8F]" />
            )}
          </button>

          <button
            onClick={() => onNavigate('timber')}
            className={`transition-colors cursor-pointer py-1 relative ${
              currentPage === 'timber'
                ? 'text-[#171717] font-semibold'
                : 'text-[#4b5563] hover:text-[#171717]'
            }`}
          >
            <span>TIMBER SOLUTIONS</span>
            {currentPage === 'timber' && (
              <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#D8BD8F]" />
            )}
          </button>

          <button
            onClick={() => onNavigate('inspiration')}
            className={`transition-colors cursor-pointer py-1 relative ${
              currentPage === 'inspiration'
                ? 'text-[#171717] font-semibold'
                : 'text-[#4b5563] hover:text-[#171717]'
            }`}
          >
            INSPIRATION
            {currentPage === 'inspiration' && (
              <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#D8BD8F]" />
            )}
          </button>
        </nav>

        {/* Zone 3: Search Icon + Primary Action */}
        <div className="flex shrink-0 items-center gap-1 sm:gap-4">
          <button
            onClick={onOpenSearchModal}
            className="cursor-pointer rounded-lg p-2 text-[#4b5563] transition-colors hover:bg-white/60 hover:text-[#171717]"
            aria-label="Search Flooring"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>

          <button
            onClick={onOpenSampleModal}
            className="cursor-pointer whitespace-nowrap rounded-none bg-[#ba8c62] px-2 py-2 text-xs font-light uppercase tracking-[0.12em] text-white shadow-md transition-all hover:bg-[#a97d55] active:scale-95 sm:px-5 sm:py-2.5 sm:text-sm sm:tracking-[0.2em]"
          >
            <span>REQUEST A QUOTE</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen((isOpen) => !isOpen)}
            className="cursor-pointer rounded-lg p-2 text-[#4b5563] hover:bg-white/60 hover:text-[#171717] xl:hidden"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <nav id="mobile-navigation" aria-label="Mobile navigation" className="space-y-3 border-b border-[#e5e2dd] bg-white px-4 py-4 text-xs font-light uppercase tracking-widest xl:hidden">
          <button
            onClick={() => {
              onNavigate('home');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-[#2d2d2d] hover:text-[#8b7252]"
          >
            Home Overview
          </button>
          <button
            onClick={() => {
              onNavigate('collection');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-[#2d2d2d] hover:text-[#8b7252]"
          >
            Flooring (16 Colours)
          </button>
          <button
            onClick={() => {
              onNavigate('parquetry');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-[#2d2d2d] hover:text-[#8b7252]"
          >
            Parquetry
          </button>
          <button
            onClick={() => {
              onNavigate('timber');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-[#2d2d2d] hover:text-[#8b7252]"
          >
            Timber Solutions
          </button>
          <button
            onClick={() => {
              onNavigate('inspiration');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-[#2d2d2d] hover:text-[#8b7252]"
          >
            Inspiration
          </button>
        </nav>
      )}
    </header>
  );
};