import { motion } from 'framer-motion';

const Categories = () => {
  const tiles = [
    { name: "Gift Boxes", img: "https://placehold.co/300x300/D32F2F/FFFFFF?text=Gift+Boxes", color: "border-red" },
    { name: "Fancy Crackers", img: "https://placehold.co/300x300/00BCD4/FFFFFF?text=Fancy", color: "border-turquoise" },
    { name: "Lakshmi Crackers", img: "https://placehold.co/300x300/FFB300/FFFFFF?text=Lakshmi", color: "border-gold" },
    { name: "Bombs", img: "https://placehold.co/300x300/1E1E1E/FFFFFF?text=Bombs", color: "border-charcoal" },
    { name: "Sparklers", img: "https://placehold.co/300x300/FF8F00/FFFFFF?text=Sparklers", color: "border-saffron" },
    { name: "Rockets", img: "https://placehold.co/300x300/FFD54F/D32F2F?text=Rockets", color: "border-gold" },
    { name: "Kids Collection", img: "https://placehold.co/300x300/2E7D32/FFFFFF?text=Kids", color: "border-green" },
    { name: "Flower Pots", img: "https://placehold.co/300x300/D32F2F/FFFFFF?text=Pots", color: "border-red" },
    { name: "Sky Shots", img: "https://placehold.co/300x300/00BCD4/FFFFFF?text=Sky+Shots", color: "border-turquoise" },
    { name: "New Arrivals", img: "https://placehold.co/300x300/FFEAA7/D32F2F?text=New", color: "border-gold" },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gold/30 via-cream-light to-gold/20 flex flex-col items-center pt-32 pb-20">
      {/* Sunburst Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48ZyBmaWxsPSIjRkZCMzAwIj48cGF0aCBkPSJNNTAgMEg1MHYxMDBoLTF6Ii8+PHBhdGggZD0iTTAgNTB2LTFoMTAwdjF6Ii8+PC9nPjwvc3ZnPg==')] bg-center bg-no-repeat bg-cover"></div>

      <div className="relative z-10 text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-serif font-bold text-charcoal mb-4">Explore the World</h1>
        <p className="text-xl text-brown font-medium">Find exactly what you need to make your celebration magical.</p>
      </div>

      <div className="relative z-10 w-full max-w-7xl px-4 flex justify-center">
        <div className="flex flex-wrap justify-center gap-10 lg:gap-16">
          {tiles.map((tile, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.1, rotate: index % 2 === 0 ? 5 : -5 }}
              className="relative group cursor-pointer"
            >
              <div className={`w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-8 ${tile.color} shadow-warm relative z-20 bg-white`}>
                <img src={tile.img} alt={tile.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-white/40 group-hover:bg-transparent transition-colors duration-300"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-white/90 backdrop-blur px-4 py-2 rounded-full font-bold text-brown text-sm md:text-base shadow-sm opacity-100 group-hover:opacity-0 transition-opacity">
                    {tile.name}
                  </span>
                </div>
              </div>
              
              {/* Confetti simulation on hover */}
              <div className="absolute -inset-4 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+PGNpcmNsZSBjeD0iNSIgY3k9IjUiIHI9IjIiIGZpbGw9IiNGRkIzMDAiLz48L3N2Zz4=')] opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-spin-slow z-10 rounded-full"></div>
              
              <h3 className="mt-4 text-center font-bold text-charcoal text-lg opacity-0 group-hover:opacity-100 transition-opacity">{tile.name}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
