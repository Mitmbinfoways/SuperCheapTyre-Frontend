import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { secureGetItem, secureRemoveItem } from "../../Utils/encryption";
import {
  createAppointment,
  createOrder,
  TransactionData,
} from "../../axios/axios";
import { Toast } from "../../Utils/Toast";

const Success = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const hasRunRef = useRef(false);
  const appointmentData = secureGetItem("appointmentData", {});

  const createAppointmentAndOrder = async () => {
    try {
      setIsLoading(true);
      const cartItems = secureGetItem("cartItemsForOrder", []);
      // Ensure cartItems is always an array
      const validCartItems = Array.isArray(cartItems) ? cartItems : [];
      // Get the payment option
      const paymentOption = appointmentData.paymentOption || "full";

      if (!appointmentData || !appointmentData.date || !appointmentData.time) {
        throw new Error("Appointment data not found");
      }

      const timeSlotId = localStorage.getItem("timeSlotId");
      const selectedSlotId = localStorage.getItem("selectedSlotId");

      if (!timeSlotId || !selectedSlotId) {
        throw new Error("Time slot data not found");
      }

      // Calculate amount based on payment option
      const subtotal = validCartItems.reduce(
        (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
        0
      );

      // Apply payment option logic
      const totalAmount = paymentOption === "full" ? subtotal : subtotal * 0.25;

      const appointmentPayload = {
        firstname: appointmentData.firstName,
        lastname: appointmentData.lastName,
        phone: appointmentData.phone,
        email: appointmentData.email,
        date: appointmentData.date,
        slotId: selectedSlotId,
        timeSlotId: timeSlotId,
        notes: appointmentData.remarks,
        status: "confirmed",
      };

      const appointmentResponse = await createAppointment(appointmentPayload);

      if (appointmentResponse?.data?.statusCode !== 201) {
        throw new Error("Failed to create appointment");
      }

      const appointmentId = appointmentResponse?.data?.data?._id;

      if (!appointmentId) {
        throw new Error("Appointment ID not found in response");
      }

      const sessionId = localStorage.getItem("tkID");
      let TID = null;

      if (sessionId) {
        try {
          const data = {
            session_id: sessionId,
          };
          const fetchTransactionData = await TransactionData(data);
          console.log(fetchTransactionData)
          TID = fetchTransactionData?.data?.transactionId;
        } catch (error) {
          console.error("Error fetching transaction ID:", error);
        }
      }

      // Split cart items into products and services
      const productItems = validCartItems.filter(item => item.type !== "service");
      const serviceItems = validCartItems.filter(item => item.type === "service");

      const orderPayload = {
        items: productItems.map((item) => ({
          id: item._id || item.id,
          quantity: item.quantity,
        })),
        serviceItems: serviceItems.map((item) => ({
          id: item._id || item.id,
          quantity: item.quantity,
        })),
        subtotal: Number(subtotal),
        total: Number(totalAmount), // Use the calculated amount based on payment option
        appointmentId,
        customer: {
          name: `${appointmentData.firstName} ${appointmentData.lastName}`,
          phone: appointmentData.phone,
          email: appointmentData.email,
        },
        payment: {
          method: "stripe",
          status: paymentOption,
          amount: Number(totalAmount),
          transactionId: TID ? TID : null, // Include the transaction ID
        },
      };

      const orderResponse = await createOrder(orderPayload);

      if (orderResponse?.data?.statusCode !== 201) {
        throw new Error("Failed to create order");
      }

      setOrderId(orderResponse?.data?.data?._id);

      secureRemoveItem("cartItems");
      secureRemoveItem("cartItemsForOrder");
      secureRemoveItem("appointmentData");
      localStorage.removeItem("timeSlotId");
      localStorage.removeItem("selectedSlotId");
      localStorage.removeItem("transactionId"); // Clean up the transaction ID
      secureRemoveItem("selectedPaymentOption"); // Clean up the payment option

      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "cartCount",
          newValue: "0",
        })
      );

      toast.success(
        "Payment successful! Your appointment and order have been confirmed."
      );
    } catch (error) {
      console.error("Error creating appointment/order:", error);
      toast.error(
        error.message ||
        "Failed to create appointment and order. Please contact support."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const downloadInvoice = (orderId) => {
    const link = document.createElement("a");
    link.href = `${import.meta.env.VITE_BASE_URL}/api/v1/order/download/${orderId}`;
    link.setAttribute("download", `invoice-${orderId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleGoHome = () => {
    localStorage.removeItem("appointmentCreated");
    localStorage.removeItem("cartItemsForOrder");
    navigate("/");
  };

  useEffect(() => {
    if (!hasRunRef.current) {
      hasRunRef.current = true;
      createAppointmentAndOrder();
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
              <svg
                className="h-12 w-12 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Payment Successful!
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Your appointment has been confirmed and payment has been
              processed.
            </p>
          </div>

          <div className="mt-8">
            <div className="bg-green-50 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">
                    Appointment Confirmed
                  </h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>
                      Thank you for your payment. Your appointment details have
                      been sent to your email.
                    </p>
                    {/* <p className="mt-2 font-medium">
                      Payment Option: {appointmentData.paymentOption === 'full' ? 'Full Payment' : 'Partial Payment (25%)'}
                    </p> */}
                  </div>
                </div>
              </div>
            </div>

            {isLoading && (
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  Creating your appointment and order...
                </p>
              </div>
            )}
          </div>

          <div className="mt-6">
            <button
              onClick={handleGoHome}
              disabled={isLoading}
              className={`w-full mb-3 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#ED1C24] hover:bg-[#c8141d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ED1C24] ${isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
              {isLoading ? "Processing..." : "Go to Home"}
            </button>
            <button
              onClick={() => downloadInvoice(orderId)}
              disabled={!orderId}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${!orderId
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500"
                } focus:outline-none focus:ring-2 focus:ring-offset-2`}
            >
              {!orderId ? "Generating Invoice..." : "Download Invoice"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success;
