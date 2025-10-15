import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { secureGetItem } from '../../Utils/encryption';
import { Toast } from '../../Utils/Toast';

const SummaryRow = ({ label, value, isDiscount = false }) => (
  <div className="flex justify-between items-center">
    <p className={`font-lexend text-xl text-black/60`}>{label}</p>
    <p className={`font-lexend text-xl font-medium ${isDiscount ? 'text-primary font-satoshi font-bold' : 'text-black'}`}>
      {isDiscount ? '-' : ''}${value.toFixed(2)}
    </p>
  </div>
);

const OrderSummary = ({ totals }) => {
  const [paymentOption, setPaymentOption] = useState('full');
  const navigate = useNavigate();

  const handleCheckout = () => {
    const cart = secureGetItem('cartItems', []);
    if (!cart.length) {
      Toast({ message: 'Please add at least one item to cart', type: 'error' });
      navigate('/tyres');
      return;
    }
    navigate('/appointment');
  };

  return (
    <div className="bg-white rounded-2xl border border-border-gray p-6 space-y-6 sticky top-8">
      <h2 className="font-satoshi font-bold text-2xl">Order Summary</h2>
      
      <div className="space-y-5">
        <SummaryRow label="Subtotal" value={totals.subtotal} />
        <SummaryRow label="Discount (-20%)" value={totals.discount} isDiscount={true} />
        <SummaryRow label="Delivery Fee" value={totals.delivery} />
      </div>

      <hr className="border-border-gray" />

      <div className="flex justify-between items-center">
        <p className="font-lexend font-medium text-xl">Total</p>
        <p className="font-lexend font-medium text-2xl">${totals.total.toFixed(2)}</p>
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
            Partial Payment
          </label>
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
