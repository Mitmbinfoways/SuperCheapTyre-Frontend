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
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
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