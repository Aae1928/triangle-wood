import React from 'react';
import { PATTERNS } from '../data/woodData';
import { findWoodRender, type WoodImplementation } from '../assets/images';

interface ChooseYourPatternProps {
  activePatternId: string;
  onSelectPattern: (id: string) => void;
  currentColorName: string;
}

export const ChooseYourPattern: React.FC<ChooseYourPatternProps> = ({
  activePatternId,
  onSelectPattern,
  currentColorName,
}) => {
  return (
    <div className="w-full">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-white/10 gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-serif-luxury tracking-[0.2em] uppercase text-[#EDE8DF]">
            CHOOSE YOUR PATTERN
          </h2>
          <p className="text-[0.6875rem] md:text-xs tracking-[0.16em] uppercase text-[#B3A897] mt-1">
            THREE DESIGNS. ONE EXTRAORDINARY COLOUR.
          </p>
        </div>
        <div className="text-[0.6875rem] md:text-xs tracking-[0.16em] uppercase text-[#8E8678] font-mono">
          SAME COLOUR. THREE EXPRESSIONS.
        </div>
      </div>

      {/* 3 Pattern Showcase Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PATTERNS.map((pattern) => {
          const isSelected = activePatternId === pattern.id;
          const patternRender = findWoodRender(
            currentColorName,
            pattern.name as WoodImplementation,
            'SCENE2',
          );

          return (
            <div
              key={pattern.id}
              onClick={() => onSelectPattern(pattern.id)}
              className={`group cursor-pointer rounded-xl overflow-hidden transition-all duration-300 border flex flex-col ${
                isSelected
                  ? 'border-[#D8BD8F] ring-1 ring-[#D8BD8F]/40 shadow-xl shadow-black/60 bg-[#16171B]'
                  : 'border-white/10 hover:border-white/25 bg-[#101114] hover:bg-[#141518]'
              }`}
            >
              {/* Pattern Texture Preview Window */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#1A1815]">
                <img
                  key={patternRender?.src}
                  src={patternRender?.src}
                  alt={`${currentColorName} ${pattern.name} Scene 2 render`}
                  className="product-image-fade w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                />

                {/* Selected indicator badge */}
                {isSelected && (
                  <div className="absolute top-3 right-3 bg-[#0B0C0E]/90 border border-[#D8BD8F] text-[#D8BD8F] text-[0.6875rem] uppercase font-mono tracking-wider px-2 py-0.5 rounded">
                    Active Design
                  </div>
                )}

                {/* Dimensions pill */}
                <div className="absolute bottom-2 left-3 text-[0.6875rem] font-mono text-white/90 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded">
                  {pattern.dimensions}
                </div>
              </div>

              {/* Card Meta Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-semibold tracking-[0.16em] uppercase text-[#EDE8DF]">
                    {pattern.name}
                  </h3>
                  <p className="text-xs text-[#D8BD8F] font-serif-luxury italic mt-1">
                    {pattern.expression}
                  </p>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed line-clamp-2">
                    {pattern.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-[0.6875rem] text-slate-400 font-mono">
                  </span>
                  <span className={`text-[0.6875rem] tracking-wider uppercase font-medium flex items-center gap-1 ${
                    isSelected ? 'text-[#D8BD8F]' : 'text-slate-300 group-hover:text-white'
                  }`}>
                    {isSelected ? 'Selected' : 'Select'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
