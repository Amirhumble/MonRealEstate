import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import PropertyCard from '../components/PropertyCard';
import { HiOutlineHeart, HiOutlineHome, HiOutlineEmojiSad } from 'react-icons/hi';

const SavedProperties = () => {
  const { user } = useAuth();
  const [savedProperties, setSavedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSavedProperties();
  }, []);

  const fetchSavedProperties = async () => {
    try {
      setLoading(true);
      const response = await authAPI.getSavedProperties();
      setSavedProperties(response.data);
    } catch (err) {
      console.error('Error fetching saved properties:', err);
      setError('Failed to load saved properties');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveProperty = async (propertyId) => {
    try {
      await authAPI.toggleSavedProperty(propertyId);
      // Remove from local state
      setSavedProperties(prev => prev.filter(property => property._id !== propertyId));
      
      // Show success message briefly
      const successMsg = document.createElement('div');
      successMsg.className = 'fixed top-24 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300';
      successMsg.textContent = 'Property removed from saved';
      document.body.appendChild(successMsg);
      
      setTimeout(() => {
        successMsg.style.opacity = '0';
        setTimeout(() => document.body.removeChild(successMsg), 300);
      }, 2000);
    } catch (err) {
      console.error('Error removing property:', err);
      setError('Failed to remove property');
      setTimeout(() => setError(''), 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2c2863] mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your saved properties...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#e81d2b] to-[#ff4757] flex items-center justify-center">
              <HiOutlineHeart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#2c2863]">Saved Properties</h1>
              <p className="text-gray-600">Properties you've saved for later</p>
            </div>
          </div>
          
          {savedProperties.length > 0 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                {savedProperties.length} {savedProperties.length === 1 ? 'property' : 'properties'} saved
              </p>
              <Link
                to="/listings"
                className="text-[#2c2863] hover:text-[#e81d2b] text-sm font-medium transition-colors flex items-center"
              >
                <HiOutlineHome className="mr-1 h-4 w-4" />
                Browse More Properties
              </Link>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 px-6 py-4 rounded-xl bg-red-50 border-l-4 border-red-400 text-red-800">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        {savedProperties.length === 0 ? (
          // Empty State
          <div className="text-center py-20">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
              <HiOutlineEmojiSad className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No saved properties yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start exploring our listings and save properties you're interested in. They'll appear here for easy access.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/listings"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-[#2c2863] hover:bg-[#1e1a4a] transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <HiOutlineHome className="mr-2 h-5 w-5" />
                Browse Properties
              </Link>
              <Link
                to="/projects"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-xl text-[#2c2863] bg-white hover:bg-gray-50 transition-all duration-200"
              >
                View Projects
              </Link>
            </div>
          </div>
        ) : (
          // Properties Grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedProperties.map((property) => (
              <div key={property._id} className="relative group">
                <PropertyCard 
                  property={property} 
                  showSaveButton={false} // We'll show a remove button instead
                />
                
                {/* Remove Button Overlay */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => handleRemoveProperty(property._id)}
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                    title="Remove from saved"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>

                {/* Saved Badge */}
                <div className="absolute top-4 left-4">
                  <div className="bg-[#e81d2b] text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
                    <HiOutlineHeart className="h-3 w-3 mr-1 fill-current" />
                    Saved
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Additional Actions */}
        {savedProperties.length > 0 && (
          <div className="mt-12 text-center">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-lg font-semibold text-[#2c2863] mb-2">Ready to take the next step?</h3>
              <p className="text-gray-600 mb-6">
                Contact our agents to schedule viewings or get more information about your saved properties.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-[#e81d2b] hover:bg-red-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Contact Agent
                </Link>
                <Link
                  to="/listings"
                  className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-xl text-[#2c2863] bg-white hover:bg-gray-50 transition-all duration-200"
                >
                  <HiOutlineHome className="mr-2 h-5 w-5" />
                  Find More Properties
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedProperties;