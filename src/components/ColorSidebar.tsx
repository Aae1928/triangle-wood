import React from 'react';
import { WOOD_COLORS, WoodColor } from '../data/woodData';

interface ColorSidebarProps {
  selectedColorId: string;
  onSelectColor: (color: WoodColor) => void;
  className?: string;
}

export const ColorSidebar: React.FC<ColorSidebarProps> = ({
  selectedColorId,
  onSelectColor,
  className = '',
}) => {
  return (
    <div className={`w-52 lg:w-56 bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-3.5 shadow-none flex flex-col ${className}`}>
      {/* Title */}
      <div className="pb-2.5 mb-2 border-b border-[#e5e2dd]">
        <h3 className="text-[0.6875rem] tracking-[0.25em] font-semibold uppercase text-black font-mono">
          OUR 16 COLOURS
        </h3>
      </div>

      {/* 16 Colors Scrollable List (Scrollbar hidden) */}
      <div className="hide-scrollbar flex flex-col gap-1.5 overflow-y-auto max-h-[calc(100vh-220px)] pr-1">
        {WOOD_COLORS.map((wood) => {
          const isSelected = selectedColorId === wood.id;

          return (
            <button
              key={wood.id}
              onClick={() => onSelectColor(wood)}
              className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center gap-3 transition-all text-xs group ${
                isSelected
                  ? 'bg-white/10 text-black font-semibold border border-white/40'
                  : 'text-black hover:text-black hover:bg-white/10'
              }`}
            >
              {/* Color Swatch Box */}
              <div
                className="w-6 h-6 rounded shrink-0 border border-black/20"
                style={{ backgroundColor: wood.sampleHex }}
              />

              {/* Color Name */}
              <span className="tracking-wider uppercase text-[0.6875rem] truncate flex-1">
                {wood.name}
              </span>

              {/* Indicator dot */}
              {isSelected && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#D8BD8F] shrink-0" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};