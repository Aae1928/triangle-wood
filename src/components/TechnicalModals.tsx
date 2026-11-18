import React from 'react';
import { PRODUCT_SPECIFICATIONS } from '../data/siteContent';
import { useModalBehavior } from '../hooks/useModalBehavior';

interface SpecsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSample: () => void;
}

export const TechnicalSpecsModal: React.FC<SpecsModalProps> = ({
  isOpen,
  onClose,
  onOpenSample,
}) => {
  useModalBehavior(isOpen, onClose);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="bg-white border border-[#e5e2dd] rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto overscroll-contain p-6 md:p-8 text-[#171717] shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#6b7280] hover:text-[#171717] p-2 rounded-lg hover:bg-[#f1f1ef] transition-colors cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="mb-6">
          <span className="text-[0.6875rem] tracking-[0.25em] uppercase font-mono text-[#D8BD8F]">
            TECHNICAL DATA SHEET
          </span>
          <h2 className="text-xl md:text-2xl font-serif-luxury tracking-wide uppercase text-[#171717] mt-1">
            ENGINEERED WOOD FLOORING SPECIFICATIONS
          </h2>
          <p className="text-xs text-[#6b7280] mt-1">
            Product information from the supplied content master. Production substrate and several technical details remain subject to factory confirmation.
          </p>
        </div>

        <div className="my-6 border-y border-[#e5e2dd] divide-y divide-[#e5e2dd]">
          {PRODUCT_SPECIFICATIONS.map((specification, index) => {
            const fields = [
              { label: 'Inspiration', value: specification.inspiration },
              { label: 'Wood Species', value: specification.woodSpecies },
              { label: 'Construction', value: specification.construction },
              { label: 'Wear Layer', value: specification.wearLayer },
              { label: 'Plank Profile', value: specification.plankProfile },
              { label: 'Grain Character', value: specification.grainCharacter },
              { label: 'Texture Treatment', value: specification.textureTreatment },
              { label: 'Expected Surface', value: specification.expectedFinish },
              { label: 'UV Treatment', value: specification.uvTreatment },
              { label: 'Surface Finish', value: specification.surfaceFinish },
              {
                label: 'Wood Grade / TW Naming',
                value: `${specification.grade} (provisional website proposal; confirm factory grade)`,
              },
              {
                label: 'Corrected Product Codes',
                value: Object.values(specification.productCodes).join(' | '),
              },
            ];

            return (
              <details key={specification.colourCode} open={index === 0} className="group py-3">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-xs">
                  <span className="min-w-0">
                    <span className="font-semibold tracking-wider text-[#171717]">{specification.name}</span>
                    <span className="ml-2 font-mono text-[#D8BD8F]">{specification.colourCode}</span>
                    <span className="block truncate text-[0.6875rem] text-[#6b7280]">{specification.colourTag}</span>
                  </span>
                  <span className="shrink-0 text-[0.6875rem] font-mono uppercase tracking-wider text-[#6b7280] group-open:text-[#8b7252]">
                    Details
                  </span>
                </summary>
                <dl className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2 pl-1 text-xs sm:grid-cols-2">
                  {fields.map(({ label, value }) => (
                    <div key={label} className="min-w-0">
                      <dt className="text-[0.6875rem] font-mono uppercase tracking-wider text-[#6b7280]">{label}</dt>
                      <dd className="mt-0.5 break-words leading-relaxed text-[#374151]">{value}</dd>
                    </div>
                  ))}
                </dl>
              </details>
            );
          })}
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <button
            onClick={() => window.print()}
            className="text-xs text-[#6b7280] hover:text-[#171717] underline underline-offset-4 flex items-center gap-1.5 cursor-pointer"
          >
            <span>Print Specification Sheet</span>
            <span>↓</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs text-[#6b7280] hover:text-[#171717] uppercase tracking-wider cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenSample();
              }}
              className="px-5 py-2.5 rounded bg-[#E4D5BE] text-[#19150E] font-semibold text-xs tracking-wider uppercase hover:bg-white transition-all cursor-pointer"
            >
              REQUEST A QUOTE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface SustainabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SustainabilityModal: React.FC<SustainabilityModalProps> = ({
  isOpen,
  onClose,
}) => {
  useModalBehavior(isOpen, onClose);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="bg-white border border-[#e5e2dd] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto overscroll-contain p-6 md:p-8 text-[#171717] shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#6b7280] hover:text-[#171717] p-2 rounded-lg hover:bg-[#f1f1ef] transition-colors cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="mb-6">
          <span className="text-[0.6875rem] tracking-[0.25em] uppercase font-mono text-[#D8BD8F]">
            DESIGN FOR SUSTAINABILITY
          </span>
          <h2 className="text-2xl font-serif-luxury tracking-wide uppercase text-[#171717] mt-1">
            EVERYTHING MATTERS
          </h2>
          <p className="text-xs text-[#4b5563] mt-2 leading-relaxed">
            When it comes to doing better for our planet, it's on us. Every component. Every process. Every product.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        </div>

        <div className="p-4 rounded-xl bg-[#f7f6f3] border border-[#e5e2dd] text-xs space-y-2 text-[#4b5563]">
          <div className="font-semibold text-[#171717] uppercase tracking-wider text-[0.6875rem]">
            Circular Economy Transparency
          </div>
          <p className="text-[0.6875rem] leading-relaxed">
            Triangle Wood engineered flooring uses 68% less slow-grown hardwood timber per square meter than solid oak, while delivering superior resistance to thermal movement and moisture fluctuation over a 50+ year architectural lifespan.
          </p>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded bg-white text-[#122315] font-semibold text-xs tracking-widest uppercase hover:bg-slate-100 transition-all cursor-pointer"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
};

interface ArchitectPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSample: () => void;
}

export const ArchitectPortalModal: React.FC<ArchitectPortalModalProps> = ({
  isOpen,
  onClose,
  onOpenSample,
}) => {
  useModalBehavior(isOpen, onClose);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="bg-white border border-[#e5e2dd] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto overscroll-contain p-6 md:p-8 text-[#171717] shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#6b7280] hover:text-[#171717] p-2 rounded-lg hover:bg-[#f1f1ef] transition-colors cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="mb-6">
          <span className="text-[0.6875rem] tracking-[0.25em] uppercase font-mono text-[#D8BD8F]">
            PROFESSIONAL SPECIFIERS
          </span>
          <h2 className="text-xl md:text-2xl font-serif-luxury tracking-wide uppercase text-[#171717] mt-1">
            ARCHITECT & DESIGNER PORTAL
          </h2>
          <p className="text-xs text-[#6b7280] mt-1">
            Access certified BIM models, high-resolution rendering textures, and specification clauses for tender documents.
          </p>
        </div>

        <div className="space-y-3 my-6">
          {[
            {
              title: 'Revit / BIM Families (.RFA)',
              desc: 'Parameter-driven BIM objects including thermal transmittance, layer stratigraphy, and finish schedules.',
              size: '42 MB ZIP',
            },
            {
              title: '4K Seamless PBR Texture Maps',
              desc: 'Albedo, Roughness, Normal, and Height displacement maps calibrated for 3ds Max, Blender, Corona, and V-Ray.',
              size: '128 MB ZIP',
            },
            {
              title: 'NBS Specification Clauses (M50 / 110)',
              desc: 'Standardized clause wordings ready to drop directly into master architectural project manuals.',
              size: 'DOCX / PDF',
            },
            {
              title: 'Acoustic & Fire Test Certifications',
              desc: 'Independent ISO 10140 impact sound insulation & EN 13501-1 reaction-to-fire laboratory reports.',
              size: '14 MB PDF',
            },
          ].map((item, i) => (
            <div key={i} className="p-3.5 rounded-xl bg-[#f7f6f3] border border-[#e5e2dd] flex items-center justify-between gap-4">
              <div>
                <h4 className="text-xs font-semibold text-[#374151] uppercase tracking-wider">{item.title}</h4>
                <p className="text-[0.6875rem] text-[#6b7280] mt-0.5">{item.desc}</p>
              </div>
              <button
                onClick={() => alert(`Downloading ${item.title}`)}
                className="shrink-0 px-3 py-1.5 rounded bg-white border border-[#d8d5cf] hover:bg-[#D8BD8F] hover:text-black transition-colors font-mono text-[0.6875rem] uppercase tracking-wider cursor-pointer"
              >
                {item.size} ↓
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-[#e5e2dd] flex items-center justify-between">
          <span className="text-xs text-[#6b7280]">Need physical finish binders for your library?</span>
          <button
            onClick={() => {
              onClose();
              onOpenSample();
            }}
            className="px-5 py-2.5 rounded bg-[#E4D5BE] text-[#19150E] font-semibold text-xs tracking-wider uppercase hover:bg-white transition-all cursor-pointer"
          >
            REQUEST A QUOTE
          </button>
        </div>
      </div>
    </div>
  );
};
