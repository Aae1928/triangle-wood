import React, { useState } from 'react';
import { PATTERNS } from '../data/woodData';
import { findWoodRender, type WoodImplementation } from '../assets/images';

interface TheBoardDiagramProps {
  activePatternId?: string;
  onSelectPattern?: (id: string) => void;
  currentColorName?: string;
  currentColorHex?: string;
}

export const TheBoardDiagram: React.FC<TheBoardDiagramProps> = ({
  activePatternId = 'wide-plank',
  onSelectPattern,
  currentColorName = 'TEFNUT',
  currentColorHex = '#C59A6F',
}) => {
  const [activeLayer, setActiveLayer] = useState<string | null>('wear-layer');

  const layers = [
    {
      id: 'wear-layer',
      title: 'Genuine Hardwood',
      sub: 'Wear Layer (3.5 mm)',
      desc: 'Selected slow-grown European white oak sawn face. Allows up to 4 refinishing cycles while preserving organic timber warmth.',
      x: 32,
      y: 35,
    },
    {
      id: 'click-system',
      title: 'TRIANGLE WOOD',
      sub: 'Click System',
      desc: 'Patented micro-engineered interlocking profile guaranteeing seam-tight dimensional stability and effortless installation.',
      x: 72,
      y: 42,
    },
    {
      id: 'core',
      title: 'Engineered Multi-Layer Core',
      sub: 'for Stability',
      desc: 'High-density multi-ply birch cross-grain construction that resists hygroscopic seasonal expansion and contraction by up to 70%.',
      x: 18,
      y: 72,
    },
    {
      id: 'profile',
      title: 'Precision Profile',
      sub: 'Under-Backing Base',
      desc: 'Balanced acoustic stabilization backing calibrated to prevent plank cupping, ideal for radiant underfloor heating systems.',
      x: 62,
      y: 78,
    },
  ];

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: 3D Exploded Plank Diagram */}
        <div className="lg:col-span-8 relative bg-gradient-to-b from-[#131418] to-[#0D0E12] rounded-2xl p-6 md:p-10 border border-white/5 overflow-hidden">
          {/* Subtle grid background */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

          {/* Isometric Wood Board Graphic */}
          <div className="relative aspect-[16/9] max-h-[23.75rem] w-full flex items-center justify-center my-4">
            <svg
              viewBox="0 0 700 380"
              className="w-full h-full max-h-[22.5rem] drop-shadow-2xl select-none"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="oakTopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={currentColorHex} />
                  <stop offset="50%" stopColor="#AF8356" />
                  <stop offset="100%" stopColor="#8E6740" />
                </linearGradient>
                <linearGradient id="coreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#805b38" />
                  <stop offset="100%" stopColor="#533b24" />
                </linearGradient>
                <linearGradient id="bevelGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0.4" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#000000" floodOpacity="0.7" />
                </filter>
              </defs>

              {/* Floor Shadow */}
              <ellipse cx="350" cy="310" rx="270" ry="40" fill="#000000" fillOpacity="0.65" filter="blur(16px)" />

              {/* Bottom Layer - Acoustic Backing */}
              <g className={`transition-transform duration-500 ${activeLayer === 'profile' ? '-translate-y-1' : ''}`}>
                <polygon
                  points="140,240 460,140 560,185 240,285"
                  fill="#473423"
                  stroke="#38291b"
                  strokeWidth="1.5"
                />
                <polygon
                  points="140,240 240,285 240,295 140,250"
                  fill="#2e2115"
                  stroke="#21180f"
                />
                <polygon
                  points="240,285 560,185 560,195 240,295"
                  fill="#3d2c1d"
                  stroke="#21180f"
                />
              </g>

              {/* Middle Layer - Multi-Layer Plywood Cross-Grain Core */}
              <g className={`transition-transform duration-500 ${activeLayer === 'core' ? '-translate-y-2' : ''}`}>
                <polygon
                  points="140,225 460,125 560,170 240,270"
                  fill="url(#coreGrad)"
                  stroke="#634529"
                  strokeWidth="1.5"
                />
                {/* Cross-grain striped edge */}
                <polygon
                  points="140,225 240,270 240,285 140,240"
                  fill="#543c24"
                  stroke="#3f2b18"
                />
                <polygon
                  points="240,270 560,170 560,185 240,285"
                  fill="#6b4c2e"
                  stroke="#3f2b18"
                />
                {/* Horizontal core ply stripes */}
                <line x1="140" y1="230" x2="240" y2="275" stroke="#7a5836" strokeWidth="1" strokeDasharray="3 2" />
                <line x1="140" y1="235" x2="240" y2="280" stroke="#452f1b" strokeWidth="1" strokeDasharray="4 2" />
                <line x1="240" y1="275" x2="560" y2="175" stroke="#7a5836" strokeWidth="1" strokeDasharray="3 2" />
                <line x1="240" y1="280" x2="560" y2="180" stroke="#452f1b" strokeWidth="1" strokeDasharray="4 2" />
              </g>

              {/* Top Layer - 3.5mm European Hardwood Wear Layer */}
              <g className={`transition-transform duration-500 filter drop-shadow-lg ${activeLayer === 'wear-layer' ? '-translate-y-3' : ''}`}>
                {/* Top Oak Surface */}
                <polygon
                  points="140,195 460,95 560,140 240,240"
                  fill="url(#oakTopGrad)"
                  stroke="#c5a075"
                  strokeWidth="1.5"
                />
                {/* Edge Bevel Highlight */}
                <line x1="140" y1="195" x2="240" y2="240" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="1.5" />
                <line x1="240" y1="240" x2="560" y2="140" stroke="#ffffff" strokeOpacity="0.3" strokeWidth="1" />
                
                {/* Subtle wood grain lines on surface */}
                <path d="M 200,180 Q 280,150 420,110" stroke="#9d744b" strokeWidth="1" strokeOpacity="0.5" fill="none" />
                <path d="M 170,190 Q 300,155 450,112" stroke="#8b633d" strokeWidth="0.8" strokeOpacity="0.4" fill="none" />
                <path d="M 260,225 Q 360,185 500,135" stroke="#9d744b" strokeWidth="1.2" strokeOpacity="0.5" fill="none" />

                {/* Sawn oak edge thickness (3.5mm) */}
                <polygon
                  points="140,195 240,240 240,250 140,205"
                  fill="#9e754e"
                  stroke="#795634"
                />
                <polygon
                  points="240,240 560,140 560,150 240,250"
                  fill="#b1855b"
                  stroke="#795634"
                />
              </g>

              {/* Click System Tongue on the right side */}
              <g className={`transition-transform duration-500 ${activeLayer === 'click-system' ? 'translate-x-1' : ''}`}>
                <polygon
                  points="560,150 575,155 575,175 560,170"
                  fill="#614429"
                  stroke="#d4b486"
                  strokeWidth="1.5"
                />
                <line x1="560" y1="140" x2="575" y2="145" stroke="#d4b486" strokeWidth="1" />
              </g>

              {/* Callout Pins and Labels */}
              {/* Wear Layer Callout */}
              <g className="cursor-pointer" onClick={() => setActiveLayer('wear-layer')}>
                <circle cx="270" cy="170" r="5" fill="#D8BD8F" className="animate-pulse" />
                <line x1="270" y1="170" x2="220" y2="85" stroke="#D8BD8F" strokeWidth="1.5" strokeDasharray="3 3" />
                <line x1="220" y1="85" x2="110" y2="85" stroke="#D8BD8F" strokeWidth="1.5" />
                <text x="110" y="70" fill="#FFFFFF" fontSize="12" fontWeight="600" letterSpacing="0.05em">
                  Genuine Hardwood
                </text>
                <text x="110" y="82" fill="#B3A897" fontSize="10">
                  Wear Layer (3.5 mm)
                </text>
              </g>

              {/* Click System Callout */}
              <g className="cursor-pointer" onClick={() => setActiveLayer('click-system')}>
                <circle cx="568" cy="160" r="5" fill="#D8BD8F" className="animate-pulse" />
                <line x1="568" y1="160" x2="520" y2="85" stroke="#D8BD8F" strokeWidth="1.5" strokeDasharray="3 3" />
                <line x1="520" y1="85" x2="410" y2="85" stroke="#D8BD8F" strokeWidth="1.5" />
                <text x="410" y="70" fill="#FFFFFF" fontSize="12" fontWeight="600" letterSpacing="0.05em">
                  TRIANGLE WOOD
                </text>
                <text x="410" y="82" fill="#D8BD8F" fontSize="10">
                  Click System
                </text>
              </g>

              {/* Core Callout */}
              <g className="cursor-pointer" onClick={() => setActiveLayer('core')}>
                <circle cx="190" cy="255" r="5" fill="#D8BD8F" className="animate-pulse" />
                <line x1="190" y1="255" x2="130" y2="330" stroke="#D8BD8F" strokeWidth="1.5" strokeDasharray="3 3" />
                <line x1="130" y1="330" x2="40" y2="330" stroke="#D8BD8F" strokeWidth="1.5" />
                <text x="40" y="315" fill="#FFFFFF" fontSize="11" fontWeight="600">
                  Engineered Multi-Layer Core
                </text>
                <text x="40" y="327" fill="#B3A897" fontSize="10">
                  for Stability
                </text>
              </g>

              {/* Precision Profile Callout */}
              <g className="cursor-pointer" onClick={() => setActiveLayer('profile')}>
                <circle cx="400" cy="240" r="5" fill="#D8BD8F" className="animate-pulse" />
                <line x1="400" y1="240" x2="470" y2="330" stroke="#D8BD8F" strokeWidth="1.5" strokeDasharray="3 3" />
                <line x1="470" y1="330" x2="570" y2="330" stroke="#D8BD8F" strokeWidth="1.5" />
                <text x="470" y="315" fill="#FFFFFF" fontSize="11" fontWeight="600">
                  Precision Profile
                </text>
                <text x="470" y="327" fill="#B3A897" fontSize="10">
                  Engineered Backing
                </text>
              </g>
            </svg>
          </div>

          {/* Active Layer Details info bar */}
          <div className="mt-4 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D8BD8F]" />
              <span className="text-[#EDE8DF] font-medium uppercase tracking-wider">
                {layers.find(l => l.id === activeLayer)?.title} — {layers.find(l => l.id === activeLayer)?.sub}
              </span>
            </div>
            <p className="text-slate-400 text-[0.6875rem] max-w-md">
              {layers.find(l => l.id === activeLayer)?.desc}
            </p>
          </div>
        </div>

        {/* Right: 3 Pattern Dimensions Cards */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {PATTERNS.map((pat) => {
            const isSelected = activePatternId === pat.id;
            const boardRender =
              findWoodRender(currentColorName, pat.name as WoodImplementation, '3D') ??
              findWoodRender(currentColorName, pat.name as WoodImplementation, null);

            return (
              <div
                key={pat.id}
                onClick={() => onSelectPattern?.(pat.id)}
                className={`cursor-pointer rounded-xl p-4 transition-all duration-300 border ${
                  isSelected
                    ? 'bg-[#1D1E24] border-[#D8BD8F] shadow-lg shadow-black/40 translate-x-1'
                    : 'bg-[#121316] border-white/10 hover:border-white/20 hover:bg-[#16171B]'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Pattern mini preview icon */}
                  <div className="w-16 h-14 rounded-lg overflow-hidden bg-black/40 border border-white/10 shrink-0 relative flex items-center justify-center">
                    <img
                      src={boardRender?.src}
                      alt={`${currentColorName} ${pat.name} 3D render`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold tracking-wider uppercase text-[#EDE8DF]">
                        {pat.name}
                      </h4>
                      {isSelected && (
                        <span className="text-[0.6875rem] uppercase tracking-wider text-[#D8BD8F] font-mono">
                          Selected
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-mono text-[#D8BD8F] mt-0.5 tracking-tight">
                      {pat.dimensions}
                    </div>
                    <div className="text-[0.6875rem] text-slate-400 mt-1 truncate">
                      {pat.expression}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom 4 Circular Feature Badges */}
      <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {/* Badge 1: NATURAL WOOD BEAUTY */}
        <div className="flex flex-col items-center group">
          <div className="w-14 h-14 rounded-full border border-white/20 bg-white/5 flex items-center justify-center mb-3 group-hover:border-[#D8BD8F] group-hover:bg-[#D8BD8F]/10 transition-colors">
            <svg className="w-6 h-6 text-[#D8BD8F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <span className="text-xs tracking-[0.18em] font-medium text-[#EDE8DF] uppercase">
            NATURAL WOOD
          </span>
          <span className="text-[0.6875rem] tracking-[0.2em] text-[#A69E8D] uppercase mt-0.5">
            BEAUTY
          </span>
        </div>

        {/* Badge 2: ENGINEERED STABILITY */}
        <div className="flex flex-col items-center group">
          <div className="w-14 h-14 rounded-full border border-white/20 bg-white/5 flex items-center justify-center mb-3 group-hover:border-[#D8BD8F] group-hover:bg-[#D8BD8F]/10 transition-colors">
            <svg className="w-6 h-6 text-[#D8BD8F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <span className="text-xs tracking-[0.18em] font-medium text-[#EDE8DF] uppercase">
            ENGINEERED
          </span>
          <span className="text-[0.6875rem] tracking-[0.2em] text-[#A69E8D] uppercase mt-0.5">
            STABILITY
          </span>
        </div>

        {/* Badge 3: PRECISION CLICK SYSTEM */}
        <div className="flex flex-col items-center group">
          <div className="w-14 h-14 rounded-full border border-white/20 bg-white/5 flex items-center justify-center mb-3 group-hover:border-[#D8BD8F] group-hover:bg-[#D8BD8F]/10 transition-colors">
            <svg className="w-6 h-6 text-[#D8BD8F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <span className="text-xs tracking-[0.18em] font-medium text-[#EDE8DF] uppercase">
            PRECISION
          </span>
          <span className="text-[0.6875rem] tracking-[0.2em] text-[#A69E8D] uppercase mt-0.5">
            CLICK SYSTEM
          </span>
        </div>

        {/* Badge 4: UV-CURED SURFACE */}
        <div className="flex flex-col items-center group">
          <div className="w-14 h-14 rounded-full border border-white/20 bg-white/5 flex items-center justify-center mb-3 group-hover:border-[#D8BD8F] group-hover:bg-[#D8BD8F]/10 transition-colors">
            <svg className="w-6 h-6 text-[#D8BD8F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <span className="text-xs tracking-[0.18em] font-medium text-[#EDE8DF] uppercase">
            UV-CURED
          </span>
          <span className="text-[0.6875rem] tracking-[0.2em] text-[#A69E8D] uppercase mt-0.5">
            SURFACE
          </span>
        </div>
      </div>
    </div>
  );
};
