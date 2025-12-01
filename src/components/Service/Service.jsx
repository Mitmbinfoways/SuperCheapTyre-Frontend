import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllServices } from '../../axios/axios';
import Loader from '../common/Loader';
import { getBlogImageUrl } from '../../Utils/Utils';
import { secureGetItem, secureSetItem } from '../../Utils/encryption';
import { Toast } from '../../Utils/Toast';

const Service = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchServices = async () => {
        try {
            const response = await getAllServices({ isActive: true });
            setServices(response.data.data || []);
        } catch (err) {
            console.error("Error fetching services:", err);
            setError("Failed to load services.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleAddToCart = (service) => {
        const productId = String(service._id);
        const image = service.images && service.images.length > 0 ? getBlogImageUrl(service.images[0]) : null;
        const price = service.price;
        const name = service.name;

        // Prevent adding to cart if required props are missing
        if (!productId || price === undefined) {
            Toast({ message: "Invalid service data", type: "error" });
            return;
        }

        const cart = secureGetItem("cartItems", []);
        const existingIndex = cart.findIndex((ci) => String(ci.id) === productId);

        if (existingIndex >= 0) {
            // Increment quantity if already in cart
            cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + 1;
        } else {
            // Add new item to cart
            cart.push({
                id: productId,
                image,
                name: name || "Service",
                brand: "Service", // Services don't have brands, so we use a placeholder
                size: "", // Services don't have sizes
                price,
                quantity: 1,
                description: "Service",
                type: "service" // Optional: to distinguish from products
            });
        }

        try {
            secureSetItem("cartItems", cart);
            // Update cart count in localStorage for header to pick up
            localStorage.setItem(
                "cartCount",
                String(cart.reduce((s, it) => s + (it.quantity || 1), 0))
            );
            Toast({ message: "Added to cart", type: "success" });

            // Redirect to cart page
            navigate("/cart");
        } catch (error) {
            console.error("Error adding item to cart:", error);
            Toast({ message: "Failed to add item to cart", type: "error" });
        }
    };

    if (loading) return <Loader label="Loading services..." />;

    if (error) return (
        <div className="min-h-[50vh] flex items-center justify-center">
            <div className="text-center text-red-500 text-xl">{error}</div>
        </div>
    );

    return (
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
            <div className="text-center mb-12">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Our Services</h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    We offer a wide range of professional tyre and wheel services to keep you safe on the road.
                </p>
            </div>

            {services.length === 0 ? (
                <div className="text-center text-gray-500 text-xl py-12">
                    No services available at the moment.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service) => (
                        <div key={service._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
                            <div className="h-56 overflow-hidden relative group">
                                {service.images && service.images.length > 0 ? (
                                    <img
                                        src={getBlogImageUrl(service.images[0])}
                                        alt={service.name}
                                        className="w-full h-full object-cover transition-transform duration-500"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://placehold.co/600x400?text=Service';
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                        <span className="text-gray-400">No Image</span>
                                    </div>
                                )}
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <h3 className="text-xl font-bold text-gray-900 mb-3">
                                    {service?.name?.toUpperCase()}
                                </h3>
                                <p className="font-bold text-gray-900 mb-3">
                                    Starting From AU${service?.price} <sup className='text-md'>ea</sup>
                                </p>
                                <div
                                    className="text-gray-600 mb-4 flex-1 line-clamp-4 prose prose-sm max-w-none"
                                    dangerouslySetInnerHTML={{ __html: service.description }}
                                />
                                <button
                                    onClick={() => handleAddToCart(service)}
                                    className="mt-auto px-6 py-2 bg-red-600 text-white rounded-full font-medium hover:bg-red-700 transition-colors w-full sm:w-fit self-start"
                                >
                                    Add To Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Service;