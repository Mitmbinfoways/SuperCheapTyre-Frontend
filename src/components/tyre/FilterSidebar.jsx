import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronDown, CloudCog } from 'lucide-react';
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
        const tyreData = response.data.data.items.filter(
          (item) => item.category === "tyre"
        );

        // Process width options
        const widthValues = tyreData
          .filter((item) => item.subCategory === "width")
          .map((item) => item.values);
        const uniqueWidths = [...new Set(widthValues)].sort((a, b) => a - b);
        const widthOptions = uniqueWidths.map((width) => ({
          value: width,
          label: width,
        }));
        setWidthOptions([{ value: "", label: "All Width" }, ...widthOptions]);

        // Process profile options
        const profileValues = tyreData
          .filter((item) => item.subCategory === "profile")
          .map((item) => item.values);
        const uniqueProfiles = [...new Set(profileValues)].sort((a, b) => a - b);
        const profileOptions = uniqueProfiles.map((profile) => ({
          value: profile,
          label: profile,
        }));
        setProfileOptions([{ value: "", label: "All Profile" }, ...profileOptions]);

        // Process diameter options
        const diameterValues = tyreData
          .filter((item) => item.subCategory === "diameter")
          .map((item) => item.values);
        const uniqueDiameters = [...new Set(diameterValues)].sort((a, b) => a - b);
        const diameterOptions = uniqueDiameters.map((diameter) => ({
          value: diameter,
          label: diameter,
        }));
        setDiameterOptions([{ value: "", label: "All Diameter" }, ...diameterOptions]);

        // Process load rating options
        const loadRatingValues = tyreData
          .filter((item) => item.subCategory === "loadRating")
          .map((item) => item.values);
        const uniqueLoadRatings = [...new Set(loadRatingValues)].sort((a, b) => a - b);
        const loadRatingOptions = uniqueLoadRatings.map((loadRating) => ({
          value: loadRating,
          label: loadRating,
        }));
        setLoadRatingOptions([{ value: "", label: "All Load Rating" }, ...loadRatingOptions]);

        // Process speed rating options
        const speedRatingValues = tyreData
          .filter((item) => item.subCategory === "speedRating")
          .map((item) => item.values);
        const uniqueSpeedRatings = [...new Set(speedRatingValues)].sort();
        const speedRatingOptions = uniqueSpeedRatings.map((speedRating) => ({
          value: speedRating,
          label: speedRating,
        }));
        setSpeedRatingOptions([{ value: "", label: "All Speed Rating" }, ...speedRatingOptions]);

        // Process pattern options
        const patternValues = tyreData
          .filter((item) => item.subCategory === "pattern")
          .map((item) => item.values);
        const uniquePatterns = [...new Set(patternValues)].sort();
        const patternOptions = uniquePatterns.map((pattern) => ({
          value: pattern,
          label: pattern,
        }));
        setPatternOptions([{ value: "", label: "All Pattern" }, ...patternOptions]);
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