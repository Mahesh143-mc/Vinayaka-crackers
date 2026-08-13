import { Link } from 'react-router-dom';
import { Share2, Camera, Video, MapPin, Phone, Mail, BookOpen, ShoppingBag, Grid, Image as ImageIcon, Headphones, Truck, ShieldCheck, HelpCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-saffron-dark text-cream-light relative mt-20 pt-16 pb-8">
      {/* Decorative Rangoli Pattern Top Border */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] -translate-y-[99%]">
        <svg
          className="relative block w-full h-[60px]"
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            opacity=".25"
            fill="#E65100"
          ></path>
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            opacity=".5"
            fill="#E65100"
          ></path>
          <path
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
            fill="#E65100"
          ></path>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Brand Col */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4 block group">
              <img 
                src="https://res.cloudinary.com/vf0fqhwo/image/upload/v1786363324/logo_q7lezq.jpg" 
                alt="Karuppa Crackers" 
                className="h-12 w-auto object-contain rounded-xl shadow-md border border-amber-400/30" 
              />
              <span className="text-3xl font-serif font-bold text-white">
                Karuppa<span className="text-gold">.</span>
              </span>
            </Link>
            <p className="text-cream-light/80 mb-6 font-sans">
              Spreading joy and light since 1995. India’s most trusted and vibrant fireworks brand for all your celebrations.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-gold hover:text-saffron-dark transition-all duration-300 transform hover:-translate-y-1 shadow-lg">
                <Share2 className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-gold hover:text-saffron-dark transition-all duration-300 transform hover:-translate-y-1 shadow-lg">
                <Camera className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-gold hover:text-saffron-dark transition-all duration-300 transform hover:-translate-y-1 shadow-lg">
                <Video className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-serif font-bold text-gold-light mb-6">Explore</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="group flex items-center text-cream-light hover:text-gold transition-colors">
                  <BookOpen className="w-4 h-4 mr-2 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                  Our Story
                </Link>
              </li>
              <li>
                <Link to="/products" className="group flex items-center text-cream-light hover:text-gold transition-colors">
                  <ShoppingBag className="w-4 h-4 mr-2 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/categories" className="group flex items-center text-cream-light hover:text-gold transition-colors">
                  <Grid className="w-4 h-4 mr-2 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="group flex items-center text-cream-light hover:text-gold transition-colors">
                  <ImageIcon className="w-4 h-4 mr-2 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                  Gallery
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-xl font-serif font-bold text-gold-light mb-6">Customer Care</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/contact" className="group flex items-center text-cream-light hover:text-gold transition-colors">
                  <Headphones className="w-4 h-4 mr-2 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="#" className="group flex items-center text-cream-light hover:text-gold transition-colors">
                  <Truck className="w-4 h-4 mr-2 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link to="#" className="group flex items-center text-cream-light hover:text-gold transition-colors">
                  <ShieldCheck className="w-4 h-4 mr-2 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                  Safety Guidelines
                </Link>
              </li>
              <li>
                <Link to="#" className="group flex items-center text-cream-light hover:text-gold transition-colors">
                  <HelpCircle className="w-4 h-4 mr-2 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xl font-serif font-bold text-gold-light mb-6">Reach Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start group">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center mr-3 flex-shrink-0 group-hover:bg-gold transition-colors duration-300">
                  <MapPin className="w-4 h-4 text-gold group-hover:text-saffron-dark transition-colors duration-300" />
                </div>
                <span className="mt-1 group-hover:text-white transition-colors duration-300 text-sm">Sivakasi, Tamil Nadu</span>
              </li>
              <li className="flex items-center group">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center mr-3 flex-shrink-0 group-hover:bg-gold transition-colors duration-300">
                  <Phone className="w-4 h-4 text-gold group-hover:text-saffron-dark transition-colors duration-300" />
                </div>
                <span className="group-hover:text-white transition-colors duration-300 text-sm">+91 88254 19454</span>
              </li>
              <li className="flex items-center group">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center mr-3 flex-shrink-0 group-hover:bg-gold transition-colors duration-300">
                  <Mail className="w-4 h-4 text-gold group-hover:text-saffron-dark transition-colors duration-300" />
                </div>
                <span className="group-hover:text-white transition-colors duration-300 text-sm">chimeratechweb@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/20 text-center text-sm text-cream-light/60">
          <p>&copy; {new Date().getFullYear()} Karuppa Crackers. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
