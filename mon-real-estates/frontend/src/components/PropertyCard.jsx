import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdLocationOn, MdAttachMoney } from "react-icons/md";
import { HiOutlineHeart, HiHeart } from "react-icons/hi";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../services/api";

const PropertyCard = ({ property, showSaveButton = true }) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if property is saved by current user
    if (isAuthenticated && user?.savedProperties) {
      setIsSaved(user.savedProperties.includes(property._id));
    }
  }, [isAuthenticated, user, property._id]);

  const handleSaveToggle = async (e) => {
    e.preventDefault(); // Prevent navigation when clicking save button
    e.stopPropagation();

    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      navigate('/login');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authAPI.toggleSavedProperty(property._id);
      setIsSaved(response.data.saved);
      
      // Update user data in localStorage
      const currentUser = JSON.parse(localStorage.getItem('user'));
      if (currentUser) {
        if (response.data.saved) {
          currentUser.savedProperties = [...(currentUser.savedProperties || []), property._id];
        } else {
          currentUser.savedProperties = (currentUser.savedProperties || []).filter(id => id !== property._id);
        }
        localStorage.setItem('user', JSON.stringify(currentUser));
      }

      // Show success message
      const message = response.data.saved ? 'Property saved!' : 'Property removed from saved';
      showToast(message, response.data.saved ? 'success' : 'info');
    } catch (error) {
      console.error('Error toggling saved property:', error);
      showToast('Failed to save property', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (message, type) => {
    const toast = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
    toast.className = `fixed top-24 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 2000);
  };

  const formatPrice = (price) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `$${(price / 1000).toFixed(0)}K`;
    }
    return `$${price}`;
  };

  return (
    <div className="border-0 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 sm:hover:-translate-y-3 transition-all duration-500 p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden group">
      {/* Save Button */}
      {showSaveButton && (
        <button
          onClick={handleSaveToggle}
          disabled={isLoading}
          className={`absolute top-3 right-3 sm:top-4 sm:right-4 z-10 p-1.5 sm:p-2 rounded-full transition-all duration-200 ${
            isSaved 
              ? 'bg-[#e81d2b] text-white shadow-lg' 
              : 'bg-white/80 text-gray-600 hover:bg-white hover:text-[#e81d2b]'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}`}
          title={isSaved ? 'Remove from saved' : 'Save property'}
        >
          {isLoading ? (
            <div className="animate-spin h-4 w-4 sm:h-5 sm:w-5 border-2 border-current border-t-transparent rounded-full"></div>
          ) : isSaved ? (
            <HiHeart className="h-4 w-4 sm:h-5 sm:w-5" />
          ) : (
            <HiOutlineHeart className="h-4 w-4 sm:h-5 sm:w-5" />
          )}
        </button>
      )}

      {/* Property Status Badge */}
      {property.status && (
        <div className="absolute top-4 left-4 z-10">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            property.status === 'For Sale' ? 'bg-green-100 text-green-800' :
            property.status === 'For Rent' ? 'bg-blue-100 text-blue-800' :
            property.status === 'Sold' ? 'bg-gray-100 text-gray-800' :
            'bg-orange-100 text-orange-800'
          }`}>
            {property.status}
          </span>
        </div>
      )}

      <div className="overflow-hidden rounded-lg">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-56 object-cover rounded-lg group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      
      <div className="mt-4">
        <h2 className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors duration-200 leading-tight line-clamp-2">
          {property.title}
        </h2>
        
        <div className="flex items-center mt-2">
          <MdLocationOn className="text-gray-500 mr-2 flex-shrink-0" />
          <p className="text-gray-600 hover:text-gray-800 transition-colors duration-200 truncate">
            {property.location}
          </p>
        </div>
        
        <div className="flex items-center mt-2">
          <MdAttachMoney className="text-green-600 mr-2 text-xl flex-shrink-0" />
          <p className="text-green-600 font-bold text-xl hover:text-green-700 transition-colors duration-200">
            {formatPrice(property.price)}
          </p>
        </div>

        {/* Property Details */}
        {(property.bedrooms || property.bathrooms || property.area) && (
          <div className="flex items-center mt-3 text-sm text-gray-600 space-x-4">
            {property.bedrooms && (
              <span className="flex items-center">
                🛏️ {property.bedrooms} bed{property.bedrooms !== 1 ? 's' : ''}
              </span>
            )}
            {property.bathrooms && (
              <span className="flex items-center">
                🚿 {property.bathrooms} bath{property.bathrooms !== 1 ? 's' : ''}
              </span>
            )}
            {property.area && (
              <span className="flex items-center">
                📐 {property.area} sq ft
              </span>
            )}
          </div>
        )}
      </div>
      
      <Link
        to={`/property/${property._id}`}
        className="mt-6 inline-block w-full text-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-indigo-600 hover:to-purple-700 hover:shadow-lg transition-all duration-300 font-semibold"
      >
        View Details
      </Link>
    </div>
  );
};

export default PropertyCard;
