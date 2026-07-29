import { useState } from 'react';
import { Search, SlidersHorizontal, Eye, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';

const Products = () => {
  const [searchFocused, setSearchFocused] = useState(false);

  const products = [
    { id: 1, name: "Deluxe Gift Hamper", price: "₹2,999", tag: "Best Seller", img: "https://placehold.co/400x600/FFEAA7/D32F2F?text=Gift+Hamper", type: "tall" },
    { id: 2, name: "Twinkling Sparklers", price: "₹599", tag: "New", img: "https://placehold.co/600x400/D32F2F/FFFFFF?text=Sparklers", type: "wide" },
    { id: 3, name: "Rocket 2000", price: "₹1,299", tag: "Top Rated", img: "https://placehold.co/400x400/FFB300/FFFFFF?text=Rocket", type: "square" },
    { id: 4, name: "Green Chakkars", price: "₹299", tag: "Eco", img: "https://placehold.co/400x400/2E7D32/FFFFFF?text=Chakkars", type: "square" },
    { id: 5, name: "Mega Sky Shot", price: "₹899", tag: "", img: "https://placehold.co/400x600/00BCD4/FFFFFF?text=Sky+Shot", type: "tall" },
  ];

  return (
    <div className="bg-cream-light min-h-screen pb-20">
      {/* Search Overlay */}
      {searchFocused && (
        <div className="fixed inset-0 z-50 bg-cream-light/95 backdrop-blur-sm flex flex-col pt-32 px-4 transition-all">
          <div className="max-w-3xl mx-auto w-full relative">
            <input 
              type="text" 
              autoFocus
              onBlur={() => setSearchFocused(false)}
              placeholder="Search for sparklers, rockets..." 
              className="w-full bg-white border-4 border-gold rounded-full px-8 py-6 text-2xl text-charcoal shadow-[0_0_40px_rgba(255,179,0,0.3)] focus:outline-none"
            />
            <div className="mt-8 flex flex-wrap gap-4">
              <span className="bg-red/10 text-red px-4 py-2 rounded-full font-bold">Sparklers</span>
              <span className="bg-green/10 text-green px-4 py-2 rounded-full font-bold">Eco-Friendly</span>
              <span className="bg-gold/10 text-gold-dark px-4 py-2 rounded-full font-bold">Gift Boxes</span>
            </div>
            <button onClick={() => setSearchFocused(false)} className="absolute -top-16 right-0 text-charcoal font-bold">Close ✕</button>
          </div>
        </div>
      )}

      {/* 1. Page Header */}
      <section className="bg-gradient-hero pt-32 pb-16 px-4 text-center">
        <h1 className="text-5xl md:text-6xl font-serif font-bold text-white drop-shadow-md mb-4">Our Collection</h1>
        <p className="text-xl text-cream-light font-medium max-w-2xl mx-auto">
          Handpicked fireworks for a legendary celebration.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-4 mt-12 flex flex-col lg:flex-row gap-8">
        
        {/* 2. Filter Sidebar */}
        <aside className="w-full lg:w-1/4">
          <div className="glass-card-bright p-6 sticky top-28">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-serif font-bold text-charcoal flex items-center">
                <SlidersHorizontal className="mr-2 w-5 h-5 text-gold" /> Filters
              </h3>
            </div>

            {/* Price Slider (Mock) */}
            <div className="mb-8">
              <h4 className="font-bold text-brown mb-4">Price Range</h4>
              <div className="h-2 bg-cream-dark rounded-full relative">
                <div className="absolute left-1/4 right-1/4 h-full bg-saffron rounded-full"></div>
                <div className="absolute left-1/4 top-1/2 -translate-y-1/2 w-4 h-4 bg-gold rounded-full border-2 border-white shadow-md"></div>
                <div className="absolute right-1/4 top-1/2 -translate-y-1/2 w-4 h-4 bg-gold rounded-full border-2 border-white shadow-md"></div>
              </div>
              <div className="flex justify-between mt-2 text-sm font-bold text-charcoal">
                <span>₹500</span>
                <span>₹5000</span>
              </div>
            </div>

            {/* Category Tags */}
            <div className="mb-8">
              <h4 className="font-bold text-brown mb-4">Categories</h4>
              <div className="flex flex-wrap gap-2">
                <span className="px-4 py-2 bg-red text-white rounded-full text-sm font-medium cursor-pointer">All</span>
                <span className="px-4 py-2 bg-cream text-charcoal hover:bg-gold/20 rounded-full text-sm font-medium cursor-pointer">Sparklers</span>
                <span className="px-4 py-2 bg-cream text-charcoal hover:bg-gold/20 rounded-full text-sm font-medium cursor-pointer">Rockets</span>
                <span className="px-4 py-2 bg-cream text-charcoal hover:bg-gold/20 rounded-full text-sm font-medium cursor-pointer">Bombs</span>
              </div>
            </div>

            {/* In Stock Toggle */}
            <div className="flex items-center justify-between mb-8 p-4 bg-cream/50 rounded-xl border border-gold/20">
              <span className="font-bold text-brown">In Stock Only</span>
              <div className="w-12 h-6 bg-green rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
            
            <button 
              onClick={() => setSearchFocused(true)}
              className="w-full flex items-center justify-center gap-2 border-2 border-gold text-gold-dark font-bold py-3 rounded-full hover:bg-gold hover:text-white transition-colors"
            >
              <Search className="w-5 h-5" /> Search Products
            </button>
          </div>
        </aside>

        {/* 3. Product Cards Grid (Masonry effect simulated with grid) */}
        <main className="w-full lg:w-3/4">
          <div className="flex gap-4 mb-8 overflow-x-auto pb-2 hide-scrollbar">
            <span className="px-6 py-2 bg-gold text-white rounded-full font-bold whitespace-nowrap">Popular</span>
            <span className="px-6 py-2 bg-white text-brown rounded-full font-bold whitespace-nowrap shadow-sm border border-gold/10">Price: Low to High</span>
            <span className="px-6 py-2 bg-white text-brown rounded-full font-bold whitespace-nowrap shadow-sm border border-gold/10">Newest</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {products.map((product) => (
              <motion.div 
                key={product.id}
                whileHover={{ scale: 1.02, y: -5 }}
                className={`bg-white rounded-tl-3xl rounded-br-3xl rounded-tr-lg rounded-bl-lg shadow-warm overflow-hidden relative group border border-gold/10 ${product.type === 'tall' ? 'row-span-2' : ''}`}
              >
                {/* Floating Tags */}
                {product.tag && (
                  <div className={`absolute top-4 left-4 px-3 py-1 text-xs font-bold text-white rounded-full z-20 ${
                    product.tag === 'Best Seller' ? 'bg-red' : 
                    product.tag === 'New' ? 'bg-green' : 
                    'bg-saffron'
                  }`}>
                    {product.tag}
                  </div>
                )}
                
                <div className={`relative overflow-hidden ${product.type === 'tall' ? 'h-96' : 'h-64'} bg-cream`}>
                  <img src={product.img} alt={product.name} className="w-full h-full object-cover" />
                  
                  {/* Subtle white to transparent gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent opacity-80"></div>
                  
                  {/* Hover Icons */}
                  <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                    <button className="w-12 h-12 bg-white text-gold rounded-full flex items-center justify-center shadow-lg hover:bg-gold hover:text-white transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300">
                      <Eye className="w-5 h-5" />
                    </button>
                    <button className="w-12 h-12 bg-saffron text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75">
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="p-6 relative z-10 bg-white">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-charcoal">{product.name}</h3>
                    <span className="bg-gold/10 text-gold-dark px-3 py-1 rounded-full font-bold text-lg">{product.price}</span>
                  </div>
                </div>

                {/* Yellow glow on hover */}
                <div className="absolute -inset-1 bg-gradient-to-r from-gold to-saffron opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 -z-10"></div>
              </motion.div>
            ))}
          </div>
        </main>

      </section>
    </div>
  );
};

export default Products;
