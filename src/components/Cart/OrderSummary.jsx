import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { secureGetItem, secureSetItem } from '../../Utils/encryption';
import { Toast } from '../../Utils/Toast';
import { formatCurrency } from '../../Utils/Utils';
import RecommendedServicesPopup from './RecommendedServicesPopup';

const SummaryRow = ({ label, value, isDiscount = false }) => (
  <div className="flex justify-between items-center">
    <p className={`font-lexend text-xl text-black/60`}>{label}</p>
    <p className={`font-lexend text-xl font-medium ${isDiscount ? 'text-primary font-satoshi font-bold' : 'text-black'}`}>
      {isDiscount ? '-' : ''}{formatCurrency(value)}
    </p>
  </div>
);

const OrderSummary = ({ totals, refreshCart }) => {
  const [paymentOption, setPaymentOption] = useState('partial');
  const [showRecommendedPopup, setShowRecommendedPopup] = useState(false);
  const navigate = useNavigate();
  const [cart, setCart] = useState([])

  useEffect(() => {
    const savedPaymentOption = secureGetItem('selectedPaymentOption', 'partial');
    setPaymentOption(savedPaymentOption);
  }, []);

  useEffect(() => {
    secureSetItem('selectedPaymentOption', paymentOption);
  }, [paymentOption]);

  const calculateDisplayTotal = () => {
    const subtotal = totals.subtotal;
    if (paymentOption === 'full') {
      return subtotal;
    } else {
      return subtotal * 0.25;
    }
  };

  const displayTotal = calculateDisplayTotal();

  const handleCheckout = () => {
    const cartItems = secureGetItem('cartItems', []);

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      openEmptyCartModal(navigate);
      return;
    }
    secureSetItem('selectedPaymentOption', paymentOption);
    setShowRecommendedPopup(true);
  };


  const proceedToCheckout = () => {
    setShowRecommendedPopup(false);
    navigate('/appointment');
  };

  const openEmptyCartModal = (navigate) => {
    const modal = document.createElement('div');
    modal.className =
      'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';

    modal.innerHTML = `
    <div class="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl relative">
      <button id="close-modal-btn" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div class="text-center">
        <h3 class="text-xl font-lexend font-semibold text-gray-900 mb-2">Select Product Type</h3>
        <p class="text-gray-500 mb-6">What would you like to add to your cart?</p>

        <div class="flex flex-col gap-3">
          <button id="tyres-btn" class="px-5 py-3 text-base font-lexend font-medium text-white bg-primary rounded-lg hover:bg-red-700 transition-colors">Tyres</button>
          <button id="wheels-btn" class="px-5 py-3 text-base font-lexend font-medium text-white bg-primary rounded-lg hover:bg-red-700 transition-colors">Wheels</button>
          <button id="services-btn" class="px-5 py-3 text-base font-lexend font-medium text-white bg-primary rounded-lg hover:bg-red-700 transition-colors">Services</button>
        </div>
      </div>
    </div>
  `;

    document.body.appendChild(modal);

    const close = () => modal.remove();

    modal.querySelector('#close-modal-btn').addEventListener('click', close);

    modal.querySelector('#tyres-btn').addEventListener('click', () => {
      navigate('/tyres');
      close();
    });

    modal.querySelector('#wheels-btn').addEventListener('click', () => {
      navigate('/wheels');
      close();
    });

    modal.querySelector('#services-btn').addEventListener('click', () => {
      navigate('/services');
      close();
    });

    // Close when clicking outside
    modal.addEventListener('click', (e) => {
      if (e.target === modal) close();
    });
  };


  return (
    <>
      <div className="bg-white rounded-2xl border border-border-gray p-6 space-y-6 sticky top-8">
        <h2 className="font-satoshi font-bold text-2xl">Order Summary</h2>

        <div className="space-y-5">
          <SummaryRow label="Total" value={totals.subtotal} />
        </div>

        <hr className="border-border-gray" />

        <div className="flex justify-between items-center">
          <p className="font-lexend font-medium text-xl">Partial Payment (25%)</p>
          <p className="font-lexend font-medium text-2xl">{formatCurrency(displayTotal)}</p>
        </div>

        <div className="flex justify-between items-center mt-2">
          <p className="font-lexend font-medium text-xl">Balance Due</p>
          <p className="font-lexend font-medium text-2xl">{formatCurrency(totals.subtotal - displayTotal)}</p>
        </div>

        <div className="space-y-3">
          <p className="font-lexend text-2xl">Payment Options:</p>
          <div className="grid sm:flex-row sm:items-center gap-4 sm:gap-2">
            {/* <label className="flex items-center gap-2 cursor-pointer font-lexend text-lg">
            <input 
              type="radio" 
              name="payment" 
              value="full" 
              checked={paymentOption === 'full'} 
              onChange={(e) => setPaymentOption(e.target.value)}
              className="w-4 h-4 accent-black"
            />
            Full Payment
          </label> */}
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

      {showRecommendedPopup && (
        <RecommendedServicesPopup
          onClose={() => setShowRecommendedPopup(false)}
          onContinue={proceedToCheckout}
          refreshCart={refreshCart}
        />
      )}
    </>
  );
};

export default OrderSummary;