import { useState, useEffect } from 'react';
import { Home, Info, ArrowLeft, ChevronRight, Image as ImageIcon, Megaphone, Store, ShieldAlert, Plus, Trash2, Edit3, Save, CheckCircle2, X, Sparkles, BookOpen, Layers, Award, Check, Globe } from 'lucide-react';
import { subscribeWebsiteCMS, saveWebsiteCMSToFirestore } from '../../services/firebaseService';

const AdminWebsiteCMS = () => {
  // Navigation Steps: 'main' | 'home_sections' | 'about_sections' | 'edit'
  const [currentStep, setCurrentStep] = useState('main'); // 'main', 'home_sections', 'about_sections', 'edit'
  const [activeSection, setActiveSection] = useState(null);
  const [successToast, setSuccessToast] = useState('');

  const triggerSuccess = (msg) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3500);
  };

  // =========================================================================
  // HOME PAGE CONTENT STATE
  // =========================================================================
  const [banners, setBanners] = useState([
    { 
      id: 'BNR-01', 
      title: 'Diwali Sparkle Mega Sale 2024', 
      subtitle: 'Flat 10% OFF on all Wholesale & Retail Sivakasi Firecrackers!', 
      buttonText: 'Explore Catalog', 
      link: '/products', 
      active: true, 
      imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=60' 
    },
    { 
      id: 'BNR-02', 
      title: '100% Green Crackers Sivakasi Direct', 
      subtitle: 'Direct factory rates with safe doorstep delivery across Tamil Nadu.', 
      buttonText: 'Order Now', 
      link: '/products', 
      active: true, 
      imageUrl: 'https://images.unsplash.com/photo-1498931299472-f7a63a5a1cfa?w=800&auto=format&fit=crop&q=60' 
    },
    { 
      id: 'BNR-03', 
      title: 'Diwali Family Gift Boxes & Combos', 
      subtitle: 'Specially curated festive combo boxes for whole families & corporate gifting.', 
      buttonText: 'View Gift Boxes', 
      link: '/categories', 
      active: true, 
      imageUrl: 'https://images.unsplash.com/photo-1531747056595-07f6cbbe10ad?w=800&auto=format&fit=crop&q=60' 
    },
  ]);

  const [editingBanner, setEditingBanner] = useState(null);
  const [showAddBannerModal, setShowAddBannerModal] = useState(false);
  const [newBanner, setNewBanner] = useState({
    title: '',
    subtitle: '',
    buttonText: 'Order Now',
    link: '/products',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=60',
    active: true
  });

  // Ticker & Offer
  const [announcementText, setAnnouncementText] = useState('🔥 Diwali Festive Special Offer: Flat 10% OFF + Free Sivakasi Direct Delivery on Orders above ₹3,000!');
  const [isTickerActive, setIsTickerActive] = useState(true);

  // Home Section Headings
  const [homeCategoryHeading, setHomeCategoryHeading] = useState('Explore Firecracker Categories');
  const [homeCategorySubtext, setHomeCategorySubtext] = useState('From vibrant sparklers & flower pots to high-altitude 120-shot fancy sky cannons.');
  const [homeFeaturedHeading, setHomeFeaturedHeading] = useState('Diwali Best Sellers & Popular Combos');
  const [homeFeaturedSubtext, setHomeFeaturedSubtext] = useState('Handpicked top-rated crackers direct from Sivakasi manufacturing hubs.');

  // =========================================================================
  // ABOUT PAGE CONTENT STATE
  // =========================================================================
  const [aboutHeroTitle, setAboutHeroTitle] = useState('Spreading Joy Since 1995');
  const [aboutHeroSubheadline, setAboutHeroSubheadline] = useState('The Story of Light & Celebrations');
  const [aboutHeroImage, setAboutHeroImage] = useState('https://res.cloudinary.com/vf0fqhwo/image/upload/v1785319726/About_Banner_e6xug6.jpg');

  const [aboutYearsExperience, setAboutYearsExperience] = useState('30+');
  const [aboutStoryHeadline, setAboutStoryHeadline] = useState('Our Journey of Spreading Joy');
  const [aboutStoryParagraph1, setAboutStoryParagraph1] = useState('Karuppa Crackers was born from a dream to make every festival brighter. From a small retail stall in Sivakasi to a trusted name across India, we source directly from Sivakasi’s finest licensed pyrotechnic factories.');
  const [aboutStoryParagraph2, setAboutStoryParagraph2] = useState('We prioritize safety, quality, and the bright smiles of our customers. Our legacy is built on the joy we bring to millions of households during their most precious celebrations.');

  const [wholesaleHeading, setWholesaleHeading] = useState('Wholesale Firecrackers');
  const [wholesaleDesc, setWholesaleDesc] = useState('We supply premium-quality fireworks in bulk at competitive wholesale prices. With a wide product range, reliable service, and timely delivery, we help retailers and distributors meet their festive demands.');

  const [retailHeading, setRetailHeading] = useState('Retail Store & Online Orders');
  const [retailDesc, setRetailDesc] = useState('We offer a complete collection of high-quality fireworks for individual customers at affordable prices. Enjoy a safe, convenient, and memorable shopping experience with products perfect for every family occasion.');

  const [whyNode1Title, setWhyNode1Title] = useState('100% Quality');
  const [whyNode1Desc, setWhyNode1Desc] = useState("Sourced from Sivakasi's finest certified factories.");
  const [whyNode2Title, setWhyNode2Title] = useState('Certified Safety');
  const [whyNode2Desc, setWhyNode2Desc] = useState('100% licensed green crackers & child-safe fireworks.');
  const [whyNode3Title, setWhyNode3Title] = useState('500+ Variety');
  const [whyNode3Desc, setWhyNode3Desc] = useState('Sky shots, sparklers, rockets & family hampers.');
  const [whyNode4Title, setWhyNode4Title] = useState('30+ Yrs Trust');
  const [whyNode4Desc, setWhyNode4Desc] = useState('Unmatched legacy & trusted customer relationships.');

  // =========================================================================
  // STORE CONTACT & RULES STATE
  // =========================================================================
  const [storeName, setStoreName] = useState('Karuppa Crackers');
  const [supportPhone, setSupportPhone] = useState('+91 8825419454');
  const [whatsappNumber, setWhatsappNumber] = useState('+91 8825419454');
  const [supportEmail, setSupportEmail] = useState('chimeratechweb@gmail.com');
  const [storeAddress, setStoreAddress] = useState('124/B, Main Road, Industrial Estate, Sivakasi - 626123, Tamil Nadu, India');
  const [gstinNumber, setGstinNumber] = useState('33AAAAA0000A1Z5');
  const [explosiveLicenseNo, setExplosiveLicenseNo] = useState('E/SC/TN/22/10082');

  const [acceptingOrders, setAcceptingOrders] = useState(true);
  const [minOrderAmount, setMinOrderAmount] = useState(1500);
  const [discountPercent, setDiscountPercent] = useState(10);
  const [minOrderForDiscount, setMinOrderForDiscount] = useState(3000);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState('We are updating our Sivakasi stock list for Diwali 2024. Online ordering will resume shortly!');

  // Banner Actions
  const toggleBannerStatus = (id) => {
    setBanners(prev => prev.map(b => {
      if (b.id === id) {
        const nextState = !b.active;
        triggerSuccess(`Banner "${b.title}" is now ${nextState ? 'ACTIVE' : 'HIDDEN'} on website.`);
        return { ...b, active: nextState };
      }
      return b;
    }));
  };

  const handleDeleteBanner = (id) => {
    setBanners(prev => prev.filter(b => b.id !== id));
    triggerSuccess(`Banner removed successfully!`);
  };

  const handleSaveBannerEdit = (e) => {
    e.preventDefault();
    if (!editingBanner) return;
    setBanners(prev => prev.map(b => b.id === editingBanner.id ? editingBanner : b));
    setEditingBanner(null);
    triggerSuccess(`Banner "${editingBanner.title}" updated & saved!`);
  };

  const handleCreateBanner = (e) => {
    e.preventDefault();
    if (!newBanner.title) return;
    const created = {
      id: `BNR-0${banners.length + 1}`,
      ...newBanner
    };
    setBanners([...banners, created]);
    setShowAddBannerModal(false);
    setNewBanner({
      title: '',
      subtitle: '',
      buttonText: 'Order Now',
      link: '/products',
      imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=60',
      active: true
    });
    triggerSuccess(`New banner "${created.title}" published!`);
  };

  useEffect(() => {
    const unsubscribe = subscribeWebsiteCMS((data) => {
      if (data) {
        if (data.banners) setBanners(data.banners);
        if (data.announcementText) setAnnouncementText(data.announcementText);
        if (data.isTickerActive !== undefined) setIsTickerActive(data.isTickerActive);
        if (data.homeCategoryHeading) setHomeCategoryHeading(data.homeCategoryHeading);
        if (data.homeCategorySubtext) setHomeCategorySubtext(data.homeCategorySubtext);
        if (data.homeFeaturedHeading) setHomeFeaturedHeading(data.homeFeaturedHeading);
        if (data.homeFeaturedSubtext) setHomeFeaturedSubtext(data.homeFeaturedSubtext);
        if (data.aboutHeroTitle) setAboutHeroTitle(data.aboutHeroTitle);
        if (data.aboutHeroSubheadline) setAboutHeroSubheadline(data.aboutHeroSubheadline);
        if (data.aboutHeroImage) setAboutHeroImage(data.aboutHeroImage);
        if (data.aboutYearsExperience) setAboutYearsExperience(data.aboutYearsExperience);
        if (data.aboutStoryHeadline) setAboutStoryHeadline(data.aboutStoryHeadline);
        if (data.aboutStoryParagraph1) setAboutStoryParagraph1(data.aboutStoryParagraph1);
        if (data.aboutStoryParagraph2) setAboutStoryParagraph2(data.aboutStoryParagraph2);
        if (data.wholesaleHeading) setWholesaleHeading(data.wholesaleHeading);
        if (data.wholesaleDesc) setWholesaleDesc(data.wholesaleDesc);
        if (data.retailHeading) setRetailHeading(data.retailHeading);
        if (data.retailDesc) setRetailDesc(data.retailDesc);
        if (data.whyNode1Title) setWhyNode1Title(data.whyNode1Title);
        if (data.whyNode1Desc) setWhyNode1Desc(data.whyNode1Desc);
        if (data.whyNode2Title) setWhyNode2Title(data.whyNode2Title);
        if (data.whyNode2Desc) setWhyNode2Desc(data.whyNode2Desc);
        if (data.whyNode3Title) setWhyNode3Title(data.whyNode3Title);
        if (data.whyNode3Desc) setWhyNode3Desc(data.whyNode3Desc);
        if (data.whyNode4Title) setWhyNode4Title(data.whyNode4Title);
        if (data.whyNode4Desc) setWhyNode4Desc(data.whyNode4Desc);
        if (data.storeName) setStoreName(data.storeName);
        if (data.supportPhone) setSupportPhone(data.supportPhone);
        if (data.whatsappNumber) setWhatsappNumber(data.whatsappNumber);
        if (data.supportEmail) setSupportEmail(data.supportEmail);
        if (data.storeAddress) setStoreAddress(data.storeAddress);
        if (data.gstinNumber) setGstinNumber(data.gstinNumber);
        if (data.explosiveLicenseNo) setExplosiveLicenseNo(data.explosiveLicenseNo);
        if (data.acceptingOrders !== undefined) setAcceptingOrders(data.acceptingOrders);
        if (data.minOrderAmount) setMinOrderAmount(data.minOrderAmount);
        if (data.discountPercent) setDiscountPercent(data.discountPercent);
        if (data.minOrderForDiscount) setMinOrderForDiscount(data.minOrderForDiscount);
        if (data.maintenanceMode !== undefined) setMaintenanceMode(data.maintenanceMode);
        if (data.maintenanceMessage) setMaintenanceMessage(data.maintenanceMessage);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSaveSectionContent = async (e) => {
    if (e) e.preventDefault();
    const cmsPayload = {
      banners,
      announcementText,
      isTickerActive,
      homeCategoryHeading,
      homeCategorySubtext,
      homeFeaturedHeading,
      homeFeaturedSubtext,
      aboutHeroTitle,
      aboutHeroSubheadline,
      aboutHeroImage,
      aboutYearsExperience,
      aboutStoryHeadline,
      aboutStoryParagraph1,
      aboutStoryParagraph2,
      wholesaleHeading,
      wholesaleDesc,
      retailHeading,
      retailDesc,
      whyNode1Title,
      whyNode1Desc,
      whyNode2Title,
      whyNode2Desc,
      whyNode3Title,
      whyNode3Desc,
      whyNode4Title,
      whyNode4Desc,
      storeName,
      supportPhone,
      whatsappNumber,
      supportEmail,
      storeAddress,
      gstinNumber,
      explosiveLicenseNo,
      acceptingOrders,
      minOrderAmount,
      discountPercent,
      minOrderForDiscount,
      maintenanceMode,
      maintenanceMessage
    };

    try {
      await saveWebsiteCMSToFirestore(cmsPayload);
    } catch (err) {
      console.error("Error saving CMS to Firestore:", err);
    }

    triggerSuccess(`🎉 Section content saved to Firestore! Frontend updated live.`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Toast Notification Banner */}
      {successToast && (
        <div className="fixed top-6 right-6 z-[1000005] bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white font-black text-xs sm:text-sm px-5 py-3.5 rounded-2xl shadow-2xl border-2 border-amber-300 flex items-center gap-3 animate-in slide-in-from-top-5 duration-300">
          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <CheckCircle2 size={18} className="text-[#FFD700]" />
          </div>
          <span>{successToast}</span>
        </div>
      )}

      {/* =================================================================== */}
      {/* LEVEL 1: MAIN PAGE (ONLY 2 CARDS: HOME PAGE & ABOUT PAGE) */}
      {/* =================================================================== */}
      {currentStep === 'main' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-[#4A0E0E] via-[#701515] to-[#4A0E0E] p-7 rounded-3xl shadow-lg text-white">
            <h1 className="text-3xl font-serif font-black tracking-wide text-white flex items-center gap-2">
              <Globe className="text-[#FFD700]" /> Website CMS & Page Content Editor
            </h1>
            <p className="text-amber-200/90 text-sm mt-1 font-medium">
              Select a page below to view and edit its section content for the user-facing website.
            </p>
          </div>

          {/* 2 MAIN CARDS: HOME PAGE & ABOUT PAGE ONLY */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* CARD 1: HOME PAGE */}
            <div 
              onClick={() => setCurrentStep('home_sections')}
              className="bg-[#FAF7F2] hover:bg-[#F4ECE0] p-8 sm:p-10 rounded-3xl border-3 border-amber-900/20 hover:border-[#4A0E0E] shadow-md hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between space-y-6 relative overflow-hidden transform hover:-translate-y-1.5"
            >
              <div className="space-y-4">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#4A0E0E] via-[#701515] to-amber-800 text-[#FFD700] flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                  <Home size={38} strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-3xl font-serif font-black text-gray-900 group-hover:text-[#4A0E0E] transition-colors">Home Page</h2>
                  <p className="text-sm font-bold text-gray-600 mt-2 leading-relaxed">
                    Manage Hero Banners, Scrolling Announcement Ticker, Festive Discounts, Category Headings, and Store Notices.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-amber-900/15 flex items-center justify-between">
                <span className="text-xs font-black uppercase text-[#4A0E0E] tracking-wider">5 Section Cards Available</span>
                <div className="px-5 py-2.5 bg-[#4A0E0E] group-hover:bg-red-950 text-white rounded-2xl font-black text-xs shadow-md flex items-center gap-2">
                  Configure Home Page Sections <ChevronRight size={16} />
                </div>
              </div>
            </div>

            {/* CARD 2: ABOUT PAGE */}
            <div 
              onClick={() => setCurrentStep('about_sections')}
              className="bg-[#FAF7F2] hover:bg-[#F4ECE0] p-8 sm:p-10 rounded-3xl border-3 border-amber-900/20 hover:border-[#4A0E0E] shadow-md hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between space-y-6 relative overflow-hidden transform hover:-translate-y-1.5"
            >
              <div className="space-y-4">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#4A0E0E] via-[#701515] to-amber-800 text-[#FFD700] flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                  <Info size={38} strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-3xl font-serif font-black text-gray-900 group-hover:text-[#4A0E0E] transition-colors">About Page</h2>
                  <p className="text-sm font-bold text-gray-600 mt-2 leading-relaxed">
                    Manage Hero Title, Background Image, Company History & Journey, Wholesale/Retail Text, and 4 Trust Pillars.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-amber-900/15 flex items-center justify-between">
                <span className="text-xs font-black uppercase text-[#4A0E0E] tracking-wider">4 Section Cards Available</span>
                <div className="px-5 py-2.5 bg-[#4A0E0E] group-hover:bg-red-950 text-white rounded-2xl font-black text-xs shadow-md flex items-center gap-2">
                  Configure About Page Sections <ChevronRight size={16} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* LEVEL 2: HOME PAGE SECTIONS LIST */}
      {/* =================================================================== */}
      {currentStep === 'home_sections' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentStep('main')}
              className="px-4 py-2.5 bg-[#FAF7F2] hover:bg-amber-100/70 border border-amber-900/20 text-[#4A0E0E] rounded-2xl text-xs font-black transition-all flex items-center gap-2 shadow-sm"
            >
              <ArrowLeft size={16} strokeWidth={2.5} /> Back to Website CMS Main
            </button>
            <span className="text-xs font-black text-[#4A0E0E] bg-[#FFD700] px-3.5 py-1.5 rounded-full border border-amber-400">
              Home Page Sections
            </span>
          </div>

          <div className="bg-[#FAF7F2] p-6 rounded-3xl border border-amber-900/15">
            <h2 className="text-2xl font-serif font-black text-gray-900">🏠 Home Page — Section Cards</h2>
            <p className="text-xs font-bold text-gray-600 mt-1">Click any section card to edit its live frontend content and images.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Section 1 */}
            <div 
              onClick={() => { setActiveSection('home_banners'); setCurrentStep('edit'); }}
              className="bg-white hover:bg-amber-50/60 p-6 rounded-3xl border-2 border-amber-900/15 hover:border-[#4A0E0E] shadow-sm hover:shadow-md transition-all cursor-pointer group space-y-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-[#4A0E0E] flex items-center justify-center font-black">
                <ImageIcon size={26} />
              </div>
              <div>
                <h3 className="font-serif font-black text-gray-900 text-lg group-hover:text-[#4A0E0E]">1. Hero Banners & Slider</h3>
                <p className="text-xs font-medium text-gray-600 mt-1">Edit titles, subtitles, CTA button links, and upload background slide images ({banners.length} Active Banners).</p>
              </div>
              <div className="pt-2 text-xs font-black text-[#4A0E0E] flex items-center gap-1">
                Edit Hero Section <ChevronRight size={14} />
              </div>
            </div>

            {/* Section 2 */}
            <div 
              onClick={() => { setActiveSection('home_ticker'); setCurrentStep('edit'); }}
              className="bg-white hover:bg-amber-50/60 p-6 rounded-3xl border-2 border-amber-900/15 hover:border-[#4A0E0E] shadow-sm hover:shadow-md transition-all cursor-pointer group space-y-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-[#4A0E0E] flex items-center justify-center font-black">
                <Megaphone size={26} />
              </div>
              <div>
                <h3 className="font-serif font-black text-gray-900 text-lg group-hover:text-[#4A0E0E]">2. Announcement Ticker & Offers</h3>
                <p className="text-xs font-medium text-gray-600 mt-1">Edit scrolling top promo message, enable/disable ticker bar, and set festive discount %.</p>
              </div>
              <div className="pt-2 text-xs font-black text-[#4A0E0E] flex items-center gap-1">
                Edit Ticker Section <ChevronRight size={14} />
              </div>
            </div>

            {/* Section 3 */}
            <div 
              onClick={() => { setActiveSection('home_headings'); setCurrentStep('edit'); }}
              className="bg-white hover:bg-amber-50/60 p-6 rounded-3xl border-2 border-amber-900/15 hover:border-[#4A0E0E] shadow-sm hover:shadow-md transition-all cursor-pointer group space-y-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-[#4A0E0E] flex items-center justify-center font-black">
                <Layers size={26} />
              </div>
              <div>
                <h3 className="font-serif font-black text-gray-900 text-lg group-hover:text-[#4A0E0E]">3. Category & Featured Headings</h3>
                <p className="text-xs font-medium text-gray-600 mt-1">Edit category section titles, sub-headlines, and featured products section header text.</p>
              </div>
              <div className="pt-2 text-xs font-black text-[#4A0E0E] flex items-center gap-1">
                Edit Headings Section <ChevronRight size={14} />
              </div>
            </div>

            {/* Section 4 */}
            <div 
              onClick={() => { setActiveSection('home_store'); setCurrentStep('edit'); }}
              className="bg-white hover:bg-amber-50/60 p-6 rounded-3xl border-2 border-amber-900/15 hover:border-[#4A0E0E] shadow-sm hover:shadow-md transition-all cursor-pointer group space-y-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-[#4A0E0E] flex items-center justify-center font-black">
                <Store size={26} />
              </div>
              <div>
                <h3 className="font-serif font-black text-gray-900 text-lg group-hover:text-[#4A0E0E]">4. Store Info & Contact Footer</h3>
                <p className="text-xs font-medium text-gray-600 mt-1">Edit store name, phone, WhatsApp number, GSTIN, license no, and physical shop address.</p>
              </div>
              <div className="pt-2 text-xs font-black text-[#4A0E0E] flex items-center gap-1">
                Edit Store Info <ChevronRight size={14} />
              </div>
            </div>

            {/* Section 5 */}
            <div 
              onClick={() => { setActiveSection('home_rules'); setCurrentStep('edit'); }}
              className="bg-white hover:bg-amber-50/60 p-6 rounded-3xl border-2 border-amber-900/15 hover:border-[#4A0E0E] shadow-sm hover:shadow-md transition-all cursor-pointer group space-y-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-[#4A0E0E] flex items-center justify-center font-black">
                <ShieldAlert size={26} />
              </div>
              <div>
                <h3 className="font-serif font-black text-gray-900 text-lg group-hover:text-[#4A0E0E]">5. Order Limits & Maintenance</h3>
                <p className="text-xs font-medium text-gray-600 mt-1">Toggle online order checkout, set minimum order limit (₹), and maintenance notice.</p>
              </div>
              <div className="pt-2 text-xs font-black text-[#4A0E0E] flex items-center gap-1">
                Edit Order Rules <ChevronRight size={14} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* LEVEL 2: ABOUT PAGE SECTIONS LIST */}
      {/* =================================================================== */}
      {currentStep === 'about_sections' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentStep('main')}
              className="px-4 py-2.5 bg-[#FAF7F2] hover:bg-amber-100/70 border border-amber-900/20 text-[#4A0E0E] rounded-2xl text-xs font-black transition-all flex items-center gap-2 shadow-sm"
            >
              <ArrowLeft size={16} strokeWidth={2.5} /> Back to Website CMS Main
            </button>
            <span className="text-xs font-black text-[#4A0E0E] bg-[#FFD700] px-3.5 py-1.5 rounded-full border border-amber-400">
              About Page Sections
            </span>
          </div>

          <div className="bg-[#FAF7F2] p-6 rounded-3xl border border-amber-900/15">
            <h2 className="text-2xl font-serif font-black text-gray-900">ℹ️ About Page — Section Cards</h2>
            <p className="text-xs font-bold text-gray-600 mt-1">Click any section card to edit company history, hero banner, wholesale text, and trust nodes.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* About Section 1 */}
            <div 
              onClick={() => { setActiveSection('about_hero'); setCurrentStep('edit'); }}
              className="bg-white hover:bg-amber-50/60 p-6 rounded-3xl border-2 border-amber-900/15 hover:border-[#4A0E0E] shadow-sm hover:shadow-md transition-all cursor-pointer group space-y-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-[#4A0E0E] flex items-center justify-center font-black">
                <ImageIcon size={26} />
              </div>
              <div>
                <h3 className="font-serif font-black text-gray-900 text-lg group-hover:text-[#4A0E0E]">1. About Hero Banner & Title</h3>
                <p className="text-xs font-medium text-gray-600 mt-1">Edit main About Us title ("Spreading Joy Since 1995"), sub-headline, and hero image URL.</p>
              </div>
              <div className="pt-2 text-xs font-black text-[#4A0E0E] flex items-center gap-1">
                Edit About Hero <ChevronRight size={14} />
              </div>
            </div>

            {/* About Section 2 */}
            <div 
              onClick={() => { setActiveSection('about_story'); setCurrentStep('edit'); }}
              className="bg-white hover:bg-amber-50/60 p-6 rounded-3xl border-2 border-amber-900/15 hover:border-[#4A0E0E] shadow-sm hover:shadow-md transition-all cursor-pointer group space-y-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-[#4A0E0E] flex items-center justify-center font-black">
                <BookOpen size={26} />
              </div>
              <div>
                <h3 className="font-serif font-black text-gray-900 text-lg group-hover:text-[#4A0E0E]">2. Company Story & Journey</h3>
                <p className="text-xs font-medium text-gray-600 mt-1">Edit story section headline, "30+ Years of Excellence" badge, and company journey paragraphs 1 & 2.</p>
              </div>
              <div className="pt-2 text-xs font-black text-[#4A0E0E] flex items-center gap-1">
                Edit Company Story <ChevronRight size={14} />
              </div>
            </div>

            {/* About Section 3 */}
            <div 
              onClick={() => { setActiveSection('about_business'); setCurrentStep('edit'); }}
              className="bg-white hover:bg-amber-50/60 p-6 rounded-3xl border-2 border-amber-900/15 hover:border-[#4A0E0E] shadow-sm hover:shadow-md transition-all cursor-pointer group space-y-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-[#4A0E0E] flex items-center justify-center font-black">
                <Store size={26} />
              </div>
              <div>
                <h3 className="font-serif font-black text-gray-900 text-lg group-hover:text-[#4A0E0E]">3. Wholesale & Retail Business</h3>
                <p className="text-xs font-medium text-gray-600 mt-1">Edit Wholesale fireworks supply description and Retail customer ordering text.</p>
              </div>
              <div className="pt-2 text-xs font-black text-[#4A0E0E] flex items-center gap-1">
                Edit Business Cards <ChevronRight size={14} />
              </div>
            </div>

            {/* About Section 4 */}
            <div 
              onClick={() => { setActiveSection('about_trust'); setCurrentStep('edit'); }}
              className="bg-white hover:bg-amber-50/60 p-6 rounded-3xl border-2 border-amber-900/15 hover:border-[#4A0E0E] shadow-sm hover:shadow-md transition-all cursor-pointer group space-y-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-[#4A0E0E] flex items-center justify-center font-black">
                <Award size={26} />
              </div>
              <div>
                <h3 className="font-serif font-black text-gray-900 text-lg group-hover:text-[#4A0E0E]">4. 4 Trust Pillars & Why Choose Us</h3>
                <p className="text-xs font-medium text-gray-600 mt-1">Edit 4 trust nodes: Quality, Safety, Variety, and Trust titles & descriptions.</p>
              </div>
              <div className="pt-2 text-xs font-black text-[#4A0E0E] flex items-center gap-1">
                Edit Trust Pillars <ChevronRight size={14} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* LEVEL 3: EDITING CONTENT FORM FOR SELECTED SECTION */}
      {/* =================================================================== */}
      {currentStep === 'edit' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(activeSection?.startsWith('home') ? 'home_sections' : 'about_sections')}
              className="px-4 py-2.5 bg-[#FAF7F2] hover:bg-amber-100/70 border border-amber-900/20 text-[#4A0E0E] rounded-2xl text-xs font-black transition-all flex items-center gap-2 shadow-sm"
            >
              <ArrowLeft size={16} strokeWidth={2.5} /> Back to {activeSection?.startsWith('home') ? 'Home Sections' : 'About Sections'}
            </button>
            
            <span className="text-xs font-black text-[#4A0E0E] bg-[#FFD700] px-3.5 py-1.5 rounded-full border border-amber-400">
              Editing: {activeSection}
            </span>
          </div>

          {/* EDIT FORM 1: HERO BANNERS & SLIDER */}
          {activeSection === 'home_banners' && (
            <div className="space-y-6 bg-[#FAF7F2] p-7 rounded-3xl border-2 border-amber-900/15 shadow-sm">
              <div className="flex items-center justify-between flex-wrap gap-4 border-b border-amber-900/15 pb-4">
                <div>
                  <h3 className="text-2xl font-serif font-black text-gray-900">Hero Banners & Slider Controls</h3>
                  <p className="text-xs font-bold text-gray-500 mt-0.5">Control slider titles, descriptions, CTA button text, and upload slide images.</p>
                </div>
                <button 
                  onClick={() => setShowAddBannerModal(true)}
                  className="bg-[#4A0E0E] hover:bg-red-950 text-white px-5 py-3 rounded-2xl text-xs font-black flex items-center gap-2 shadow-md"
                >
                  <Plus size={18} /> Add New Banner
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {banners.map((banner) => (
                  <div 
                    key={banner.id} 
                    className={`bg-white rounded-3xl p-5 border-2 transition-all shadow-sm flex flex-col justify-between space-y-4 ${
                      banner.active ? 'border-amber-900/20' : 'border-gray-300 opacity-60 bg-gray-50'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="w-full h-40 rounded-2xl overflow-hidden relative border border-amber-900/15 shadow-inner">
                        <img 
                          src={banner.imageUrl} 
                          alt={banner.title} 
                          className="w-full h-full object-cover" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3 flex flex-col justify-end">
                          <span className="text-[10px] font-black text-[#FFD700] uppercase tracking-wider">
                            {banner.id} • {banner.link}
                          </span>
                          <p className="text-white font-serif font-black text-sm line-clamp-1">{banner.title}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <button 
                          onClick={() => toggleBannerStatus(banner.id)}
                          className={`text-[11px] font-black px-3 py-1 rounded-full border transition-all ${
                            banner.active 
                              ? 'bg-emerald-100 text-emerald-900 border-emerald-300' 
                              : 'bg-gray-200 text-gray-700 border-gray-300'
                          }`}
                        >
                          {banner.active ? '✓ Active On Website' : 'Hidden'}
                        </button>
                        <span className="text-[10px] font-bold text-gray-500">CTA: {banner.buttonText}</span>
                      </div>

                      <h4 className="font-serif font-black text-gray-900 text-base">{banner.title}</h4>
                      <p className="text-xs font-bold text-gray-600 line-clamp-2">{banner.subtitle}</p>
                    </div>

                    <div className="pt-3 border-t border-amber-900/10 flex items-center justify-between">
                      <button
                        onClick={() => setEditingBanner({ ...banner })}
                        className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-[#4A0E0E] rounded-xl text-xs font-black flex items-center gap-1.5 transition-colors"
                      >
                        <Edit3 size={14} /> Edit Banner
                      </button>

                      <button 
                        onClick={() => handleDeleteBanner(banner.id)}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors" 
                        title="Delete Banner"
                      >
                        <Trash2 size={16}/>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* EDIT FORM 2: ANNOUNCEMENT TICKER */}
          {activeSection === 'home_ticker' && (
            <form onSubmit={handleSaveSectionContent} className="bg-[#FAF7F2] p-7 rounded-3xl border-2 border-amber-900/15 shadow-sm space-y-6">
              <div className="border-b border-amber-900/15 pb-4">
                <h3 className="text-2xl font-serif font-black text-gray-900">Announcement Ticker & Promo Bar</h3>
                <p className="text-xs font-bold text-gray-500 mt-0.5">Control top marquee announcement text and festive promo offer badges.</p>
              </div>

              {/* Live Preview */}
              <div className="space-y-2">
                <p className="text-xs font-black uppercase text-amber-950 tracking-wider">Live Announcement Bar Preview:</p>
                <div className="bg-gradient-to-r from-[#4A0E0E] via-[#701515] to-[#4A0E0E] text-[#FFD700] p-3.5 rounded-2xl border border-amber-400/40 shadow-sm flex items-center gap-3 text-xs font-black">
                  <Megaphone size={18} className="shrink-0 text-[#FFD700] animate-bounce" />
                  <marquee className="font-bold text-white tracking-wide">{announcementText}</marquee>
                </div>
              </div>

              <div className="space-y-4 text-xs font-bold pt-2">
                <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-amber-900/15 shadow-sm">
                  <div>
                    <p className="text-sm font-black text-gray-900">Enable Scrolling Announcement Bar</p>
                    <p className="text-[11px] text-gray-600 font-medium">Show announcement top bar on customer website</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={isTickerActive}
                    onChange={(e) => setIsTickerActive(e.target.checked)}
                    className="w-6 h-6 accent-[#4A0E0E] cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-[#4A0E0E] uppercase tracking-wider mb-2">Ticker Announcement Text *</label>
                  <textarea 
                    rows={3}
                    required
                    value={announcementText}
                    onChange={(e) => setAnnouncementText(e.target.value)}
                    className="w-full p-4 bg-white border-2 border-amber-900/20 rounded-2xl text-sm font-black text-gray-900 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#4A0E0E] uppercase tracking-wider mb-1.5">Festive Discount (%)</label>
                    <input 
                      type="number"
                      value={discountPercent}
                      onChange={(e) => setDiscountPercent(e.target.value)}
                      className="w-full p-3.5 bg-white border-2 border-amber-900/20 rounded-2xl text-sm font-black text-gray-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[#4A0E0E] uppercase tracking-wider mb-1.5">Min Order for Discount (₹)</label>
                    <input 
                      type="number"
                      value={minOrderForDiscount}
                      onChange={(e) => setMinOrderForDiscount(e.target.value)}
                      className="w-full p-3.5 bg-white border-2 border-amber-900/20 rounded-2xl text-sm font-black text-gray-900 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button 
                  type="submit"
                  className="px-6 py-3.5 bg-[#4A0E0E] hover:bg-red-950 text-white rounded-2xl font-black text-xs shadow-md flex items-center gap-2"
                >
                  <Save size={16} /> Save Ticker Section
                </button>
              </div>
            </form>
          )}

          {/* EDIT FORM 3: HOMEPAGE HEADINGS */}
          {activeSection === 'home_headings' && (
            <form onSubmit={handleSaveSectionContent} className="bg-[#FAF7F2] p-7 rounded-3xl border-2 border-amber-900/15 shadow-sm space-y-6">
              <div className="border-b border-amber-900/15 pb-4">
                <h3 className="text-2xl font-serif font-black text-gray-900">Category & Featured Section Headings</h3>
                <p className="text-xs font-bold text-gray-500 mt-0.5">Edit main title and sub-headline text for homepage sections.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs font-bold">
                <div>
                  <label className="block text-[#4A0E0E] uppercase tracking-wider mb-1.5">Category Section Main Title</label>
                  <input 
                    type="text"
                    value={homeCategoryHeading}
                    onChange={(e) => setHomeCategoryHeading(e.target.value)}
                    className="w-full p-3.5 bg-white border-2 border-amber-900/20 rounded-2xl text-sm font-black text-gray-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#4A0E0E] uppercase tracking-wider mb-1.5">Category Section Subtitle</label>
                  <input 
                    type="text"
                    value={homeCategorySubtext}
                    onChange={(e) => setHomeCategorySubtext(e.target.value)}
                    className="w-full p-3.5 bg-white border-2 border-amber-900/20 rounded-2xl text-xs font-bold text-gray-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#4A0E0E] uppercase tracking-wider mb-1.5">Featured Products Main Title</label>
                  <input 
                    type="text"
                    value={homeFeaturedHeading}
                    onChange={(e) => setHomeFeaturedHeading(e.target.value)}
                    className="w-full p-3.5 bg-white border-2 border-amber-900/20 rounded-2xl text-sm font-black text-gray-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#4A0E0E] uppercase tracking-wider mb-1.5">Featured Products Subtext</label>
                  <input 
                    type="text"
                    value={homeFeaturedSubtext}
                    onChange={(e) => setHomeFeaturedSubtext(e.target.value)}
                    className="w-full p-3.5 bg-white border-2 border-amber-900/20 rounded-2xl text-xs font-bold text-gray-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button 
                  type="submit"
                  className="px-6 py-3.5 bg-[#4A0E0E] hover:bg-red-950 text-white rounded-2xl font-black text-xs shadow-md flex items-center gap-2"
                >
                  <Save size={16} /> Save Section Headings
                </button>
              </div>
            </form>
          )}

          {/* EDIT FORM 4: STORE INFO */}
          {activeSection === 'home_store' && (
            <form onSubmit={handleSaveSectionContent} className="bg-[#FAF7F2] p-7 rounded-3xl border-2 border-amber-900/15 shadow-sm space-y-6">
              <div className="border-b border-amber-900/15 pb-4">
                <h3 className="text-2xl font-serif font-black text-gray-900">Store Public Identity & Contact Footer</h3>
                <p className="text-xs font-bold text-gray-500 mt-0.5">These details appear on customer invoices, website header, and footer.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs font-bold">
                <div>
                  <label className="block text-[#4A0E0E] uppercase tracking-wider mb-1.5">Official Brand Store Name</label>
                  <input 
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full p-3.5 bg-white border-2 border-amber-900/20 rounded-2xl text-sm font-black text-gray-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#4A0E0E] uppercase tracking-wider mb-1.5">GSTIN Number</label>
                  <input 
                    type="text"
                    value={gstinNumber}
                    onChange={(e) => setGstinNumber(e.target.value)}
                    className="w-full p-3.5 bg-white border-2 border-amber-900/20 rounded-2xl text-sm font-black text-gray-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#4A0E0E] uppercase tracking-wider mb-1.5">Support Phone</label>
                  <input 
                    type="text"
                    value={supportPhone}
                    onChange={(e) => setSupportPhone(e.target.value)}
                    className="w-full p-3.5 bg-white border-2 border-amber-900/20 rounded-2xl text-sm font-black text-gray-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#4A0E0E] uppercase tracking-wider mb-1.5">WhatsApp Number</label>
                  <input 
                    type="text"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    className="w-full p-3.5 bg-white border-2 border-amber-900/20 rounded-2xl text-sm font-black text-gray-900 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[#4A0E0E] uppercase tracking-wider mb-1.5">Support Email</label>
                  <input 
                    type="email"
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                    className="w-full p-3.5 bg-white border-2 border-amber-900/20 rounded-2xl text-sm font-black text-gray-900 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[#4A0E0E] uppercase tracking-wider mb-1.5">Factory / Shop Physical Address</label>
                  <textarea 
                    rows={2}
                    value={storeAddress}
                    onChange={(e) => setStoreAddress(e.target.value)}
                    className="w-full p-3.5 bg-white border-2 border-amber-900/20 rounded-2xl text-sm font-black text-gray-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button 
                  type="submit"
                  className="px-6 py-3.5 bg-[#4A0E0E] hover:bg-red-950 text-white rounded-2xl font-black text-xs shadow-md flex items-center gap-2"
                >
                  <Save size={16} /> Save Store Information
                </button>
              </div>
            </form>
          )}

          {/* EDIT FORM 5: ORDER RULES */}
          {activeSection === 'home_rules' && (
            <form onSubmit={handleSaveSectionContent} className="bg-[#FAF7F2] p-7 rounded-3xl border-2 border-amber-900/15 shadow-sm space-y-6">
              <div className="border-b border-amber-900/15 pb-4">
                <h3 className="text-2xl font-serif font-black text-gray-900">Order Acceptance & Maintenance Mode</h3>
                <p className="text-xs font-bold text-gray-500 mt-0.5">Control online order checkout, minimum order amount, and emergency notices.</p>
              </div>

              <div className="space-y-4 text-xs font-bold">
                <div className="flex items-center justify-between bg-white p-5 rounded-3xl border-2 border-amber-900/15 shadow-sm">
                  <div>
                    <p className="text-base font-black text-gray-900">Accepting Online Orders</p>
                    <p className="text-xs text-emerald-800 font-bold mt-0.5">Allow buyers to add items to cart and complete checkout</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={acceptingOrders}
                    onChange={(e) => setAcceptingOrders(e.target.checked)}
                    className="w-7 h-7 accent-[#4A0E0E] cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-[#4A0E0E] uppercase tracking-wider mb-1.5">Minimum Order Amount for Checkout (₹)</label>
                  <input 
                    type="number"
                    value={minOrderAmount}
                    onChange={(e) => setMinOrderAmount(e.target.value)}
                    className="w-full p-3.5 bg-white border-2 border-amber-900/20 rounded-2xl text-sm font-black text-gray-900 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-between bg-white p-4 rounded-2xl border-2 border-amber-900/15 shadow-sm">
                  <div>
                    <p className="text-sm font-black text-rose-900">Maintenance Mode</p>
                    <p className="text-[11px] text-gray-600 font-medium">Show maintenance pop-up message to visitors</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={maintenanceMode}
                    onChange={(e) => setMaintenanceMode(e.target.checked)}
                    className="w-6 h-6 accent-rose-700 cursor-pointer"
                  />
                </div>

                {maintenanceMode && (
                  <div>
                    <label className="block text-rose-900 uppercase tracking-wider mb-1.5">Maintenance Notice Message</label>
                    <textarea 
                      rows={2}
                      value={maintenanceMessage}
                      onChange={(e) => setMaintenanceMessage(e.target.value)}
                      className="w-full p-3.5 bg-rose-50 border-2 border-rose-300 rounded-2xl text-xs font-bold text-rose-950 focus:outline-none"
                    />
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-end">
                <button 
                  type="submit"
                  className="px-6 py-3.5 bg-[#4A0E0E] hover:bg-red-950 text-white rounded-2xl font-black text-xs shadow-md flex items-center gap-2"
                >
                  <Save size={16} /> Save Order Rules
                </button>
              </div>
            </form>
          )}

          {/* EDIT FORM 6: ABOUT HERO */}
          {activeSection === 'about_hero' && (
            <form onSubmit={handleSaveSectionContent} className="bg-[#FAF7F2] p-7 rounded-3xl border-2 border-amber-900/15 shadow-sm space-y-6">
              <div className="border-b border-amber-900/15 pb-4">
                <h3 className="text-2xl font-serif font-black text-gray-900">About Hero Banner & Main Title</h3>
                <p className="text-xs font-bold text-gray-500 mt-0.5">Edit main title, sub-headline, and background image for the About page.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs font-bold">
                <div>
                  <label className="block text-[#4A0E0E] uppercase tracking-wider mb-1.5">Hero Main Title *</label>
                  <input 
                    type="text"
                    required
                    value={aboutHeroTitle}
                    onChange={(e) => setAboutHeroTitle(e.target.value)}
                    className="w-full p-3.5 bg-white border-2 border-amber-900/20 rounded-2xl text-sm font-black text-gray-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#4A0E0E] uppercase tracking-wider mb-1.5">Hero Sub-headline *</label>
                  <input 
                    type="text"
                    required
                    value={aboutHeroSubheadline}
                    onChange={(e) => setAboutHeroSubheadline(e.target.value)}
                    className="w-full p-3.5 bg-white border-2 border-amber-900/20 rounded-2xl text-sm font-black text-gray-900 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[#4A0E0E] uppercase tracking-wider mb-1.5">Hero Background Banner Image URL</label>
                  <input 
                    type="text"
                    value={aboutHeroImage}
                    onChange={(e) => setAboutHeroImage(e.target.value)}
                    className="w-full p-3.5 bg-white border-2 border-amber-900/20 rounded-2xl text-xs font-bold text-gray-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button 
                  type="submit"
                  className="px-6 py-3.5 bg-[#4A0E0E] hover:bg-red-950 text-white rounded-2xl font-black text-xs shadow-md flex items-center gap-2"
                >
                  <Save size={16} /> Save About Hero Section
                </button>
              </div>
            </form>
          )}

          {/* EDIT FORM 7: ABOUT STORY */}
          {activeSection === 'about_story' && (
            <form onSubmit={handleSaveSectionContent} className="bg-[#FAF7F2] p-7 rounded-3xl border-2 border-amber-900/15 shadow-sm space-y-6">
              <div className="border-b border-amber-900/15 pb-4">
                <h3 className="text-2xl font-serif font-black text-gray-900">Company Story & Journey Paragraphs</h3>
                <p className="text-xs font-bold text-gray-500 mt-0.5">Edit company history text and years of experience badge.</p>
              </div>

              <div className="space-y-4 text-xs font-bold">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-[#4A0E0E] uppercase tracking-wider mb-1.5">Story Section Headline</label>
                    <input 
                      type="text"
                      value={aboutStoryHeadline}
                      onChange={(e) => setAboutStoryHeadline(e.target.value)}
                      className="w-full p-3.5 bg-white border-2 border-amber-900/20 rounded-2xl text-sm font-black text-gray-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[#4A0E0E] uppercase tracking-wider mb-1.5">Years Badge (e.g. 30+)</label>
                    <input 
                      type="text"
                      value={aboutYearsExperience}
                      onChange={(e) => setAboutYearsExperience(e.target.value)}
                      className="w-full p-3.5 bg-white border-2 border-amber-900/20 rounded-2xl text-sm font-black text-gray-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#4A0E0E] uppercase tracking-wider mb-1.5">Company Story Paragraph 1</label>
                  <textarea 
                    rows={3}
                    value={aboutStoryParagraph1}
                    onChange={(e) => setAboutStoryParagraph1(e.target.value)}
                    className="w-full p-4 bg-white border-2 border-amber-900/20 rounded-2xl text-xs font-bold text-gray-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#4A0E0E] uppercase tracking-wider mb-1.5">Company Story Paragraph 2</label>
                  <textarea 
                    rows={3}
                    value={aboutStoryParagraph2}
                    onChange={(e) => setAboutStoryParagraph2(e.target.value)}
                    className="w-full p-4 bg-white border-2 border-amber-900/20 rounded-2xl text-xs font-bold text-gray-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button 
                  type="submit"
                  className="px-6 py-3.5 bg-[#4A0E0E] hover:bg-red-950 text-white rounded-2xl font-black text-xs shadow-md flex items-center gap-2"
                >
                  <Save size={16} /> Save Company Story Section
                </button>
              </div>
            </form>
          )}

          {/* EDIT FORM 8: ABOUT BUSINESS */}
          {activeSection === 'about_business' && (
            <form onSubmit={handleSaveSectionContent} className="bg-[#FAF7F2] p-7 rounded-3xl border-2 border-amber-900/15 shadow-sm space-y-6">
              <div className="border-b border-amber-900/15 pb-4">
                <h3 className="text-2xl font-serif font-black text-gray-900">Wholesale & Retail Business Descriptions</h3>
                <p className="text-xs font-bold text-gray-500 mt-0.5">Edit bulk wholesale supply and retail shop text cards on About page.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs font-bold">
                <div className="space-y-3">
                  <div>
                    <label className="block text-[#4A0E0E] uppercase tracking-wider mb-1">Wholesale Title</label>
                    <input 
                      type="text"
                      value={wholesaleHeading}
                      onChange={(e) => setWholesaleHeading(e.target.value)}
                      className="w-full p-3.5 bg-white border-2 border-amber-900/20 rounded-2xl text-sm font-black text-gray-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 text-[11px] mb-1">Wholesale Description Text</label>
                    <textarea 
                      rows={4}
                      value={wholesaleDesc}
                      onChange={(e) => setWholesaleDesc(e.target.value)}
                      className="w-full p-3.5 bg-white border-2 border-amber-900/20 rounded-2xl text-xs font-bold text-gray-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[#4A0E0E] uppercase tracking-wider mb-1">Retail Title</label>
                    <input 
                      type="text"
                      value={retailHeading}
                      onChange={(e) => setRetailHeading(e.target.value)}
                      className="w-full p-3.5 bg-white border-2 border-amber-900/20 rounded-2xl text-sm font-black text-gray-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 text-[11px] mb-1">Retail Description Text</label>
                    <textarea 
                      rows={4}
                      value={retailDesc}
                      onChange={(e) => setRetailDesc(e.target.value)}
                      className="w-full p-3.5 bg-white border-2 border-amber-900/20 rounded-2xl text-xs font-bold text-gray-900 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button 
                  type="submit"
                  className="px-6 py-3.5 bg-[#4A0E0E] hover:bg-red-950 text-white rounded-2xl font-black text-xs shadow-md flex items-center gap-2"
                >
                  <Save size={16} /> Save Business Cards Section
                </button>
              </div>
            </form>
          )}

          {/* EDIT FORM 9: ABOUT TRUST PILLARS */}
          {activeSection === 'about_trust' && (
            <form onSubmit={handleSaveSectionContent} className="bg-[#FAF7F2] p-7 rounded-3xl border-2 border-amber-900/15 shadow-sm space-y-6">
              <div className="border-b border-amber-900/15 pb-4">
                <h3 className="text-2xl font-serif font-black text-gray-900">4 Trust Pillars & Why Choose Us</h3>
                <p className="text-xs font-bold text-gray-500 mt-0.5">Edit Quality, Safety, Variety, and Trust titles & descriptions.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold">
                <div className="p-4 bg-white rounded-2xl border-2 border-amber-900/15 space-y-2">
                  <p className="font-black text-[#4A0E0E] text-sm">Pillar 1: Quality</p>
                  <input 
                    type="text"
                    value={whyNode1Title}
                    onChange={(e) => setWhyNode1Title(e.target.value)}
                    className="w-full p-3 bg-amber-50/50 border rounded-xl text-xs font-bold text-gray-900"
                  />
                  <input 
                    type="text"
                    value={whyNode1Desc}
                    onChange={(e) => setWhyNode1Desc(e.target.value)}
                    className="w-full p-3 bg-amber-50/50 border rounded-xl text-xs text-gray-700"
                  />
                </div>

                <div className="p-4 bg-white rounded-2xl border-2 border-amber-900/15 space-y-2">
                  <p className="font-black text-[#4A0E0E] text-sm">Pillar 2: Safety</p>
                  <input 
                    type="text"
                    value={whyNode2Title}
                    onChange={(e) => setWhyNode2Title(e.target.value)}
                    className="w-full p-3 bg-amber-50/50 border rounded-xl text-xs font-bold text-gray-900"
                  />
                  <input 
                    type="text"
                    value={whyNode2Desc}
                    onChange={(e) => setWhyNode2Desc(e.target.value)}
                    className="w-full p-3 bg-amber-50/50 border rounded-xl text-xs text-gray-700"
                  />
                </div>

                <div className="p-4 bg-white rounded-2xl border-2 border-amber-900/15 space-y-2">
                  <p className="font-black text-[#4A0E0E] text-sm">Pillar 3: Variety</p>
                  <input 
                    type="text"
                    value={whyNode3Title}
                    onChange={(e) => setWhyNode3Title(e.target.value)}
                    className="w-full p-3 bg-amber-50/50 border rounded-xl text-xs font-bold text-gray-900"
                  />
                  <input 
                    type="text"
                    value={whyNode3Desc}
                    onChange={(e) => setWhyNode3Desc(e.target.value)}
                    className="w-full p-3 bg-amber-50/50 border rounded-xl text-xs text-gray-700"
                  />
                </div>

                <div className="p-4 bg-white rounded-2xl border-2 border-amber-900/15 space-y-2">
                  <p className="font-black text-[#4A0E0E] text-sm">Pillar 4: Trust</p>
                  <input 
                    type="text"
                    value={whyNode4Title}
                    onChange={(e) => setWhyNode4Title(e.target.value)}
                    className="w-full p-3 bg-amber-50/50 border rounded-xl text-xs font-bold text-gray-900"
                  />
                  <input 
                    type="text"
                    value={whyNode4Desc}
                    onChange={(e) => setWhyNode4Desc(e.target.value)}
                    className="w-full p-3 bg-amber-50/50 border rounded-xl text-xs text-gray-700"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button 
                  type="submit"
                  className="px-6 py-3.5 bg-[#4A0E0E] hover:bg-red-950 text-white rounded-2xl font-black text-xs shadow-md flex items-center gap-2"
                >
                  <Save size={16} /> Save Trust Pillars Section
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Edit Banner Modal */}
      {editingBanner && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSaveBannerEdit} className="bg-[#FAF7F2] rounded-3xl max-w-lg w-full p-7 shadow-2xl border border-amber-900/30 space-y-5 animate-in fade-in zoom-in duration-200 relative">
            <button 
              type="button"
              onClick={() => setEditingBanner(null)}
              className="absolute top-6 right-6 w-9 h-9 rounded-full bg-amber-200/80 hover:bg-amber-300 text-[#4A0E0E] flex items-center justify-center font-black"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 border-b border-amber-900/15 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#4A0E0E] to-amber-700 flex items-center justify-center text-white font-black text-xl shadow-md">
                <Edit3 size={22} />
              </div>
              <div>
                <h3 className="text-xl font-serif font-black text-gray-900">Edit Banner #{editingBanner.id}</h3>
                <p className="text-xs font-bold text-gray-500">Update banner text, image link, and action CTA button</p>
              </div>
            </div>

            <div className="space-y-4 text-xs font-bold">
              <div>
                <label className="block text-[#4A0E0E] uppercase tracking-wider mb-1.5">Banner Main Title *</label>
                <input 
                  type="text"
                  required
                  value={editingBanner.title}
                  onChange={(e) => setEditingBanner({ ...editingBanner, title: e.target.value })}
                  className="w-full p-3 bg-white border-2 border-amber-900/20 rounded-2xl text-sm font-black text-gray-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#4A0E0E] uppercase tracking-wider mb-1.5">Subtitle / Offer Description</label>
                <textarea 
                  rows={2}
                  value={editingBanner.subtitle}
                  onChange={(e) => setEditingBanner({ ...editingBanner, subtitle: e.target.value })}
                  className="w-full p-3 bg-white border-2 border-amber-900/20 rounded-2xl text-xs font-bold text-gray-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#4A0E0E] uppercase tracking-wider mb-1.5">Button Text (CTA)</label>
                  <input 
                    type="text"
                    value={editingBanner.buttonText}
                    onChange={(e) => setEditingBanner({ ...editingBanner, buttonText: e.target.value })}
                    className="w-full p-3 bg-white border-2 border-amber-900/20 rounded-2xl text-xs font-black text-gray-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#4A0E0E] uppercase tracking-wider mb-1.5">Button Target Link</label>
                  <input 
                    type="text"
                    value={editingBanner.link}
                    onChange={(e) => setEditingBanner({ ...editingBanner, link: e.target.value })}
                    className="w-full p-3 bg-white border-2 border-amber-900/20 rounded-2xl text-xs font-black text-gray-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#4A0E0E] uppercase tracking-wider mb-1.5">Banner Image URL</label>
                <input 
                  type="text"
                  value={editingBanner.imageUrl}
                  onChange={(e) => setEditingBanner({ ...editingBanner, imageUrl: e.target.value })}
                  className="w-full p-3 bg-white border-2 border-amber-900/20 rounded-2xl text-xs font-bold text-gray-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-amber-900/15">
              <button 
                type="button"
                onClick={() => setEditingBanner(null)}
                className="py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-2xl text-xs font-black"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="py-3 bg-[#4A0E0E] hover:bg-red-950 text-white rounded-2xl text-xs font-black shadow-md"
              >
                Save Banner
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add New Banner Modal */}
      {showAddBannerModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreateBanner} className="bg-[#FAF7F2] rounded-3xl max-w-lg w-full p-7 shadow-2xl border border-amber-900/30 space-y-5 animate-in fade-in zoom-in duration-200 relative">
            <button 
              type="button"
              onClick={() => setShowAddBannerModal(false)}
              className="absolute top-6 right-6 w-9 h-9 rounded-full bg-amber-200/80 hover:bg-amber-300 text-[#4A0E0E] flex items-center justify-center font-black"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 border-b border-amber-900/15 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#4A0E0E] to-amber-700 flex items-center justify-center text-white font-black text-xl shadow-md">
                <Plus size={24} />
              </div>
              <div>
                <h3 className="text-xl font-serif font-black text-gray-900">Add New Website Banner</h3>
                <p className="text-xs font-bold text-gray-500">Create a promotional slide for the homepage carousel</p>
              </div>
            </div>

            <div className="space-y-4 text-xs font-bold">
              <div>
                <label className="block text-[#4A0E0E] uppercase tracking-wider mb-1.5">Banner Main Title *</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Diwali Mega Crackers Offer 2024"
                  value={newBanner.title}
                  onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
                  className="w-full p-3 bg-white border-2 border-amber-900/20 rounded-2xl text-sm font-black text-gray-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#4A0E0E] uppercase tracking-wider mb-1.5">Subtitle / Sub-headline</label>
                <textarea 
                  rows={2}
                  placeholder="e.g. Direct factory prices with fast shipping across Tamil Nadu."
                  value={newBanner.subtitle}
                  onChange={(e) => setNewBanner({ ...newBanner, subtitle: e.target.value })}
                  className="w-full p-3 bg-white border-2 border-amber-900/20 rounded-2xl text-xs font-bold text-gray-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#4A0E0E] uppercase tracking-wider mb-1.5">Button Text (CTA)</label>
                  <input 
                    type="text"
                    value={newBanner.buttonText}
                    onChange={(e) => setNewBanner({ ...newBanner, buttonText: e.target.value })}
                    className="w-full p-3 bg-white border-2 border-amber-900/20 rounded-2xl text-xs font-black text-gray-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#4A0E0E] uppercase tracking-wider mb-1.5">Target Link</label>
                  <input 
                    type="text"
                    value={newBanner.link}
                    onChange={(e) => setNewBanner({ ...newBanner, link: e.target.value })}
                    className="w-full p-3 bg-white border-2 border-amber-900/20 rounded-2xl text-xs font-black text-[#4A0E0E] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#4A0E0E] uppercase tracking-wider mb-1.5">Image URL</label>
                <input 
                  type="text"
                  value={newBanner.imageUrl}
                  onChange={(e) => setNewBanner({ ...newBanner, imageUrl: e.target.value })}
                  className="w-full p-3 bg-white border-2 border-amber-900/20 rounded-2xl text-xs font-bold text-gray-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-amber-900/15">
              <button 
                type="button"
                onClick={() => setShowAddBannerModal(false)}
                className="py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-2xl text-xs font-black"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="py-3 bg-[#4A0E0E] hover:bg-red-950 text-white rounded-2xl text-xs font-black shadow-md"
              >
                Publish Banner
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminWebsiteCMS;
