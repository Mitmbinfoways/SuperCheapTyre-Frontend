import React, { useState, useEffect } from 'react';
import { getAllServices } from '../../axios/axios';
import { getBlogImageUrl } from '../../Utils/Utils';
import { secureGetItem, secureSetItem } from '../../Utils/encryption';
import { Toast } from '../../Utils/Toast';
import { X, Check } from 'lucide-react';

const RecommendedServicesPopup = ({ onClose, onContinue, refreshCart }) => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedServices, setSelectedServices] = useState({});

    useEffect(() => {
        const fetchRecommendedServices = async () => {
            try {
                const response = await getAllServices({ isActive: true, cart_Recommended: true });
                const allServices = response.data.data || [];

                // Filter out services that are already in the cart
                const cart = secureGetItem('cartItems', []);
                const cartServiceIds = new Set(cart.map(item => String(item.id)));

                const newServices = allServices.filter(service => !cartServiceIds.has(String(service._id)));

                setServices(newServices);

                // If no new recommended services, just continue
                if (newServices.length === 0) {
                    onContinue();
                }
            } catch (error) {
                console.error("Error fetching recommended services:", error);
                // On error, just continue to checkout to not block user
                onContinue();
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendedServices();
    }, []);

    const toggleSelection = (serviceId) => {
        setSelectedServices(prev => ({
            ...prev,
            [serviceId]: !prev[serviceId]
        }));
    };

    const handleAddSelected = () => {
        const servicesToAdd = services.filter(service => selectedServices[service._id]);

        if (servicesToAdd.length === 0) {
            onContinue();
            return;
        }

        const cart = secureGetItem("cartItems", []);
        let addedCount = 0;

        servicesToAdd.forEach(service => {
            const productId = String(service._id);
            // Double check if not already in cart
            if (!cart.some(item => String(item.id) === productId)) {
                const image = service.images && service.images.length > 0 ? getBlogImageUrl(service.images[0]) : null;

                cart.push({
                    id: productId,
                    image,
                    name: service.name || "Service",
                    brand: "Service",
                    size: "",
                    price: service.price,
                    quantity: 1,
                    description: "Service",
                    type: "service"
                });
                addedCount++;
            }
        });

        try {
            if (addedCount > 0) {
                secureSetItem("cartItems", cart);
                // Update cart count in localStorage
                localStorage.setItem(
                    "cartCount",
                    String(cart.reduce((s, it) => s + (it.quantity || 1), 0))
                );
                Toast({ message: "Services added to cart", type: "success" });

                // Refresh parent cart state
                if (refreshCart) refreshCart();
            }
            onContinue();
        } catch (error) {
            console.error("Error adding items to cart:", error);
            Toast({ message: "Failed to add items to cart", type: "error" });
        }
    };

    if (loading) return null; // Or a spinner if preferred, but null avoids flash if empty

    if (services.length === 0) return null;

    const hasSelected = Object.values(selectedServices).some(Boolean);

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[999] p-4">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-300">

                {/* Header */}
                <div className="p-4 sm:p-6 border-b border-gray-100 flex justify-between items-start sm:items-center bg-gray-50">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold font-satoshi text-gray-900">Recommended Services</h2>
                        <p className="text-sm sm:text-base text-gray-500 mt-1 font-lexend">Enhance your experience with these services</p>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50/50">
                    <div className="grid grid-cols-1 gap-6">
                        {services.map((service) => (
                            <div
                                key={service._id}
                                onClick={() => toggleSelection(service._id)}
                                className={`bg-white rounded-xl p-3 sm:p-4 border transition-all duration-300 flex flex-row items-center gap-3 sm:gap-4 cursor-pointer ${selectedServices[service._id]
                                    ? "border-primary ring-1 ring-primary shadow-md"
                                    : "border-gray-200 hover:border-primary/30 hover:shadow-lg"
                                    }`}
                            >
                                {/* CHECKBOX */}
                                <div className="flex-shrink-0">
                                    <div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors border-1 ${selectedServices[service._id] ? 'bg-primary border-primary' : 'border-black bg-white'
                                        }`}>
                                        {selectedServices[service._id] && <Check size={16} className="text-white" />}
                                    </div>
                                </div>

                                {/* IMAGE */}
                                <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                    {service.images?.length > 0 ? (
                                        <img
                                            src={getBlogImageUrl(service.images[0])}
                                            alt={service.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            No Image
                                        </div>
                                    )}
                                </div>

                                {/* TEXT SECTION */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-base sm:text-lg text-gray-900 line-clamp-1">{service.name}</h3>

                                    <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 my-1 pr-0 sm:pr-4" dangerouslySetInnerHTML={{ __html: service.description }}></p>

                                    <div className="text-sm sm:text-xl font-semibold text-gray-900 mt-1 sm:mt-0">
                                        Starting From AU${service.price}
                                        <span className="text-xs align-top"> EA</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 sm:p-6 border-t border-gray-100 bg-white flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
                    <button
                        onClick={onContinue}
                        className="w-full border border-gray-300 sm:w-auto justify-center px-8 py-3 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Skip
                    </button>

                    {hasSelected && (
                        <button
                            onClick={handleAddSelected}
                            className="w-full sm:w-auto justify-center px-8 py-3 bg-primary text-white font-bold rounded-lg hover:bg-red-700 transition-colors shadow-lg shadow-red-500/20 flex items-center gap-2"
                        >
                            Add
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecommendedServicesPopup;
