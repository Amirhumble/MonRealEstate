import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { HiOutlineUserCircle, HiOutlineChevronDown, HiOutlineLogout, HiOutlineHeart, HiOutlineUser } from "react-icons/hi";
import { addCacheBusting, getUserInitials, handleImageError } from "../utils/imageUtils";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/listings", label: "Listings" },
    { to: "/projects", label: "Projects" },
    { to: "/contact", label: "Contact" },
  ];

  if (isAuthenticated && isAdmin) {
    navLinks.push({ to: "/admin", label: "Admin" });
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    closeMobileMenu();
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "backdrop-blur-md bg-white/70 shadow-lg border-b border-white/20"
            : "backdrop-blur-sm bg-white/5"
        }`}
        style={{
          background: isScrolled
            ? "rgba(255, 255, 255, 0.85)"
            : "rgba(232, 232, 232, 0.1)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link
                to="/"
                onClick={closeMobileMenu}
                aria-label="Go to homepage"
                className="transition-all duration-300 hover:scale-105 inline-flex items-center"
              >
                <img
                  src="/images/logo1.jpg"
                  alt="MonRealEstate Logo"
                  className="h-10 w-auto rounded-md shadow-sm"
                />
                <span className="ml-3 text-lg font-bold tracking-tight text-[#2c2863] hidden sm:inline-flex">
                  MonReal<span className="text-[#e81d2b]">Estate</span>
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-8">
              <div className="flex items-baseline space-x-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`px-3 py-2 rounded-md text-sm font-semibold transition-all duration-300 relative group ${
                      location.pathname === link.to
                        ? "text-[#e81d2b]"
                        : "text-[#2c2863] hover:text-[#e81d2b]"
                    }`}
                  >
                    {link.label}
                    <span
                      className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${
                        location.pathname === link.to ? "w-full" : ""
                      }`}
                      style={{ backgroundColor: "#e81d2b" }}
                    ></span>
                  </Link>
                ))}
              </div>

              <div className="flex items-center gap-4 ml-4">
                {isAuthenticated ? (
                  <div className="relative" ref={profileRef}>
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="flex items-center space-x-2 p-1 rounded-full hover:bg-black/5 transition-all duration-200"
                    >
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#2c2863] to-[#4a4494] flex items-center justify-center text-white font-bold text-sm border-2 border-white shadow-sm overflow-hidden">
                        {user?.profilePicture ? (
                          <img 
                            src={addCacheBusting(user.profilePicture)} 
                            alt={user.name} 
                            className="w-full h-full object-cover"
                            onError={handleImageError}
                          />
                        ) : null}
                        <div 
                          className={`w-full h-full flex items-center justify-center ${user?.profilePicture ? 'hidden' : ''}`}
                        >
                          {getUserInitials(user?.name)}
                        </div>
                      </div>
                      <HiOutlineChevronDown className={`text-[#2c2863] transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    <div className={`absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-2xl border border-gray-100 py-2 transition-all duration-200 origin-top-right ${
                      isProfileOpen 
                        ? "opacity-100 scale-100 translate-y-0" 
                        : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                    }`}>
                      <div className="px-4 py-3 border-b border-gray-50 mb-1">
                        <p className="text-sm font-semibold text-[#2c2863] truncate">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>
                      
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#e81d2b] transition-colors"
                      >
                        <HiOutlineUser className="mr-3 text-lg opacity-70" />
                        Manage Profile
                      </Link>
                      
                      <Link
                        to="/saved-properties"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#e81d2b] transition-colors"
                      >
                        <HiOutlineHeart className="mr-3 text-lg opacity-70" />
                        Saved Properties
                      </Link>
                      
                      <div className="border-t border-gray-50 mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <HiOutlineLogout className="mr-3 text-lg opacity-70" />
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="bg-[#2c2863] text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-[#e81d2b] transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    Login / Join
                  </Link>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-4">
              {isAuthenticated && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#2c2863] to-[#4a4494] flex items-center justify-center text-white font-bold text-xs border-2 border-white shadow-sm overflow-hidden">
                  {user?.profilePicture ? (
                    <img 
                      src={addCacheBusting(user.profilePicture)} 
                      alt={user.name} 
                      className="w-full h-full object-cover"
                      onError={handleImageError}
                    />
                  ) : null}
                  <div 
                    className={`w-full h-full flex items-center justify-center ${user?.profilePicture ? 'hidden' : ''}`}
                  >
                    {getUserInitials(user?.name)}
                  </div>
                </div>
              )}
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md transition-all duration-300 hover:bg-[#2c2863]/10"
                style={{ color: "#2c2863" }}
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                <div className="w-6 h-6 relative">
                  <span
                    className={`block absolute h-0.5 w-6 bg-current transform transition duration-300 ease-in-out ${
                      isMobileMenuOpen ? "rotate-45 translate-y-1" : "-translate-y-1"
                    }`}
                  ></span>
                  <span
                    className={`block absolute h-0.5 w-6 bg-current transform transition duration-300 ease-in-out ${
                      isMobileMenuOpen ? "opacity-0" : "opacity-100"
                    }`}
                  ></span>
                  <span
                    className={`block absolute h-0.5 w-6 bg-current transform transition duration-300 ease-in-out ${
                      isMobileMenuOpen ? "-rotate-45 -translate-y-1" : "translate-y-1"
                    }`}
                  ></span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            isMobileMenuOpen
              ? "max-h-[500px] opacity-100 shadow-xl"
              : "max-h-0 opacity-0"
          }`}
          style={{
            background: "rgba(255, 255, 255, 0.98)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        >
          <div className="px-4 pt-4 pb-6 space-y-2 border-t border-gray-100">
            {isAuthenticated && (
              <div className="mb-4 p-4 rounded-xl bg-gray-50">
                <p className="text-sm font-bold text-[#2c2863]">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            )}
            
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={closeMobileMenu}
                className={`block px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300 ${
                  location.pathname === link.to
                    ? "text-white bg-[#e81d2b]"
                    : "text-[#2c2863] hover:bg-gray-100"
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            {isAuthenticated ? (
              <div className="pt-4 space-y-2">
                <Link
                  to="/profile"
                  onClick={closeMobileMenu}
                  className="flex items-center px-4 py-3 rounded-xl text-base font-semibold text-gray-700 hover:bg-gray-100"
                >
                  <HiOutlineUser className="mr-3 text-xl opacity-70" />
                  Manage Profile
                </Link>
                <Link
                  to="/saved-properties"
                  onClick={closeMobileMenu}
                  className="flex items-center px-4 py-3 rounded-xl text-base font-semibold text-gray-700 hover:bg-gray-100"
                >
                  <HiOutlineHeart className="mr-3 text-xl opacity-70" />
                  Saved Properties
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-3 rounded-xl text-base font-semibold text-red-600 hover:bg-red-50 mt-2"
                >
                  <HiOutlineLogout className="mr-3 text-xl opacity-70" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="pt-4">
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="block w-full text-center rounded-xl bg-[#2c2863] px-4 py-3 text-base font-bold text-white transition-all hover:bg-[#e81d2b]"
                >
                  Login / Join
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content from hiding behind fixed navbar */}
      <div className="h-16"></div>
    </>
  );
};

export default Navbar;
