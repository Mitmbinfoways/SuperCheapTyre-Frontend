import React, { useState } from 'react';
import Button from './ui/Button';
import QuantityInput from './ui/QuantityInput';
import { secureGetItem, secureSetItem } from '../../Utils/encryption';
import { getTyreImageUrl } from '../../Utils/Utils';
import { Toast } from '../../Utils/Toast';

const WheelProductInfo = (product) => {
  const [quantity, setQuantity] = useState(1);

  const specifications = [
    { label: 'Brand :', value: product.product.brand, icon: '/productdetails/brand.svg' },
    {
      label: 'Size :',
      value: product.product.wheelSpecifications
        ? `${product.product.wheelSpecifications.size}"`
        : 'N/A',
      icon: '/productdetails/size.svg'
    },
    { label: 'Diameter :', value: product.product.wheelSpecifications?.diameter || 'N/A', icon: '/productdetails/size.svg' },
    { label: 'Color :', value: product.product.wheelSpecifications?.color || 'N/A', icon: '/productdetails/tread.svg' },
    { label: 'Fitments :', value: product.product.wheelSpecifications?.fitments || 'N/A', icon: '/productdetails/bolt.svg' },
    // { label: 'Staggered Options :', value: product.product.wheelSpecifications?.staggeredOptions || 'N/A', icon: '/productdetails/offset.svg' },
    { label: 'Stock :', value: product.product.stock, icon: '/productdetails/stock.svg' },
  ];

  const handleQuantityChange = (newQuantity) => {
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    // Prevent adding to cart if stock is 0
    if (product.product.stock === 0) {
      Toast({ message: "This product is out of stock", type: 'error' });
      return;
    }
    
    // Prevent adding to cart if quantity exceeds stock
    if (quantity > product.product.stock) {
      Toast({ 
        message: `Maximum quantity available is ${product.product.stock}`, 
        type: 'error' 
      });
      return;
    }
    
    const cart = secureGetItem('cartItems', []);
    const productId = product.product.id || product.product._id;
    const existingIndex = cart.findIndex((ci) => ci.id === productId);
    
    // Check if adding this quantity would exceed stock
    if (existingIndex >= 0) {
      const newQuantity = (cart[existingIndex].quantity || 1) + quantity;
      if (newQuantity > product.product.stock) {
        Toast({ 
          message: `Maximum quantity available is ${product.product.stock}`, 
          type: 'error' 
        });
        return;
      }
      cart[existingIndex].quantity = newQuantity;
    } else {
      cart.push({
        id: productId,
        image: product.product.images?.[0] ? getTyreImageUrl(product.product.images[0]) : '/cart/carttyre.svg',
        name: product.product.name || 'Wheel',
        brand: product.product.brand,
        size: product.product.wheelSpecifications
          ? `${product.product.wheelSpecifications.size}" ${product.product.wheelSpecifications.diameter}"`
          : 'N/A',
        price: product.product.price || 0,
        quantity,
        description: `${product.product.brand || ''} ${product.product.name || ''}`.trim() || 'Wheel Product'
      });
    }
    secureSetItem('cartItems', cart);
    localStorage.setItem('cartCount', String(cart.reduce((s, it) => s + (it.quantity || 1), 0)));
    Toast({ message: 'Added to cart', type: 'success' });
  };

  return (
    <div className="w-full">
      <div className="flex flex-col gap-[8px] sm:gap-[12px] md:gap-[14px] lg:gap-[16px] w-full">
        {/* Product Specifications */}
        <div className="flex flex-col w-full">
          {/* Specifications List */}
          <div className="border border-[#e0e0e0] rounded-[14px] bg-white px-[16px] sm:px-[18px] md:px-[20px] lg:px-[22px] py-[10px]">
            <h3 className="text-[18px] sm:text-[19px] md:text-[20px] font-medium leading-[23px] sm:leading-[24px] md:leading-[25px] font-['Lexend'] text-black py-[12px] px-[6px]">
              Product Specification
            </h3>
            {specifications?.map((spec, index) => (
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
                  layout_align_self=""
                  fill_background_color=""
                  border_border_radius=""
                  layout_width=""
                  position=""
                  variant=""
                  size=""
                  className=""
                  onClick={() => { }}
                />
              </div>
            ))}
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
              max={product.product.stock}
              onChange={handleQuantityChange}
              className="px-[10px]"
            />
          </div>
        </div>

        {/* Stock Information */}
        {product.product.stock === 0 && (
          <div className="text-red-600 font-medium text-center py-2">
            This product is currently out of stock
          </div>
        )}

        {/* Add to Cart Button */}
        <Button
          text="Add To Cart"
          text_font_size="16"
          text_font_family="Lexend"
          text_font_weight="600"
          text_line_height="20px"
          text_color="#ffffff"
          fill_background_color={product.product.stock === 0 ? "#D7D7D7" : "#ed1c24"}
          border_border_radius="10px"
          layout_width="100%"
          padding="14px 34px"
          onClick={handleAddToCart}
          disabled={product.product.stock === 0}
          className={product.product.stock === 0 ? "cursor-not-allowed" : ""}
          layout_align_self=""
          position=""
          variant=""
          size=""
          margin=""
        />
      </div>
    </div>
  );
};

export default WheelProductInfo;