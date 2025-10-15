import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { secureGetItem, secureRemoveItem } from "../../Utils/encryption";
import { createAppointment, createOrder } from "../../axios/axios";
import { Toast } from '../../Utils/Toast';

const Success = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const hasRunRef = useRef(false);

  const createAppointmentAndOrder = async () => {
    try {
      setIsLoading(true);
      const appointmentData = secureGetItem("appointmentData", {});
      const cartItems = secureGetItem("cartItemsForOrder", []);

      if (!appointmentData || !appointmentData.date || !appointmentData.time) {
        throw new Error("Appointment data not found");
      }

      const timeSlotId = localStorage.getItem("timeSlotId");
      const selectedSlotId = localStorage.getItem("selectedSlotId");

      if (!timeSlotId || !selectedSlotId) {
        throw new Error("Time slot data not found");
      }

      // Create appointment
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

      const orderPayload = {
        items: cartItems.map((item) => ({
          id: item._id || item.id,
          quantity: item.quantity,
        })),
        subtotal: cartItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
        total: cartItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
        appointment: {
          date: appointmentData.date,
          slotId: selectedSlotId,
          timeSlotId: timeSlotId,
          firstname: appointmentData.firstName,
          lastname: appointmentData.lastName,
          phone: appointmentData.phone,
          email: appointmentData.email,
        },
        customer: {
          name: `${appointmentData.firstName} ${appointmentData.lastName}`,
          phone: appointmentData.phone,
          email: appointmentData.email,
        },
        payment: {
          method: "stripe",
          status: "completed",
          amount: cartItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          ),
        },
      };

      const orderResponse = await createOrder(orderPayload);

      if (orderResponse?.data?.statusCode !== 201) {
        throw new Error("Failed to create order");
      }

      secureRemoveItem("cartItems");
      secureRemoveItem("cartItemsForOrder");
      secureRemoveItem("appointmentData");
      localStorage.removeItem("timeSlotId");
      localStorage.removeItem("selectedSlotId");

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
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#ED1C24] hover:bg-[#c8141d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ED1C24] ${isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
              {isLoading ? "Processing..." : "Go to Home"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success;
