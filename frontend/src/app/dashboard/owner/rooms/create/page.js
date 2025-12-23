'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import OwnerSidebar from '@/components/OwnerSidebar';
import OwnerHeader from '@/components/OwnerHeader';
import {
  ArrowLeft,
  Save,
  Plus,
  Upload,
  Bed,
  Bath,
  Square,
  DollarSign,
  Home,
  Users,
  Check,
  X,
  Image as ImageIcon,
  Camera,
  Trash2
} from 'lucide-react';

export default function CreateUpdateRoomPage({ params }) {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState('rooms');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  
  const [formData, setFormData] = useState({
    roomNumber: '',
    name: '',
    type: 'Single',
    price: '',
    beds: 1,
    baths: 1,
    size: '',
    amenities: ['WiFi', 'AC'],
    description: '',
    status: 'Available',
    images: []
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Simulate API call
      console.log('Form data:', formData);
      toast.success('Room created successfully!');
      router.push('/dashboard/owner/rooms');
    } catch (error) {
      toast.error('Failed to create room');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleAmenity = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length + imagePreviews.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    // Simulate upload
    setUploading(true);
    const newPreviews = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      name: file.name
    }));

    setTimeout(() => {
      setImagePreviews(prev => [...prev, ...newPreviews]);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...files.map(file => ({
          name: file.name,
          url: URL.createObjectURL(file)
        }))]
      }));
      setUploading(false);
      toast.success(`${files.length} image(s) uploaded`);
    }, 1000);
  };

  const removeImage = (id) => {
    setImagePreviews(prev => prev.filter(img => img.id !== id));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => {
        const previewIndex = imagePreviews.findIndex(img => img.id === id);
        return index !== previewIndex;
      })
    }));
    toast.success('Image removed');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const event = { target: { files } };
      handleImageUpload(event);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const roomTypes = ['Single', 'Double', 'Suite', 'Family', 'Penthouse'];
  const statuses = ['Available', 'Occupied', 'Maintenance', 'Reserved', 'Cleaning'];
  const allAmenities = ['WiFi', 'AC', 'TV', 'Mini Fridge', 'Kitchen', 'Balcony', 'Jacuzzi', 'Coffee Maker', 'Safe', 'Laundry', 'Breakfast', 'Parking', 'Gym Access', 'Swimming Pool', 'Room Service'];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <OwnerSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <OwnerHeader />
        
        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <button
                onClick={() => router.back()}
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
              >
                <ArrowLeft size={18} />
                Back to Rooms
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Add New Room</h1>
              <p className="text-gray-600">Create a new room listing for your property</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-gray-800">
              <div className="space-y-8">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Room Number *
                      </label>
                      <input
                        type="text"
                        name="roomNumber"
                        value={formData.roomNumber}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Room Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="e.g., Ocean View Suite"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Room Type *
                      </label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        required
                      >
                        {roomTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Monthly Price ($) *
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                          required
                          min="0"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Room Images */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Room Images</h3>
                  <div className="space-y-4">
                    {/* Upload Area */}
                    <div
                      className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                        uploading 
                          ? 'border-blue-400 bg-blue-50' 
                          : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                      }`}
                      onClick={triggerFileInput}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        className="hidden"
                        accept="image/*"
                        multiple
                      />
                      <div className="flex flex-col items-center justify-center">
                        {uploading ? (
                          <>
                            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mb-3"></div>
                            <p className="text-blue-600 font-medium">Uploading images...</p>
                          </>
                        ) : (
                          <>
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                              <Camera className="text-blue-600" size={24} />
                            </div>
                            <p className="text-gray-700 font-medium">Drag & drop images or click to upload</p>
                            <p className="text-gray-500 text-sm mt-1">
                              Upload up to 5 high-quality images (JPG, PNG, WebP)
                            </p>
                            <p className="text-gray-400 text-xs mt-2">
                              Recommended: 1200x800px or larger
                            </p>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Image Previews */}
                    {imagePreviews.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3">
                          Uploaded Images ({imagePreviews.length}/5)
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                          {imagePreviews.map((img) => (
                            <div key={img.id} className="relative group">
                              <div className="aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                                <img
                                  src={img.preview}
                                  alt={img.name}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeImage(img.id);
                                    }}
                                    className="opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-200 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600"
                                  >
                                    <Trash2 size={16} className="text-white" />
                                  </button>
                                </div>
                              </div>
                              <div className="mt-2 flex items-center justify-between">
                                <span className="text-xs text-gray-500 truncate" title={img.name}>
                                  {img.name.length > 15 ? `${img.name.substring(0, 15)}...` : img.name}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => removeImage(img.id)}
                                  className="text-red-500 hover:text-red-700 p-1"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            </div>
                          ))}
                          
                          {/* Add more button */}
                          {imagePreviews.length < 5 && (
                            <button
                              type="button"
                              onClick={triggerFileInput}
                              className="aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 flex flex-col items-center justify-center text-gray-500 hover:text-blue-600 transition-colors"
                            >
                              <Plus size={24} className="mb-2" />
                              <span className="text-sm font-medium">Add More</span>
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Room Specifications */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Room Specifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <Bed className="inline mr-2" size={16} />
                        Number of Beds
                      </label>
                      <select
                        name="beds"
                        value={formData.beds}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      >
                        {[1, 2, 3, 4, 5].map(num => (
                          <option key={num} value={num}>{num} bed{num > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <Bath className="inline mr-2" size={16} />
                        Number of Baths
                      </label>
                      <select
                        name="baths"
                        value={formData.baths}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      >
                        {[1, 2, 3].map(num => (
                          <option key={num} value={num}>{num} bath{num > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <Square className="inline mr-2" size={16} />
                        Room Size (sqft)
                      </label>
                      <input
                        type="text"
                        name="size"
                        value={formData.size}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="e.g., 300"
                      />
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                    {allAmenities.map(amenity => (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => toggleAmenity(amenity)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                          formData.amenities.includes(amenity)
                            ? 'bg-blue-50 border-blue-200 text-blue-700'
                            : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {formData.amenities.includes(amenity) ? (
                          <Check size={16} />
                        ) : (
                          <Plus size={16} />
                        )}
                        {amenity}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Status */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Status</h3>
                  <div className="flex flex-wrap gap-2">
                    {statuses.map(status => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, status }))}
                        className={`px-4 py-2 rounded-lg border transition-colors ${
                          formData.status === status
                            ? 'bg-blue-50 border-blue-200 text-blue-700 font-medium'
                            : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Describe the room features, view, and any special details..."
                  />
                </div>

                {/* Tips */}
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <ImageIcon className="text-blue-600 mt-0.5" size={18} />
                    <div>
                      <h4 className="font-medium text-blue-900 mb-1">Image Upload Tips</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Use high-quality, well-lit photos</li>
                        <li>• Show the bedroom, bathroom, and main living areas</li>
                        <li>• Include photos of unique features or amenities</li>
                        <li>• Use landscape orientation for better display</li>
                        <li>• Keep file sizes under 5MB each</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
                  >
                    <Save size={18} />
                    Create Room
                  </button>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}