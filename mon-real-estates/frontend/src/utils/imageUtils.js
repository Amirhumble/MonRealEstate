/**
 * Utility functions for handling images and cache busting
 */

/**
 * Add cache busting parameter to image URL to force refresh
 * @param {string} imageUrl - The original image URL
 * @returns {string} - URL with cache busting parameter
 */
export const addCacheBusting = (imageUrl) => {
  if (!imageUrl) return '';
  
  const separator = imageUrl.includes('?') ? '&' : '?';
  return `${imageUrl}${separator}t=${Date.now()}`;
};

/**
 * Get user initials for avatar fallback
 * @param {string} name - User's full name
 * @returns {string} - User initials (max 2 characters)
 */
export const getUserInitials = (name) => {
  if (!name) return 'U';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
};

/**
 * Handle image load error by showing fallback
 * @param {Event} event - The error event
 * @param {Function} fallbackCallback - Optional callback for custom fallback handling
 */
export const handleImageError = (event, fallbackCallback) => {
  const img = event.target;
  const fallbackElement = img.nextSibling;
  
  if (img && fallbackElement) {
    img.style.display = 'none';
    fallbackElement.style.display = 'flex';
  }
  
  if (fallbackCallback && typeof fallbackCallback === 'function') {
    fallbackCallback(event);
  }
};