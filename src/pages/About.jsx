import { motion } from 'framer-motion';
import { ShieldCheck, Sparkles, Heart, Globe } from 'lucide-react';

const About = () => {
  return (
    <div className="overflow-hidden">
      {/* 1. Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1543257850-8b0933c4dd24?auto=format&fit=crop&q=80&w=2000" 
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
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="w-full md:w-1/2">
            {/* Simple Horizontal Scroll Gallery Simulation */}
            <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x snap-mandatory">
              {[
                "1533230676451-92be5a049d5c",
                "1514525253161-7a46d19cd819",
                "1543257850-8b0933c4dd24"
              ].map((photoId, i) => (
                <div key={i} className="min-w-[80%] h-80 rounded-3xl overflow-hidden snap-center flex-shrink-0 shadow-warm">
                  <img 
                    src={`https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&q=80&w=600`} 
                    alt={`Historical Photo ${i}`} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <h2 className="text-4xl font-serif font-bold text-charcoal mb-6">Our Journey</h2>
            <p className="text-lg text-brown leading-relaxed mb-6">
              Vinayaka Crackers was born from a dream to make every festival brighter. From a small stall in Chromepet to a trusted name across India, we source directly from Sivakasi’s finest.
            </p>
            <p className="text-lg text-brown leading-relaxed">
              We prioritize safety, quality, and the bright smiles of our customers. Our legacy is built on the joy we bring to millions of households during their most precious celebrations.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Vision & Mission (Asymmetrical Cards) */}
      <section className="py-20 px-4 bg-white relative">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 justify-center items-center">
          <motion.div 
            whileHover={{ y: -10 }}
            className="w-full md:w-5/12 bg-cream-light border-2 border-gold rounded-[2rem] p-10 shadow-warm md:-mt-16 z-10"
          >
            <Sparkles className="w-12 h-12 text-gold mb-6" />
            <h3 className="text-3xl font-serif font-bold text-charcoal mb-4">Vision</h3>
            <p className="text-xl text-brown leading-relaxed">
              To be India’s most loved fireworks brand, lighting up every celebration with unmatched brilliance and joy.
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -10 }}
            className="w-full md:w-5/12 bg-[#FFF3E0] rounded-[2rem] p-10 shadow-warm md:mt-16"
          >
            <Globe className="w-12 h-12 text-saffron mb-6" />
            <h3 className="text-3xl font-serif font-bold text-charcoal mb-4">Mission</h3>
            <p className="text-xl text-brown leading-relaxed">
              Deliver unparalleled quality, safety, and eco-friendly awareness, ensuring a spectacular yet responsible festive experience.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 4. Why Choose Us (Constellation Nodes) */}
      <section className="py-24 px-4 bg-cream-light relative overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h2 className="text-4xl font-serif font-bold text-charcoal mb-16">Why Vinayaka?</h2>
          
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
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 flex flex-wrap justify-around gap-8 text-center">
          <motion.div whileHover={{ scale: 1.1 }}>
            <div className="text-5xl font-bold text-saffron mb-2">1,000+</div>
            <div className="text-xl text-brown font-medium">SKUs</div>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }}>
            <div className="text-5xl font-bold text-saffron mb-2">15+</div>
            <div className="text-xl text-brown font-medium">States Delivered</div>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }}>
            <div className="text-5xl font-bold text-saffron mb-2">100+</div>
            <div className="text-xl text-brown font-medium">Corporate Clients</div>
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
                <p className="text-2xl text-brown font-medium">Chromepet, Chennai</p>
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
