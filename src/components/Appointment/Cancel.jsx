import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Toast } from '../../Utils/Toast';

const Cancel = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/cart');
  };

  const handleRetryPayment = () => {
    navigate('/appointment');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
              <svg className="h-12 w-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Payment Cancelled
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Your payment was not processed. Your cart items are still available.
            </p>
          </div>

          <div className="mt-8">
            <div className="bg-red-50 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Payment Cancelled
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>
                      Your payment was cancelled or failed. Don't worry, your cart items are still saved.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <button
              onClick={handleRetryPayment}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#ED1C24] hover:bg-[#c8141d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ED1C24]"
            >
              Retry Payment
            </button>
            <button
              onClick={handleGoBack}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ED1C24]"
            >
              Back to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cancel;