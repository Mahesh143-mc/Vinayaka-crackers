import { motion } from 'framer-motion';
import { Phone, MessageCircle, Mail, MapPin, Send, Sparkles, Building2, FileText } from 'lucide-react';
import { useStoreSettings } from '../context/StoreSettingsContext';

const Contact = () => {
  const { storeSettings } = useStoreSettings();

  const companyName = storeSettings?.companyName || 'Karuppa Crackers';
  const phone = storeSettings?.phone || storeSettings?.supportPhone || '8825419454';
  const whatsapp = storeSettings?.whatsapp || storeSettings?.phone || '8825419454';
  const email = storeSettings?.email || storeSettings?.supportEmail || 'chimeratechweb@gmail.com';
  const address = storeSettings?.address || '124/B, Sivakasi Main Road, Sivakasi';
  const gstNumber = storeSettings?.gstNumber || '33AAAAA0000A1Z5';

  return (
    <div className="bg-cream-light min-h-screen pt-32 pb-24 relative overflow-hidden">
      
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-gold/10 to-transparent rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16 lg:mb-24">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gold/30 text-gold text-sm font-bold tracking-widest uppercase mb-6 shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>Get in Touch with {companyName}</span>
            <Sparkles className="w-4 h-4" />
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-serif font-black text-[#8B1E1E] drop-shadow-sm leading-tight">
            We’d Love to <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-yellow-600">Hear</span> From You!
          </h1>
          <p className="mt-6 text-xl text-brown font-medium max-w-2xl mx-auto">
            Whether you have a question about our firecracker collections, need help with an order, or want wholesale enquiries, we are here for you.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 xl:gap-20">
          
          {/* Left: Contact Form (Premium Glass Card) */}
          <div className="w-full lg:w-1/2">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white border-2 border-gold/20 shadow-[0_20px_50px_rgba(139,30,30,0.05)] rounded-[3rem] p-10 md:p-14 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl"></div>
              
              <div className="relative z-10 mb-8">
                <h3 className="text-3xl font-serif font-bold text-charcoal mb-2">Send a Message</h3>
                <p className="text-brown">Fill out the form below and our Sivakasi team will get back to you shortly.</p>
              </div>

              <form className="relative z-10 flex flex-col gap-8">
                <div className="relative">
                  <input type="text" id="name" className="peer w-full border-b-2 border-brown/20 focus:border-gold bg-transparent py-3 text-charcoal outline-none transition-colors" placeholder=" " />
                  <label htmlFor="name" className="absolute left-0 top-3 text-brown cursor-text peer-focus:text-gold peer-focus:-top-5 peer-focus:text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base font-medium">Full Name</label>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-8">
                  <div className="relative w-full">
                    <input type="tel" id="phone" className="peer w-full border-b-2 border-brown/20 focus:border-gold bg-transparent py-3 text-charcoal outline-none transition-colors" placeholder=" " />
                    <label htmlFor="phone" className="absolute left-0 top-3 text-brown cursor-text peer-focus:text-gold peer-focus:-top-5 peer-focus:text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base font-medium">Phone Number</label>
                  </div>
                  
                  <div className="relative w-full">
                    <input type="email" id="email" className="peer w-full border-b-2 border-brown/20 focus:border-gold bg-transparent py-3 text-charcoal outline-none transition-colors" placeholder=" " />
                    <label htmlFor="email" className="absolute left-0 top-3 text-brown cursor-text peer-focus:text-gold peer-focus:-top-5 peer-focus:text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base font-medium">Email Address</label>
                  </div>
                </div>

                <div className="relative mt-2">
                  <select className="w-full border-b-2 border-brown/20 focus:border-gold bg-transparent py-3 text-charcoal outline-none transition-colors appearance-none font-medium cursor-pointer">
                    <option value="" disabled selected hidden>Select Subject</option>
                    <option value="bulk" className="text-charcoal">Bulk Order / Wholesale</option>
                    <option value="support" className="text-charcoal">Customer Support</option>
                    <option value="franchise" className="text-charcoal">Franchise Enquiry</option>
                  </select>
                  <label className="absolute left-0 -top-5 text-gold text-sm font-medium">Subject</label>
                </div>
                
                <div className="relative mt-2">
                  <textarea id="message" rows="4" className="peer w-full border-b-2 border-brown/20 focus:border-gold bg-transparent py-3 text-charcoal outline-none transition-colors resize-none" placeholder=" "></textarea>
                  <label htmlFor="message" className="absolute left-0 top-3 text-brown cursor-text peer-focus:text-gold peer-focus:-top-5 peer-focus:text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base font-medium">Your Message</label>
                </div>

                <button type="button" className="group mt-6 bg-gradient-to-r from-[#D32F2F] to-[#8B1E1E] text-white px-8 py-4 rounded-full font-bold text-lg shadow-[0_10px_30px_rgba(139,30,30,0.3)] hover:shadow-[0_15px_40px_rgba(139,30,30,0.5)] transition-all flex items-center justify-center gap-3 transform hover:-translate-y-1 w-full sm:w-auto self-start">
                  <span>Send Message</span>
                  <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </motion.div>
          </div>

          {/* Right: Contact Details & Quick Access */}
          <div className="w-full lg:w-1/2 flex flex-col gap-6">
            
            {/* Quick Contact Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <a href={`tel:+91${phone}`} className="bg-white border border-gray-100 hover:border-blue-200 p-6 rounded-[2rem] flex flex-col items-center justify-center gap-4 shadow-sm hover:shadow-xl transition-all group">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Phone className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Direct Call</span>
                  <span className="text-base font-extrabold text-gray-800 group-hover:text-blue-600 transition-colors">+91 {phone}</span>
                </div>
              </a>

              <a href={`https://wa.me/91${whatsapp}`} target="_blank" rel="noopener noreferrer" className="bg-white border border-gray-100 hover:border-green-200 p-6 rounded-[2rem] flex flex-col items-center justify-center gap-4 shadow-sm hover:shadow-xl transition-all group">
                <div className="w-12 h-12 bg-green-50 text-[#25D366] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform relative">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Chat on WhatsApp</p>
                  <p className="text-base font-extrabold text-gray-800 group-hover:text-green-600 transition-colors">+91 {whatsapp}</p>
                </div>
              </a>
            </div>

            {/* Address & Business Info Card */}
            <div className="bg-white border border-gray-100 p-8 rounded-[2rem] shadow-sm space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-900 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-[#4A0E0E]" />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase text-amber-900 tracking-wider">Factory & Showroom Address</h4>
                  <p className="text-gray-800 font-bold text-sm mt-1">{address}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 pt-4 border-t border-gray-100">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-900 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-[#4A0E0E]" />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase text-amber-900 tracking-wider">Official Email</h4>
                  <a href={`mailto:${email}`} className="text-gray-800 font-bold text-sm hover:text-[#4A0E0E] mt-1 block">
                    {email}
                  </a>
                </div>
              </div>

              {gstNumber && (
                <div className="flex items-start gap-4 pt-4 border-t border-gray-100">
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-900 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-[#4A0E0E]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase text-amber-900 tracking-wider">GSTIN Number</h4>
                    <p className="text-gray-800 font-mono font-black text-sm mt-1">{gstNumber}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Map Frame */}
            <div className="relative h-48 rounded-[2rem] overflow-hidden shadow-sm border-4 border-white group">
              <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200" alt="Map Location" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur px-4 py-2.5 rounded-2xl shadow-lg flex items-center gap-3">
                <div className="w-8 h-8 bg-red/10 rounded-full flex items-center justify-center shrink-0">
                  <MapPin className="text-[#4A0E0E] w-4 h-4" />
                </div>
                <p className="font-bold text-charcoal text-xs leading-snug">
                  {address}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

