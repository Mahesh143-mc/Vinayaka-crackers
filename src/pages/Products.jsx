import { useState, useEffect } from 'react';
import { ShoppingCart, Filter, Search, X, ArrowUp, SlidersHorizontal, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';

const Products = () => {
  const [searchFocused, setSearchFocused] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { cartItems, cartTotals, addToCart, decrementQuantity } = useCart();
  const navigate = useNavigate();

  const shootConfetti = () => {
    const colors = ['#FFD700', '#D32F2F', '#4CAF50', '#FF9800', '#ffffff'];
    confetti({
      particleCount: 60,
      angle: 60,
      spread: 70,
      origin: { x: 0, y: 1 },
      colors: colors,
      zIndex: 150,
      disableForReducedMotion: true
    });
    confetti({
      particleCount: 60,
      angle: 120,
      spread: 70,
      origin: { x: 1, y: 1 },
      colors: colors,
      zIndex: 150,
      disableForReducedMotion: true
    });
  };

  const handleAddToCart = (e, product) => {
    e?.preventDefault();
    addToCart(product);
    shootConfetti();
  };

  const handleDecrementAction = (e, productId) => {
    e?.preventDefault();
    decrementQuantity(productId);
    shootConfetti();
  };

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
    <div className="bg-[#FFF8E7] min-h-screen pb-32 relative">
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

      {/* 1. Page Header (Banner Image) */}
      <section
        className="w-full h-[300px] sm:h-[400px] lg:h-[500px] relative z-10 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('https://res.cloudinary.com/vf0fqhwo/image/upload/v1786363847/banner_km6rhv.png')` }}
      >
      </section>

      {/* Full-width Cart Summary Bar */}
      <section className="w-full bg-[#8B1E1E] shadow-md z-[60] sticky top-0 border-b border-gold/30 transition-shadow duration-300">
        <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 md:px-16 py-3 sm:py-4 flex justify-between items-center gap-4">

          {/* Left Section (100% Mobile / 80% Desktop) */}
          <div className="flex-1 flex justify-between sm:justify-evenly items-center w-full">

            {/* Quantity */}
            <div className="flex items-center gap-2 sm:gap-3 flex-col sm:flex-row">
              <span className="text-gold font-bold text-[10px] sm:text-base uppercase tracking-widest leading-tight">Quantity</span>
              <div className="bg-[#f9f5eb] border border-gold/30 rounded-full px-3 sm:px-5 py-0.5 sm:py-1 text-[#B71C1C] font-bold shadow-sm text-xs sm:text-base">
                {cartTotals.totalQuantity}
              </div>
            </div>

            {/* Items */}
            <div className="flex items-center gap-2 sm:gap-3 flex-col sm:flex-row">
              <span className="text-gold font-bold text-[10px] sm:text-base uppercase tracking-widest leading-tight">Item</span>
              <div className="bg-[#f9f5eb] border border-gold/30 rounded-full px-3 sm:px-5 py-0.5 sm:py-1 text-[#B71C1C] font-bold shadow-sm text-xs sm:text-base">
                {cartTotals.totalItems}
              </div>
            </div>

            {/* Total */}
            <div className="flex items-center gap-2 sm:gap-3 flex-col sm:flex-row">
              <span className="text-gold font-bold text-[10px] sm:text-base uppercase tracking-widest leading-tight">Total</span>
              <div className="bg-[#f9f5eb] border border-gold/30 rounded-full px-3 sm:px-5 py-0.5 sm:py-1 text-[#B71C1C] font-bold shadow-sm flex items-center gap-0.5 sm:gap-1 text-xs sm:text-base">
                <span>₹</span>{cartTotals.totalAmount.toLocaleString('en-IN')}
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
                            <div 
                              className="aspect-[4/3] relative overflow-hidden bg-[#f9f5eb] cursor-pointer"
                              onClick={() => setSelectedProduct(product)}
                            >
                              <img
                                src={product.img}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                              />
                            </div>

                            {/* Practical E-commerce Text Block */}
                            <div className="flex-1 bg-white p-3 sm:p-4 flex flex-col justify-between z-20 border-t border-cream">
                              <div className="text-center mb-3">
                                <h3 
                                  className="text-sm sm:text-lg md:text-xl font-serif font-black text-[#B71C1C] leading-tight line-clamp-2 cursor-pointer hover:text-[#FFB300] transition-colors"
                                  onClick={() => setSelectedProduct(product)}
                                >
                                  {product.name}
                                </h3>
                                <div className="text-[#FFB300] font-black text-sm sm:text-lg mt-1">{product.price}</div>
                              </div>

                            {/* Quantity & Add to Cart Controls */}
                            <div className="flex items-center justify-center mt-auto w-full pt-2">
                              {(() => {
                                const cartItem = cartItems.find(item => item.id === product.id);
                                if (cartItem) {
                                  return (
                                    <div className="flex items-center justify-between bg-[#f9f5eb] rounded-full border border-gold/30 p-1 w-full max-w-[140px]">
                                      <button onClick={(e) => handleDecrementAction(e, product.id)} className="w-8 h-8 flex items-center justify-center text-[#B71C1C] hover:bg-white rounded-full transition-colors font-bold shadow-sm text-lg">-</button>
                                      <span className="flex-1 text-center font-bold text-charcoal text-sm">{cartItem.quantity}</span>
                                      <button onClick={(e) => handleAddToCart(e, product)} className="w-8 h-8 flex items-center justify-center text-[#B71C1C] hover:bg-white rounded-full transition-colors font-bold shadow-sm text-lg">+</button>
                                    </div>
                                  );
                                } else {
                                  return (
                                    <button onClick={(e) => handleAddToCart(e, product)} className="w-full bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-bold py-2 px-4 rounded-full shadow-md transition-colors flex items-center justify-center gap-2 text-sm">
                                      <ShoppingCart className="w-4 h-4" /> Add
                                    </button>
                                  );
                                }
                              })()}
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
        className="group fixed -left-4 sm:left-0 bottom-[30%] translate-y-1/2 z-[60] flex items-center h-14 bg-gradient-to-tr from-gold to-yellow-500 rounded-r-full shadow-md text-white transition-all duration-300 hover:shadow-lg hover:-left-0"
      >
        <div className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 shrink-0">
          <Filter size={24} className="group-hover:scale-110 transition-transform md:w-7 md:h-7" />
        </div>
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs group-hover:pr-6 font-bold md:text-lg transition-all duration-300 ease-in-out">
          Filters
        </span>
      </button>

      {/* Scroll to Top Button (Left Bottom) */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed left-6 bottom-10 z-40 flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-white text-[#B71C1C] border-2 border-gold/40 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-110 hover:border-gold hover:bg-[#f9f5eb] group"
        aria-label="Scroll to top"
      >
        <ArrowUp size={24} className="group-hover:-translate-y-1 transition-transform duration-300 md:w-7 md:h-7" />
      </button>

      {/* Floating Cart Button (Right Bottom) */}
      <button
        onClick={() => setShowCart(true)}
        className="group fixed right-6 bottom-10 z-40 flex items-center h-14 bg-gradient-to-tr from-[#D32F2F] to-[#B71C1C] rounded-full shadow-md text-white transition-all duration-300 hover:shadow-lg"
      >
        <div className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 shrink-0 relative">
          <ShoppingCart size={24} className="group-hover:scale-110 transition-transform md:w-7 md:h-7" />
          {cartTotals.totalQuantity > 0 && (
            <span className="absolute top-0 right-0 -mt-1 -mr-1 md:-mt-2 md:-mr-2 flex items-center justify-center min-w-[22px] h-[22px] md:min-w-[28px] md:h-[28px] px-1.5 text-[11px] md:text-[14px] font-black text-[#B71C1C] bg-white rounded-full shadow-md border-2 border-white">
              {cartTotals.totalQuantity}
            </span>
          )}
        </div>
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs group-hover:pr-6 font-bold md:text-lg transition-all duration-300 ease-in-out">
          Cart
        </span>
      </button>

      {/* Filter Sidebar Overlay */}
      {showFilters && (
        <div className="fixed inset-0 z-[70] flex justify-end bg-black/40 backdrop-blur-sm transition-opacity">
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
        <div className="fixed inset-0 z-[70] flex justify-end bg-black/40 backdrop-blur-sm transition-opacity">
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

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
                  <ShoppingCart size={48} className="text-gold mb-4" />
                  <p className="text-lg font-bold text-charcoal">Your cart is currently empty.</p>
                  <p className="text-sm mt-2">Selected products will appear here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4 p-3 bg-[#f9f5eb] border border-gold/20 rounded-2xl items-center shadow-sm">
                      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-gold/30 bg-white">
                        <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm text-[#B71C1C] truncate">{item.name}</h4>
                        <div className="text-charcoal font-semibold text-xs mt-0.5">{item.price}</div>
                      </div>
                      <div className="flex items-center gap-2 bg-white rounded-full border border-gold/30 p-0.5 shrink-0">
                        <button onClick={(e) => handleDecrementAction(e, item.id)} className="w-6 h-6 flex items-center justify-center text-[#B71C1C] hover:bg-cream-light rounded-full font-bold transition-colors">-</button>
                        <span className="w-4 text-center font-bold text-xs">{item.quantity}</span>
                        <button onClick={(e) => handleAddToCart(e, item)} className="w-6 h-6 flex items-center justify-center text-[#B71C1C] hover:bg-cream-light rounded-full font-bold transition-colors">+</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-gold/20 space-y-3">
              {cartItems.length > 0 && (
                <div className="flex justify-between items-center mb-4 px-2">
                  <span className="font-bold text-charcoal">Subtotal</span>
                  <span className="font-black text-xl text-[#B71C1C]">₹{cartTotals.totalAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              {cartItems.length > 0 ? (
                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/checkout')}
                    className="w-full bg-[#B71C1C] hover:bg-red-800 text-white font-bold py-3 px-4 rounded-full shadow-lg transition-colors flex justify-center items-center gap-2"
                  >
                    Proceed to Checkout
                  </button>
                  <button
                    onClick={() => setShowCart(false)}
                    className="w-full bg-[#f9f5eb] border-2 border-[#FFB300] text-[#FFB300] hover:bg-[#FFB300] hover:text-white font-bold py-3 px-4 rounded-full transition-all flex justify-center items-center gap-2"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowCart(false)}
                  className="w-full bg-[#B71C1C] hover:bg-red-800 text-white font-bold py-3 px-4 rounded-full shadow-lg transition-colors"
                >
                  Continue Shopping
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Product Details Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl overflow-hidden shadow-2xl relative z-10 max-w-4xl w-full flex flex-col md:flex-row max-h-[90vh]"
            >
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 bg-white/80 backdrop-blur text-charcoal hover:text-red-600 rounded-full p-2 z-20 shadow-sm transition-colors"
              >
                <X size={24} />
              </button>

              <div className="md:w-1/2 bg-[#f9f5eb] relative">
                <img src={selectedProduct.img} alt={selectedProduct.name} className="w-full h-full object-cover aspect-square md:aspect-auto" />
                {selectedProduct.tag && (
                  <div className="absolute top-6 left-6 bg-[#B71C1C] text-white px-4 py-1 rounded-full text-sm font-bold shadow-md">
                    {selectedProduct.tag}
                  </div>
                )}
              </div>
              
              <div className="md:w-1/2 p-6 md:p-10 flex flex-col overflow-y-auto">
                <span className="text-gold font-bold uppercase tracking-wider text-sm mb-2">{selectedProduct.category}</span>
                <h2 className="text-3xl md:text-4xl font-serif font-black text-[#B71C1C] mb-4 leading-tight">{selectedProduct.name}</h2>
                <div className="text-3xl font-black text-[#FFB300] mb-6">{selectedProduct.price}</div>
                
                <p className="text-[#666666] text-base md:text-lg mb-8 leading-relaxed">
                  Experience the ultimate festive joy with our premium {selectedProduct.name}. Perfectly curated for your celebrations, this item guarantees a spectacular display of light and sound. 
                </p>

                <div className="mt-auto pt-6 border-t border-cream">
                  {(() => {
                    const cartItem = cartItems.find(item => item.id === selectedProduct.id);
                    if (cartItem) {
                      return (
                        <div className="flex items-center justify-between bg-[#f9f5eb] rounded-full p-2 border border-gold/20 w-full max-w-xs mx-auto md:mx-0">
                          <button 
                            onClick={(e) => handleDecrementAction(e, selectedProduct.id)} 
                            className="w-12 h-12 flex items-center justify-center bg-white text-[#B71C1C] hover:bg-red-50 rounded-full shadow-sm text-xl font-bold transition-colors"
                          >
                            -
                          </button>
                          <span className="font-black text-[#B71C1C] text-xl px-4">{cartItem.quantity}</span>
                          <button 
                            onClick={(e) => handleAddToCart(e, selectedProduct)} 
                            className="w-12 h-12 flex items-center justify-center bg-[#FFB300] text-white hover:bg-[#FF8F00] rounded-full shadow-sm text-xl font-bold transition-colors"
                          >
                            +
                          </button>
                        </div>
                      );
                    }
                    return (
                      <button 
                        onClick={(e) => handleAddToCart(e, selectedProduct)}
                        className="w-full bg-[#B71C1C] hover:bg-red-800 text-white font-bold py-4 px-8 rounded-full shadow-lg transition-transform hover:-translate-y-1 flex items-center justify-center gap-3 text-lg"
                      >
                        <ShoppingCart size={24} /> Add to Cart
                      </button>
                    );
                  })()}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Products;
