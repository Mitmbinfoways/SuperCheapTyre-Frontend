'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { secureGetItem, secureRemoveItem } from '../Utils/encryption';
import axios from 'axios';

const CheckPendingOrder = () => {
    const pathname = usePathname();

    useEffect(() => {
        // If on Success page, let Success component handle cleanup to avoid race conditions
        if (pathname && pathname.includes('/success')) return;

        const checkOrder = async () => {
            const pendingSessionId = secureGetItem('pendingSessionId');
            if (!pendingSessionId) return;

            try {
                // Use the new PUBLIC status check endpoint by SESSION ID
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://api.supercheaptyre.com.au'}/api/v1/payment/check-session/${pendingSessionId}`);

                if (response.data && response.data.status) {
                    const paymentStatus = response.data.status;

                    if (paymentStatus === 'full' || paymentStatus === 'partial') {
                        // Order is paid! Clear cart.
                        secureRemoveItem('cartItems');
                        secureRemoveItem('appointmentData');
                        secureRemoveItem('cartItemsForOrder');
                        secureRemoveItem('transactionCharge');
                        secureRemoveItem('selectedSlotId');
                        secureRemoveItem('timeSlotId');
                        localStorage.removeItem('tkID');

                        // Clear pending flag
                        secureRemoveItem('pendingSessionId');
                        secureRemoveItem('pendingOrderId'); // clean old one too if exists

                        // Optional: Dispatch event to update cart UI count
                        window.dispatchEvent(new Event("storage"));
                    }
                }
            } catch (error) {
                console.error("Error checking pending order:", error);
                // If 404, usually means webhook hasn't fired yet OR failed. 
                // We do NOT remove the flag on 404 immediately, because webhook might be slow.
                // But if it's been days? For now let's keep it simple.
            }
        };

        checkOrder();
    }, [pathname]);

    return null;
};

export default CheckPendingOrder;
