import React, { useState } from 'react';

const QuantityInput = ({ 
  initialValue = 1, 
  min = 1, 
  max = 99, 
  onChange,
  className = "" 
}) => {
  const [quantity, setQuantity] = useState(initialValue);

  const handleDecrement = () => {
    if (quantity > min) {
      const newValue = quantity - 1;
      setQuantity(newValue);
      if (onChange) onChange(newValue);
    }
  };

  const handleIncrement = () => {
    if (quantity < max) {
      const newValue = quantity + 1;
      setQuantity(newValue);
      if (onChange) onChange(newValue);
    }
  };

  return (
    <div className={`flex items-center gap-[10px] ${className}`}>
      <button
        type="button"
        onClick={handleDecrement}
        disabled={quantity <= min}
        className="w-[22px] h-[22px] flex items-center justify-center hover:opacity-70 transition-opacity disabled:opacity-50"
        aria-label="Decrease quantity"
      >
        <img 
          src="/productdetails/minus.svg" 
          alt="decrease" 
          className="w-full h-full"
        />
      </button>
      
      <span className="text-[20px] font-normal leading-[25px] font-['Lexend'] text-black min-w-[20px] text-center">
        {quantity}
      </span>
      
      <button
        type="button"
        onClick={handleIncrement}
        disabled={quantity >= max}
        className="w-[22px] h-[22px] flex items-center justify-center hover:opacity-70 transition-opacity disabled:opacity-50"
        aria-label="Increase quantity"
      >
        <img 
          src="/productdetails/max.svg" 
          alt="increase" 
          className="w-full h-full"
        />
      </button>
    </div>
  );
};

export default QuantityInput;

