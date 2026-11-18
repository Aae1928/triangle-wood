import React, { useState } from 'react';
import type { WoodColor } from '../data/woodData';
import { getFlooringOptions, getParquetryOptions, getTimberOptions } from '../data/catalogueOptions';
import { useModalBehavior } from '../hooks/useModalBehavior';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFlooringProduct: (color: WoodColor, patternId: string) => void;
  onSelectParquetry: (name: string) => void;
  onSelectTimber: (name: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectFlooringProduct,
  onSelectParquetry,
  onSelectTimber,
}) => {
  const [query, setQuery] = useState('');
  useModalBehavior(isOpen, onClose);

  if (!isOpen) return null;

  const flooringProducts = getFlooringOptions().filter(({ name }) =>
    name.toLowerCase().includes(query.toLowerCase()),
  );
  const filteredParquetry = getParquetryOptions().filter(({ name }) =>
    name.toLowerCase().includes(query.toLowerCase()),
  );
  const filteredTimber = getTimberOptions().filter(({ name }) =>
    name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="bg-white border border-[#e5e2dd] rounded-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl relative">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#e5e2dd] flex items-center gap-3">
          <svg className="w-5 h-5 text-[#6b7280] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search colours, flooring, Parquetry, or Timber Solutions..."
            className="w-full bg-transparent text-sm text-[#171717] placeholder-[#9ca3af] focus:outline-none"
          />
          <button
            onClick={onClose}
            className="text-xs text-[#6b7280] hover:text-[#171717] px-2 py-1 rounded bg-[#f1f1ef] uppercase font-mono cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto overscroll-contain p-4 space-y-4 max-h-[60vh] custom-scrollbar">
          <div className="pt-2 border-t border-[#e5e2dd]">
            <div className="text-[0.6875rem] font-mono tracking-widest text-[#D8BD8F] uppercase mb-2">
              FLOORING PRODUCTS ({flooringProducts.length})
            </div>
            <div className="grid grid-cols-2 gap-2">
              {flooringProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => {
                    onSelectFlooringProduct(product.color, product.patternId);
                    onClose();
                  }}
                  className="flex items-center gap-2 rounded-lg border border-[#e5e2dd] bg-white p-2.5 text-left transition-all hover:border-[#D8BD8F] hover:bg-[#f7f6f3]"
                >
                  {product.imageUrl && (
                    <img
                      src={product.imageUrl}
                      alt=""
                      loading="lazy"
                      className="h-10 w-10 shrink-0 object-contain"
                    />
                  )}
                  <span className="min-w-0 whitespace-normal break-words text-xs font-semibold tracking-wider text-[#171717]">
                    {product.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-[#e5e2dd]">
            <div className="text-[0.6875rem] font-mono tracking-widest text-[#D8BD8F] uppercase mb-2">
              PARQUETRY ({filteredParquetry.length})
            </div>
            <div className="grid grid-cols-2 gap-2">
              {filteredParquetry.map((product) => (
                <button
                  key={product.id}
                  onClick={() => {
                    onSelectParquetry(product.name);
                    onClose();
                  }}
                  className="flex items-center gap-2 rounded-lg border border-[#e5e2dd] bg-white p-2.5 text-left transition-all hover:border-[#D8BD8F] hover:bg-[#f7f6f3]"
                >
                  {product.imageUrl && (
                    <img
                      src={product.imageUrl}
                      alt=""
                      loading="lazy"
                      className="h-8 w-8 shrink-0 object-contain"
                    />
                  )}
                  <span className="whitespace-normal break-words text-xs font-semibold tracking-wider text-[#171717]">
                    {product.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-[#e5e2dd]">
            <div className="text-[0.6875rem] font-mono tracking-widest text-[#D8BD8F] uppercase mb-2">
              TIMBER SOLUTIONS ({filteredTimber.length})
            </div>
            <div className="space-y-2">
              {filteredTimber.map((product) => (
                <button
                  key={product.id}
                  onClick={() => {
                    onSelectTimber(product.name);
                    onClose();
                  }}
                  className="w-full whitespace-normal break-words rounded-lg border border-[#e5e2dd] bg-white p-2.5 text-left text-xs font-semibold tracking-wider text-[#171717] transition-all hover:border-[#D8BD8F] hover:bg-[#f7f6f3]"
                >
                  {product.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
