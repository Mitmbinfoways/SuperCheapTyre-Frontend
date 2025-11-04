import React, { useEffect, useState, useRef } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { images, navLinks } from '../assets/data';
import { Phone, User, Search, Menu, X, Moon } from 'lucide-react';
import { HiMoon } from "react-icons/hi";
import { FaPhoneAlt } from "react-icons/fa";
import { MdLocationPin } from "react-icons/md";
import { FaShoppingCart } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { IoMdSearch } from "react-icons/io";
import { secureGetItem } from '../Utils/encryption';
import { getAllTyres } from '../axios/axios'; // Import the API function
import { getTyreImageUrl, formatCurrency } from '../Utils/Utils'; // Import image utility and formatCurrency

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(() => Number(localStorage.getItem('cartCount') || 0));
  const [searchQuery, setSearchQuery] = useState(''); // State for search input
  const [suggestions, setSuggestions] = useState([]); // State for product suggestions
  const [showSuggestions, setShowSuggestions] = useState(false); // State to toggle suggestions dropdown
  const searchRef = useRef(null); // Ref for search container
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'cartCount') {
        setCartCount(Number(e.newValue || 0));
      }
    };
    window.addEventListener('storage', onStorage);

    // Also check cart items directly to ensure consistency
    const updateCartCount = () => {
      const cartItems = secureGetItem('cartItems', []);
      const count = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
      setCartCount(count);
      // Also update localStorage to keep it in sync
      localStorage.setItem('cartCount', String(count));
    };

    // Update immediately on mount
    updateCartCount();

    // Set up polling for updates
    const interval = setInterval(updateCartCount, 500);

    return () => {
      window.removeEventListener('storage', onStorage);
      clearInterval(interval);
    };
  }, []);

  // Handle clicks outside of search to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch product suggestions based on search query
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim() === '') {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      try {
        const response = await getAllTyres(searchQuery.trim());
        const products = response.data?.data?.items || [];
        // Limit suggestions to 5 items
        setSuggestions(products.slice(0, 5));
        setShowSuggestions(products.length > 0);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    // Debounce the API call to avoid too many requests
    const debounceTimer = setTimeout(() => {
      if (searchQuery.trim() !== '') {
        fetchSuggestions();
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // Handle search form submission
  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      try {
        // Navigate to tyres page with search query
        navigate(`/tyres?search=${encodeURIComponent(searchQuery.trim())}`);
        setIsMenuOpen(false); // Close mobile menu after search
        setShowSuggestions(false); // Hide suggestions
      } catch (error) {
        console.error('Search error:', error);
      }
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (productId) => {
    // Navigate directly to product details page
    navigate(`/productdetails/${productId}`);
    setSearchQuery(''); // Clear search query
    setShowSuggestions(false); // Hide suggestions
    setIsMenuOpen(false); // Close mobile menu
  };

  return (
    <header className="relative z-50">
      {/* Main Row */}
      <div className="bg-[#000000] text-white">
        <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 lg:px-8 flex items-start justify-between h-16 sm:h-20 md:h-[160px] py-0">
          {/* Logo */}
          <Link to="/" className="w-40 sm:w-52 md:w-64 lg:w-80 shrink-0">
            <img src={images.logo} alt="Supercheap Tyres Logo" className="block h-16 sm:h-28 md:h-32 lg:h-40 object-contain" />
          </Link>

          <div className=''>
            <div className="bg-[#000000] text-white text-xs sm:text-sm">
              <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 lg:px-8 flex justify-end items-center h-10 sm:h-12">
                <div className="flex items-center gap-3">
                  <div className="flex items-center space-x-3">
                    <a
                      href="tel:(03)97936190"
                      className="flex items-center space-x-2 text-white hover:text-gray-300 cursor-pointer"
                    >
                      <FaPhoneAlt size={14} className="sm:w-4 sm:h-4" />
                      <span className="text-xs sm:text-sm">(03) 9793 6190</span>
                    </a>
                  </div>

                  {/* <HiMoon size={20} className="ml-2" /> */}
                </div>
              </div>
            </div>
            {/* Right: Compact search + icons */}
            <div className="hidden lg:flex items-center justify-end space-x-2 xl:space-x-4">
              <div className="relative w-[16rem] xl:w-[28rem] 2xl:w-[36rem]" ref={searchRef}>
                <form onSubmit={handleSearch}>
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => searchQuery.trim() !== '' && suggestions.length > 0 && setShowSuggestions(true)}
                    className="w-full h-10 xl:h-11 rounded-full bg-white text-dark placeholder-gray-500 pl-4 pr-11 focus:outline-none"
                  />
                  <button 
                    type="submit"
                    className="absolute right-1 top-1 bottom-1 aspect-square rounded-full bg-dark text-white grid place-items-center"
                  >
                    <IoMdSearch size={24} />
                  </button>
                </form>
                {/* Suggestions dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 w-full bg-white rounded-lg shadow-lg mt-1 max-h-80 overflow-y-auto z-50">
                    {suggestions.map((product) => (
                      <div
                        key={product._id}
                        className="flex items-center p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0"
                        onClick={() => handleSuggestionClick(product._id)}
                      >
                        <img
                          src={getTyreImageUrl(product.images?.[0])}
                          alt={product.name}
                          className="w-12 h-12 object-contain mr-3"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                          <p className="text-xs text-gray-500 truncate">{product.brand}</p>
                          <p className="text-xs font-medium text-dark truncate">{formatCurrency(product.price)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <a 
                href="https://www.google.com/maps/place/Supercheap+Tyres+Dandenong/@-38.0077899,145.2065489,20.47z/data=!4m15!1m8!3m7!1s0x6ad613c03393e259:0x6e08fd31f52665a5!2s114+Hammond+Rd,+Dandenong+South+VIC+3175,+Australia!3b1!8m2!3d-38.0078006!4d145.206244!16s%2Fg%2F11csllhb_6!3m5!1s0x6ad613f6637330fb:0xd763a0ab7822508d!8m2!3d-38.0078313!4d145.2066405!16s%2Fg%2F1s04wr9dv?entry=ttu&g_ep=EgoyMDI1MTAwOC4wIKXMDSoASAFQAw%3D%3D" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 xl:p-3 rounded-full bg-white text-black hover:bg-gray-100 transition-colors shadow-sm"
              >
                <FaLocationDot size={20} className="xl:w-5 xl:h-5" />
              </a>
              <NavLink to="/cart" className="relative p-2 xl:p-3 rounded-full bg-white text-black hover:bg-gray-100 transition-colors shadow-sm">
                <FaShoppingCart size={20} className="xl:w-5 xl:h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[16px] text-center">
                    {cartCount}
                  </span>
                )}
              </NavLink>
            </div>
            {/* Center Search */}
            <div className="hidden lg:block bg-[#000000] text-white mt-6 h-[10px]">
              <div className="container">
                <nav className="flex gap-3 items-center justify-center">
                  {navLinks.map((link) => {
                    const to = link.href || '#';
                    return (
                      <NavLink
                        key={link.name}
                        to={to}
                        className={({ isActive }) =>
                          `text-base pb-3 xl:text-lg font-medium px-5 transition-colors hover:text-primary ${isActive && (to !== '#' ? 'text-primary border-b-2 border-primary' : '')
                          }`
                        }
                        end={link.name === 'Home'}
                      >
                        <span className="inline-block">{link.name}</span>
                      </NavLink>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>
          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white p-1">
              {isMenuOpen ? <X size={24} className="sm:w-7 sm:h-7" /> : <Menu size={24} className="sm:w-7 sm:h-7" />}
            </button>
          </div>



        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-dark text-white absolute top-full left-0 w-full z-50 shadow-lg">
          <nav className="flex flex-col items-center space-y-3 sm:space-y-4 py-6 sm:py-8">
            {navLinks.map((link) => {
              const to = link.href || '#';
              return to === '#' ? (
                <span key={link.name} className="text-base sm:text-lg font-medium transition-colors py-2 px-4 rounded-lg opacity-50 cursor-not-allowed">
                  {link.name}
                </span>
              ) : (
                <NavLink
                  key={link.name}
                  to={to}
                  className={({ isActive }) =>
                    `text-base sm:text-lg font-medium transition-colors py-2 px-4 rounded-lg hover:bg-gray-800 ${isActive && (to !== '#' ? 'text-primary' : '')
                    }`
                  }
                  end={link.name === 'Home'}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </NavLink>
              );
            })}
            {/* Mobile Search Form */}
            <form onSubmit={handleSearch} className="w-full px-4" ref={searchRef}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.trim() !== '' && suggestions.length > 0 && setShowSuggestions(true)}
                  className="w-full h-10 rounded-full bg-white text-dark placeholder-gray-500 pl-4 pr-11 focus:outline-none"
                />
                <button 
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 aspect-square rounded-full bg-dark text-white grid place-items-center"
                >
                  <IoMdSearch size={20} />
                </button>
              </div>
              {/* Mobile Suggestions dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 w-full bg-white rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto z-50">
                  {suggestions.map((product) => (
                    <div
                      key={product._id}
                      className="flex items-center p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0"
                      onClick={() => handleSuggestionClick(product._id)}
                    >
                      <img
                        src={getTyreImageUrl(product.images?.[0])}
                        alt={product.name}
                        className="w-10 h-10 object-contain mr-3"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                        <p className="text-xs text-gray-500 truncate">{product.brand}</p>
                        <p className="text-xs font-medium text-dark truncate">{formatCurrency(product.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </form>
            <div className="flex items-center space-x-3 sm:space-x-4 pt-4 border-t border-gray-700 w-full justify-center">
              <a 
                href="https://maps.app.goo.gl/8MCfDBfNa6dqdQY9A" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 sm:p-3 rounded-full bg-white text-black hover:bg-gray-100 transition-colors"
              >
                <MdLocationPin size={18} className="sm:w-5 sm:h-5" />
              </a>
              <NavLink to="/cart" className="relative p-2 sm:p-3 rounded-full bg-white text-black hover:bg-gray-100 transition-colors">
                <FaShoppingCart size={18} className="sm:w-5 sm:h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full px-1 py-0.5 min-w-[16px] text-center">
                    {cartCount}
                  </span>
                )}
              </NavLink>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;