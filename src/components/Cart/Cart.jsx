import React from 'react';
import CartPage from './CardPage';
function Cart() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <CartPage />
      </main>
    </div>
  );
}

export default Cart;
