import { motion } from 'framer-motion';
import { ShieldCheck, Sparkles, Heart, Globe, Package, Store } from 'lucide-react';

const About = () => {
  return (
    <div className="overflow-hidden">
      {/* 1. Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://res.cloudinary.com/vf0fqhwo/image/upload/v1785319726/About_Banner_e6xug6.jpg"
            alt="Festival Celebration"
            className="w-full h-full object-cover"
          />
        </div>
        {/* Bright Gold-to-Cream diagonal gradient overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-gold/80 to-cream-light/90 mix-blend-overlay"></div>
        <div className="absolute inset-0 z-10 bg-gradient-to-tr from-gold/40 to-cream-light/60"></div>

        <div className="relative z-20 text-center px-4">
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-serif font-bold text-red drop-shadow-md mb-4"
          >
            Spreading Joy Since 1995
          </motion.h1>
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-2xl text-brown font-medium max-w-2xl mx-auto drop-shadow-sm"
          >
            The Story of Light
          </motion.p>
        </div>
      </section>

      {/* 2. Company Story (Split Screen) */}
      <section className="py-24 px-4 overflow-hidden bg-[#fffdf5]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 md:gap-20">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="w-full md:w-1/2 relative"
          >
            {/* Decorative background box */}
            <div className="absolute inset-0 bg-gold/30 rounded-[2.5rem] transform translate-x-4 translate-y-4 -z-10"></div>
            <div className="w-full h-[450px] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-[#FFD700]/30 relative z-10 bg-white p-6 flex items-center justify-center">
              <img 
                src="https://res.cloudinary.com/vf0fqhwo/image/upload/v1786363324/logo_q7lezq.jpg" 
                alt="Karuppan Crackers Logo" 
                className="w-full h-full object-contain transform hover:scale-105 transition-transform duration-700"
              />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-4 border border-gray-100 z-20">
              <div className="w-14 h-14 bg-red/10 rounded-full flex items-center justify-center text-red font-extrabold text-2xl">
                30+
              </div>
              <div className="text-sm font-bold text-gray-800 leading-tight">
                Years of <br/> Excellence
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full md:w-1/2"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/15 text-[#b38a00] font-bold text-sm mb-6 shadow-sm">
              <Sparkles className="w-4 h-4" />
              <span>Since 1995</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#B71C1C] mb-6 leading-tight">
              Our Journey of <br className="hidden md:block"/> Spreading Joy
            </h2>
            <div className="relative">
              {/* Decorative quote mark */}
              <div className="absolute -top-8 -left-4 text-7xl text-gold/20 font-serif leading-none pointer-events-none">"</div>
              <p className="text-lg text-brown leading-relaxed mb-6 relative z-10 pl-5 border-l-2 border-gold/40">
                Karuppan Crackers was born from a dream to make every festival brighter. From a small stall in Sivakasi to a trusted name across India, we source directly from Sivakasi’s finest.
              </p>
            </div>
            <p className="text-lg text-brown leading-relaxed pl-5">
              We prioritize safety, quality, and the bright smiles of our customers. Our legacy is built on the joy we bring to millions of households during their most precious celebrations.
            </p>
            
            <div className="mt-10 pt-8 border-t border-gray-200 flex flex-wrap items-center gap-8">
              <div className="flex flex-col">
                <span className="text-3xl font-extrabold text-red drop-shadow-sm">100%</span>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Quality Assured</span>
              </div>
              <div className="hidden sm:block w-px h-12 bg-gray-300"></div>
              <div className="flex flex-col">
                <span className="text-3xl font-extrabold text-red drop-shadow-sm">Direct</span>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">From Sivakasi</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. Vision & Mission (Premium Glassmorphism Cards) */}
      <section className="py-24 px-4 bg-white relative overflow-hidden">
        {/* Subtle dot pattern background */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(#e5e7eb_2px,transparent_2px)] [background-size:24px_24px] opacity-60"></div>
        
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10 justify-center items-center relative z-10">
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            whileHover={{ y: -12, scale: 1.02 }}
            className="w-full md:w-5/12 bg-white/90 backdrop-blur-xl border border-gold/40 rounded-[2.5rem] p-12 shadow-[0_15px_50px_-12px_rgba(255,215,0,0.3)] md:-mt-16 group transition-all duration-300"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-gold/20 to-gold/5 rounded-[1.25rem] flex items-center justify-center mb-8 group-hover:rotate-6 transition-transform duration-500 shadow-inner">
              <Package className="w-10 h-10 text-[#c29b1d]" />
            </div>
            <h3 className="text-4xl font-serif font-bold text-[#B71C1C] mb-4">Wholesale</h3>
            <div className="w-16 h-1.5 bg-gradient-to-r from-gold to-gold/20 rounded-full mb-6"></div>
            <p className="text-xl text-gray-700 leading-relaxed font-medium">
              We supply <span className="text-[#c29b1d] font-bold">premium-quality fireworks in bulk</span> at competitive wholesale prices. With a wide product range, reliable service, and timely delivery, we help retailers and distributors meet their customers' festive needs.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ y: -12, scale: 1.02 }}
            className="w-full md:w-5/12 bg-white/90 backdrop-blur-xl border border-saffron/40 rounded-[2.5rem] p-12 shadow-[0_15px_50px_-12px_rgba(230,81,0,0.25)] md:mt-16 group transition-all duration-300"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-saffron/20 to-saffron/5 rounded-[1.25rem] flex items-center justify-center mb-8 group-hover:-rotate-6 transition-transform duration-500 shadow-inner">
              <Store className="w-10 h-10 text-saffron" />
            </div>
            <h3 className="text-4xl font-serif font-bold text-[#B71C1C] mb-4">Retail</h3>
            <div className="w-16 h-1.5 bg-gradient-to-r from-saffron to-saffron/20 rounded-full mb-6"></div>
            <p className="text-xl text-gray-700 leading-relaxed font-medium">
              We offer a complete collection of high-quality fireworks for individual customers at <span className="text-saffron font-bold">affordable prices</span>. Enjoy a safe, convenient, and memorable shopping experience with products perfect for every celebration.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 4. Why Choose Us (Constellation Nodes) */}
      <section className="py-24 px-4 bg-cream-light relative overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h2 className="text-4xl font-serif font-bold text-charcoal mb-16">Why Karuppan?</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { title: "Quality", desc: "Sourced from Sivakasi's finest.", color: "bg-red" },
              { title: "Safety", desc: "100% licensed and certified.", color: "bg-green" },
              { title: "Variety", desc: "500+ unique crackers.", color: "bg-turquoise" },
              { title: "Trust", desc: "30+ years of legacy.", color: "bg-gold" }
            ].map((node, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className={`w-20 h-20 rounded-full ${node.color} flex items-center justify-center mb-6 shadow-warm relative`}>
                  <ShieldCheck className="w-10 h-10 text-white" />
                  <div className="absolute -inset-2 border-2 border-dashed border-gold/50 rounded-full animate-spin-slow"></div>
                </div>
                <h4 className="text-2xl font-bold text-charcoal mb-2">{node.title}</h4>
                <p className="text-brown">{node.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Business Highlights (Floating Stats) */}
      <section className="py-12 relative overflow-hidden">
        {/* Deep rich background gradient & pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#B71C1C] via-[#901010] to-[#600000] z-0"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4=')] opacity-30 z-0 mix-blend-overlay"></div>
        
        <div className="max-w-6xl mx-auto px-4 flex flex-wrap justify-around gap-12 text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center group"
          >
            <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-6 border border-white/20 shadow-lg group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300">
              <Package className="w-10 h-10 text-[#d4af37]" />
            </div>
            <div className="text-4xl md:text-5xl font-extrabold text-white mb-2 drop-shadow-md">1,000+</div>
            <div className="text-sm md:text-base text-[#d4af37] font-bold uppercase tracking-[0.2em]">Unique SKUs</div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col items-center group"
          >
            <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-6 border border-white/20 shadow-lg group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300">
              <Globe className="w-10 h-10 text-[#d4af37]" />
            </div>
            <div className="text-4xl md:text-5xl font-extrabold text-white mb-2 drop-shadow-md">15+</div>
            <div className="text-sm md:text-base text-[#d4af37] font-bold uppercase tracking-[0.2em]">States Delivered</div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col items-center group"
          >
            <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-6 border border-white/20 shadow-lg group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300">
              <ShieldCheck className="w-10 h-10 text-[#d4af37]" />
            </div>
            <div className="text-4xl md:text-5xl font-extrabold text-white mb-2 drop-shadow-md">100+</div>
            <div className="text-sm md:text-base text-[#d4af37] font-bold uppercase tracking-[0.2em]">Corporate Clients</div>
          </motion.div>
        </div>
      </section>

      {/* 6. Contact Info Block */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 z-0 opacity-10 bg-saffron bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiAvPgo8L3N2Zz4=')]"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="glass-card-bright p-12 text-center shadow-glass border border-gold/50 rounded-[3rem]">
            <h2 className="text-4xl font-serif font-bold text-charcoal mb-8">Visit Our Showroom</h2>
            <div className="flex flex-col md:flex-row justify-center gap-12 text-left">
              <div>
                <h4 className="text-xl font-bold text-red mb-2">Timing</h4>
                <p className="text-2xl text-brown font-medium">10 AM – 9 PM</p>
                <p className="text-brown">Open all days of the week</p>
              </div>
              <div className="hidden md:block w-px bg-gold/30"></div>
              <div>
                <h4 className="text-xl font-bold text-red mb-2">Address</h4>
                <p className="text-2xl text-brown font-medium">Sivakasi</p>
                <p className="text-brown">No. 45, GST Road, 600044</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
