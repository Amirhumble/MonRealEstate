import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { propertiesAPI } from "../services/api";
import { 
  MdLocationOn, 
  MdBed, 
  MdBathtub, 
  MdSquareFoot,
  MdDirectionsCar,
  MdCalendarToday,
  MdCheckCircle,
  MdPhone,
  MdEmail,
  MdShare,
  MdFavorite,
  MdClose,
  MdChevronLeft,
  MdChevronRight
} from "react-icons/md";
import PropertyCard from "../components/PropertyCard";

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [relatedProperties, setRelatedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "I'm interested in this property. Please contact me with more details."
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propertyRes, allPropertiesRes] = await Promise.all([
          propertiesAPI.getAll(),
          propertiesAPI.getAll()
        ]);
        
        const foundProperty = propertyRes.data.find((p) => p._id === id);
        if (foundProperty) {
          setProperty(foundProperty);
          setSelectedImage(foundProperty.image);
          
          // Get related properties (same type, different id)
          const related = allPropertiesRes.data
            .filter(p => p.type === foundProperty.type && p._id !== id)
            .slice(0, 3);
          setRelatedProperties(related);
        } else {
          setError("Property not found");
        }
      } catch (err) {
        setError("Failed to load property details");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Handle form submission (integrate with contact API)
    alert("Inquiry sent! We'll contact you soon.");
    setShowContactForm(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      message: "I'm interested in this property. Please contact me with more details."
    });
  };

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = () => {
    const allImages = [property.image, ...(property.images || [])];
    setLightboxIndex((lightboxIndex + 1) % allImages.length);
  };

  const prevImage = () => {
    const allImages = [property.image, ...(property.images || [])];
    setLightboxIndex((lightboxIndex - 1 + allImages.length) % allImages.length);
  };

  if (loading) {
    return <p className="text-center text-gray-500 py-20 text-lg">Loading property details...</p>;
  }

  if (error || !property) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 text-xl mb-4">{error || "Property not found"}</p>
        <Link to="/listings" className="text-[#2c2863] hover:text-[#e81d2b] font-semibold">
          ← Back to Listings
        </Link>
      </div>
    );
  }

  const allImages = [property.image, ...(property.images || [])];
  
  const getStatusColor = (status) => {
    switch (status) {
      case "For Sale":
        return "bg-green-100 text-green-700 border-green-300";
      case "For Rent":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "Sold":
        return "bg-gray-100 text-gray-700 border-gray-300";
      case "Pending":
        return "bg-orange-100 text-orange-700 border-orange-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-slate-900 to-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Link 
            to="/listings" 
            className="inline-flex items-center text-white/80 hover:text-white font-semibold mb-4 transition-colors"
          >
            <MdChevronLeft className="text-2xl" /> Back to Listings
          </Link>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Property Info */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${getStatusColor(property.status || "For Sale")}`}>
                  {property.status || "For Sale"}
                </span>
                {property.featured && (
                  <span className="px-4 py-2 rounded-full text-sm font-bold bg-[#e81d2b]/20 text-[#e81d2b] border-2 border-[#e81d2b]/30">
                    ⭐ Featured
                  </span>
                )}
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{property.title}</h1>
              
              <div className="flex items-center text-white/90 mb-6">
                <MdLocationOn className="text-2xl mr-2" />
                <span className="text-lg">{property.location}</span>
              </div>
              
              <div className="text-5xl font-bold text-[#e81d2b] mb-6">
                ${property.price?.toLocaleString()}
              </div>
              
              {/* Key Features */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {property.bedrooms && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                    <MdBed className="text-3xl mx-auto mb-2" />
                    <p className="text-2xl font-bold">{property.bedrooms}</p>
                    <p className="text-sm text-white/70">Bedrooms</p>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                    <MdBathtub className="text-3xl mx-auto mb-2" />
                    <p className="text-2xl font-bold">{property.bathrooms}</p>
                    <p className="text-sm text-white/70">Bathrooms</p>
                  </div>
                )}
                {property.area && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                    <MdSquareFoot className="text-3xl mx-auto mb-2" />
                    <p className="text-2xl font-bold">{property.area}</p>
                    <p className="text-sm text-white/70">Sq Ft</p>
                  </div>
                )}
                {property.parking && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                    <MdDirectionsCar className="text-3xl mx-auto mb-2" />
                    <p className="text-2xl font-bold">{property.parking}</p>
                    <p className="text-sm text-white/70">Parking</p>
                  </div>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setShowContactForm(true)}
                  className="flex-1 min-w-[200px] bg-[#e81d2b] hover:bg-red-700 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Schedule a Visit
                </button>
                <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold py-4 px-6 rounded-full transition-all duration-300 border border-white/20">
                  <MdShare className="text-xl" />
                </button>
                <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold py-4 px-6 rounded-full transition-all duration-300 border border-white/20">
                  <MdFavorite className="text-xl" />
                </button>
              </div>
            </div>
            
            {/* Hero Image */}
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl cursor-pointer" onClick={() => openLightbox(0)}>
                <img
                  src={selectedImage}
                  alt={property.title}
                  className="w-full h-[400px] object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Gallery Thumbnails */}
      {allImages.length > 1 && (
        <div className="bg-slate-50 py-6">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {allImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedImage(image);
                    openLightbox(index);
                  }}
                  className={`rounded-xl overflow-hidden border-4 transition-all hover:scale-105 ${
                    selectedImage === image 
                      ? "border-[#e81d2b] shadow-lg" 
                      : "border-transparent hover:border-gray-300"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${property.title} ${index + 1}`}
                    className="w-full h-20 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Property Overview */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-8">
              <h2 className="text-3xl font-bold text-[#1f2b52] mb-6">Property Overview</h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {property.description || "Beautiful property in a prime location. This stunning home offers modern amenities and exceptional living spaces perfect for families or professionals seeking comfort and style."}
              </p>
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-8">
              <h2 className="text-3xl font-bold text-[#1f2b52] mb-6">Property Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Property Type</span>
                  <span className="text-gray-900 font-semibold">{property.type}</span>
                </div>
                {property.bedrooms && (
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Bedrooms</span>
                    <span className="text-gray-900 font-semibold">{property.bedrooms}</span>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Bathrooms</span>
                    <span className="text-gray-900 font-semibold">{property.bathrooms}</span>
                  </div>
                )}
                {property.area && (
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Area</span>
                    <span className="text-gray-900 font-semibold">{property.area} sq ft</span>
                  </div>
                )}
                {property.yearBuilt && (
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Year Built</span>
                    <span className="text-gray-900 font-semibold">{property.yearBuilt}</span>
                  </div>
                )}
                {property.parking && (
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Parking Spaces</span>
                    <span className="text-gray-900 font-semibold">{property.parking}</span>
                  </div>
                )}
                {property.lotSize && (
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Lot Size</span>
                    <span className="text-gray-900 font-semibold">{property.lotSize}</span>
                  </div>
                )}
                {property.floors && (
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Floors</span>
                    <span className="text-gray-900 font-semibold">{property.floors}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Features & Amenities */}
            {(property.features?.length > 0 || property.amenities?.length > 0) && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-8">
                <h2 className="text-3xl font-bold text-[#1f2b52] mb-6">Features & Amenities</h2>
                
                {property.features?.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Interior Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {property.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <MdCheckCircle className="text-green-500 text-xl flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {property.amenities?.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Building Amenities</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {property.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <MdCheckCircle className="text-blue-500 text-xl flex-shrink-0" />
                          <span className="text-gray-700">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Floor Plans */}
            {property.floorPlans?.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-8">
                <h2 className="text-3xl font-bold text-[#1f2b52] mb-6">Floor Plans</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {property.floorPlans.map((plan, index) => (
                    <div key={index} className="rounded-2xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
                      <img
                        src={plan}
                        alt={`Floor Plan ${index + 1}`}
                        className="w-full h-auto"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Virtual Tour */}
            {property.virtualTour && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-8">
                <h2 className="text-3xl font-bold text-[#1f2b52] mb-6">Virtual Tour</h2>
                <div className="aspect-video rounded-2xl overflow-hidden bg-gray-100">
                  <iframe
                    src={property.virtualTour}
                    className="w-full h-full"
                    allowFullScreen
                    title="Virtual Tour"
                  />
                </div>
              </div>
            )}

            {/* Location */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-8">
              <h2 className="text-3xl font-bold text-[#1f2b52] mb-6">Location</h2>
              <div className="mb-6">
                <div className="flex items-start gap-3 mb-4">
                  <MdLocationOn className="text-[#e81d2b] text-2xl mt-1" />
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{property.location}</p>
                    {property.address && <p className="text-gray-600">{property.address}</p>}
                    {property.neighborhood && <p className="text-gray-600">{property.neighborhood}</p>}
                  </div>
                </div>
              </div>
              
              {/* Map Placeholder */}
              <div className="aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                <div className="text-center">
                  <MdLocationOn className="text-6xl text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">Map integration coming soon</p>
                  <p className="text-sm text-gray-400 mt-1">Google Maps / Mapbox</p>
                </div>
              </div>
              
              {/* Nearby Amenities */}
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-slate-50 rounded-xl">
                  <p className="text-2xl mb-1">🏫</p>
                  <p className="text-sm font-semibold text-gray-700">Schools Nearby</p>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-xl">
                  <p className="text-2xl mb-1">🏥</p>
                  <p className="text-sm font-semibold text-gray-700">Hospitals</p>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-xl">
                  <p className="text-2xl mb-1">🛒</p>
                  <p className="text-sm font-semibold text-gray-700">Shopping</p>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-xl">
                  <p className="text-2xl mb-1">🚇</p>
                  <p className="text-sm font-semibold text-gray-700">Transport</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Agent Card */}
            <div className="bg-gradient-to-br from-[#2c2863] to-[#4a4494] rounded-3xl shadow-xl p-8 text-white sticky top-24">
              <h3 className="text-2xl font-bold mb-6">Contact Agent</h3>
              
              {property.agentPhoto && (
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={property.agentPhoto}
                    alt={property.agentName || "Agent"}
                    className="w-16 h-16 rounded-full border-4 border-white/20"
                  />
                  <div>
                    <p className="font-bold text-lg">{property.agentName || "Property Agent"}</p>
                    <p className="text-white/70 text-sm">Real Estate Professional</p>
                  </div>
                </div>
              )}
              
              {!showContactForm ? (
                <div className="space-y-3">
                  {property.agentPhone && (
                    <a
                      href={`tel:${property.agentPhone}`}
                      className="flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm p-4 rounded-xl transition-all"
                    >
                      <MdPhone className="text-2xl" />
                      <span>{property.agentPhone}</span>
                    </a>
                  )}
                  {property.agentEmail && (
                    <a
                      href={`mailto:${property.agentEmail}`}
                      className="flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm p-4 rounded-xl transition-all"
                    >
                      <MdEmail className="text-2xl" />
                      <span className="truncate">{property.agentEmail}</span>
                    </a>
                  )}
                  <button
                    onClick={() => setShowContactForm(true)}
                    className="w-full bg-[#e81d2b] hover:bg-red-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl mt-4"
                  >
                    Request Information
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleFormChange}
                    className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleFormChange}
                    className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                    required
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Your Phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                    required
                  />
                  <textarea
                    name="message"
                    placeholder="Message"
                    value={formData.message}
                    onChange={handleFormChange}
                    rows="4"
                    className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                    required
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 bg-[#e81d2b] hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl transition-all"
                    >
                      Send
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowContactForm(false)}
                      className="bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-xl transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Mortgage Calculator Placeholder */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-6">
              <h3 className="text-xl font-bold text-[#1f2b52] mb-4">Mortgage Calculator</h3>
              <div className="text-center py-8 bg-slate-50 rounded-2xl">
                <p className="text-gray-500 mb-2">💰</p>
                <p className="text-sm text-gray-600">Calculate your monthly payment</p>
                <p className="text-xs text-gray-400 mt-1">Coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Properties */}
      {relatedProperties.length > 0 && (
        <div className="bg-slate-50 py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-[#1f2b52] mb-2">Similar Properties</h2>
              <p className="text-gray-600">You might also be interested in these properties</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {relatedProperties.map((relatedProperty) => (
                <PropertyCard key={relatedProperty._id} property={relatedProperty} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
          >
            <MdClose className="text-4xl" />
          </button>
          
          <button
            onClick={prevImage}
            className="absolute left-4 text-white hover:text-gray-300 transition-colors"
          >
            <MdChevronLeft className="text-6xl" />
          </button>
          
          <img
            src={allImages[lightboxIndex]}
            alt={`${property.title} ${lightboxIndex + 1}`}
            className="max-w-full max-h-[90vh] object-contain"
          />
          
          <button
            onClick={nextImage}
            className="absolute right-4 text-white hover:text-gray-300 transition-colors"
          >
            <MdChevronRight className="text-6xl" />
          </button>
          
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
            {lightboxIndex + 1} / {allImages.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetails;
