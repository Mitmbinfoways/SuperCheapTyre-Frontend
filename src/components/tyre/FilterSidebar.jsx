import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import SingleSelect from '../common/SingleSelect';
import axiosInstance from '../../axios/axios';

const FilterSidebar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // State for filter options from API
  const [brandOptions, setBrandOptions] = useState([{ value: '', label: 'All Brand' }]);
  const [widthOptions, setWidthOptions] = useState([{ value: '', label: 'All Width' }]);
  const [profileOptions, setProfileOptions] = useState([{ value: '', label: 'All Profile' }]);
  const [diameterOptions, setDiameterOptions] = useState([{ value: '', label: 'All Diameter' }]);
  const [loadRatingOptions, setLoadRatingOptions] = useState([{ value: '', label: 'All Load Rating' }]);
  const [speedRatingOptions, setSpeedRatingOptions] = useState([{ value: '', label: 'All Speed Rating' }]);
  const [patternOptions, setPatternOptions] = useState([{ value: '', label: 'All Pattern' }]);
  const [loading, setLoading] = useState(true);

  // Price sorting options
  const priceOptions = [
    { value: '', label: 'All Price' },
    { value: 'low-to-high', label: 'Low to High' },
    { value: 'high-to-low', label: 'High to Low' },
  ];

  // Initialize selected values from URL parameters
  const [selected, setSelected] = useState({
    brand: searchParams.get('brand') || '',
    width: searchParams.get('width') || '',
    profile: searchParams.get('profile') || '',
    diameter: searchParams.get('diameter') || '',
    loadRating: searchParams.get('loadRating') || '',
    speedRating: searchParams.get('speedRating') || '',
    pattern: searchParams.get('pattern') || '',
    price: searchParams.get('price') || '',
  });

  // Fetch brands from API
  const fetchBrands = async () => {
    try {
      const response = await axiosInstance.get('/api/v1/brand');
      if (response.data.statusCode === 200) {
        // Filter brands by category 'tyre' and map to options
        const brands = response.data.data.items
          .filter(brand => brand.category === 'tyre')
          .map(brand => ({
            value: brand.name,
            label: brand.name
          }));
        setBrandOptions([{ value: '', label: 'All Brand' }, ...brands]);
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  // Fetch master filters (width, profile, diameter) from API
  const fetchMasterFilters = async () => {
    try {
      const response = await axiosInstance.get('/api/v1/masterFilter');
      if (response.data.statusCode === 200 && response.data.data.items.length > 0) {
        const tyreData = response.data.data.items[0].tyres;

        // Set width options
        if (tyreData.width && tyreData.width.length > 0) {
          const widths = tyreData.width.map(item => ({
            value: item.name,
            label: item.name
          }));
          setWidthOptions([{ value: '', label: 'All Width' }, ...widths]);
        }

        // Set profile options
        if (tyreData.profile && tyreData.profile.length > 0) {
          const profiles = tyreData.profile.map(item => ({
            value: item.name,
            label: item.name
          }));
          setProfileOptions([{ value: '', label: 'All Profile' }, ...profiles]);
        }

        // Set diameter options
        if (tyreData.diameter && tyreData.diameter.length > 0) {
          const diameters = tyreData.diameter.map(item => ({
            value: item.name,
            label: item.name
          }));
          setDiameterOptions([{ value: '', label: 'All Diameter' }, ...diameters]);
        }

        // Set load rating options
        if (tyreData.loadRating && tyreData.loadRating.length > 0) {
          const loadRatings = tyreData.loadRating.map(item => ({
            value: item.name,
            label: item.name
          }));
          setLoadRatingOptions([{ value: '', label: 'All Load Rating' }, ...loadRatings]);
        }

        // Set speed rating options
        if (tyreData.speedRating && tyreData.speedRating.length > 0) {
          const speedRatings = tyreData.speedRating.map(item => ({
            value: item.name,
            label: item.name
          }));
          setSpeedRatingOptions([{ value: '', label: 'All Speed Rating' }, ...speedRatings]);
        }

        // Set pattern options
        if (tyreData.pattern && tyreData.pattern.length > 0) {
          const patterns = tyreData.pattern.map(item => ({
            value: item.name,
            label: item.name
          }));
          setPatternOptions([{ value: '', label: 'All Pattern' }, ...patterns]);
        }
      }
    } catch (error) {
      console.error('Error fetching master filters:', error);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchBrands(), fetchMasterFilters()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Sync selected values with URL parameters when URL changes
  useEffect(() => {
    setSelected({
      brand: searchParams.get('brand') || '',
      width: searchParams.get('width') || '',
      profile: searchParams.get('profile') || '',
      diameter: searchParams.get('diameter') || '',
      loadRating: searchParams.get('loadRating') || '',
      speedRating: searchParams.get('speedRating') || '',
      pattern: searchParams.get('pattern') || '',
      price: searchParams.get('price') || '',
    });
  }, [searchParams]);

  const handleChange = (key) => (value) => {
    setSelected((prev) => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    // Update URL query parameters with selected filters
    const params = new URLSearchParams();
    
    Object.keys(selected).forEach(key => {
      if (selected[key]) {
        params.set(key, selected[key]);
      }
    });
    
    setSearchParams(params);
  };

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#D5D5D5] shadow-[0_5px_5px_-1px_rgba(0,0,0,0.25)] p-4 sm:p-6 lg:p-8 w-full sm:w-full lg:w-96 h-fit">
      <h2 className="text-xl sm:text-2xl font-lexend font-medium text-center mb-6 sm:mb-8">Filters</h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-1 grid-cols-1 gap-6">
        {/* Brand Filter */}
        <div>
          <div className="text-xs sm:text-sm text-black mb-1 ps-2"> 
            Brand
          </div>
          <div className="relative">
            <SingleSelect
              options={brandOptions}
              value={selected.brand}
              onChange={handleChange('brand')}
              selectStyle="w-full appearance-none border border-[#7E7E7E] rounded bg-white text-[#6F6F6F] text-xs sm:text-sm h-8 sm:h-10 px-2 sm:px-3 pr-6 focus:outline-none focus:ring-1 focus:ring-[#ED1C24]"
            />
          </div>
        </div>

        {/* Width Filter */}
        <div>
          <div className="text-xs sm:text-sm text-black mb-1 ps-2"> 
            Width
          </div>
          <div className="relative">
            <SingleSelect
              options={widthOptions}
              value={selected.width}
              onChange={handleChange('width')}
              selectStyle="w-full appearance-none border border-[#7E7E7E] rounded bg-white text-[#6F6F6F] text-xs sm:text-sm h-8 sm:h-10 px-2 sm:px-3 pr-6 focus:outline-none focus:ring-1 focus:ring-[#ED1C24]"
            />
          </div>
        </div>

        {/* Profile Filter */}
        <div>
          <div className="text-xs sm:text-sm text-black mb-1 ps-2"> 
            Profile
          </div>
          <div className="relative">
            <SingleSelect
              options={profileOptions}
              value={selected.profile}
              onChange={handleChange('profile')}
              selectStyle="w-full appearance-none border border-[#7E7E7E] rounded bg-white text-[#6F6F6F] text-xs sm:text-sm h-8 sm:h-10 px-2 sm:px-3 pr-6 focus:outline-none focus:ring-1 focus:ring-[#ED1C24]"
            />
          </div>
        </div>

        {/* Diameter Filter */}
        <div>
          <div className="text-xs sm:text-sm text-black mb-1 ps-2"> 
            Diameter
          </div>
          <div className="relative">
            <SingleSelect
              options={diameterOptions}
              value={selected.diameter}
              onChange={handleChange('diameter')}
              selectStyle="w-full appearance-none border border-[#7E7E7E] rounded bg-white text-[#6F6F6F] text-xs sm:text-sm h-8 sm:h-10 px-2 sm:px-3 pr-6 focus:outline-none focus:ring-1 focus:ring-[#ED1C24]"
            />
          </div>
        </div>

        {/* Load Rating Filter */}
        <div>
          <div className="text-xs sm:text-sm text-black mb-1 ps-2"> 
            Load Rating
          </div>
          <div className="relative">
            <SingleSelect
              options={loadRatingOptions}
              value={selected.loadRating}
              onChange={handleChange('loadRating')}
              selectStyle="w-full appearance-none border border-[#7E7E7E] rounded bg-white text-[#6F6F6F] text-xs sm:text-sm h-8 sm:h-10 px-2 sm:px-3 pr-6 focus:outline-none focus:ring-1 focus:ring-[#ED1C24]"
            />
          </div>
        </div>

        {/* Speed Rating Filter */}
        <div>
          <div className="text-xs sm:text-sm text-black mb-1 ps-2"> 
            Speed Rating
          </div>
          <div className="relative">
            <SingleSelect
              options={speedRatingOptions}
              value={selected.speedRating}
              onChange={handleChange('speedRating')}
              selectStyle="w-full appearance-none border border-[#7E7E7E] rounded bg-white text-[#6F6F6F] text-xs sm:text-sm h-8 sm:h-10 px-2 sm:px-3 pr-6 focus:outline-none focus:ring-1 focus:ring-[#ED1C24]"
            />
          </div>
        </div>

        {/* Pattern Filter */}
        <div>
          <div className="text-xs sm:text-sm text-black mb-1 ps-2"> 
            Pattern
          </div>
          <div className="relative">
            <SingleSelect
              options={patternOptions}
              value={selected.pattern}
              onChange={handleChange('pattern')}
              selectStyle="w-full appearance-none border border-[#7E7E7E] rounded bg-white text-[#6F6F6F] text-xs sm:text-sm h-8 sm:h-10 px-2 sm:px-3 pr-6 focus:outline-none focus:ring-1 focus:ring-[#ED1C24]"
            />
          </div>
        </div>

        {/* Price Sorting */}
        <div>
          <div className="text-xs sm:text-sm text-black mb-1 ps-2"> 
            Sort by Price
          </div>
          <div className="relative">
            <SingleSelect
              options={priceOptions}
              value={selected.price}
              onChange={handleChange('price')}
              selectStyle="w-full appearance-none border border-[#7E7E7E] rounded bg-white text-[#6F6F6F] text-xs sm:text-sm h-8 sm:h-10 px-2 sm:px-3 pr-6 focus:outline-none focus:ring-1 focus:ring-[#ED1C24]"
            />
          </div>
        </div>
      </div>

      <button onClick={handleApply} className="w-full bg-brand-red text-white rounded-[8px] py-2 sm:py-3 mt-6 sm:mt-6 font-lexend font-semibold text-xs sm:text-sm bg-[#ED1C24] hover:bg-red-700 transition-colors">
        Apply Filter
      </button>
    </div>
  );
};

export default FilterSidebar;