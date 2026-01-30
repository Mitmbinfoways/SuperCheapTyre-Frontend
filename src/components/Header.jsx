import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { images, navLinks } from '../assets/data';
import { Phone, Search, Menu, X, Moon } from 'lucide-react';
import { HiMoon } from "react-icons/hi";
import { FaPhoneAlt } from "react-icons/fa";
import { MdLocationPin } from "react-icons/md";
import { FaShoppingCart } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { IoMdSearch } from "react-icons/io";
import { secureGetItem } from '../Utils/encryption';
import { getAllTyres, getContactInfoDetail } from '../axios/axios'; // Import the API function
import { getTyreImageUrl, formatCurrency } from '../Utils/Utils'; // Import image utility and formatCurrency
import { formatPhoneNumber } from '../Utils/FormatePhoneNumber';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0); // Initialize with 0 for consistent hydration
  const [searchQuery, setSearchQuery] = useState(''); // State for search input
  const [suggestions, setSuggestions] = useState([]); // State for product suggestions
  const [showSuggestions, setShowSuggestions] = useState(false); // State to toggle suggestions dropdown
  const searchRef = useRef(null); // Ref for search container
  const router = useRouter(); // Hook for navigation
  const pathname = usePathname();
  const [contactData, setContactData] = useState(null);

  useEffect(() => {
    // Client-side only hydration for cart count
    setCartCount(Number(localStorage.getItem('cartCount') || 0));
  }, []);

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
      // Ensure cartItems is always an array
      const validCartItems = Array.isArray(cartItems) ? cartItems : [];
      const count = validCartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
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
        setShowSuggestions(true); // Always show suggestions panel to display results or "no results" message
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
        setShowSuggestions(true);
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
        // If there are suggestions, navigate to the first product
        if (suggestions.length > 0) {
          handleSuggestionClick(suggestions[0]._id);
        } else {
          // Navigate to tyres page with search query
          router.push(`/tyres?search=${encodeURIComponent(searchQuery.trim())}`);
        }
      } catch (error) {
        console.error('Search error:', error);
      }
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (productId) => {
    // Navigate directly to product details page
    router.push(`/productdetails/${productId}`);
    setSearchQuery(''); // Clear search query
    setShowSuggestions(false); // Hide suggestions
    setIsMenuOpen(false); // Close mobile menu
  };

  const fetchContactInfo = async () => {
    try {
      const response = await getContactInfoDetail();
      setContactData(response.data.data);
    } catch (error) {
      console.error("Error fetching contact info:", error);
    }
  };

  useEffect(() => {
    fetchContactInfo();
  }, []);

  // Helper for NavLink active state
  const isLinkActive = (to) => {
    if (to === '/') return pathname === '/';
    return pathname.startsWith(to) && to !== '#';
  };

  return (
    <header className="relative z-50">
      {/* Main Row */}
      <div className="bg-[#000000] text-white">
        <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 lg:px-8 flex lg:items-start items-center justify-between h-16 sm:h-20 md:h-[160px] py-0">
          {/* Logo */}
          <Link href="/" className="w-40 sm:w-52 md:w-64 lg:w-64 xl:w-72 2xl:w-80 shrink-0">
            <img src={images.logo} alt="Supercheap Tyres Logo" className="block h-16 sm:h-28 md:h-32 lg:h-32 xl:h-36 2xl:h-40 object-contain" />
          </Link>

          <div className='flex xl:flex-col xl:items-end items-center h-full'>
            <div className="bg-[#000000] text-white text-xs sm:text-sm ">
              <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 lg:px-8 flex justify-end items-center h-10 sm:h-12">
                <div className="flex items-center gap-8">
                  <div className="flex items-center space-x-3 -mx-5">
                    <a
                      href={`tel:${(contactData?.phone || "0397936190").replace(/\s+/g, "")}`}
                      className="flex items-center xl:gap-2 lg:gap-4 md:gap-3 gap-2 text-white hover:text-gray-300 cursor-pointer -mx-1"
                      onClick={(e) => {
                        if (!contactData?.phone) {
                          console.log("Using fallback number");
                        }
                      }}
                    >
                      <div className="sm:hidden p-2 rounded-full bg-white text-black hover:bg-gray-100 transition-colors shadow-sm">
                        <FaPhoneAlt size={18} />
                      </div>
                      <FaPhoneAlt className="hidden sm:block size-6 md:size-4 lg:size-5 xl:size-4" />
                      <span className="hidden sm:block text-xs md:text-lg xl:text-sm lg:text-3xl">
                        {formatPhoneNumber(contactData?.phone) || "(03) 9793 6190"}
                      </span>
                    </a>
                  </div>


                  {/* Mobile Menu Button and Cart Icon */}
                  <div className="xl:hidden flex items-center space-x-3">
                    <Link href="/cart" className="relative p-2 rounded-full bg-white text-black hover:bg-gray-100 transition-colors shadow-sm">
                      <FaShoppingCart size={18} className="sm:w-5 sm:h-5" />
                      {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full px-1 py-0.5 min-w-[16px] text-center">
                          {cartCount}
                        </span>
                      )}
                    </Link>
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white p-1">
                      {isMenuOpen ? <X size={24} className="xl:w-7 xl:h-7 lg:w-8 lg:h-8" /> : <Menu size={24} className="xl:w-7 xl:h-7 lg:w-10 lg:h-10 md:w-7 md:h-7" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* Right: Compact search + icons */}
            <div className="hidden xl:flex items-center justify-end space-x-2 xl:space-x-4">
              <div className="relative w-[16rem] xl:w-[22rem] 2xl:w-[36rem]" ref={searchRef}>
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
                {showSuggestions && (
                  <div className="absolute top-full left-0 w-full bg-white rounded-lg shadow-lg mt-1 max-h-80 overflow-y-auto z-50">
                    {suggestions.length > 0 ? (
                      suggestions.map((product) => (
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
                      ))
                    ) : (
                      <div className="p-12 text-center">
                        <p className="font-semibold text-gray-900 mb-2">Can’t find what you’re looking for?</p>
                        <p className="text-sm text-gray-600">
                          “It looks like this product is not currently listed on our website. Don’t worry our team can help! Call us at{" "}
                          <a href={`tel:${(contactData?.phone || "0397936190").replace(/\s+/g, "")}`} className="font-bold text-primary hover:underline">
                            {formatPhoneNumber(contactData?.phone) || "(03) 9793 6190"}
                          </a>{" "}
                          to get the product you’re looking for.”
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <a
                href={`${contactData?.mapLocation}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 xl:p-3 rounded-full bg-white text-black hover:bg-gray-100 transition-colors shadow-sm"
              >
                <FaLocationDot size={20} className="xl:w-5 xl:h-5" />
              </a>
              <Link href="/cart" className="relative p-2 xl:p-3 rounded-full bg-white text-black hover:bg-gray-100 transition-colors shadow-sm">
                <FaShoppingCart size={20} className="xl:w-5 xl:h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[16px] text-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
            {/* Center Search */}
            <div className="hidden xl:block bg-[#000000] text-white mt-6 h-[10px]">
              <div className="w-full">
                <nav className="flex gap-2 xl:gap-2 2xl:gap-3 items-center justify-center flex-nowrap">
                  {navLinks.map((link) => {
                    const to = link.href || '#';
                    const isActive = isLinkActive(to);
                    return (
                      <Link
                        key={link.name}
                        href={to}
                        className={
                          `text-base pb-3 xl:text-base 2xl:text-lg font-medium px-3 xl:px-3 2xl:px-5 transition-colors hover:text-primary whitespace-nowrap flex-shrink-0 ${isActive && (to !== '#' ? 'text-primary border-b-2 border-primary' : '')}`
                        }
                      >
                        <span className="inline-block">{link.name}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="xl:hidden bg-dark text-white absolute top-full left-0 w-full z-50 shadow-lg">
          <nav className="flex flex-col items-center space-y-3 sm:space-y-4 py-6 sm:py-8">
            {navLinks.map((link) => {
              const to = link.href || '#';
              const isActive = isLinkActive(to);

              return to === '#' ? (
                <span key={link.name} className="text-base sm:text-lg font-medium transition-colors py-2 px-4 rounded-lg opacity-50 cursor-not-allowed">
                  {link.name}
                </span>
              ) : (
                <Link
                  key={link.name}
                  href={to}
                  className={
                    `text-base sm:text-lg font-medium transition-colors py-2 px-4 rounded-lg hover:bg-gray-800 ${isActive && (to !== '#' ? 'text-primary' : '')}`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              );
            })}
            {/* Mobile Search Form */}
            <form onSubmit={handleSearch} className="w-full px-4 md:w-96" ref={searchRef}>
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
              {showSuggestions && (
                <div className="absolute left-0 w-full bg-white rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto z-50">
                  {suggestions.length > 0 ? (
                    suggestions.map((product) => (
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
                    ))
                  ) : (
                    <div className="p-4 text-center">
                      <p className="font-semibold text-gray-900 mb-2">Can’t find what you’re looking for?</p>
                      <p className="text-sm text-gray-600">
                        “It looks like this product is not currently listed on our website. Don’t worry our team can help! Call us at{" "}
                        <a href={`tel:${(contactData?.phone || "0397936190").replace(/\s+/g, "")}`} className="font-bold text-primary hover:underline">
                          {formatPhoneNumber(contactData?.phone) || "(03) 9793 6190"}
                        </a>{" "}
                        to get the product you’re looking for.”
                      </p>
                    </div>
                  )}
                </div>
              )}
            </form>
            <div className="flex items-center space-x-3 sm:space-x-4 pt-4 border-t border-gray-700 w-full justify-center">
              <a
                href="https://maps.app.goo.gl/8MCfDBfNa6dqdQY9A"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 sm:p-3 rounded-full bg-white text-black hover:bg-gray-100 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <MdLocationPin size={18} className="sm:w-5 sm:h-5" />
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;