import React from 'react';
import { Check, Plus, Minus } from 'lucide-react';

const ProductCatalogGrid = ({
  viewMode,
  gridCols,
  filteredCatalog,
  getItemQtyInCart,
  addToCart,
  updateQty
}) => {
  return (
    <div className="w-full pt-2 sm:pt-4">
      {viewMode === 'grid' ? (
        <div className={`grid gap-2.5 sm:gap-6 ${gridCols === 1 ? 'grid-cols-1' :
          gridCols === 2 ? 'grid-cols-2' :
            gridCols === 3 ? 'grid-cols-2 sm:grid-cols-3' :
              gridCols === 4 ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4' :
                gridCols === 5 ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-5' :
                  'grid-cols-2 sm:grid-cols-3 md:grid-cols-6'
          }`}>
          {filteredCatalog.map((product) => {
            const qtyInCart = getItemQtyInCart(product.id);
            const isInCart = qtyInCart > 0;

            return (
              <div
                key={product.id}
                className={`bg-[#FAF7F2] p-2.5 sm:p-3.5 rounded-2xl border-2 transition-all shadow-sm relative flex flex-col justify-between space-y-2 group ${isInCart
                  ? 'border-[#4A0E0E] ring-2 ring-[#FFD700]/50 shadow-md bg-white'
                  : 'border-amber-900/20 hover:border-amber-500 hover:shadow-md'
                  }`}
              >
                {/* Live Cart Quantity Badge */}
                {isInCart && (
                  <div className="absolute top-2.5 right-2.5 z-10 bg-[#FFD700] text-[#4A0E0E] border border-amber-500 font-black text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1">
                    <Check size={12} strokeWidth={3} /> {qtyInCart} in Cart
                  </div>
                )}

                {/* Image & Product Title */}
                <div onClick={() => addToCart(product)} className="cursor-pointer space-y-1.5 sm:space-y-2">
                  <div className="w-full h-24 sm:h-32 bg-white rounded-xl flex items-center justify-center overflow-hidden shadow-sm border border-amber-900/20 group-hover:scale-[1.02] transition-transform">
                    {product.img ? (
                      <img
                        src={product.img}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl sm:text-4xl">🎆</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-[#4A0E0E] bg-amber-200/80 px-2 py-0.5 rounded border border-amber-300">
                      {product.category}
                    </span>
                    <span className="text-[10px] font-bold text-gray-500">Stock: {product.stock}</span>
                  </div>

                  <h3 className="text-sm sm:text-base font-serif font-black text-gray-900 line-clamp-1">
                    {product.name}
                  </h3>
                </div>

                {/* Unit Price Row */}
                <div className="flex items-center justify-between pt-1.5 border-t border-amber-900/15">
                  <span className="text-[10px] font-black uppercase text-amber-950">Unit Price</span>
                  <span className="text-base sm:text-lg font-black text-[#c00000]">₹{product.price}</span>
                </div>

                {/* Full-Width Button Row */}
                <div className="pt-0.5">
                  {isInCart ? (
                    <div className="w-full flex items-center justify-between bg-[#4A0E0E] text-white rounded-xl p-0.5 shadow-md">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); updateQty(product.id, -1); }}
                        className="px-3 py-1.5 hover:bg-red-950 text-white rounded-lg transition-colors"
                        title="Reduce quantity"
                      >
                        <Minus size={15} strokeWidth={3} />
                      </button>
                      <span className="text-sm sm:text-base font-black text-[#FFD700] tracking-wider px-2">
                        {qtyInCart}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); updateQty(product.id, 1); }}
                        className="px-3 py-1.5 hover:bg-red-950 text-white rounded-lg transition-colors"
                        title="Increase quantity"
                      >
                        <Plus size={15} strokeWidth={3} />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => addToCart(product)}
                      className="w-full py-2 bg-[#4A0E0E] hover:bg-red-950 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 transform hover:scale-[1.01]"
                    >
                      <Plus size={15} strokeWidth={2.5} /> Add to Cart
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List Mode */
        <div className="bg-[#FAF7F2] rounded-2xl border border-amber-900/20 overflow-hidden divide-y divide-amber-900/10">
          {filteredCatalog.map((product) => {
            const qtyInCart = getItemQtyInCart(product.id);
            const isInCart = qtyInCart > 0;

            return (
              <div
                key={product.id}
                className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-amber-100/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white border border-amber-300 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                    {product.img ? (
                      <img
                        src={product.img}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xl sm:text-2xl">🎆</span>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm sm:text-base font-serif font-black text-gray-900">{product.name}</h4>
                      {isInCart && (
                        <span className="bg-[#FFD700] text-[#4A0E0E] font-black text-[10px] px-2 py-0.5 rounded-full border border-amber-400">
                          {qtyInCart} in Cart
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] sm:text-xs text-amber-950 font-bold">{product.category} • Stock: {product.stock} units</span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 border-t sm:border-t-0 pt-2 sm:pt-0">
                  <span className="font-black text-[#4A0E0E] text-sm sm:text-base">₹{product.price}</span>

                  {isInCart ? (
                    <div className="w-[150px] h-[46px] flex items-center justify-between border border-amber-900/20 rounded-xl overflow-hidden bg-[#4A0E0E] text-white shadow-md shrink-0">
                      <button
                        type="button"
                        onClick={() => updateQty(product.id, -1)}
                        className="h-full px-3.5 hover:bg-red-950 text-amber-200 transition-colors flex items-center justify-center"
                        title="Reduce quantity"
                      >
                        <Minus size={17} strokeWidth={3} />
                      </button>
                      <span className="text-base font-black text-[#FFD700] tracking-wider">{qtyInCart}</span>
                      <button
                        type="button"
                        onClick={() => updateQty(product.id, 1)}
                        className="h-full px-3.5 hover:bg-red-950 text-amber-200 transition-colors flex items-center justify-center"
                        title="Increase quantity"
                      >
                        <Plus size={17} strokeWidth={3} />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => addToCart(product)}
                      className="w-[150px] h-[46px] bg-[#4A0E0E] hover:bg-red-950 text-white rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-1.5 shadow-md transform hover:scale-105 transition-all shrink-0"
                    >
                      <Plus size={16} strokeWidth={2.5} /> Add to Cart
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductCatalogGrid;
