import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import CartItem from './CartItem';
import OrderSummary from './OrderSummary';
import { cartData as initialCartData } from './mock';
import { secureGetItem, secureSetItem } from '../../Utils/encryption';
import { getTyreById, getAllMasterFilters, getServiceById } from '../../axios/axios';

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = secureGetItem('cartItems', []);
    return Array.isArray(savedCart) ? savedCart : [];
  });

  const refreshCart = () => {
    const savedCart = secureGetItem('cartItems', []);
    setCartItems(Array.isArray(savedCart) ? savedCart : []);
  };

  const [productStocks, setProductStocks] = useState({});
  const [loadingStocks, setLoadingStocks] = useState(true);
  const [totals, setTotals] = useState({ subtotal: 0, discount: 0, delivery: 15, total: 0 });

  // Fetch stock information for all products in the cart
  // Validate cart items and fetch stock information
  useEffect(() => {
    const validateCartAndFetchStock = async () => {
      if (cartItems.length === 0) {
        setLoadingStocks(false);
        return;
      }

      let itemsRemoved = false;
      let pricesUpdated = false;
      let specsUpdated = false;
      const updatedCartItems = [...cartItems];
      const itemsToRemoveIds = [];

      try {
        const [filtersRes] = await Promise.all([
          getAllMasterFilters({ limit: 1000 })
        ]);
        const masterFilters = filtersRes.data?.data?.items || [];

        const getFilterValue = (val) => {
          if (!val) return "";
          const filter = masterFilters.find(f => f._id === val || f.values === val);
          return filter ? filter.values : val;
        };

        // Create an array of promises to fetch fresh data for each product
        const stockPromises = cartItems.map(async (item, index) => {
          // Check for services
          if (item.type === 'service') {
            try {
              const response = await getServiceById(item.id);
              const service = response.data?.data;

              if (!service) {
                itemsToRemoveIds.push(item.id);
                itemsRemoved = true;
                return { id: item.id, stock: undefined };
              }

              if (service.isActive === false) {
                itemsToRemoveIds.push(item.id);
                itemsRemoved = true;
                return { id: item.id, stock: undefined };
              }

              // Check if price changed
              if (parseInt(service.price) !== parseInt(item.price)) {
                updatedCartItems[index].price = parseInt(service.price);
                pricesUpdated = true;
              }

              return { id: item.id, stock: undefined };
            } catch (error) {
              console.error(`Error fetching data for service ${item.id}:`, error);
              if (error.response && error.response.status === 404) {
                itemsToRemoveIds.push(item.id);
                itemsRemoved = true;
              }
              return { id: item.id, stock: undefined };
            }
          }

          try {
            const response = await getTyreById(item.id);
            const product = response.data?.data;

            if (!product) {
              // Product not found, mark for removal
              itemsToRemoveIds.push(item.id);
              itemsRemoved = true;
              return { id: item.id, stock: 0 };
            }

            // Check if product is inactive
            if (product.isActive === false) {
              itemsToRemoveIds.push(item.id);
              itemsRemoved = true;
              return { id: item.id, stock: 0 };
            }

            // Check if price changed
            if (product.price !== item.price) {
              updatedCartItems[index].price = product.price;
              pricesUpdated = true;
            }

            // Validate Specs (Size Check)
            let currentSize = "";
            if (product.category === 'tyre' && product.tyreSpecifications) {
              const width = getFilterValue(product.tyreSpecifications.width);
              const profile = getFilterValue(product.tyreSpecifications.profile);
              const diameter = getFilterValue(product.tyreSpecifications.diameter);
              const loadRating = getFilterValue(product.tyreSpecifications.loadRating);
              const speedRating = getFilterValue(product.tyreSpecifications.speedRating);

              currentSize = `${width}/${profile} ${diameter} ${loadRating}${speedRating}`;
            } else if (product.category === 'wheel' && product.wheelSpecifications) {
              const sizeVal = getFilterValue(product.wheelSpecifications.size);
              const diamVal = getFilterValue(product.wheelSpecifications.diameter);
              // const fitVal = getFilterValue(product.wheelSpecifications.fitments);
              // const stagVal = getFilterValue(product.wheelSpecifications.staggeredOptions);

              const parts = [
                sizeVal ? `${sizeVal}"` : "",
                diamVal ? `${diamVal}"` : "",
                // fitVal,
                // stagVal
              ];
              currentSize = parts.filter(Boolean).join(" ");
            }

            // If we constructed a size and the cart item has a size, check for mismatch
            // Note: We trim to avoid whitespace issues
            if (currentSize && item.size && currentSize.replace(/\s+/g, '') !== item.size.replace(/\s+/g, '')) {
              // Instead of removing, we update the cart item with the new size
              updatedCartItems[index].size = currentSize;
              specsUpdated = true;
            }

            return { id: item.id, stock: product.stock || 0 };
          } catch (error) {
            console.error(`Error fetching data for product ${item.id}:`, error);
            // If error is 404 (or null product), might want to remove, but safely keep for now unless explicit signal
            if (error.response && error.response.status === 404) {
              itemsToRemoveIds.push(item.id);
              itemsRemoved = true;
            }
            return { id: item.id, stock: 0 };
          }
        });

        // Wait for all promises to resolve
        const stockResults = await Promise.all(stockPromises);

        // Convert to an object for easy lookup
        const stockMap = {};
        stockResults.forEach(({ id, stock }) => {
          stockMap[id] = stock;
        });

        setProductStocks(stockMap);

        // Update cart if changes detected
        if (itemsRemoved || pricesUpdated || specsUpdated) {
          const finalCartItems = updatedCartItems.filter(item => !itemsToRemoveIds.includes(item.id));

          setCartItems(finalCartItems);

          if (itemsRemoved) {
            toast.info("Some items were removed from your cart because they are no longer available.");
          }
          if (specsUpdated) {
            // toast.info("Specifications for some items in your cart have been updated.");
          }
          if (pricesUpdated) {
            toast.info("Prices for some items in your cart have been updated.");
          }
        }

      } catch (error) {
        console.error("Error validating cart:", error);
      } finally {
        setLoadingStocks(false);
      }
    };

    validateCartAndFetchStock();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartItems.length]); // Only run on mount or when item count changes (not strictly every render to avoid loops)

  useEffect(() => {
    // Ensure cartItems is always an array before processing
    if (!Array.isArray(cartItems)) {
      console.error('Cart items is not an array:', cartItems);
      return;
    }

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

    const item = cartItems.find(i => i.id === id);

    // Check stock limitation only for non-service items
    if (item && item.type !== 'service') {
      const productStock = productStocks[id];
      if (productStock !== undefined && newQuantity > productStock) {
        // Don't allow quantity to exceed stock
        return;
      }
    }

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
      <div class="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl relative">
        <button id="close-modal-btn" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
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
    const closeModalBtn = modal.querySelector('#close-modal-btn');

    const close = () => {
      document.body.removeChild(modal);
    };

    confirmBtn.addEventListener('click', () => {
      setCartItems(prevItems => prevItems.filter(item => item.id !== id));
      close();
    });

    cancelBtn.addEventListener('click', close);
    closeModalBtn.addEventListener('click', close);

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
                  productStock={productStocks[item.id]}
                  loadingStock={loadingStocks}
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
                  onClick={() => {
                    // Show modal to select product type
                    const modal = document.createElement('div');
                    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
                    modal.innerHTML = `
                      <div class="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl relative">
                        <button id="close-modal-btn" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                          </svg>
                        </button>
                        <div class="text-center">
                          <h3 class="text-xl font-lexend font-semibold text-gray-900 mb-2">Select Product Type</h3>
                          <p class="text-gray-500 mb-6">What would you like to add to your cart?</p>
                          <div class="flex flex-col gap-3">
                            <button id="tyres-btn" class="px-5 py-3 text-base font-lexend font-medium text-white bg-primary rounded-lg hover:bg-red-700 transition-colors">
                              Tyres
                            </button>
                            <button id="wheels-btn" class="px-5 py-3 text-base font-lexend font-medium text-white bg-primary rounded-lg hover:bg-red-700 transition-colors">
                              Wheels
                            </button>
                            <button id="services-btn" class="px-5 py-3 text-base font-lexend font-medium text-white bg-primary rounded-lg hover:bg-red-700 transition-colors">
                              Services
                            </button>
                          </div>
                        </div>
                      </div>
                    `;

                    document.body.appendChild(modal);

                    const tyresBtn = modal.querySelector('#tyres-btn');
                    const wheelsBtn = modal.querySelector('#wheels-btn');
                    const servicesBtn = modal.querySelector('#services-btn');
                    const closeModalBtn = modal.querySelector('#close-modal-btn');

                    const close = () => {
                      document.body.removeChild(modal);
                    };

                    tyresBtn.addEventListener('click', () => {
                      navigate('/tyres');
                      close();
                    });

                    wheelsBtn.addEventListener('click', () => {
                      navigate('/wheels');
                      close();
                    });
                    servicesBtn.addEventListener('click', () => {
                      navigate('/services');
                      close();
                    });
                    closeModalBtn.addEventListener('click', close);

                    // Close if clicked outside
                    modal.addEventListener('click', (e) => {
                      if (e.target === modal) close();
                    });
                  }}
                  className="mt-4 bg-primary text-white font-lexend font-semibold text-xl py-3 px-6 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
            {cartItems.length > 0 && (
              <>
                <hr className="border-border-gray" />
                <button
                  onClick={() => {
                    // Show modal to select product type
                    const modal = document.createElement('div');
                    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
                    modal.innerHTML = `
                      <div class="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl relative">
                        <button id="close-modal-btn" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                          </svg>
                        </button>
                        <div class="text-center">
                          <h3 class="text-xl font-lexend font-semibold text-gray-900 mb-2">Select Product Type</h3>
                          <p class="text-gray-500 mb-6">What would you like to add to your cart?</p>
                          <div class="flex flex-col gap-3">
                            <button id="tyres-btn" class="px-5 py-3 text-base font-lexend font-medium text-white bg-primary rounded-lg hover:bg-red-700 transition-colors">
                              Tyres
                            </button>
                            <button id="wheels-btn" class="px-5 py-3 text-base font-lexend font-medium text-white bg-primary rounded-lg hover:bg-red-700 transition-colors">
                              Wheels
                            </button>
                            <button id="services-btn" class="px-5 py-3 text-base font-lexend font-medium text-white bg-primary rounded-lg hover:bg-red-700 transition-colors">
                              Services
                            </button>
                          </div>
                        </div>
                      </div>
                    `;

                    document.body.appendChild(modal);

                    const tyresBtn = modal.querySelector('#tyres-btn');
                    const wheelsBtn = modal.querySelector('#wheels-btn');
                    const servicesBtn = modal.querySelector('#services-btn');
                    const closeModalBtn = modal.querySelector('#close-modal-btn');

                    const close = () => {
                      document.body.removeChild(modal);
                    };

                    tyresBtn.addEventListener('click', () => {
                      navigate('/tyres');
                      close();
                    });

                    wheelsBtn.addEventListener('click', () => {
                      navigate('/wheels');
                      close();
                    });
                    servicesBtn.addEventListener('click', () => {
                      navigate('/services');
                      close();
                    });
                    closeModalBtn.addEventListener('click', close);

                    // Close if clicked outside
                    modal.addEventListener('click', (e) => {
                      if (e.target === modal) close();
                    });
                  }}
                  className="w-full bg-primary text-white font-lexend font-semibold text-xl py-4 rounded-lg hover:bg-red-700 transition-colors">
                  Add Another Product
                </button>
              </>
            )}
          </div>
        </div>
        <div className="lg:col-span-1">
          <OrderSummary totals={totals} refreshCart={refreshCart} />
        </div>
      </div>
    </div>
  );
};

export default CartPage;