import { useState, useEffect, useRef } from 'react';
import { 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  UploadCloud, 
  Sparkles, 
  CheckCircle2, 
  X, 
  Eye, 
  Filter, 
  Loader2, 
  Maximize2,
  ChevronDown,
  Check,
  Camera,
  Layers,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';
import { subscribeGallery, saveGalleryItemToFirestore, deleteGalleryItemFromFirestore } from '../../services/firebaseService';
import { uploadToCloudinary } from '../../services/cloudinaryService';
import { useToast } from '../../context/ToastContext';
import { generateGalleryId } from '../../utils/idGenerator';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const GALLERY_CATEGORIES = [
  'Festivals',
  'Shop & Outlet',
  'Products Showcase',
  'Happy Customers',
  'Sky Shots & Aerials',
  'Manufacturing Unit'
];

const AdminGalleryManagement = () => {
  const { showToast } = useToast();
  const [galleryItems, setGalleryItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const categoryDropdownRef = useRef(null);

  // Pagination
  const itemsPerPage = 12;
  const [currentPage, setCurrentPage] = useState(1);

  // Modals
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState(null);
  const [previewImageModal, setPreviewImageModal] = useState(null);

  // Upload Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Festivals',
    description: '',
    span: 'md:col-span-1 md:row-span-1',
    imageUrl: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Subscribe to real-time Gallery collection in Firestore
  useEffect(() => {
    const unsubscribe = subscribeGallery((items) => {
      setGalleryItems(items || []);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Outside click for category dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setShowCategoryDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  // Handle image file selection & Cloudinary upload
  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setIsUploading(true);
      try {
        const url = await uploadToCloudinary(file, 'Karuppan Crackers/gallery');
        setImagePreview(url);
        setFormData(prev => ({ ...prev, imageUrl: url }));
        showToast('Photo uploaded to Cloudinary successfully!', 'success');
      } catch (err) {
        console.error("Upload error:", err);
        showToast('Failed to upload image', 'error');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      category: 'Festivals',
      description: '',
      span: 'md:col-span-1 md:row-span-1',
      imageUrl: ''
    });
    setImageFile(null);
    setImagePreview('');
    setShowUploadModal(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      category: item.category || 'Festivals',
      description: item.description || '',
      span: item.span || 'md:col-span-1 md:row-span-1',
      imageUrl: item.imageUrl || item.src || ''
    });
    setImagePreview(item.imageUrl || item.src || '');
    setShowUploadModal(true);
  };

  const handleSavePhoto = async (e) => {
    e.preventDefault();
    if (!formData.imageUrl && !imagePreview) {
      showToast('Please select or upload a photo image', 'error');
      return;
    }

    setIsSaving(true);
    const photoId = editingItem ? editingItem.id : generateGalleryId(galleryItems);

    const payload = {
      id: photoId,
      title: formData.title.trim() || `Diwali Celebration #${photoId}`,
      category: formData.category || 'Festivals',
      type: formData.category || 'Festivals',
      description: formData.description.trim() || '',
      span: formData.span || 'md:col-span-1 md:row-span-1',
      imageUrl: formData.imageUrl || imagePreview,
      src: formData.imageUrl || imagePreview,
      createdAt: editingItem?.createdAt || new Date().toISOString()
    };

    try {
      await saveGalleryItemToFirestore(payload);
      showToast(editingItem ? `Photo #${photoId} updated successfully!` : `🎉 New photo #${photoId} added to Gallery!`, 'success');
      setShowUploadModal(false);
      setEditingItem(null);
    } catch (err) {
      console.error("Error saving gallery item:", err);
      showToast('Failed to save photo to database', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDeletePhoto = async () => {
    if (!deleteConfirmItem) return;
    const targetId = deleteConfirmItem.id;
    try {
      await deleteGalleryItemFromFirestore(targetId);
      showToast(`Photo #${targetId} deleted from gallery!`, 'success');
    } catch (err) {
      console.error("Delete photo error:", err);
      showToast('Failed to delete photo', 'error');
    } finally {
      setDeleteConfirmItem(null);
    }
  };

  // Filter gallery items
  const filteredItems = galleryItems.filter(item => {
    const titleMatch = (item.title || '').toLowerCase().includes(searchQuery.toLowerCase());
    const descMatch = (item.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    const idMatch = (item.id || '').toLowerCase().includes(searchQuery.toLowerCase());
    const categoryMatch = selectedCategory === 'All' || item.category === selectedCategory || item.type === selectedCategory;

    return (titleMatch || descMatch || idMatch) && categoryMatch;
  });

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  if (isLoading) {
    return <LoadingSpinner message="Loading gallery showcase from database..." />;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#4A0E0E] via-[#701515] to-[#4A0E0E] p-7 rounded-3xl shadow-lg text-white">
        <div>
          <h1 className="text-3xl font-serif font-black tracking-wide text-white flex items-center gap-2">
            <Camera className="text-[#FFD700]" /> Store Gallery & Visual Showcase
          </h1>
          <p className="text-amber-200/90 text-sm mt-1 font-medium">
            Upload and manage celebration photos, festival memories, and store showcases. Changes reflect live on the website gallery.
          </p>
        </div>

        <button 
          onClick={handleOpenAddModal}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#FFD700] to-amber-500 hover:from-amber-400 hover:to-amber-600 text-[#4A0E0E] font-black text-sm shadow-md transition-all transform hover:scale-105 flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus size={18} /> Upload New Photo
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#FAF7F2] p-4 rounded-3xl border border-amber-900/10 shadow-sm">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-900/50" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by photo title, caption, or ID..."
            className="w-full pl-11 pr-4 py-3 bg-white border-2 border-amber-900/20 rounded-2xl text-xs sm:text-sm font-black text-gray-900 focus:outline-none focus:border-[#4A0E0E] shadow-sm"
          />
        </div>

        {/* Category Filter Dropdown Menu */}
        <div className="relative w-full sm:w-72" ref={categoryDropdownRef}>
          <button
            type="button"
            onClick={() => setShowCategoryDropdown(prev => !prev)}
            className="w-full flex items-center justify-between px-4 py-3 bg-white border-2 border-amber-900/20 hover:border-[#4A0E0E] rounded-2xl text-xs sm:text-sm font-black text-gray-800 shadow-sm transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2 truncate">
              <Filter size={16} className="text-[#4A0E0E] shrink-0" />
              <span className="truncate">
                {selectedCategory === 'All' ? 'All Categories' : selectedCategory}
              </span>
              <span className="px-2 py-0.5 bg-amber-100 text-[#4A0E0E] rounded-md text-[11px] font-bold shrink-0">
                {selectedCategory === 'All' 
                  ? galleryItems.length 
                  : galleryItems.filter(i => i.category === selectedCategory || i.type === selectedCategory).length}
              </span>
            </div>
            <ChevronDown 
              size={17} 
              className={`text-gray-500 transition-transform duration-200 shrink-0 ml-1.5 ${showCategoryDropdown ? 'rotate-180 text-[#4A0E0E]' : ''}`} 
            />
          </button>

          {/* Dropdown Popover */}
          {showCategoryDropdown && (
            <div className="absolute right-0 top-full mt-2 w-full sm:w-80 bg-white rounded-2xl shadow-xl border-2 border-amber-900/15 py-2 z-40 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between">
                <span className="text-[11px] font-black text-gray-400 uppercase tracking-wider">
                  Select Filter Category
                </span>
                {selectedCategory !== 'All' && (
                  <button
                    onClick={() => {
                      setSelectedCategory('All');
                      setShowCategoryDropdown(false);
                    }}
                    className="text-[11px] font-bold text-[#4A0E0E] hover:underline cursor-pointer"
                  >
                    Reset Filter
                  </button>
                )}
              </div>

              <div className="max-h-60 overflow-y-auto py-1">
                {/* All Option */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('All');
                    setShowCategoryDropdown(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-xs font-bold transition-colors cursor-pointer ${
                    selectedCategory === 'All'
                      ? 'bg-amber-50 text-[#4A0E0E] font-black'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Layers size={15} className={selectedCategory === 'All' ? 'text-[#4A0E0E]' : 'text-gray-400'} />
                    <span>All Photos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-bold">
                      {galleryItems.length}
                    </span>
                    {selectedCategory === 'All' && <Check size={15} className="text-[#4A0E0E]" />}
                  </div>
                </button>

                {/* Individual Categories */}
                {GALLERY_CATEGORIES.map((cat) => {
                  const count = galleryItems.filter(i => i.category === cat || i.type === cat).length;
                  const isSelected = selectedCategory === cat;

                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat);
                        setShowCategoryDropdown(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-2.5 text-xs font-bold transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-amber-50 text-[#4A0E0E] font-black'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Camera size={14} className={isSelected ? 'text-[#4A0E0E]' : 'text-gray-400'} />
                        <span className="truncate">{cat}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          count > 0 ? 'bg-amber-100 text-amber-900' : 'bg-gray-100 text-gray-400'
                        }`}>
                          {count}
                        </span>
                        {isSelected && <Check size={15} className="text-[#4A0E0E]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Photos Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-[#FAF7F2] rounded-3xl p-12 text-center border border-amber-900/10 space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 flex items-center justify-center text-[#4A0E0E]">
            <Camera size={32} />
          </div>
          <h3 className="text-xl font-serif font-black text-gray-900">No Gallery Photos Found</h3>
          <p className="text-xs font-bold text-gray-500 max-w-md mx-auto">
            {searchQuery || selectedCategory !== 'All' 
              ? 'No photos match your filter criteria. Try clearing search.' 
              : 'Start by uploading your first photo to showcase on the customer website gallery.'}
          </p>
          <button
            onClick={handleOpenAddModal}
            className="px-6 py-3 bg-[#4A0E0E] hover:bg-[#3B0B0B] text-[#FFD700] font-black text-xs rounded-2xl shadow-md transition-transform hover:scale-105 inline-flex items-center gap-2 cursor-pointer"
          >
            <Plus size={16} /> Upload First Photo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {paginatedItems.map((item) => {
            const imgSrc = item.imageUrl || item.src;
            return (
              <div 
                key={item.id}
                className="bg-white rounded-3xl overflow-hidden border-2 border-amber-900/10 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                  <img 
                    src={imgSrc} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out" 
                  />

                  {/* Badge */}
                  <div className="absolute top-3 left-3 bg-[#4A0E0E]/90 backdrop-blur-sm text-[#FFD700] text-[10px] font-black uppercase px-2.5 py-1 rounded-lg shadow-sm border border-amber-400/30">
                    {item.category || item.type || 'Gallery'}
                  </div>

                  {/* Hover Overlay with Quick Actions */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => setPreviewImageModal(imgSrc)}
                      className="p-2.5 bg-white/90 hover:bg-white text-[#4A0E0E] rounded-full shadow-lg transition-transform hover:scale-110 cursor-pointer"
                      title="View Full Image"
                    >
                      <Maximize2 size={16} />
                    </button>
                    <button
                      onClick={() => handleOpenEditModal(item)}
                      className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-transform hover:scale-110 cursor-pointer"
                      title="Edit Details"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmItem(item)}
                      className="p-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full shadow-lg transition-transform hover:scale-110 cursor-pointer"
                      title="Delete Photo"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Info Card */}
                <div className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-serif font-black text-sm text-gray-900 line-clamp-1">
                        {item.title || 'Untitled Photo'}
                      </h4>
                      <p className="text-[11px] font-mono text-gray-400 mt-0.5">
                        ID: {item.id}
                      </p>
                    </div>
                  </div>

                  {item.description && (
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {item.description}
                    </p>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                    <span className="text-[10px] font-bold text-gray-400">
                      {item.createdAt ? new Date(item.createdAt?.seconds ? item.createdAt.seconds * 1000 : item.createdAt).toLocaleDateString('en-IN') : 'Recent'}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditModal(item)}
                        className="px-2.5 py-1 bg-blue-50 text-blue-800 hover:bg-blue-600 hover:text-white rounded-lg font-black transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteConfirmItem(item)}
                        className="px-2.5 py-1 bg-rose-50 text-rose-800 hover:bg-rose-600 hover:text-white rounded-lg font-black transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Bar */}
      {filteredItems.length > itemsPerPage && (
        <div className="p-4 bg-[#FAF7F2] rounded-3xl border border-amber-900/10 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="text-xs font-bold text-gray-700">
            Showing <span className="font-black text-[#4A0E0E]">{startIndex + 1}</span> to <span className="font-black text-[#4A0E0E]">{Math.min(startIndex + itemsPerPage, filteredItems.length)}</span> of <span className="font-black text-[#4A0E0E]">{filteredItems.length}</span> photos
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="p-2 rounded-xl text-xs font-black bg-white border border-amber-900/15 text-gray-700 hover:bg-amber-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
              title="First Page"
            >
              <ChevronsLeft size={16} />
            </button>
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl text-xs font-black bg-white border border-amber-900/15 text-gray-700 hover:bg-amber-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
              title="Previous Page"
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-xl text-xs font-black transition-all border shadow-sm ${
                  currentPage === page
                    ? 'bg-[#4A0E0E] text-white border-[#4A0E0E]'
                    : 'bg-white text-gray-800 border-amber-900/15 hover:bg-amber-100'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl text-xs font-black bg-white border border-amber-900/15 text-gray-700 hover:bg-amber-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
              title="Next Page"
            >
              <ChevronRight size={16} />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl text-xs font-black bg-white border border-amber-900/15 text-gray-700 hover:bg-amber-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
              title="Last Page"
            >
              <ChevronsRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Upload / Edit Photo Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-amber-900/30 space-y-6 animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-amber-900/15 pb-4">
              <h3 className="text-xl font-serif font-black text-gray-900 flex items-center gap-2">
                <Camera className="text-[#4A0E0E]" /> {editingItem ? 'Edit Gallery Photo' : 'Upload New Photo to Gallery'}
              </h3>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="p-1 text-gray-400 hover:text-gray-700 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSavePhoto} className="space-y-4">
              {/* Photo Upload & Preview */}
              <div>
                <label className="block text-xs font-black text-[#4A0E0E] uppercase mb-2">Photo Image *</label>
                
                <div className="border-2 border-dashed border-amber-900/20 bg-white rounded-2xl p-4 text-center space-y-3">
                  {imagePreview ? (
                    <div className="relative inline-block group">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="max-h-48 rounded-xl object-contain shadow-md mx-auto" 
                      />
                      <label className="absolute inset-0 bg-black/50 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center font-bold text-xs cursor-pointer">
                        <UploadCloud size={18} className="mr-1.5" /> Change Photo
                        <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                      </label>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center py-6 cursor-pointer hover:bg-amber-50/50 rounded-xl transition-colors">
                      <div className="w-12 h-12 rounded-full bg-amber-100 text-[#4A0E0E] flex items-center justify-center mb-2">
                        {isUploading ? <Loader2 size={24} className="animate-spin" /> : <UploadCloud size={24} />}
                      </div>
                      <span className="font-bold text-xs text-gray-800">
                        {isUploading ? 'Uploading to Cloudinary...' : 'Click to Browse & Upload Photo Image'}
                      </span>
                      <span className="text-[11px] text-gray-400 mt-1">Supports JPG, PNG, WEBP, GIF</span>
                      <input type="file" accept="image/*" onChange={handleFileSelect} disabled={isUploading} className="hidden" />
                    </label>
                  )}
                </div>

                <div className="mt-2">
                  <label className="block text-[11px] font-bold text-gray-500 mb-1">Or paste Direct Image URL:</label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, imageUrl: e.target.value }));
                      setImagePreview(e.target.value);
                    }}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2 bg-white border border-amber-900/20 rounded-xl text-xs font-mono text-gray-800 focus:outline-none"
                  />
                </div>
              </div>

              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-[#4A0E0E] uppercase mb-1.5">Photo Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. Grand Diwali Night Aerials"
                    className="w-full px-4 py-2.5 bg-white border-2 border-amber-900/20 rounded-2xl text-xs font-black text-gray-900 focus:outline-none focus:border-[#4A0E0E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-[#4A0E0E] uppercase mb-1.5">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-white border-2 border-amber-900/20 rounded-2xl text-xs font-black text-gray-900 focus:outline-none focus:border-[#4A0E0E] cursor-pointer"
                  >
                    {GALLERY_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Grid Span Sizing Option */}
              <div>
                <label className="block text-xs font-black text-[#4A0E0E] uppercase mb-1.5">Display Size / Masonry Span</label>
                <select
                  value={formData.span}
                  onChange={(e) => setFormData(prev => ({ ...prev, span: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-white border-2 border-amber-900/20 rounded-2xl text-xs font-bold text-gray-900 focus:outline-none focus:border-[#4A0E0E] cursor-pointer"
                >
                  <option value="md:col-span-1 md:row-span-1">Standard Card (1x1)</option>
                  <option value="md:col-span-2 md:row-span-1">Wide Card (2x1)</option>
                  <option value="md:col-span-1 md:row-span-2">Tall Card (1x2)</option>
                  <option value="md:col-span-2 md:row-span-2">Large Featured Spotlight (2x2)</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-black text-[#4A0E0E] uppercase mb-1.5">Caption / Description</label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Optional notes or details about this photo..."
                  className="w-full px-4 py-2.5 bg-white border-2 border-amber-900/20 rounded-2xl text-xs font-bold text-gray-900 focus:outline-none focus:border-[#4A0E0E] resize-none"
                ></textarea>
              </div>

              {/* Buttons */}
              <div className="pt-3 border-t border-amber-900/15 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  disabled={isSaving || isUploading}
                  className="py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-2xl text-xs font-black cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || isUploading}
                  className="py-3 bg-gradient-to-r from-[#FFD700] to-amber-500 hover:from-amber-400 hover:to-amber-600 text-[#4A0E0E] rounded-2xl text-xs font-black shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
                >
                  {isSaving ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Check size={16} /> {editingItem ? 'Update Photo' : 'Publish to Gallery'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmItem && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] rounded-3xl max-w-md w-full p-8 shadow-2xl border border-rose-900/30 text-center relative space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 mx-auto rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shadow-md">
              <Trash2 size={32} />
            </div>

            <div>
              <h3 className="text-2xl font-serif font-black text-gray-900">Delete Photo?</h3>
              <p className="text-xs font-bold text-gray-600 mt-2">
                Are you sure you want to delete <span className="text-rose-700 font-black">"{deleteConfirmItem.title || deleteConfirmItem.id}"</span>? It will be removed immediately from the customer website gallery.
              </p>
            </div>

            <div className="pt-4 border-t border-amber-900/15 grid grid-cols-2 gap-3">
              <button 
                onClick={() => setDeleteConfirmItem(null)}
                className="py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-black text-xs rounded-2xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDeletePhoto}
                className="py-3 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-2xl shadow-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <Trash2 size={15} /> Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Lightbox Preview Modal */}
      {previewImageModal && (
        <div 
          onClick={() => setPreviewImageModal(null)}
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <button
              onClick={() => setPreviewImageModal(null)}
              className="absolute -top-10 right-0 text-white hover:text-amber-400 p-1 font-black"
            >
              <X size={28} />
            </button>
            <img 
              src={previewImageModal} 
              alt="Fullscreen Preview" 
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl border border-white/20"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGalleryManagement;
