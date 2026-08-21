import React from 'react';
import { Search, ShoppingCart, Filter, ChevronDown, Columns, Check, LayoutGrid, List, Maximize2, Minimize2 } from 'lucide-react';

const PosHeaderToolbar = ({
  selectedCategory,
  setSelectedCategory,
  showCatMenu,
  setShowCatMenu,
  catDropdownRef,
  categories,
  viewMode,
  setViewMode,
  gridCols,
  setGridCols,
  showColMenu,
  setShowColMenu,
  colDropdownRef,
  isFullscreenPos,
  toggleFullscreen,
  searchQuery,
  setSearchQuery
}) => {
  return (
    <div className="w-full space-y-3 sm:space-y-4">
      {/* Header Bar */}
      <div className="p-3 sm:p-4 bg-gradient-to-r from-[#4A0E0E] via-[#5C1212] to-[#3B0B0B] rounded-2xl sm:rounded-3xl shadow-md text-white space-y-2.5 sm:space-y-3">
        <div className="flex items-center justify-between gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
          {/* POS Title (Desktop Only) */}
          <h2 className="hidden md:flex text-xl font-serif font-black items-center gap-2 text-white shrink-0">
            <ShoppingCart className="text-[#FFD700]" size={21} /> Point of Sale (POS)
          </h2>

          {/* Toolbar Controls */}
          <div className="flex items-center justify-between sm:justify-end gap-2 w-full md:w-auto">
            {/* Category Filter Selector */}
            <div ref={catDropdownRef} className="relative flex-1 sm:flex-initial min-w-[130px]">
              <button
                type="button"
                onClick={() => setShowCatMenu(!showCatMenu)}
                className="w-full px-3 py-2 bg-white border-2 border-amber-900/20 hover:border-[#4A0E0E] rounded-xl sm:rounded-2xl text-xs sm:text-sm font-black text-gray-900 shadow-sm transition-all flex items-center justify-between gap-1.5 cursor-pointer"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <Filter size={14} className="text-[#4A0E0E] shrink-0 stroke-[2.5]" />
                  <span className="truncate">{selectedCategory === 'All' ? 'All Categories' : selectedCategory}</span>
                </div>
                <ChevronDown size={14} className={`text-[#4A0E0E] transition-transform shrink-0 stroke-[2.5] ${showCatMenu ? 'rotate-180' : ''}`} />
              </button>

              {showCatMenu && (
                <div className="absolute left-0 sm:left-auto sm:right-0 top-full mt-2 w-60 bg-white border-2 border-amber-900/20 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 space-y-1">
                  <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between text-[#4A0E0E] font-black text-xs uppercase tracking-wider">
                    <span>Filter Category</span>
                    <Filter size={14} className="text-[#4A0E0E]" />
                  </div>
                  <div className="max-h-60 overflow-y-auto space-y-1 pt-1">
                    <button
                      type="button"
                      onClick={() => { setSelectedCategory('All'); setShowCatMenu(false); }}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-between ${selectedCategory === 'All' ? 'bg-[#4A0E0E] text-[#FFD700] shadow-md' : 'text-gray-800 hover:bg-amber-100/60'
                        }`}
                    >
                      <span>All Categories</span>
                      {selectedCategory === 'All' && <Check size={15} strokeWidth={3} />}
                    </button>
                    {categories.filter(c => c !== 'All').map(cat => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => { setSelectedCategory(cat); setShowCatMenu(false); }}
                        className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-between ${selectedCategory === cat ? 'bg-[#4A0E0E] text-[#FFD700] shadow-md' : 'text-gray-800 hover:bg-amber-100/60'
                          }`}
                      >
                        <span>{cat}</span>
                        {selectedCategory === cat && <Check size={15} strokeWidth={3} />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Dynamic Columns Selector (Desktop/Tablet Only) */}
            {viewMode === 'grid' && (
              <div ref={colDropdownRef} className="relative hidden sm:block">
                <button
                  type="button"
                  onClick={() => setShowColMenu(!showColMenu)}
                  className="px-3 py-2 bg-white border-2 border-amber-900/20 hover:border-[#4A0E0E] rounded-xl sm:rounded-2xl text-xs sm:text-sm font-black text-gray-900 shadow-sm transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                  title="Change Cards Per Row"
                >
                  <Columns size={15} className="text-[#4A0E0E] stroke-[2.5]" />
                  <span>{gridCols}x Per Row</span>
                  <ChevronDown size={14} className={`text-[#4A0E0E] transition-transform stroke-[2.5] ${showColMenu ? 'rotate-180' : ''}`} />
                </button>

                {/* Columns Selection Dropdown */}
                {showColMenu && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white border-2 border-amber-900/20 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                    <p className="text-xs font-black uppercase text-[#4A0E0E] px-3 py-2 border-b border-gray-100 flex items-center justify-between tracking-wider">
                      <span>Cards Per Row</span>
                      <Columns size={14} className="text-[#4A0E0E]" />
                    </p>
                    <div className="space-y-1 pt-1">
                      {[2, 3, 4, 5, 6].map(cols => (
                        <button
                          key={cols}
                          type="button"
                          onClick={() => { setGridCols(cols); setShowColMenu(false); }}
                          className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-between ${gridCols === cols ? 'bg-[#4A0E0E] text-[#FFD700] shadow-md' : 'text-gray-800 hover:bg-amber-100/60'
                            }`}
                        >
                          <span>{cols} Cards Per Row</span>
                          {gridCols === cols && <Check size={15} strokeWidth={3} />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Grid / List View Toggle Switch */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border-2 border-amber-900/20 shadow-sm shrink-0">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-black transition-all flex items-center gap-1 cursor-pointer ${viewMode === 'grid'
                  ? 'bg-[#FFD700] text-[#4A0E0E] shadow-md border border-amber-400/80'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-amber-100/60 font-bold'
                  }`}
              >
                <LayoutGrid size={14} className={viewMode === 'grid' ? 'text-[#4A0E0E]' : 'text-gray-600'} />
                <span className="hidden sm:inline">Grid</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-black transition-all flex items-center gap-1 cursor-pointer ${viewMode === 'list'
                  ? 'bg-[#FFD700] text-[#4A0E0E] shadow-md border border-amber-400/80'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-amber-100/60 font-bold'
                  }`}
              >
                <List size={14} className={viewMode === 'list' ? 'text-[#4A0E0E]' : 'text-gray-600'} />
                <span className="hidden sm:inline">List</span>
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-800" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search product name or SKU code..."
            className="w-full pl-10 pr-4 py-2 bg-white border-2 border-amber-900/20 rounded-xl sm:rounded-2xl focus:outline-none focus:border-[#4A0E0E] text-xs sm:text-sm font-black text-gray-900 shadow-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default PosHeaderToolbar;
