import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from './ui/Button';
import QuantityInput from './ui/QuantityInput';
import { secureGetItem, secureSetItem } from '../../Utils/encryption';
import { getTyreImageUrl } from '../../Utils/Utils';
import { Toast } from '../../Utils/Toast';
import { getTyreSize, getAllMasterFilters } from '../../axios/axios';

const WheelProductInfo = ({ product, navigate }) => {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("specification");
  const [relatedData, setRelatedData] = useState([]);
  const [masterFilters, setMasterFilters] = useState([]);

  const fetchdata = async () => {
    try {
      const [res, filtersRes] = await Promise.all([
        getTyreSize(product?._id),
        getAllMasterFilters({ limit: 1000 })
      ]);
      setRelatedData(res.data.data);
      setMasterFilters(filtersRes.data.data.items || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchdata();
  }, [product?._id]);

  const getFilterValue = (val) => {
    if (!val) return "N/A";
    const filter = masterFilters.find(f => f._id === val || f.values === val);
    return filter ? filter.values : val;
  };

  const specifications = [
    { label: 'Brand :', value: product?.brand || 'N/A', icon: '/productdetails/brand.svg' },
    {
      label: 'Size :',
      value: product?.wheelSpecifications
        ? `${getFilterValue(product.wheelSpecifications.size)}"`
        : 'N/A',
      icon: '/productdetails/size.svg'
    },
    { label: 'Diameter :', value: getFilterValue(product?.wheelSpecifications?.diameter), icon: '/productdetails/size.svg' },
    { label: 'Color :', value: getFilterValue(product?.wheelSpecifications?.color), icon: '/productdetails/tread.svg' },
    { label: 'Fitments :', value: getFilterValue(product?.wheelSpecifications?.fitments), icon: '/productdetails/bolt.svg' },
    { label: 'Staggered Options :', value: getFilterValue(product?.wheelSpecifications?.staggeredOptions), icon: '/productdetails/bars-staggered.png' },
    { label: 'Stock :', value: product?.stock || 0, icon: '/productdetails/stock.svg' },
  ];

  const handleQuantityChange = (newQuantity) => {
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    // Prevent adding to cart if stock is 0
    if (!product || product.stock === 0) {
      Toast({ message: "This product is out of stock", type: 'error' });
      return;
    }

    // Prevent adding to cart if quantity exceeds stock
    if (!product || quantity > product.stock) {
      Toast({
        message: `Maximum quantity available is ${product.stock || 0}`,
        type: 'error'
      });
      return;
    }

    const cart = secureGetItem('cartItems', []);
    const productId = String(product.id || product._id);
    const existingIndex = cart.findIndex((ci) => String(ci.id) === productId);

    // Check if adding this quantity would exceed stock
    if (existingIndex >= 0) {
      const newQuantity = (cart[existingIndex].quantity || 1) + quantity;
      if (newQuantity > (product?.stock || 0)) {
        Toast({
          message: `Maximum quantity available is ${product?.stock || 0}`,
          type: 'error'
        });
        return;
      }
      cart[existingIndex].quantity = newQuantity;
    } else {
      // Helper to construct wheel size string consistently
      const getWheelSizeString = () => {
        if (!product?.wheelSpecifications) return 'N/A';
        const sizeVal = getFilterValue(product.wheelSpecifications.size);
        const diamVal = getFilterValue(product.wheelSpecifications.diameter);

        const parts = [
          sizeVal ? `${sizeVal}"` : "",
          diamVal ? `${diamVal}"` : "",
        ];
        return parts.filter(Boolean).join(" ");
      };
      cart.push({
        id: productId,
        image: product?.images?.[0] ? getTyreImageUrl(product.images[0]) : '/cart/carttyre.svg',
        name: product?.name || 'Wheel',
        brand: product?.brand || 'Unknown',
        size: getWheelSizeString(),
        price: product?.price || 0,
        quantity,
        description: `${product?.brand || ''} ${product?.name || ''}`.trim() || 'Wheel Product'
      });
    }
    try {
      secureSetItem('cartItems', cart);
      localStorage.setItem('cartCount', String(cart.reduce((s, it) => s + (it.quantity || 1), 0)));
      Toast({ message: 'Added to cart', type: 'success' });

      // Redirect to cart page
      navigate("/cart");
    } catch (error) {
      console.error('Error adding item to cart:', error);
      Toast({ message: 'Failed to add item to cart', type: 'error' });
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col gap-[8px] sm:gap-[12px] md:gap-[14px] lg:gap-[16px] w-full">
        {/* Product Specifications */}
        <div className="flex flex-col w-full">
          {/* Specifications List */}
          <div className="border border-[#e0e0e0] rounded-[14px] bg-white px-[16px] sm:px-[18px] md:px-[20px] lg:px-[22px] py-[10px]">
            <div className="flex gap-6 border-b border-gray-200 mb-4 px-[6px]">
              <button
                className={`text-[18px] sm:text-[19px] md:text-[20px] font-medium leading-[23px] sm:leading-[24px] md:leading-[25px] font-['Lexend'] py-[12px] transition-colors relative ${activeTab === "specification"
                  ? "text-[#ed1c24]"
                  : "text-gray-500 hover:text-gray-700"
                  }`}
                onClick={() => setActiveTab("specification")}
              >
                Product Specification
                {activeTab === "specification" && (
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#ed1c24]" />
                )}
              </button>
              <button
                className={`text-[18px] sm:text-[19px] md:text-[20px] font-medium leading-[23px] sm:leading-[24px] md:leading-[25px] font-['Lexend'] py-[12px] transition-colors relative ${activeTab === "wheelSize"
                  ? "text-[#ed1c24]"
                  : "text-gray-500 hover:text-gray-700"
                  }`}
                onClick={() => setActiveTab("wheelSize")}
              >
                Other Size
                {activeTab === "wheelSize" && (
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#ed1c24]" />
                )}
              </button>
            </div>
            {activeTab === "specification" ? specifications?.map((spec, index) => (
              <div
                key={index}
                className={`flex justify-start items-center w-full ${index > 0 ? 'mt-[-2px]' : ''} ${index === specifications?.length - 1 ? 'mb-[8px]' : ''}`}
              >
                <img
                  src={spec?.icon}
                  alt="specification icon"
                  className="w-[20px] h-[20px] object-contain flex-shrink-0"
                />
                <span className="text-[14px] sm:text-[15px] font-normal leading-[18px] sm:leading-[19px] md:leading-[20px] font-['Lexend'] text-black border border-white py-[10px] px-[10px] w-[140px] flex-shrink-0">
                  {spec?.label}
                </span>
                <Button
                  text={spec?.value}
                  text_font_size="16"
                  text_font_family="Lexend"
                  text_font_weight="400"
                  text_line_height="20px"
                  text_color="#6e6d6d"
                  border_border="1px solid #ffffff"
                  padding="10px"
                  margin="0 0 0 14px"
                />
              </div>
            )) : activeTab === "wheelSize" && (
              relatedData?.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-48 overflow-y-auto pb-2">
                  {relatedData.map((item) => (
                    <Link
                      key={item._id}
                      to={`/wheel/${item._id}`}
                      className="flex flex-col items-center border p-3 rounded-lg text-center hover:scale-105 transition-transform cursor-pointer"
                    >
                      <img
                        src={item.images?.[0] ? getTyreImageUrl(item.images[0]) : "/cart/carttyre.svg"}
                        alt={item.name}
                        className="w-20 h-20 object-contain"
                      />
                      <p className="text-sm text-gray-700 mt-2 hover:underline underline-offset-2">
                        {item?.wheelSpecifications
                          ? `${item.wheelSpecifications.size}x${item.wheelSpecifications.diameter}`
                          : item.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate w-full">
                        {item.brand}
                      </p>
                    </Link>
                  ))}
                </div>

              ) : (
                <div className="flex justify-center items-center h-36 w-full">
                  <p className="text-gray-500 font-['Lexend'] text-lg">No wheel found</p>
                </div>
              )
            )}
          </div>
        </div>

        {/* Quantity Selection */}
        <div className="flex justify-center items-center w-full py-[10px] px-[10px]">
          <span className="flex-none text-[18px] sm:text-[19px] md:text-[20px] font-medium leading-[23px] sm:leading-[24px] md:leading-[25px] font-['Lexend'] text-black">
            Quantity :
          </span>
          <div className="flex justify-start items-center w-full ml-[10px]">
            <QuantityInput
              initialValue={quantity}
              min={1}
              max={product?.stock || 0}
              onChange={handleQuantityChange}
              className="px-[10px]"
            />
          </div>
        </div >

        {/* Stock Information */}
        {
          (!product || product.stock === 0) && (
            <div className="text-red-600 font-medium text-center py-2">
              This product is currently out of stock
            </div>
          )
        }

        {/* Add to Cart Button */}
        <Button
          text="Add To Cart"
          text_font_size="16"
          text_font_family="Lexend"
          text_font_weight="600"
          text_line_height="20px"
          text_color="#ffffff"
          fill_background_color={(!product || product.stock === 0) ? "#D7D7D7" : "#ed1c24"}
          border_border_radius="10px"
          layout_width="100%"
          padding="14px 34px"
          onClick={handleAddToCart}
          disabled={!product || product.stock === 0}
          className={(!product || product.stock === 0) ? "cursor-not-allowed" : ""}
          layout_align_self=""
          position=""
          variant=""
          size=""
          margin=""
        />
      </div >
    </div >
  );
};

export default WheelProductInfo;