import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, X, Sparkles, Image as ImageIcon } from 'lucide-react';
import { subscribeGallery } from '../services/firebaseService';

const DEFAULT_GALLERY_IMAGES = [
  { id: 'DEF-1', type: 'Festivals', category: 'Festivals', title: 'Grand Diwali Celebrations', src: "https://res.cloudinary.com/vf0fqhwo/image/upload/v1785323861/Sample_Crackers_rfzenl.jpg", span: "md:col-span-2 md:row-span-2" },
  { id: 'DEF-2', type: 'Shop & Outlet', category: 'Shop & Outlet', title: 'Sivakasi Direct Outlet', src: "https://res.cloudinary.com/vf0fqhwo/image/upload/v1785323861/Sample_Crackers_rfzenl.jpg", span: "md:col-span-1 md:row-span-1" },
  { id: 'DEF-3', type: 'Products Showcase', category: 'Products Showcase', title: 'Premium Sky Shots Lineup', src: "https://res.cloudinary.com/vf0fqhwo/image/upload/v1785323861/Sample_Crackers_rfzenl.jpg", span: "md:col-span-1 md:row-span-1" },
  { id: 'DEF-4', type: 'Happy Customers', category: 'Happy Customers', title: 'Customer Festive Delight', src: "https://res.cloudinary.com/vf0fqhwo/image/upload/v1785323861/Sample_Crackers_rfzenl.jpg", span: "md:col-span-1 md:row-span-2" },
  { id: 'DEF-5', type: 'Sky Shots & Aerials', category: 'Sky Shots & Aerials', title: 'Midnight 120 Shots Night Sky', src: "https://res.cloudinary.com/vf0fqhwo/image/upload/v1785323861/Sample_Crackers_rfzenl.jpg", span: "md:col-span-2 md:row-span-1" },
  { id: 'DEF-6', type: 'Festivals', category: 'Festivals', title: 'Flower Pots & Ground Chakkars', src: "https://res.cloudinary.com/vf0fqhwo/image/upload/v1785323861/Sample_Crackers_rfzenl.jpg", span: "md:col-span-1 md:row-span-1" },
  { id: 'DEF-7', type: 'Shop & Outlet', category: 'Shop & Outlet', title: 'Wholesale Dispatch Hub', src: "https://res.cloudinary.com/vf0fqhwo/image/upload/v1785323861/Sample_Crackers_rfzenl.jpg", span: "md:col-span-1 md:row-span-2" },
  { id: 'DEF-8', type: 'Happy Customers', category: 'Happy Customers', title: 'Diwali Family Gifting Memories', src: "https://res.cloudinary.com/vf0fqhwo/image/upload/v1785323861/Sample_Crackers_rfzenl.jpg", span: "md:col-span-1 md:row-span-1" },
];

const Gallery = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [selectedImg, setSelectedImg] = useState(null);
  const [firestoreGallery, setFirestoreGallery] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Subscribe to live gallery uploads from Admin
  useEffect(() => {
    const unsubscribe = subscribeGallery((items) => {
      setFirestoreGallery(items || []);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const activeImages = firestoreGallery.length > 0 ? firestoreGallery.map((item, idx) => ({
    id: item.id || `GAL-${idx+1}`,
    title: item.title || 'Diwali Fireworks Celebration',
    type: item.category || item.type || 'Festivals',
    category: item.category || item.type || 'Festivals',
    src: item.imageUrl || item.src || "https://res.cloudinary.com/vf0fqhwo/image/upload/v1785323861/Sample_Crackers_rfzenl.jpg",
    span: item.span || (idx % 5 === 0 ? "md:col-span-2 md:row-span-2" : (idx % 3 === 0 ? "md:col-span-1 md:row-span-2" : "md:col-span-1 md:row-span-1")),
    description: item.description || ''
  })) : DEFAULT_GALLERY_IMAGES;

  // Build dynamic categories list
  const uniqueCategories = ['All', ...Array.from(new Set(activeImages.map(img => img.category || img.type).filter(Boolean)))];

  const filteredImages = activeTab === 'All' ? activeImages : activeImages.filter(img => (img.category === activeTab || img.type === activeTab));

  return (
    <div className="bg-cream-light min-h-screen pt-32 pb-24 relative overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gold/30 text-gold text-sm font-bold tracking-widest uppercase mb-6 shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>Visual Story</span>
            <Sparkles className="w-4 h-4" />
          </motion.div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-black text-charcoal mb-8 drop-shadow-sm leading-tight">
            Celebrations Captured <br className="hidden md:block"/> in <span className="text-transparent bg-clip-text bg-gradient-to-r from-red to-[#8B1E1E]">Light</span>
          </h1>
          
          {/* Filter Tabs */}
          <div className="flex gap-3 md:gap-5 mt-10 pb-4 overflow-x-auto hide-scrollbar md:justify-center px-2 sm:px-0">
            {uniqueCategories.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-3 rounded-full font-bold text-sm md:text-base transition-all duration-300 shadow-md whitespace-nowrap shrink-0 cursor-pointer ${
                  activeTab === tab 
                    ? 'bg-gradient-to-tr from-[#D32F2F] to-[#8B1E1E] text-white shadow-[0_4px_20px_rgba(211,47,47,0.4)] scale-105' 
                    : 'bg-white text-brown hover:bg-gold/10 hover:text-charcoal hover:scale-105'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* CSS Grid (Bento Box Style Masonry) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 auto-rows-[250px]">
          <AnimatePresence mode="popLayout">
            {filteredImages.map((img) => (
              <motion.div
                layout
                key={img.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4, type: "spring", bounce: 0.2 }}
                className={`relative group overflow-hidden rounded-[2rem] cursor-pointer shadow-warm border border-white/50 bg-white ${img.span}`}
                onClick={() => setSelectedImg(img.src)}
              >
                <img 
                  src={img.src} 
                  alt={img.title || img.type} 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" 
                />
                
                {/* Premium Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6 sm:p-8">
                  <div className="translate-y-6 group-hover:translate-y-0 transition-transform duration-500 ease-out flex items-center justify-between">
                    <div>
                      <span className="text-amber-300 font-bold text-xs tracking-wider uppercase drop-shadow-md block mb-1">
                        {img.type}
                      </span>
                      <h3 className="text-white font-serif font-black text-base sm:text-lg leading-tight">
                        {img.title || 'Diwali Fireworks'}
                      </h3>
                    </div>
                    <div className="w-11 h-11 bg-gold/90 backdrop-blur text-charcoal rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,179,0,0.5)] transform scale-75 group-hover:scale-100 transition-transform duration-500 shrink-0 ml-3">
                      <Maximize2 className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Premium Lightbox */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center flex-col p-4 md:p-10"
          >
            {/* Close Button */}
            <button 
              onClick={() => setSelectedImg(null)}
              className="absolute top-6 right-6 md:top-10 md:right-10 text-white/50 hover:text-gold transition-colors z-[110] bg-white/10 hover:bg-white/20 p-4 rounded-full backdrop-blur-md"
            >
              <X className="w-8 h-8" />
            </button>
            
            {/* Main Image */}
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", bounce: 0.3 }}
              className="relative w-full max-w-6xl flex justify-center items-center flex-1"
            >
              <img 
                src={selectedImg} 
                alt="Expanded" 
                className="max-w-full max-h-[75vh] object-contain shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 rounded-xl"
              />
            </motion.div>
            
            {/* Thumbnail Strip */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8 flex gap-4 overflow-x-auto max-w-full pb-4 px-4 hide-scrollbar justify-start md:justify-center w-full"
            >
              {filteredImages.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImg(img.src)}
                  className={`relative shrink-0 rounded-xl overflow-hidden transition-all duration-300 w-20 h-20 md:w-24 md:h-24 ${
                    selectedImg === img.src 
                      ? 'border-4 border-gold scale-110 shadow-[0_0_20px_rgba(255,179,0,0.4)] opacity-100' 
                      : 'border-2 border-transparent opacity-50 hover:opacity-100 hover:scale-105'
                  }`}
                >
                  <img src={img.src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
