import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import SingleSelect from '../common/SingleSelect';
import SearchableSingleSelect from '../common/SearchableSingleSelect';
import axiosInstance from '../../axios/axios';

const WheelFilterSidebar = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // State for filter options from API
  const [brandOptions, setBrandOptions] = useState([{ value: '', label: 'All Brand' }]);
  const [sizeOptions, setSizeOptions] = useState([{ value: '', label: 'All Size' }]);
  const [colorOptions, setColorOptions] = useState([{ value: '', label: 'All Color' }]);
  const [diameterOptions, setDiameterOptions] = useState([{ value: '', label: 'All Diameter' }]);
  const [fitmentOptions, setFitmentOptions] = useState([{ value: '', label: 'All Fitments' }]);
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
    size: searchParams.get('size') || '',
    color: searchParams.get('color') || '',
    diameter: searchParams.get('diameter') || '',
    fitments: searchParams.get('fitments') || '',
    price: searchParams.get('price') || '',
  });

  // Fetch brands from API
  const fetchBrands = async () => {
    try {
      const response = await axiosInstance.get('/api/v1/brand');
      if (response.data.statusCode === 200) {
        // Filter brands by category 'wheel' and map to options
        const brands = response.data.data.items
          .filter(brand => brand.category === 'wheel')
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

  // Fetch master filters (wheels data) from API
  const fetchMasterFilters = async () => {
    try {
      const response = await axiosInstance.get('/api/v1/masterFilter');
      if (response.data.statusCode === 200 && response.data.data.items.length > 0) {
        const wheelData = response.data.data.items.filter(
          (item) => item.category === "wheel"
        );

        // Helper to process options with ID as value and values as label
        const processOptions = (items, subCat, sortNumeric = false) => {
          const subItems = items.filter(i => i.subCategory === subCat);
          const unique = [];
          const seen = new Set();
          subItems.forEach(item => {
            if (!seen.has(item.values)) {
              seen.add(item.values);
              unique.push(item);
            }
          });

          if (sortNumeric) {
            unique.sort((a, b) => {
              const valA = parseFloat(a.values.toString().replace(/[^\d.]/g, ''));
              const valB = parseFloat(b.values.toString().replace(/[^\d.]/g, ''));
              return valA - valB;
            });
          } else {
            unique.sort((a, b) => a.values.localeCompare(b.values));
          }

          return unique.map(item => ({
            value: item._id, // Use ID for filtering
            label: item.values
          }));
        };

        const sizeOptions = processOptions(wheelData, "size", true);
        setSizeOptions([{ value: "", label: "All Size" }, ...sizeOptions]);

        const colorOptions = processOptions(wheelData, "color", false);
        setColorOptions([{ value: "", label: "All Color" }, ...colorOptions]);

        const diameterOptions = processOptions(wheelData, "diameter", true);
        setDiameterOptions([{ value: "", label: "All Diameter" }, ...diameterOptions]);

        const fitmentOptions = processOptions(wheelData, "fitments", false);
        setFitmentOptions([{ value: "", label: "All Fitments" }, ...fitmentOptions]);
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
      size: searchParams.get('size') || '',
      color: searchParams.get('color') || '',
      diameter: searchParams.get('diameter') || '',
      fitments: searchParams.get('fitments') || '',
      price: searchParams.get('price') || '',
    });
  }, [searchParams]);

  const handleChange = (key) => (value) => {
    const updatedSelected = { ...selected, [key]: value };
    setSelected(updatedSelected);

    const params = new URLSearchParams();
    Object.keys(updatedSelected).forEach((k) => {
      if (updatedSelected[k]) {
        params.set(k, updatedSelected[k]);
      }
    });
    setSearchParams(params);
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

  const handleReset = () => {
    const resetState = {
      brand: '',
      size: '',
      color: '',
      diameter: '',
      fitments: '',
      price: '',
    };
    setSelected(resetState);
    setSearchParams(new URLSearchParams());
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
            <SearchableSingleSelect
              options={brandOptions}
              value={selected.brand}
              onChange={handleChange('brand')}
              selectStyle="w-full appearance-none border border-[#7E7E7E] rounded bg-white text-[#6F6F6F] text-xs sm:text-sm h-8 sm:h-10 px-2 sm:px-3 pr-6 focus:outline-none focus:ring-1 focus:ring-[#ED1C24]"
            />
          </div>
        </div>

        {/* Size Filter */}
        <div>
          <div className="text-xs sm:text-sm text-black mb-1 ps-2">
            Size
          </div>
          <div className="relative">
            <SingleSelect
              options={sizeOptions}
              value={selected.size}
              onChange={handleChange('size')}
              selectStyle="w-full appearance-none border border-[#7E7E7E] rounded bg-white text-[#6F6F6F] text-xs sm:text-sm h-8 sm:h-10 px-2 sm:px-3 pr-6 focus:outline-none focus:ring-1 focus:ring-[#ED1C24]"
            />
          </div>
        </div>

        {/* Color Filter */}
        <div>
          <div className="text-xs sm:text-sm text-black mb-1 ps-2">
            Color
          </div>
          <div className="relative">
            <SingleSelect
              options={colorOptions}
              value={selected.color}
              onChange={handleChange('color')}
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

        {/* Fitments Filter */}
        <div>
          <div className="text-xs sm:text-sm text-black mb-1 ps-2">
            Fitments
          </div>
          <div className="relative">
            <SingleSelect
              options={fitmentOptions}
              value={selected.fitments}
              onChange={handleChange('fitments')}
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
      {Object.values(selected).some((val) => val !== '') && (
        <button
          onClick={handleReset}
          className="w-full border border-[#ED1C24] text-[#ED1C24] rounded-[8px] py-2 sm:py-3 mt-3 font-lexend font-semibold text-xs sm:text-sm hover:bg-red-50 transition-colors"
        >
          Reset Filter
        </button>
      )}
    </div>
  );
};

export default WheelFilterSidebar;