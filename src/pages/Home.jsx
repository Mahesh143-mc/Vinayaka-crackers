import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

const Home = () => {
  const [activeFaq, setActiveFaq] = useState(null);
  const [isBestSellersHovered, setIsBestSellersHovered] = useState(false);
  const bestSellersRef = useRef(null);

  const scrollBestSellers = (direction) => {
    if (bestSellersRef.current) {
      const container = bestSellersRef.current;
      const firstCard = container.firstElementChild;
      if (firstCard) {
        const stepWidth = firstCard.getBoundingClientRect().width + 24; // card width + gap-6
        const { scrollLeft, scrollWidth, clientWidth } = container;
        if (direction === 'right') {
          if (scrollLeft + clientWidth >= scrollWidth - 15) {
            container.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            container.scrollTo({ left: scrollLeft + stepWidth, behavior: 'smooth' });
          }
        } else {
          if (scrollLeft <= 15) {
            container.scrollTo({ left: scrollWidth - clientWidth, behavior: 'smooth' });
          } else {
            container.scrollTo({ left: scrollLeft - stepWidth, behavior: 'smooth' });
          }
        }
      }
    }
  };

  // Automatic 1-Card Step Left-to-Right Scrolling (1-4 -> 2-5 -> 3-6 -> 4-7 -> 5-8 -> 1-4)
  useEffect(() => {
    if (isBestSellersHovered) return;
    const interval = setInterval(() => {
      if (bestSellersRef.current) {
        const container = bestSellersRef.current;
        const firstCard = container.firstElementChild;
        if (firstCard) {
          const stepWidth = firstCard.getBoundingClientRect().width + 24; // 1-card step width
          const { scrollLeft, scrollWidth, clientWidth } = container;
          if (scrollLeft + clientWidth >= scrollWidth - 15) {
            container.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            container.scrollTo({ left: scrollLeft + stepWidth, behavior: 'smooth' });
          }
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isBestSellersHovered]);

  const bestSellers = [
    {
      id: 1,
      name: "Golden Sparklers (50 pcs)",
      price: "₹349",
      tag: "Best Seller",
      img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80"
    },
    {
      id: 2,
      name: "2000 Shots Rocket",
      price: "₹1,299",
      tag: "Best Seller",
      img: "https://images.unsplash.com/photo-1531685250784-756995259372?w=1000&q=80"
    },
    {
      id: 3,
      name: "Lakshmi Flower Pot",
      price: "₹499",
      tag: "Best Seller",
      img: "https://images.unsplash.com/photo-1498931299472-f7a63a5a1cfa?w=800&q=80"
    },
    {
      id: 4,
      name: "Kids Fun Pack",
      price: "₹699",
      tag: "Best Seller",
      img: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80"
    },
    {
      id: 5,
      name: "Deluxe Gift Hamper",
      price: "₹2,499",
      tag: "Best Seller",
      img: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=1000&q=80"
    },
    {
      id: 6,
      name: "Sky Thunder Bombs",
      price: "₹899",
      tag: "Best Seller",
      img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80"
    },
    {
      id: 7,
      name: "Mega Peacock Fountain",
      price: "₹749",
      tag: "Best Seller",
      img: "https://images.unsplash.com/photo-1498931299472-f7a63a5a1cfa?w=800&q=80"
    },
    {
      id: 8,
      name: "Multi-Color Sky Shots",
      price: "₹1,599",
      tag: "Best Seller",
      img: "https://images.unsplash.com/photo-1531685250784-756995259372?w=1000&q=80"
    }
  ];

  const categoryBanners = [
    {
      id: 1,
      emoji: "✨",
      name: "Sparklers",
      description: "Hand-held magic for all ages.",
      alignment: "left",
      tint: "#FFF8E1",
      path: "/products"
    },
    {
      id: 2,
      emoji: "🌸",
      name: "Flower Pots",
      description: "Colorful fountains of fire.",
      alignment: "right",
      tint: "#FCE4EC",
      path: "/products"
    },
    {
      id: 3,
      emoji: "🚀",
      name: "Rockets",
      description: "Soar high with spectacular trails.",
      alignment: "left",
      tint: "#E3F2FD",
      path: "/products"
    },
    {
      id: 4,
      emoji: "🧒",
      name: "Kids Special",
      description: "Safe and colorful crackers for kids.",
      alignment: "right",
      tint: "#E8F5E9",
      path: "/products"
    },
    {
      id: 5,
      emoji: "🎁",
      name: "Gift Boxes",
      description: "Curated hampers for every occasion.",
      alignment: "left",
      tint: "#FFF3E0",
      path: "/products"
    },
    {
      id: 6,
      emoji: "🌟",
      name: "Deluxe Combo",
      description: "Premium cracker assortment.",
      alignment: "right",
      tint: "#F3E5F5",
      path: "/products"
    }
  ];

  return (
    <div className="overflow-hidden">
      <section className="relative flex items-center justify-center overflow-hidden bg-white pt-24 pb-12 md:pt-32 md:pb-20 md:min-h-[85vh]">
        {/* User Provided Texture Background */}
        <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/vf0fqhwo/image/upload/v1785301158/texture_njj3db.webp')] bg-repeat bg-center opacity-100"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 w-full grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-16 items-center mt-2 sm:mt-8">

          {/* Text Content Column (First on mobile order-1, Right on desktop md:order-2) */}
          <div className="order-1 md:order-2 text-center flex flex-col justify-center items-center w-full mx-auto md:ml-4 px-2">
            <motion.h1
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-[1.4rem] sm:text-4xl md:text-5xl lg:text-[4rem] font-serif font-bold text-[#B71C1C] mb-4 sm:mb-6 leading-tight drop-shadow-sm tracking-tight"
            >
              Bring the best quality <br className="block sm:hidden" /> fireworks with us
            </motion.h1>

            <motion.p
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-[#2C2C2C] text-xs sm:text-base md:text-lg font-sans leading-relaxed mb-6 sm:mb-8 text-center max-w-xl px-2 opacity-90"
            >
              Karuppa Crackers is your trusted destination for premium-quality fireworks from Sivakasi. We offer a wide range of safe, vibrant, and high-quality crackers at competitive prices. Celebrate every occasion with confidence, backed by reliable service and customer satisfaction.
            </motion.p>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <a href="#collection" className="bg-[#fb923c] hover:bg-[#f97316] text-white font-extrabold font-sans text-sm sm:text-base md:text-lg px-8 py-3 sm:py-3.5 rounded-full shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl inline-block tracking-wide">
                Explore Our Products
              </a>
            </motion.div>
          </div>

          {/* Graphic Column (Second on mobile order-2, Left on desktop md:order-1) */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="order-2 md:order-1 flex justify-center md:justify-end mt-2 md:mt-0"
          >
            <img
              src="https://res.cloudinary.com/vf0fqhwo/image/upload/v1785301007/banner_inner_k8nudd.webp"
              alt="Diwali Dhamaka Banner"
              className="w-[85%] sm:w-full max-w-[500px] object-contain drop-shadow-2xl"
            />
          </motion.div>
        </div>
      </section>

      {/* PAGE 2: DISCOVER MAGIC – "Category Discovery" */}
      <section className="py-20 px-4 sm:px-6 relative bg-[#FCE4EC] overflow-hidden">
        {/* Subtle golden radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-100/50 via-transparent to-transparent pointer-events-none"></div>

        {/* Faint Rangoli Mandala Background */}
        <div className="absolute -bottom-48 -right-48 w-[800px] h-[800px] opacity-5 pointer-events-none text-charcoal">
          <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
            <path d="M50 0 C60 20 80 40 100 50 C80 60 60 80 50 100 C40 80 20 60 0 50 C20 40 40 20 50 0 Z" />
            <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="50" cy="50" r="10" />
            <path d="M50 10 L55 25 L70 30 L55 35 L50 50 L45 35 L30 30 L45 25 Z" fill="none" stroke="currentColor" strokeWidth="1" />
            <path d="M50 50 L55 65 L70 70 L55 75 L50 90 L45 75 L30 70 L45 65 Z" fill="none" stroke="currentColor" strokeWidth="1" />
          </svg>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#B71C1C] mb-3 italic tracking-tight">
              ✨ Discover Magic
            </h2>
            <p className="text-[#2C2C2C] text-base sm:text-xl font-normal mb-5 font-sans">
              Explore our magical collection of crackers.
            </p>
            {/* Golden Divider (80px wide) */}
            <div className="w-[80px] h-1 bg-[#FFB300] mx-auto rounded-full shadow-sm shadow-amber-400/50"></div>
          </div>

          {/* Category Banners - 6 items with Alternating Alignment & Custom Tints */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {categoryBanners.map((cat, index) => {
              const isRight = cat.alignment === 'right';
              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8, boxShadow: '0 12px 30px rgba(255, 179, 0, 0.25)' }}
                  style={{ backgroundColor: cat.tint }}
                  className={`rounded-2xl p-5 sm:px-8 sm:py-6 border border-amber-300/40 shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all duration-300 flex items-center justify-between gap-4 ${isRight ? 'md:translate-y-4' : ''
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-4xl sm:text-[2.5rem] filter drop-shadow-md flex-shrink-0">
                      {cat.emoji}
                    </span>
                    <div className="text-left">
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-[#B71C1C] leading-snug">
                        {cat.name}
                      </h3>
                      <p className="font-sans text-xs sm:text-sm text-[#666666] font-normal mt-0.5">
                        {cat.description}
                      </p>
                    </div>
                  </div>

                  <Link to={cat.path} className="flex-shrink-0">
                    <button className="border-2 border-[#FFB300] text-[#B71C1C] hover:bg-[#FFB300] hover:text-gray-900 font-bold text-xs sm:text-sm px-4 sm:px-5 py-1.5 sm:py-2 rounded-full transition-all duration-300 shadow-sm">
                      Shop Now
                    </button>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Best Selling Crackers - OPTION 1: "The Floating Cracker Bazaar" */}
      <section id="collection" className="py-24 px-4 bg-gradient-to-b from-[#fffbeb] via-[#fef3c7]/70 to-[#fff8f0] relative overflow-hidden">
        {/* Animated Rangoli Watermark SVG Background */}
        <div className="absolute top-10 -right-20 opacity-10 animate-[spin_60s_linear_infinite] pointer-events-none">
          <svg className="w-[500px] h-[500px] text-amber-600 fill-current" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2" />
            <polygon points="50,5 63,35 95,50 63,65 50,95 37,65 5,50 37,35" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="0.8" />
            <polygon points="50,20 58,40 80,50 58,60 50,80 42,60 20,50 42,40" fill="currentColor" />
          </svg>
        </div>
        <div className="absolute -bottom-20 -left-20 opacity-10 animate-[spin_80s_linear_infinite_reverse] pointer-events-none">
          <svg className="w-[600px] h-[600px] text-amber-700 fill-current" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <polygon points="50,5 63,35 95,50 63,65 50,95 37,65 5,50 37,35" fill="none" stroke="currentColor" strokeWidth="1" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Title Header with Scroll Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end mb-8 sm:mb-12">
            <div className="text-center sm:text-left mb-4 sm:mb-0">
              <span className="text-amber-700 font-extrabold uppercase tracking-widest text-[10px] sm:text-xs bg-amber-200/80 px-4 py-1.5 rounded-full border border-amber-300/80 shadow-sm inline-block mb-2">
                🔥 Floating Cracker Bazaar
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-extrabold text-[#78350f] drop-shadow-sm">
                Best Sellers
              </h2>
              <p className="text-amber-900/80 text-sm sm:text-base md:text-lg font-medium mt-1">
                Curated favorites floating on a festive stage — scroll to explore all.
              </p>
            </div>

            {/* Scroll Navigation Buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => scrollBestSellers('left')}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-amber-200/80 hover:bg-amber-400 text-amber-950 flex items-center justify-center shadow-md hover:shadow-lg transition-all border border-amber-300 active:scale-95"
                title="Scroll Left"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <button
                onClick={() => scrollBestSellers('right')}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-amber-200/80 hover:bg-amber-400 text-amber-950 flex items-center justify-center shadow-md hover:shadow-lg transition-all border border-amber-300 active:scale-95"
                title="Scroll Right"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>

          {/* Single Row Horizontal Auto-Scroll Container (4 cards visible per row on desktop) */}
          <div
            ref={bestSellersRef}
            onMouseEnter={() => setIsBestSellersHovered(true)}
            onMouseLeave={() => setIsBestSellersHovered(false)}
            className="flex overflow-x-auto gap-4 sm:gap-6 items-stretch pb-6 pt-2 snap-x snap-mandatory scroll-smooth no-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {bestSellers.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="flex-none w-[270px] sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] snap-start relative rounded-3xl p-4 sm:p-6 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#FFF8E7] via-[#FFF8E7] to-[#FEF08A]/30 border border-amber-300/60 shadow-md hover:shadow-xl transition-all duration-500 overflow-hidden flex flex-col justify-between group"
              >
                {/* Diagonal Red Ribbon Badge */}
                <div className="absolute top-5 -left-10 bg-gradient-to-r from-[#B71C1C] via-red-600 to-[#B71C1C] text-amber-300 py-1 px-12 transform -rotate-45 font-extrabold shadow-sm z-20 text-[10px] sm:text-xs tracking-wider border-y border-amber-300 flex items-center justify-center gap-1">
                  <span>⭐</span> Best Seller
                </div>

                {/* Image Area: ~65% with golden circular halo frame */}
                <div className="h-44 sm:h-52 w-full flex items-center justify-center pt-2 mb-3 relative z-10">
                  <div className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-full p-1.5 bg-gradient-to-tr from-amber-400 via-yellow-200 to-amber-500 shadow-md flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                    <div className="w-full h-full rounded-full overflow-hidden border-2 border-white bg-white">
                      <img
                        src={product.img}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                  </div>
                </div>

                {/* Product Info Section */}
                <div className="flex flex-col items-center text-center z-10">
                  {/* Product Name in Deep Crimson (#B71C1C) Serif with Diya icon */}
                  <h3 className="font-serif text-base sm:text-lg md:text-xl font-bold text-[#B71C1C] flex items-center justify-center gap-1.5 leading-snug">
                    <span>🪔</span>
                    <span>{product.name}</span>
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Explore Our Products Common Button */}
          <div className="mt-12 text-center flex justify-center">
            <Link to="/products">
              <button className="bg-[#fb923c] hover:bg-[#f97316] text-white font-extrabold font-sans text-sm sm:text-base md:text-lg px-8 py-3 sm:py-3.5 rounded-full shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl inline-block tracking-wide">
                Explore Our Products
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Promotional Banner */}
      <section
        className="relative py-10 md:py-14 min-h-[320px] flex items-center justify-center bg-cover bg-center bg-fixed overflow-hidden"
        style={{ backgroundImage: "url('https://res.cloudinary.com/vf0fqhwo/image/upload/v1785307516/bg_banner_q4whkz.avif')" }}
      >
        <div className="absolute inset-0 bg-black/60 md:bg-black/40 backdrop-blur-[3px]"></div> {/* Blurred dark overlay for text readability */}
        <div className="relative z-10 max-w-7xl w-full mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">

          {/* Left Side: Text Content */}
          <div className="text-center flex flex-col items-center justify-center">
            <h2 className="text-3xl md:text-5xl font-sans font-extrabold text-[#ffb300] mb-3 drop-shadow-md">
              Karuppa Crackers
            </h2>
            <p className="text-white text-base md:text-lg font-medium mb-6 max-w-lg leading-relaxed drop-shadow-md">
              To make your Diwali shopping even more delightful, we're offering exclusive discounts and combo deals on our crackers.
            </p>
            <button className="bg-[#ffb300] hover:bg-[#e6a100] text-gray-900 font-extrabold text-base px-8 py-2.5 rounded-full shadow-lg hover:-translate-y-1 transition-all">
              Shop Now
            </button>
          </div>

          {/* Right Side: Graphic */}
          <div className="flex justify-center items-center mt-4 md:mt-0">
            <img
              src="https://res.cloudinary.com/vf0fqhwo/image/upload/v1785308111/BG_Enjoy_eyyg8z.png"
              alt="Enjoy Diwali Graphic"
              className="w-full max-w-[240px] md:max-w-[300px] object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </section>

      {/* NEW Features Section */}
      <section
        className="relative py-20 bg-cover bg-center"
        style={{ backgroundImage: "url('https://res.cloudinary.com/vf0fqhwo/image/upload/v1785305135/crackersbg_jen1me.webp')" }}
      >
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="text-center mb-10 sm:mb-16 px-2">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-extrabold text-[#B71C1C] mb-4 leading-snug drop-shadow-sm">
              Festival celebration with <br className="hidden sm:block" />
              <span>Karuppa Crackers</span>
            </h2>
            <div className="w-[80px] h-1 bg-[#FFB300] mx-auto rounded-full shadow-sm shadow-amber-400/50"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Left Features */}
            <div className="flex flex-col gap-16">
              <div className="text-center md:text-right">
                <div className="flex justify-center md:justify-end mb-4">
                  <div className="bg-[#ffd9c2] p-4 rounded-full shadow-md border-2 border-white">
                    <span className="text-4xl">🏅</span>
                  </div>
                </div>
                <h3 className="text-xl font-extrabold text-[#c00000] mb-2 font-sans">Quality</h3>
                <p className="text-gray-800 text-sm font-medium px-4 md:px-0 md:pl-8">Quality & innovation are the key behind our success</p>
              </div>
              <div className="text-center md:text-right">
                <div className="flex justify-center md:justify-end mb-4">
                  <div className="bg-[#dcfce7] p-4 rounded-full shadow-md border-2 border-white">
                    <span className="text-4xl">🛡️</span>
                  </div>
                </div>
                <h3 className="text-xl font-extrabold text-[#c00000] mb-2 font-sans">Safe to Use</h3>
                <p className="text-gray-800 text-sm font-medium px-4 md:px-0 md:pl-8">Crackers we offer are safe & are made from fine quality raw materials</p>
              </div>
            </div>

            {/* Center Image */}
            <div className="flex justify-center items-center my-6 md:my-0">
              <img
                src="https://res.cloudinary.com/vf0fqhwo/image/upload/v1785305773/Diwali_Crackers-removebg-preview_t0blaz.png"
                alt="Diwali Gifts and Crackers"
                className="w-full max-w-[240px] md:max-w-none h-auto object-contain drop-shadow-xl hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Right Features */}
            <div className="flex flex-col gap-16">
              <div className="text-center md:text-left">
                <div className="flex justify-center md:justify-start mb-4">
                  <div className="bg-[#fce7f3] p-4 rounded-full shadow-md border-2 border-white">
                    <span className="text-4xl">🏷️</span>
                  </div>
                </div>
                <h3 className="text-xl font-extrabold text-[#c00000] mb-2 font-sans">Genuine Price</h3>
                <p className="text-gray-800 text-sm font-medium px-4 md:px-0 md:pr-8">Quality products at economic price is the main motto for us</p>
              </div>
              <div className="text-center md:text-left">
                <div className="flex justify-center md:justify-start mb-4">
                  <div className="bg-[#fef08a] p-4 rounded-full shadow-md border-2 border-white">
                    <span className="text-4xl">⭐</span>
                  </div>
                </div>
                <h3 className="text-xl font-extrabold text-[#c00000] mb-2 font-sans">Customer Satisfaction</h3>
                <p className="text-gray-800 text-sm font-medium px-4 md:px-0 md:pr-8">Our quality and timely delivery has attracted customers easily</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🎇 DEEPAVALI MEGA SALE SECTION – GRAND OFFER BANNER */}
      <section className="relative pt-20 pb-28 px-4 bg-gradient-to-br from-[#c00000] via-[#d32f2f] to-[#ffb300] overflow-hidden">
        {/* Floating Sparkles & Particles Background */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.8)_0,transparent_100%)]"></div>
        <div className="absolute top-10 left-10 text-xl animate-pulse pointer-events-none">✨</div>
        <div className="absolute top-20 right-16 text-2xl animate-bounce pointer-events-none">🌟</div>
        <div className="absolute bottom-24 left-1/4 text-xl animate-pulse pointer-events-none">✨</div>
        <div className="absolute bottom-20 right-1/3 text-2xl animate-bounce pointer-events-none">🎆</div>

        {/* 1. TOP-LEFT BADGE */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-8 z-20">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.5 }}
            className="bg-[#FFB300] text-[#B71C1C] font-extrabold text-xs sm:text-sm px-4 sm:px-5 py-1.5 rounded-full shadow-lg border border-amber-200 flex items-center gap-1.5 tracking-wider"
          >
            <span>🎇</span>
            <span>LIMITED TIME OFFER</span>
          </motion.div>
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto pt-6 sm:pt-4">
          {/* 2. MAIN HEADLINE */}
          <motion.h2
            initial={{ y: -20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-5xl md:text-[3.2rem] font-serif font-extrabold text-white mb-3 italic leading-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
          >
            🎆 Deepavali Mega Sale!
          </motion.h2>

          {/* 3. SUB-HEADLINE */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <span className="bg-black/20 backdrop-blur-md border border-white/30 text-white font-sans font-bold text-base sm:text-xl px-6 sm:px-8 py-2.5 rounded-full inline-block shadow-inner">
              Flat 20% off on all items!
            </span>
          </motion.div>

          {/* 4. COUNTDOWN TIMER */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-2 sm:gap-4 max-w-lg mx-auto mb-10"
          >
            {[
              { val: '12', label: 'Days' },
              { val: '45', label: 'Hours' },
              { val: '30', label: 'Mins' },
              { val: '15', label: 'Secs' }
            ].map((item, idx, arr) => (
              <div key={idx} className="flex items-center gap-2 sm:gap-4">
                <div className="bg-white rounded-2xl px-4 py-3 sm:px-6 sm:py-4 shadow-xl hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 min-w-[70px] sm:min-w-[95px] flex flex-col items-center justify-center">
                  <span className="font-serif font-extrabold text-[#B71C1C] text-2xl sm:text-4xl md:text-[2.8rem] leading-none">
                    {item.val}
                  </span>
                  <span className="font-sans text-[10px] sm:text-xs font-semibold text-[#666666] uppercase tracking-widest mt-1">
                    {item.label}
                  </span>
                </div>
                {idx < arr.length - 1 && (
                  <span className="font-extrabold text-2xl sm:text-3xl text-[#FFB300] drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                    :
                  </span>
                )}
              </div>
            ))}
          </motion.div>

          {/* 5. CTA BUTTON */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <a href="#collection">
              <button className="bg-white hover:bg-[#FFB300] text-[#B71C1C] hover:text-white font-sans font-extrabold text-base sm:text-lg px-8 sm:px-12 py-3.5 sm:py-4 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
                🎁 Claim Offer Now →
              </button>
            </a>
          </motion.div>
        </div>

        {/* 7. DECORATIVE SVG BOTTOM WAVE DIVIDER */}
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none z-10 pointer-events-none">
          <svg className="relative block w-full h-10 sm:h-14 text-[#FFF8E7]" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.94,130.83,121.2,200.75,108.6,241.6,101.23,281.82,82.44,321.39,56.44Z" fill="currentColor"></path>
          </svg>
        </div>
      </section>

      {/* 5. Standalone Shop Statistics Section */}
      <section className="py-16 sm:py-20 bg-[#FFF8E7] relative z-20">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 text-center">
          <div className="bg-white/80 rounded-2xl p-6 shadow-sm border border-amber-200/60">
            <div className="text-5xl md:text-6xl font-serif font-bold text-[#FFB300] mb-2 drop-shadow-sm">500+</div>
            <div className="text-lg md:text-xl text-[#78350f] font-bold font-sans">Varieties of Crackers</div>
          </div>
          <div className="bg-white/80 rounded-2xl p-6 shadow-sm border border-amber-200/60">
            <div className="text-5xl md:text-6xl font-serif font-bold text-[#FFB300] mb-2 drop-shadow-sm">50K+</div>
            <div className="text-lg md:text-xl text-[#78350f] font-bold font-sans">Happy Customers</div>
          </div>
          <div className="bg-white/80 rounded-2xl p-6 shadow-sm border border-amber-200/60">
            <div className="text-5xl md:text-6xl font-serif font-bold text-[#FFB300] mb-2 flex items-center justify-center gap-1 drop-shadow-sm">
              4.9<Star className="w-8 h-8 text-[#FFB300] fill-current" />
            </div>
            <div className="text-lg md:text-xl text-[#78350f] font-bold font-sans">Average Rating</div>
          </div>
        </div>
      </section>

      {/* 6. FAQ Accordion */}
      <section className="py-20 px-4 bg-[#FFF8E7] relative z-20 border-t border-amber-100">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#B71C1C] mb-4 drop-shadow-sm">
              Common Questions
            </h2>
            <div className="w-[80px] h-1 bg-[#FFB300] mx-auto rounded-full shadow-sm shadow-amber-400/50"></div>
          </div>

          <div className="space-y-4">
            {[
              { q: "Are your crackers eco-friendly?", a: "We offer a wide range of green and eco-friendly crackers that produce 30% less smoke and are well within the permissible decibel limits." },
              { q: "Do you deliver Pan-India?", a: "Currently, we deliver across 15+ states in India. Please enter your pincode on the checkout page to verify delivery availability." },
              { q: "Are there any bulk discounts?", a: "Yes, we offer special wholesale pricing for corporate orders and bulk purchases above ₹20,000. Contact our team for details." }
            ].map((faq, index) => (
              <div key={index} className="bg-white/80 rounded-2xl shadow-sm border border-amber-200/60 overflow-hidden transition-all duration-300 hover:shadow-md">
                <button
                  className="w-full flex justify-between items-center p-5 sm:p-6 text-left font-bold text-base sm:text-lg text-[#78350f] hover:text-[#B71C1C] transition-colors"
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                >
                  <span className="font-sans pr-4">{faq.q}</span>
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center transition-all duration-300 shadow-sm ${activeFaq === index ? 'bg-[#B71C1C] text-white rotate-45' : 'bg-[#FFB300] text-[#B71C1C]'}`}>
                    <Plus className="w-5 h-5" />
                  </div>
                </button>
                {activeFaq === index && (
                  <div className="px-5 sm:px-6 pb-5 sm:pb-6 text-[#78350f]/80 font-medium leading-relaxed border-t border-amber-100 pt-4 font-sans text-sm sm:text-base">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
