import { motion } from 'framer-motion';
import { PhoneCall, MessageCircle, Mail, Camera, Video, Share2, MapPin, Clock } from 'lucide-react';

const Contact = () => {
  return (
    <div className="bg-cream-light min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-serif font-bold text-gold drop-shadow-sm">We’d Love to Hear From You!</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Left: Contact Form (Bright Glass Card) */}
          <div className="w-full lg:w-1/2">
            <div className="bg-white border border-gold shadow-warm rounded-[3rem] p-10 md:p-14 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-3xl"></div>
              
              <form className="relative z-10 flex flex-col gap-6">
                <div className="relative">
                  <input type="text" id="name" className="peer w-full border-b-2 border-cream-dark focus:border-saffron bg-transparent py-3 text-charcoal outline-none transition-colors" placeholder=" " />
                  <label htmlFor="name" className="absolute left-0 top-3 text-brown cursor-text peer-focus:text-saffron peer-focus:-top-4 peer-focus:text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-brown">Full Name</label>
                </div>
                
                <div className="relative">
                  <input type="tel" id="phone" className="peer w-full border-b-2 border-cream-dark focus:border-saffron bg-transparent py-3 text-charcoal outline-none transition-colors" placeholder=" " />
                  <label htmlFor="phone" className="absolute left-0 top-3 text-brown cursor-text peer-focus:text-saffron peer-focus:-top-4 peer-focus:text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-brown">Phone Number</label>
                </div>
                
                <div className="relative">
                  <input type="email" id="email" className="peer w-full border-b-2 border-cream-dark focus:border-saffron bg-transparent py-3 text-charcoal outline-none transition-colors" placeholder=" " />
                  <label htmlFor="email" className="absolute left-0 top-3 text-brown cursor-text peer-focus:text-saffron peer-focus:-top-4 peer-focus:text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-brown">Email Address</label>
                </div>

                <div className="relative mt-2">
                  <select className="w-full border-b-2 border-cream-dark focus:border-saffron bg-transparent py-3 text-charcoal outline-none transition-colors appearance-none">
                    <option value="">Select Subject</option>
                    <option value="bulk">Bulk Order</option>
                    <option value="support">Customer Support</option>
                    <option value="franchise">Franchise Enquiry</option>
                  </select>
                  <label className="absolute left-0 -top-4 text-saffron text-sm">Subject</label>
                </div>
                
                <div className="relative mt-2">
                  <textarea id="message" rows="4" className="peer w-full border-b-2 border-cream-dark focus:border-saffron bg-transparent py-3 text-charcoal outline-none transition-colors resize-none" placeholder=" "></textarea>
                  <label htmlFor="message" className="absolute left-0 top-3 text-brown cursor-text peer-focus:text-saffron peer-focus:-top-4 peer-focus:text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-brown">Message</label>
                </div>

                <button type="button" className="pill-btn pill-btn-gradient w-full mt-4 text-lg">
                  Send Message &rarr;
                </button>
              </form>
            </div>
          </div>

          {/* Right: Business Details & Map */}
          <div className="w-full lg:w-1/2 flex flex-col gap-8">
            
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="tel:+919876543210" className="flex-1 bg-green hover:bg-green/90 text-white p-6 rounded-full flex items-center justify-center gap-3 font-bold text-xl shadow-lg transition-transform hover:-translate-y-1">
                <PhoneCall /> +91 98765 43210
              </a>
              <a href="https://wa.me/919876543210" className="flex-1 bg-[#25D366] hover:bg-[#1ebd5a] text-white p-6 rounded-full flex items-center justify-center gap-3 font-bold text-xl shadow-lg relative transition-transform hover:-translate-y-1">
                <div className="absolute inset-0 rounded-full border-2 border-[#25D366] animate-ping opacity-50"></div>
                <MessageCircle /> WhatsApp
              </a>
            </div>

            <div className="bg-white p-6 rounded-[2rem] flex items-center gap-4 shadow-warm">
              <div className="w-16 h-16 bg-red/10 rounded-full flex items-center justify-center text-red">
                <Mail className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm text-brown font-bold uppercase">Email Us</p>
                <p className="text-xl text-charcoal font-bold">vinayakacrackers@gmail.com</p>
              </div>
            </div>

            <div className="bg-saffron/10 border border-saffron/30 p-6 rounded-[2rem] flex items-start gap-4">
              <Clock className="w-8 h-8 text-saffron mt-1 shrink-0" />
              <div>
                <p className="text-lg font-bold text-saffron uppercase mb-1">Showroom Timing</p>
                <p className="text-2xl text-charcoal font-bold">Mon-Sun: 10 AM – 9 PM</p>
              </div>
            </div>

            {/* Map Embed Simulation */}
            <div className="h-64 rounded-[2rem] overflow-hidden shadow-warm border-4 border-white relative">
              <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800" alt="Map Location" className="w-full h-full object-cover opacity-80" />
              <div className="absolute inset-0 bg-white/40 flex items-center justify-center backdrop-blur-[2px]">
                <div className="bg-white p-4 rounded-2xl shadow-lg flex items-center gap-3 font-bold text-charcoal">
                  <MapPin className="text-red" /> No. 45, GST Road, Chromepet
                </div>
              </div>
            </div>

            {/* Social Proof Strip */}
            <div className="bg-white/50 backdrop-blur rounded-[2rem] p-6 flex justify-center gap-8 shadow-sm">
              <a href="#" className="w-14 h-14 rounded-full bg-gradient-to-tr from-orange-500 to-pink-500 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-md">
                <Camera className="w-7 h-7" />
              </a>
              <a href="#" className="w-14 h-14 rounded-full bg-red text-white flex items-center justify-center hover:scale-110 transition-transform shadow-md">
                <Video className="w-7 h-7" />
              </a>
              <a href="#" className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-md">
                <Share2 className="w-7 h-7" />
              </a>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
