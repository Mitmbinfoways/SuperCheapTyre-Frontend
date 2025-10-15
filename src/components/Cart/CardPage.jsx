import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CartItem from './CartItem';
import OrderSummary from './OrderSummary';
import { cartData as initialCartData } from './mock';
import { secureGetItem, secureSetItem } from '../../Utils/encryption';

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(() => {
    return secureGetItem('cartItems', []);
  });
  const [totals, setTotals] = useState({ subtotal: 0, discount: 0, delivery: 15, total: 0 });

  useEffect(() => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = subtotal * 0.20;
    const delivery = 15;
    const total = subtotal - discount + delivery;
    setTotals({ subtotal, discount, delivery, total });
    secureSetItem('cartItems', cartItems);
    const cartCount = cartItems.reduce((s, it) => s + (it.quantity || 1), 0);
    localStorage.setItem('cartCount', String(cartCount));
    
    // Dispatch storage event to immediately update cart count in header
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'cartCount',
      newValue: String(cartCount)
    }));
  }, [cartItems]);

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (id) => {
    // Create a custom modal for better UI
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
      <div class="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl">
        <div class="text-center">
          <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
            <svg class="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 class="text-xl font-lexend font-semibold text-gray-900 mb-2">Remove Item</h3>
          <p class="text-gray-500 mb-6">Are you sure you want to remove this item from your cart?</p>
          <div class="flex gap-3 justify-center">
            <button id="cancel-btn" class="px-5 py-2.5 text-sm font-lexend font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
              Cancel
            </button>
            <button id="confirm-btn" class="px-5 py-2.5 text-sm font-lexend font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors">
              Remove
            </button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    const confirmBtn = modal.querySelector('#confirm-btn');
    const cancelBtn = modal.querySelector('#cancel-btn');
    
    const close = () => {
      document.body.removeChild(modal);
    };
    
    confirmBtn.addEventListener('click', () => {
      setCartItems(prevItems => prevItems.filter(item => item.id !== id));
      close();
    });
    
    cancelBtn.addEventListener('click', close);
    
    // Close if clicked outside
    modal.addEventListener('click', (e) => {
      if (e.target === modal) close();
    });
  };

  return (
      <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 lg:px-8 py-5">
      <h1 className="font-lexend font-medium text-3xl text-primary mb-7 px-3">Your Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-border-gray p-6 space-y-6">
            {cartItems.map((item, index) => (
              <React.Fragment key={item.id}>
                <CartItem
                  item={item}
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemoveItem}
                />
                {index < cartItems.length - 1 && <hr className="border-border-gray" />}
              </React.Fragment>
            ))}
            {cartItems.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 text-lg">Your cart is empty</p>
                <button 
                  onClick={() => navigate('/tyres')} 
                  className="mt-4 bg-primary text-white font-lexend font-semibold text-xl py-3 px-6 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
            {cartItems.length > 0 && (
              <>
                <hr className="border-border-gray" />
                <button onClick={() => navigate('/tyres')} className="w-full bg-primary text-white font-lexend font-semibold text-xl py-4 rounded-lg hover:bg-red-700 transition-colors">
                  Add Another Product
                </button>
              </>
            )}
          </div>
        </div>
        <div className="lg:col-span-1">
          <OrderSummary totals={totals} />
        </div>
      </div>
    </div>
  );
};

export default CartPage;