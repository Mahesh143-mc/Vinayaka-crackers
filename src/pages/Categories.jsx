import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const Categories = () => {
  const tiles = [
    { name: "Gift Boxes", img: "https://res.cloudinary.com/vf0fqhwo/image/upload/v1785323861/Sample_Crackers_rfzenl.jpg", color: "from-red to-[#8B1E1E]" },
    { name: "Fancy Crackers", img: "https://res.cloudinary.com/vf0fqhwo/image/upload/v1785323861/Sample_Crackers_rfzenl.jpg", color: "from-blue-600 to-blue-900" },
    { name: "Lakshmi Crackers", img: "https://res.cloudinary.com/vf0fqhwo/image/upload/v1785323861/Sample_Crackers_rfzenl.jpg", color: "from-gold to-yellow-600" },
    { name: "Bombs", img: "https://res.cloudinary.com/vf0fqhwo/image/upload/v1785323861/Sample_Crackers_rfzenl.jpg", color: "from-charcoal to-black" },
    { name: "Sparklers", img: "https://res.cloudinary.com/vf0fqhwo/image/upload/v1785323861/Sample_Crackers_rfzenl.jpg", color: "from-saffron to-orange-700" },
    { name: "Rockets", img: "https://res.cloudinary.com/vf0fqhwo/image/upload/v1785323861/Sample_Crackers_rfzenl.jpg", color: "from-red to-pink-700" },
    { name: "Kids Collection", img: "https://res.cloudinary.com/vf0fqhwo/image/upload/v1785323861/Sample_Crackers_rfzenl.jpg", color: "from-green to-emerald-900" },
    { name: "Flower Pots", img: "https://res.cloudinary.com/vf0fqhwo/image/upload/v1785323861/Sample_Crackers_rfzenl.jpg", color: "from-purple-600 to-purple-900" },
    { name: "Sky Shots", img: "https://res.cloudinary.com/vf0fqhwo/image/upload/v1785323861/Sample_Crackers_rfzenl.jpg", color: "from-cyan-500 to-blue-700" },
    { name: "New Arrivals", img: "https://res.cloudinary.com/vf0fqhwo/image/upload/v1785323861/Sample_Crackers_rfzenl.jpg", color: "from-gold to-yellow-700" },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#8B1E1E] flex flex-col items-center pt-32 pb-24">
      
      {/* Premium Background Textures */}
      <div className="absolute inset-0 z-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-black/40 to-transparent z-0"></div>

      {/* Header Section */}
      <div className="relative z-10 text-center mb-16 px-4">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/20 border border-gold/30 text-gold text-sm font-bold tracking-widest uppercase mb-6 backdrop-blur-sm"
        >
          <Sparkles className="w-4 h-4" />
          <span>Our Collections</span>
          <Sparkles className="w-4 h-4" />
        </motion.div>
        
        <h1 className="text-5xl md:text-7xl font-serif font-black text-white mb-6 drop-shadow-lg">
          Explore the <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-yellow-300 to-gold">Magic</span>
        </h1>
        <p className="text-xl text-cream-light font-medium max-w-2xl mx-auto drop-shadow-md">
          Discover a spectacular array of fireworks designed to make every celebration truly legendary.
        </p>
      </div>

      {/* Grid Layout */}
      <div className="relative z-10 w-full max-w-[1400px] px-6 lg:px-12 flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 xl:gap-12 w-full">
          {tiles.map((tile, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="group relative rounded-3xl overflow-hidden cursor-pointer shadow-2xl bg-[#5D1414] border-2 border-gold/20 hover:border-gold/60 transition-all duration-500 h-80"
            >
              {/* Image */}
              <img 
                src={tile.img} 
                alt={tile.name} 
                className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out" 
              />
              
              {/* Dark Overlay Gradient for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition-opacity duration-300"></div>
              
              {/* Category Color Accent Glow */}
              <div className={`absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t ${tile.color} opacity-30 mix-blend-color-dodge group-hover:opacity-60 transition-opacity duration-500`}></div>

              {/* Content Box */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="font-serif font-bold text-white text-2xl md:text-3xl mb-2 drop-shadow-lg leading-tight">
                    {tile.name}
                  </h3>
                  <div className="h-1 w-12 bg-gold rounded-full transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
    </div>
  );
};

export default Categories;
