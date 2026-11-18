import { useEffect, useState } from 'react';
import { WOOD_COLORS, WoodColor } from './data/woodData';
import { Navbar, type SitePage } from './components/Navbar';
import { CollectionPage } from './components/CollectionPage';
import { ParquetryPage } from './components/ParquetryPage';
import { HomePage } from './components/HomePage';
import { InspirationPage } from './components/InspirationPage';
import { RequestSampleModal } from './components/RequestSampleModal';
import {
  TechnicalSpecsModal,
  SustainabilityModal,
  ArchitectPortalModal,
} from './components/TechnicalModals';
import { SearchModal } from './components/SearchModal';
import { SceneDetailModal } from './components/SceneDetailModal';
import { SceneItem } from './components/SceneGallery';

import { TimberSolutionsPage } from './components/TimberSolutionsPage';
import { loadWebsiteData } from './data/supabaseWebsiteData';
import { prefetchColorImages } from './assets/images';

export default function App() {
  const [currentPage, setCurrentPage] = useState<SitePage>('home');
  const [currentColor, setCurrentColor] = useState<WoodColor>(WOOD_COLORS[0]); // TEFNUT
  const [selectedPatternId, setSelectedPatternId] = useState('wide-plank');
  const [searchParquetryProduct, setSearchParquetryProduct] = useState<string | null>(null);
  const [searchTimberProduct, setSearchTimberProduct] = useState<string | null>(null);
  const [isHeroImageOnly, setIsHeroImageOnly] = useState(false);
  const [isNavbarVisible, setIsNavbarVisible] = useState(false);
  const [navNonce, setNavNonce] = useState(0);
  
  // Modals state
  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);
  const [isSpecsModalOpen, setIsSpecsModalOpen] = useState(false);
  const [isSustainabilityModalOpen, setIsSustainabilityModalOpen] = useState(false);
  const [isArchitectPortalOpen, setIsArchitectPortalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [activeSceneModal, setActiveSceneModal] = useState<SceneItem | null>(null);
  const [isCatalogReady, setIsCatalogReady] = useState(false);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [catalogLoadAttempt, setCatalogLoadAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    setCatalogError(null);
    loadWebsiteData()
      .then(() => {
        if (!active) return;
        setCurrentColor(WOOD_COLORS[0]);
        setIsCatalogReady(true);
      })
      .catch((error: unknown) => {
        if (!active) return;
        setCatalogError(
          error instanceof Error ? error.message : 'An unexpected Supabase error occurred.',
        );
      });

    return () => {
      active = false;
    };
  }, [catalogLoadAttempt]);

  useEffect(() => {
    if (!isCatalogReady || currentPage !== 'collection') return;

    const timer = window.setTimeout(() => {
      const implementation =
        currentPage === 'collection'
          ? (selectedPatternId === 'herringbone'
            ? 'HERRINGBONE'
            : selectedPatternId === 'chevron'
              ? 'CHEVRON'
              : 'WIDE PLANK')
          : 'WIDE PLANK';
      prefetchColorImages(currentColor.name, implementation);
    }, 120);

    return () => window.clearTimeout(timer);
  }, [currentColor, currentPage, isCatalogReady, selectedPatternId]);

  useEffect(() => {
    const updateHeaderVisibility = (event: PointerEvent) => {
      setIsNavbarVisible(
        window.innerWidth < 1280 || event.clientY <= window.innerHeight * 0.2,
      );
    };
    const updateHeaderForViewport = () => {
      setIsNavbarVisible(window.innerWidth < 1280);
    };

    updateHeaderForViewport();
    window.addEventListener('pointermove', updateHeaderVisibility, { passive: true });
    window.addEventListener('pointerdown', updateHeaderVisibility, { passive: true });
    window.addEventListener('resize', updateHeaderForViewport);
    return () => {
      window.removeEventListener('pointermove', updateHeaderVisibility);
      window.removeEventListener('pointerdown', updateHeaderVisibility);
      window.removeEventListener('resize', updateHeaderForViewport);
    };
  }, []);

  // Scroll to top on page change
  const handleNavigate = (page: SitePage, sectionId?: string) => {
    setIsHeroImageOnly(false);
    if (page !== 'parquetry') setSearchParquetryProduct(null);
    if (page !== 'timber') setSearchTimberProduct(null);
    setCurrentPage(page);
    if (page === 'parquetry' || page === 'timber') setNavNonce((n) => n + 1);
    if (sectionId) {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 80);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#171717] font-sans antialiased selection:bg-[#D8BD8F]/30 selection:text-[#171717] flex flex-col justify-between">
      <div
        aria-hidden={!isNavbarVisible}
        onMouseEnter={() => {
          setIsHeroImageOnly(false);
          setIsNavbarVisible(true);
        }}
        className={`fixed inset-x-0 top-0 z-50 transition-transform duration-300 ease-out ${
          !isNavbarVisible
            ? '-translate-y-full pointer-events-none'
            : 'translate-y-0 pointer-events-auto'
        }`}
      >
        <Navbar
          currentPage={currentPage}
          onNavigate={handleNavigate}
          onOpenSampleModal={() => setIsSampleModalOpen(true)}
          onOpenSearchModal={() => setIsSearchModalOpen(true)}
        />
      </div>

      {(!isCatalogReady || catalogError) && (
        <div
          role={catalogError ? 'alert' : 'status'}
          className="fixed bottom-4 right-4 z-[70] flex max-w-sm items-center gap-3 rounded-lg border border-[#e5e2dd] bg-white/95 px-4 py-3 text-xs text-[#4b5563] shadow-lg"
        >
          <span>
            {catalogError
              ? `Catalogue unavailable: ${catalogError}`
              : 'Loading product catalogue…'}
          </span>
          {catalogError && (
            <button
              type="button"
              onClick={() => setCatalogLoadAttempt((attempt) => attempt + 1)}
              className="shrink-0 font-semibold uppercase tracking-wider text-[#8b7252] hover:text-[#171717]"
            >
              Retry
            </button>
          )}
        </div>
      )}

      <div key={currentPage === 'parquetry' ? `parquetry-${navNonce}` : currentPage === 'timber' ? `timber-${navNonce}` : currentPage} className="page-ease-out">
        {currentPage === 'home' ? (
          <HomePage
            onOpenSpecs={() => setIsSpecsModalOpen(true)}
            onOpenSustainability={() => setIsSustainabilityModalOpen(true)}
            onOpenSampleModal={() => setIsSampleModalOpen(true)}
            onOpenArchitectPortal={() => setIsArchitectPortalOpen(true)}
            onNavigate={handleNavigate}
          />
        ) : currentPage === 'parquetry' ? (
          <ParquetryPage
            initialProductName={searchParquetryProduct}
            onOpenSpecs={() => setIsSpecsModalOpen(true)}
            onOpenSustainability={() => setIsSustainabilityModalOpen(true)}
            onOpenSampleModal={() => setIsSampleModalOpen(true)}
            onOpenArchitectPortal={() => setIsArchitectPortalOpen(true)}
            onNavigate={handleNavigate}
          />
        ) : currentPage === 'timber' ? (
          <TimberSolutionsPage
            initialProductName={searchTimberProduct}
            onOpenSpecs={() => setIsSpecsModalOpen(true)}
            onOpenSustainability={() => setIsSustainabilityModalOpen(true)}
            onOpenSampleModal={() => setIsSampleModalOpen(true)}
            onOpenArchitectPortal={() => setIsArchitectPortalOpen(true)}
            onNavigate={handleNavigate}
          />
        ) : currentPage === 'inspiration' ? (
          <InspirationPage
            onOpenSpecs={() => setIsSpecsModalOpen(true)}
            onOpenSustainability={() => setIsSustainabilityModalOpen(true)}
            onOpenSampleModal={() => setIsSampleModalOpen(true)}
            onOpenArchitectPortal={() => setIsArchitectPortalOpen(true)}
            onNavigate={handleNavigate}
          />
        ) : (
          <CollectionPage
            currentColor={currentColor}
            selectedPatternId={selectedPatternId}
            onSelectPattern={setSelectedPatternId}
            isHeroImageOnly={isHeroImageOnly}
            onHeroImageOnlyChange={setIsHeroImageOnly}
            onSelectColor={setCurrentColor}
            onOpenSpecs={() => setIsSpecsModalOpen(true)}
            onOpenSustainability={() => setIsSustainabilityModalOpen(true)}
            onOpenSampleModal={() => setIsSampleModalOpen(true)}
            onOpenArchitectPortal={() => setIsArchitectPortalOpen(true)}
            onNavigate={handleNavigate}
            onOpenSceneModal={setActiveSceneModal}
          />
        )}
      </div>
      {/* Modals & Interactive Overlays */}
      <RequestSampleModal
        isOpen={isSampleModalOpen}
        onClose={() => setIsSampleModalOpen(false)}
      />

      <TechnicalSpecsModal
        isOpen={isSpecsModalOpen}
        onClose={() => setIsSpecsModalOpen(false)}
        onOpenSample={() => setIsSampleModalOpen(true)}
      />

      <SustainabilityModal
        isOpen={isSustainabilityModalOpen}
        onClose={() => setIsSustainabilityModalOpen(false)}
      />

      <ArchitectPortalModal
        isOpen={isArchitectPortalOpen}
        onClose={() => setIsArchitectPortalOpen(false)}
        onOpenSample={() => setIsSampleModalOpen(true)}
      />

      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSelectFlooringProduct={(color, patternId) => {
          setCurrentColor(color);
          setSelectedPatternId(patternId);
          handleNavigate('collection');
        }}
        onSelectParquetry={(name) => {
          handleNavigate('parquetry');
          setSearchParquetryProduct(name);
        }}
        onSelectTimber={(name) => {
          handleNavigate('timber');
          setSearchTimberProduct(name);
        }}
      />

      <SceneDetailModal
        scene={activeSceneModal}
        currentColorName={currentColor.name}
        onClose={() => setActiveSceneModal(null)}
        onRequestSample={() => setIsSampleModalOpen(true)}
        onNavigateHome={() => handleNavigate('home')}
      />
    </div>
  );
}
