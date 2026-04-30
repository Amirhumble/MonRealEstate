import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white mt-16 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500 rounded-full -translate-x-16 -translate-y-16"></div>
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-400 rounded-full translate-x-12 -translate-y-12"></div>
        <div className="absolute bottom-0 left-1/4 w-20 h-20 bg-blue-600 rounded-full translate-y-10"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Brand Section */}
          <div className="sm:col-span-1">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.84L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.84l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                </svg>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Mon Real Estate
              </h2>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your trusted partner in finding the perfect property. Quality homes, exceptional service.
            </p>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact Us
            </h3>
            <div className="space-y-3">
              <a
                href="mailto:Mondigital47@gmail.com"
                className="flex items-center text-gray-300 hover:text-blue-400 transition-all duration-300 group"
              >
                <svg className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                Mondigital47@gmail.com
              </a>
              <a
                href="tel:+251948666555"
                className="flex items-center text-gray-300 hover:text-blue-400 transition-all duration-300 group"
              >
                <svg className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +251 948 666 555
              </a>
              <a
                href="tel:+251949666000"
                className="flex items-center text-gray-300 hover:text-blue-400 transition-all duration-300 group"
              >
                <svg className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +251 949 666 000
              </a>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              Follow Us
            </h3>
            <div className="space-y-3">
              <a
                href="https://web.facebook.com/p/Mon-Real-Estate-61564934258294/?_rdc=1&_rdr#"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-300 hover:text-blue-400 transition-all duration-300 group"
              >
                <svg className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </a>
              <a
                href="https://www.instagram.com/accounts/login/?next=%2Fmonrealestate1%2F&source=omni_redirect"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-300 hover:text-pink-400 transition-all duration-300 group"
              >
                <svg className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C8.396 0 7.609.035 6.298.129c-1.31.094-2.207.447-2.996.955a5.886 5.886 0 00-2.142 2.142C.447 4.034.094 4.931.129 6.242.035 7.553 0 8.34 0 11.961s.035 4.408.129 5.719c.094 1.31.447 2.207.955 2.996a5.886 5.886 0 002.142 2.142c.789.508 1.686.861 2.996.955 1.31.094 2.098.129 5.719.129s4.408-.035 5.719-.129c1.31-.094 2.207-.447 2.996-.955a5.886 5.886 0 002.142-2.142c.508-.789.861-1.686.955-2.996.094-1.31.129-2.098.129-5.719s-.035-4.408-.129-5.719c-.094-1.31-.447-2.207-.955-2.996a5.886 5.886 0 00-2.142-2.142C19.966.447 19.069.094 17.759.129 16.448.035 15.661 0 12.04 0h-.023zm0 1.982c3.544 0 3.967.014 5.372.078 1.308.062 2.013.278 2.486.462a3.901 3.901 0 011.483 1.483c.184.473.4 1.178.462 2.486.064 1.405.078 1.828.078 5.372s-.014 3.967-.078 5.372c-.062 1.308-.278 2.013-.462 2.486a3.901 3.901 0 01-1.483 1.483c-.473.184-1.178.4-2.486.462-1.405.064-1.828.078-5.372.078s-3.967-.014-5.372-.078c-1.308-.062-2.013-.278-2.486-.462a3.901 3.901 0 01-1.483-1.483c-.184-.473-.4-1.178-.462-2.486C1.982 15.967 1.968 15.544 1.968 12s.014-3.967.078-5.372c.062-1.308.278-2.013.462-2.486A3.901 3.901 0 013.483 2.659C3.956.447 4.661.231 5.969.169 7.374.105 7.797.091 11.341.091h.023zm0 3.968a7.99 7.99 0 100 15.98 7.99 7.99 0 000-15.98zm0 13.156a5.166 5.166 0 110-10.332 5.166 5.166 0 010 10.332zm8.135-13.843a1.87 1.87 0 11-3.74 0 1.87 1.87 0 013.74 0z"/>
                </svg>
                Instagram
              </a>
            </div>
          </div>

          {/* Location */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Our Location
            </h3>
            <div className="text-gray-300">
              <div className="flex items-start">
                <svg className="w-4 h-4 mr-3 mt-1 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div className="text-sm leading-relaxed">
                  <p>Sarbet, at the back of Adot Cinema</p>
                  <p>Shemeket Commercial Center</p>
                  <p>6th Floor, Office Number 601</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Mon Real Estates. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-gray-400">
              <span className="hover:text-blue-400 transition-colors cursor-pointer">Privacy Policy</span>
              <span className="hover:text-blue-400 transition-colors cursor-pointer">Terms of Service</span>
              <span className="hover:text-blue-400 transition-colors cursor-pointer">Contact</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
