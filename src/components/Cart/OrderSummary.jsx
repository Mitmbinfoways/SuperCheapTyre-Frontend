import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { secureGetItem, secureSetItem } from '../../Utils/encryption';
import { Toast } from '../../Utils/Toast';
import { formatCurrency } from '../../Utils/Utils';

const SummaryRow = ({ label, value, isDiscount = false }) => (
  <div className="flex justify-between items-center">
    <p className={`font-lexend text-xl text-black/60`}>{label}</p>
    <p className={`font-lexend text-xl font-medium ${isDiscount ? 'text-primary font-satoshi font-bold' : 'text-black'}`}>
      {isDiscount ? '-' : ''}{formatCurrency(value)}
    </p>
  </div>
);

const OrderSummary = ({ totals }) => {
  const [paymentOption, setPaymentOption] = useState('full');
  const navigate = useNavigate();

  // Load saved payment option from localStorage on component mount
  useEffect(() => {
    const savedPaymentOption = secureGetItem('selectedPaymentOption', 'full');
    setPaymentOption(savedPaymentOption);
  }, []);

  // Save payment option to localStorage whenever it changes
  useEffect(() => {
    secureSetItem('selectedPaymentOption', paymentOption);
  }, [paymentOption]);

  // Calculate display total based on payment option
  const calculateDisplayTotal = () => {
    const subtotal = totals.subtotal;
    
    if (paymentOption === 'full') {
      // Full payment: just the subtotal (no delivery fee)
      return subtotal;
    } else {
      // Partial payment: 25% of subtotal
      return subtotal * 0.25;
    }
  };

  const displayTotal = calculateDisplayTotal();

  const handleCheckout = () => {
    const cart = secureGetItem('cartItems', []);
    if (!cart.length) {
      Toast({ message: 'Please add at least one item to cart', type: 'error' });
      navigate('/tyres');
      return;
    }
    // Store the selected payment option in localStorage
    secureSetItem('selectedPaymentOption', paymentOption);
    navigate('/appointment');
  };

  return (
    <div className="bg-white rounded-2xl border border-border-gray p-6 space-y-6 sticky top-8">
      <h2 className="font-satoshi font-bold text-2xl">Order Summary</h2>
      
      <div className="space-y-5">
        <SummaryRow label="Subtotal" value={totals.subtotal} />
      </div>

      <hr className="border-border-gray" />

      <div className="flex justify-between items-center">
        <p className="font-lexend font-medium text-xl">Total</p>
        <p className="font-lexend font-medium text-2xl">{formatCurrency(displayTotal)}</p>
      </div>

      <div className="space-y-3">
        <p className="font-lexend text-2xl">Payment Options:</p>
        <div className="grid sm:flex-row sm:items-center gap-4 sm:gap-2">
          <label className="flex items-center gap-2 cursor-pointer font-lexend text-lg">
            <input 
              type="radio" 
              name="payment" 
              value="full" 
              checked={paymentOption === 'full'} 
              onChange={(e) => setPaymentOption(e.target.value)}
              className="w-4 h-4 accent-black"
            />
            Full Payment
          </label>
          <label className="flex items-center gap-2 cursor-pointer font-lexend text-lg">
            <input 
              type="radio" 
              name="payment" 
              value="partial" 
              checked={paymentOption === 'partial'}
              onChange={(e) => setPaymentOption(e.target.value)}
              className="w-4 h-4 accent-black"
            />
            Partial Payment (25%)
          </label>
        </div>
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm text-blue-800">
            {paymentOption === 'full' 
              ? 'You will be charged the full amount.' 
              : 'You will be charged 25% of the total now, with the remainder payable at the store.'}
          </p>
        </div>
      </div>

      <button onClick={handleCheckout} className="w-full bg-primary text-white font-lexend font-semibold text-base py-4 rounded-lg flex items-center justify-center gap-3 hover:bg-red-700 transition-colors">
        Go to Checkout
        <ArrowRight size={24} />
      </button>
    </div>
  );
};

export default OrderSummary;