import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Eye, ShoppingCart, Filter, X } from 'lucide-react';
import { motion } from 'framer-motion';

const Products = () => {
  const [searchFocused, setSearchFocused] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 280) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categories = ["All", "Gift Hampers", "Sparklers", "Rockets", "Chakkars", "Sky Shots"];

  const products = [
    { id: 1, name: "Deluxe Gift Hamper", price: "₹2,999", tag: "Best Seller", category: "Gift Hampers", img: "https://res.cloudinary.com/vf0fqhwo/image/upload/v1785323861/Sample_Crackers_rfzenl.jpg" },
    { id: 2, name: "Twinkling Sparklers", price: "₹599", tag: "New", category: "Sparklers", img: "https://res.cloudinary.com/vf0fqhwo/image/upload/v1785323861/Sample_Crackers_rfzenl.jpg" },
    { id: 3, name: "Rocket 2000", price: "₹1,299", tag: "Top Rated", category: "Rockets", img: "https://res.cloudinary.com/vf0fqhwo/image/upload/v1785323861/Sample_Crackers_rfzenl.jpg" },
    { id: 4, name: "Green Chakkars", price: "₹299", tag: "Eco", category: "Chakkars", img: "https://res.cloudinary.com/vf0fqhwo/image/upload/v1785323861/Sample_Crackers_rfzenl.jpg" },
    { id: 5, name: "Mega Sky Shot", price: "₹899", tag: "", category: "Sky Shots", img: "https://res.cloudinary.com/vf0fqhwo/image/upload/v1785323861/Sample_Crackers_rfzenl.jpg" },
    { id: 6, name: "Deluxe Gift Hamper", price: "₹2,999", tag: "Best Seller", category: "Gift Hampers", img: "https://res.cloudinary.com/vf0fqhwo/image/upload/v1785323861/Sample_Crackers_rfzenl.jpg" },
    { id: 7, name: "Twinkling Sparklers", price: "₹599", tag: "New", category: "Sparklers", img: "https://res.cloudinary.com/vf0fqhwo/image/upload/v1785323861/Sample_Crackers_rfzenl.jpg" },
    { id: 8, name: "Rocket 2000", price: "₹1,299", tag: "Top Rated", category: "Rockets", img: "https://res.cloudinary.com/vf0fqhwo/image/upload/v1785323861/Sample_Crackers_rfzenl.jpg" },
    { id: 9, name: "Green Chakkars", price: "₹299", tag: "Eco", category: "Chakkars", img: "https://res.cloudinary.com/vf0fqhwo/image/upload/v1785323861/Sample_Crackers_rfzenl.jpg" },
    { id: 10, name: "Mega Sky Shot", price: "₹899", tag: "", category: "Sky Shots", img: "https://res.cloudinary.com/vf0fqhwo/image/upload/v1785323861/Sample_Crackers_rfzenl.jpg" },
    { id: 11, name: "Deluxe Gift Hamper", price: "₹2,999", tag: "Best Seller", category: "Gift Hampers", img: "https://res.cloudinary.com/vf0fqhwo/image/upload/v1785323861/Sample_Crackers_rfzenl.jpg" },
    { id: 12, name: "Twinkling Sparklers", price: "₹599", tag: "New", category: "Sparklers", img: "https://res.cloudinary.com/vf0fqhwo/image/upload/v1785323861/Sample_Crackers_rfzenl.jpg" },
    { id: 13, name: "Rocket 2000", price: "₹1,299", tag: "Top Rated", category: "Rockets", img: "https://res.cloudinary.com/vf0fqhwo/image/upload/v1785323861/Sample_Crackers_rfzenl.jpg" },
    { id: 14, name: "Green Chakkars", price: "₹299", tag: "Eco", category: "Chakkars", img: "https://res.cloudinary.com/vf0fqhwo/image/upload/v1785323861/Sample_Crackers_rfzenl.jpg" },
    { id: 15, name: "Mega Sky Shot", price: "₹899", tag: "", category: "Sky Shots", img: "https://res.cloudinary.com/vf0fqhwo/image/upload/v1785323861/Sample_Crackers_rfzenl.jpg" },
    { id: 16, name: "Deluxe Gift Hamper", price: "₹2,999", tag: "Best Seller", category: "Gift Hampers", img: "https://res.cloudinary.com/vf0fqhwo/image/upload/v1785323861/Sample_Crackers_rfzenl.jpg" },
    { id: 17, name: "Twinkling Sparklers", price: "₹599", tag: "New", category: "Sparklers", img: "https://res.cloudinary.com/vf0fqhwo/image/upload/v1785323861/Sample_Crackers_rfzenl.jpg" },
    { id: 18, name: "Rocket 2000", price: "₹1,299", tag: "Top Rated", category: "Rockets", img: "https://res.cloudinary.com/vf0fqhwo/image/upload/v1785323861/Sample_Crackers_rfzenl.jpg" },
    { id: 19, name: "Green Chakkars", price: "₹299", tag: "Eco", category: "Chakkars", img: "https://res.cloudinary.com/vf0fqhwo/image/upload/v1785323861/Sample_Crackers_rfzenl.jpg" },
    { id: 20, name: "Mega Sky Shot", price: "₹899", tag: "", category: "Sky Shots", img: "https://res.cloudinary.com/vf0fqhwo/image/upload/v1785323861/Sample_Crackers_rfzenl.jpg" },
    { id: 21, name: "Deluxe Gift Hamper", price: "₹2,999", tag: "Best Seller", category: "Gift Hampers", img: "https://res.cloudinary.com/vf0fqhwo/image/upload/v1785323861/Sample_Crackers_rfzenl.jpg" },
    { id: 22, name: "Twinkling Sparklers", price: "₹599", tag: "New", category: "Sparklers", img: "https://res.cloudinary.com/vf0fqhwo/image/upload/v1785323861/Sample_Crackers_rfzenl.jpg" },
    { id: 23, name: "Rocket 2000", price: "₹1,299", tag: "Top Rated", category: "Rockets", img: "https://res.cloudinary.com/vf0fqhwo/image/upload/v1785323861/Sample_Crackers_rfzenl.jpg" },
    { id: 24, name: "Green Chakkars", price: "₹299", tag: "Eco", category: "Chakkars", img: "https://res.cloudinary.com/vf0fqhwo/image/upload/v1785323861/Sample_Crackers_rfzenl.jpg" },
    { id: 25, name: "Mega Sky Shot", price: "₹899", tag: "", category: "Sky Shots", img: "https://res.cloudinary.com/vf0fqhwo/image/upload/v1785323861/Sample_Crackers_rfzenl.jpg" },
    { id: 26, name: "Deluxe Gift Hamper", price: "₹2,999", tag: "Best Seller", category: "Gift Hampers", img: "https://res.cloudinary.com/vf0fqhwo/image/upload/v1785323861/Sample_Crackers_rfzenl.jpg" },
    { id: 27, name: "Twinkling Sparklers", price: "₹599", tag: "New", category: "Sparklers", img: "https://res.cloudinary.com/vf0fqhwo/image/upload/v1785323861/Sample_Crackers_rfzenl.jpg" },
    { id: 28, name: "Rocket 2000", price: "₹1,299", tag: "Top Rated", category: "Rockets", img: "https://res.cloudinary.com/vf0fqhwo/image/upload/v1785323861/Sample_Crackers_rfzenl.jpg" },
    { id: 29, name: "Green Chakkars", price: "₹299", tag: "Eco", category: "Chakkars", img: "https://res.cloudinary.com/vf0fqhwo/image/upload/v1785323861/Sample_Crackers_rfzenl.jpg" },
    { id: 30, name: "Mega Sky Shot", price: "₹899", tag: "", category: "Sky Shots", img: "https://res.cloudinary.com/vf0fqhwo/image/upload/v1785323861/Sample_Crackers_rfzenl.jpg" },
    { id: 31, name: "Deluxe Gift Hamper", price: "₹2,999", tag: "Best Seller", category: "Gift Hampers", img: "https://res.cloudinary.com/vf0fqhwo/image/upload/v1785323861/Sample_Crackers_rfzenl.jpg" },
    { id: 32, name: "Twinkling Sparklers", price: "₹599", tag: "New", category: "Sparklers", img: "https://res.cloudinary.com/vf0fqhwo/image/upload/v1785323861/Sample_Crackers_rfzenl.jpg" },
    { id: 33, name: "Rocket 2000", price: "₹1,299", tag: "Top Rated", category: "Rockets", img: "https://res.cloudinary.com/vf0fqhwo/image/upload/v1785323861/Sample_Crackers_rfzenl.jpg" },
    { id: 34, name: "Green Chakkars", price: "₹299", tag: "Eco", category: "Chakkars", img: "https://res.cloudinary.com/vf0fqhwo/image/upload/v1785323861/Sample_Crackers_rfzenl.jpg" },
    { id: 35, name: "Mega Sky Shot", price: "₹899", tag: "", category: "Sky Shots", img: "https://res.cloudinary.com/vf0fqhwo/image/upload/v1785323861/Sample_Crackers_rfzenl.jpg" },
    { id: 36, name: "Deluxe Gift Hamper", price: "₹2,999", tag: "Best Seller", category: "Gift Hampers", img: "https://res.cloudinary.com/vf0fqhwo/image/upload/v1785323861/Sample_Crackers_rfzenl.jpg" },
    { id: 37, name: "Twinkling Sparklers", price: "₹599", tag: "New", category: "Sparklers", img: "https://res.cloudinary.com/vf0fqhwo/image/upload/v1785323861/Sample_Crackers_rfzenl.jpg" },
    { id: 38, name: "Rocket 2000", price: "₹1,299", tag: "Top Rated", category: "Rockets", img: "https://res.cloudinary.com/vf0fqhwo/image/upload/v1785323861/Sample_Crackers_rfzenl.jpg" },
    { id: 39, name: "Green Chakkars", price: "₹299", tag: "Eco", category: "Chakkars", img: "https://res.cloudinary.com/vf0fqhwo/image/upload/v1785323861/Sample_Crackers_rfzenl.jpg" },
    { id: 40, name: "Mega Sky Shot", price: "₹899", tag: "", category: "Sky Shots", img: "https://res.cloudinary.com/vf0fqhwo/image/upload/v1785323861/Sample_Crackers_rfzenl.jpg" },
  ];

  const filteredProducts = selectedCategory === "All" ? products : products.filter(p => p.category === selectedCategory);

  return (
    <div className="bg-[#FFF8E7] min-h-screen pb-32 relative overflow-hidden">
      {/* Floating golden sparkle particles (simulated with absolute divs) */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-gold rounded-full animate-ping opacity-70"></div>
      <div className="absolute top-40 right-20 w-3 h-3 bg-gold rounded-full animate-pulse opacity-50"></div>
      <div className="absolute bottom-40 left-1/4 w-4 h-4 bg-gold rounded-full animate-bounce opacity-40"></div>
      <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-saffron rounded-full animate-ping opacity-60"></div>

      {/* Search Overlay */}
      {searchFocused && (
        <div className="fixed inset-0 z-50 bg-[#FFF8E7]/95 backdrop-blur-sm flex flex-col pt-32 px-4 transition-all">
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
            <button onMouseDown={() => setSearchFocused(false)} className="absolute -top-16 right-0 text-charcoal font-bold">Close ✕</button>
          </div>
        </div>
      )}

      {/* 1. Page Header */}
      <section className="bg-gradient-hero pt-32 pb-16 px-4 text-center relative z-10">
        <h1 className="text-5xl md:text-6xl font-serif font-bold text-white drop-shadow-md mb-4">Our Collection</h1>
        <p className="text-xl text-cream-light font-medium max-w-2xl mx-auto">
          Handpicked fireworks for a legendary celebration.
        </p>
      </section>

      {/* Full-width Cart Summary Bar */}
      {isSticky && <div style={{ height: '74px' }} className="w-full"></div>}
      <section className={`w-full bg-[#8B1E1E] shadow-sm z-50 transition-all duration-300 ${isSticky ? 'fixed top-0 left-0 border-b border-gold/30 shadow-md' : 'relative border-b border-gold/20'}`}>
        <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 md:px-16 py-3 sm:py-4 flex justify-between items-center gap-4">
          
          {/* Left Section (100% Mobile / 80% Desktop) */}
          <div className="flex-1 flex justify-between sm:justify-evenly items-center w-full">
            
            {/* Quantity */}
            <div className="flex items-center gap-2 sm:gap-3 flex-col sm:flex-row">
              <span className="text-gold font-bold text-[10px] sm:text-base uppercase tracking-widest leading-tight">Quantity</span>
              <div className="bg-[#f9f5eb] border border-gold/30 rounded-full px-3 sm:px-5 py-0.5 sm:py-1 text-[#B71C1C] font-bold shadow-sm text-xs sm:text-base">
                0
              </div>
            </div>
            
            {/* Items */}
            <div className="flex items-center gap-2 sm:gap-3 flex-col sm:flex-row">
              <span className="text-gold font-bold text-[10px] sm:text-base uppercase tracking-widest leading-tight">Item</span>
              <div className="bg-[#f9f5eb] border border-gold/30 rounded-full px-3 sm:px-5 py-0.5 sm:py-1 text-[#B71C1C] font-bold shadow-sm text-xs sm:text-base">
                0
              </div>
            </div>
            
            {/* Total */}
            <div className="flex items-center gap-2 sm:gap-3 flex-col sm:flex-row">
              <span className="text-gold font-bold text-[10px] sm:text-base uppercase tracking-widest leading-tight">Total</span>
              <div className="bg-[#f9f5eb] border border-gold/30 rounded-full px-3 sm:px-5 py-0.5 sm:py-1 text-[#B71C1C] font-bold shadow-sm flex items-center gap-0.5 sm:gap-1 text-xs sm:text-base">
                <span>₹</span>0
              </div>
            </div>
          </div>

          {/* Right Section (Hidden Mobile / 20% Desktop) */}
          <div className="hidden sm:flex justify-end items-center">
            <button 
              onClick={() => setShowCart(true)}
              className="bg-gradient-to-tr from-gold to-yellow-500 hover:from-yellow-400 hover:to-yellow-300 text-[#B71C1C] px-8 py-2 rounded-full font-black shadow-lg border border-yellow-200 transition-all flex items-center justify-center gap-2 transform hover:scale-105 whitespace-nowrap"
            >
              <ShoppingCart size={18} /> View Cart
            </button>
          </div>
        </div>
      </section>

      <section className="w-full max-w-[1400px] mx-auto px-2 md:px-8 mt-8">

        {/* Floating Islands Grid (Now using CSS Grid) */}
        <main className="w-full mx-auto">
          <div className="flex gap-4 mb-12 overflow-x-auto pb-4 hide-scrollbar">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-bold whitespace-nowrap shadow-sm cursor-pointer transition-transform ${selectedCategory === category
                  ? 'bg-gradient-to-r from-gold to-yellow-500 text-white shadow-md hover:scale-105'
                  : 'bg-white text-brown border border-gold/20 hover:border-gold'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>


          <div className="space-y-16 pb-16">
            {categories.filter(c => c !== "All" && (selectedCategory === "All" || selectedCategory === c)).map((category) => {
              const categoryProducts = products.filter(p => p.category === category);
              if (categoryProducts.length === 0) return null;

              return (
                <div key={category} className="mb-8">
                  {/* Category Title Header */}
                  <div className="flex items-center gap-4 mb-8">
                    <h2 className="text-3xl md:text-4xl font-serif font-black text-[#B71C1C] drop-shadow-sm">{category}</h2>
                    <div className="flex-1 h-1 bg-gradient-to-r from-gold/50 to-transparent rounded-full"></div>
                  </div>

                  {/* Grid for this category */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
                    {categoryProducts.map((product, index) => {
                      const zIndexClass = index % 2 === 0 ? 'z-10' : 'z-20';

                      return (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, y: 50 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "100px" }}
                          transition={{ duration: 0.6, delay: index * 0.1 }}
                          className={`relative ${zIndexClass} transition-all duration-500`}
                        >
                          {/* Card Container with uniform size */}
                          <div
                            className={`bg-white border border-gold/15 shadow-sm hover:shadow-md overflow-hidden relative rounded-2xl sm:rounded-3xl h-full w-full flex flex-col transition-shadow duration-300`}
                            style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)' }}
                          >
                            {/* Image taking upper portion */}
                            <div className="aspect-[4/3] relative overflow-hidden bg-[#f9f5eb]">
                              <img
                                src={product.img}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            {/* Practical E-commerce Text Block */}
                            <div className="flex-1 bg-white p-3 sm:p-4 flex flex-col justify-between z-20 border-t border-cream">
                              <div className="text-center mb-3">
                                <h3 className="text-sm sm:text-lg md:text-xl font-serif font-black text-[#B71C1C] leading-tight line-clamp-2">{product.name}</h3>
                                <div className="text-[#FFB300] font-black text-sm sm:text-lg mt-1">{product.price}</div>
                              </div>

                              {/* Quantity & Add to Cart Controls */}
                              <div className="flex flex-col xl:flex-row items-center justify-between mt-auto gap-2 w-full">
                                {/* Quantity Selector */}
                                <div className="flex items-center justify-between bg-[#f9f5eb] rounded-full border border-gold/30 p-1 w-full xl:w-auto">
                                  <button className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-[#B71C1C] hover:bg-white rounded-full transition-colors font-bold shadow-sm">-</button>
                                  <span className="flex-1 xl:w-8 text-center font-bold text-charcoal text-xs sm:text-sm">1</span>
                                  <button className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-[#B71C1C] hover:bg-white rounded-full transition-colors font-bold shadow-sm">+</button>
                                </div>

                                {/* Add Button */}
                                <button className="w-full xl:flex-1 bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-bold py-1.5 px-3 rounded-full shadow-md transition-colors flex items-center justify-center gap-1 text-xs sm:text-sm">
                                  <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" /> Add
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </section>

      {/* Floating Filter Button (Left) */}
      <button
        onClick={() => setShowFilters(true)}
        className="group fixed left-6 bottom-[70%] translate-y-1/2 z-40 flex items-center h-14 bg-gradient-to-tr from-gold to-yellow-500 rounded-full shadow-md text-white transition-all duration-300 hover:shadow-lg"
      >
        <div className="flex items-center justify-center w-14 h-14 shrink-0">
          <Filter size={24} className="group-hover:scale-110 transition-transform" />
        </div>
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs group-hover:pr-5 font-bold transition-all duration-300 ease-in-out">
          Filters
        </span>
      </button>

      {/* Floating Cart Button (Right Bottom) */}
      <button
        onClick={() => setShowCart(true)}
        className="group fixed right-6 bottom-10 z-40 flex items-center h-14 bg-gradient-to-tr from-[#D32F2F] to-[#B71C1C] rounded-full shadow-md text-white transition-all duration-300 hover:shadow-lg"
      >
        <div className="flex items-center justify-center w-14 h-14 shrink-0">
          <ShoppingCart size={24} className="group-hover:scale-110 transition-transform" />
        </div>
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs group-hover:pr-5 font-bold transition-all duration-300 ease-in-out">
          Cart
        </span>
      </button>

      {/* Filter Sidebar Overlay */}
      {showFilters && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm transition-opacity">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-full max-w-sm h-full bg-white shadow-2xl p-6 flex flex-col overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold text-[#B71C1C] font-serif">Refine Products</h3>
              <button onClick={() => setShowFilters(false)} className="text-gray-400 hover:text-[#B71C1C] transition-colors p-2 bg-gray-100 rounded-full hover:bg-gold/10">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-8 flex-1">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-bold text-charcoal mb-3">Category</label>
                <div className="relative">
                  <select 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full appearance-none bg-[#f9f5eb] border border-gold/30 rounded-xl px-4 py-3 text-charcoal focus:outline-none focus:border-gold font-medium cursor-pointer"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Filter 1 */}
              <div>
                <label className="block text-sm font-bold text-charcoal mb-3">Price Range</label>
                <div className="relative">
                  <select className="w-full appearance-none bg-[#f9f5eb] border border-gold/30 rounded-xl px-4 py-3 text-charcoal focus:outline-none focus:border-gold font-medium cursor-pointer">
                    <option>Any Price</option>
                    <option>Under ₹1,000</option>
                    <option>₹1,000 - ₹2,000</option>
                    <option>Over ₹2,000</option>
                  </select>
                </div>
              </div>
              
              {/* Filter 2 */}
              <div>
                <label className="block text-sm font-bold text-charcoal mb-3">Sort By</label>
                <div className="relative">
                  <select className="w-full appearance-none bg-[#f9f5eb] border border-gold/30 rounded-xl px-4 py-3 text-charcoal focus:outline-none focus:border-gold font-medium cursor-pointer">
                    <option>Recommended</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Newest Arrivals</option>
                  </select>
                </div>
              </div>
              
              {/* Filter 3 */}
              <div>
                <label className="block text-sm font-bold text-charcoal mb-3">Availability</label>
                <label className="flex items-center gap-3 mt-4 cursor-pointer group">
                  <div className="w-6 h-6 rounded border border-gold flex items-center justify-center bg-gold group-hover:bg-yellow-500 transition-colors">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <span className="text-charcoal font-bold">In Stock Only</span>
                </label>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gold/20">
              <button 
                onClick={() => setShowFilters(false)}
                className="w-full bg-[#B71C1C] hover:bg-red-800 text-white font-bold py-3 px-4 rounded-full shadow-lg transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Cart Sidebar Overlay */}
      {showCart && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm transition-opacity">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-full max-w-md h-full bg-white shadow-2xl p-6 flex flex-col overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-8 border-b border-gold/20 pb-4">
              <h2 className="text-2xl font-serif font-black text-[#B71C1C] uppercase tracking-wider">Your Cart</h2>
              <button 
                onClick={() => setShowCart(false)}
                className="p-2 hover:bg-[#f9f5eb] rounded-full transition-colors text-charcoal hover:text-[#B71C1C]"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60">
              <ShoppingCart size={48} className="text-gold mb-4" />
              <p className="text-lg font-bold text-charcoal">Your cart is currently empty.</p>
              <p className="text-sm mt-2">Selected products will appear here.</p>
            </div>

            <div className="mt-8 pt-6 border-t border-gold/20">
              <button 
                onClick={() => setShowCart(false)}
                className="w-full bg-[#B71C1C] hover:bg-red-800 text-white font-bold py-3 px-4 rounded-full shadow-lg transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Products;
