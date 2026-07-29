import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, X } from 'lucide-react';

const Gallery = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [selectedImg, setSelectedImg] = useState(null);

  const tabs = ['All', 'Shop', 'Festivals', 'Products', 'Customers'];

  const images = [
    { id: 1, type: 'Festivals', src: "https://placehold.co/600x400/D32F2F/FFFFFF?text=Festival" },
    { id: 2, type: 'Shop', src: "https://placehold.co/400x400/FFB300/FFFFFF?text=Shop" },
    { id: 3, type: 'Products', src: "https://placehold.co/600x600/FFEAA7/D32F2F?text=Product" },
    { id: 4, type: 'Customers', src: "https://placehold.co/400x600/2E7D32/FFFFFF?text=Customer" },
    { id: 5, type: 'Products', src: "https://placehold.co/600x400/00BCD4/FFFFFF?text=Product+2" },
    { id: 6, type: 'Festivals', src: "https://placehold.co/400x400/FF8F00/FFFFFF?text=Festival+2" },
    { id: 7, type: 'Shop', src: "https://placehold.co/600x800/1E1E1E/FFFFFF?text=Shop+2" },
    { id: 8, type: 'Customers', src: "https://placehold.co/400x400/D32F2F/FFFFFF?text=Customer+2" },
  ];

  const filteredImages = activeTab === 'All' ? images : images.filter(img => img.type === activeTab);

  return (
    <div className="bg-white min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-red mb-6">Celebrations Captured in Light</h1>
          
          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-full font-bold transition-colors ${
                  activeTab === tab ? 'bg-red text-white' : 'bg-cream-light text-brown hover:bg-gold/20'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Masonry Grid (Simulated with columns) */}
        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          <AnimatePresence>
            {filteredImages.map((img) => (
              <motion.div
                key={img.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="relative group overflow-hidden rounded-2xl cursor-pointer break-inside-avoid shadow-warm"
                onClick={() => setSelectedImg(img.src)}
              >
                <img src={img.src} alt={img.type} className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-white/20 group-hover:bg-white/40 transition-colors opacity-0 group-hover:opacity-100 flex items-center justify-center backdrop-blur-sm">
                  <div className="w-16 h-16 bg-gold text-white rounded-full flex items-center justify-center shadow-lg transform scale-50 group-hover:scale-100 transition-transform">
                    <Maximize2 className="w-8 h-8" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-white flex items-center justify-center flex-col"
          >
            <button 
              onClick={() => setSelectedImg(null)}
              className="absolute top-8 right-8 text-charcoal hover:text-red transition-colors z-[70] bg-cream-light p-3 rounded-full"
            >
              <X className="w-8 h-8" />
            </button>
            
            <motion.img 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              src={selectedImg} 
              alt="Expanded" 
              className="max-w-[90vw] max-h-[80vh] object-contain shadow-2xl border-8 border-cream-light rounded-xl"
            />
            
            <div className="mt-8 flex gap-4 overflow-x-auto max-w-full px-4 hide-scrollbar">
              {filteredImages.map((img) => (
                <img 
                  key={img.id}
                  src={img.src} 
                  onClick={() => setSelectedImg(img.src)}
                  className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-4 ${selectedImg === img.src ? 'border-gold' : 'border-transparent'}`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
