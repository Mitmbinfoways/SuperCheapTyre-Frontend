import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
// import { featuredProducts } from '../assets/data'; // replaced by API data
import { ChevronLeft, ChevronRight } from 'lucide-react';
// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Pagination, Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { getTyreImageUrl } from '../Utils/Utils';
import Loader from './common/Loader';
import Badge from './common/Badge';
import { secureGetItem, secureSetItem } from '../Utils/encryption';
import { Toast } from '../Utils/Toast';
import { getAllMasterFilters } from '../axios/axios';

const ProductCard = ({ product, onBuyNow, onViewDetails }) => (
    <div onClick={onViewDetails} className="flex-shrink-0 w-64 sm:w-72 bg-light rounded-2xl sm:rounded-3xl shadow-lg text-center p-4 sm:p-6 mx-auto sm:mx-4 h-[25rem] relative cursor-pointer">

        {/* Image */}
        <div className="relative h-40 sm:h-48 md:h-52 flex items-center justify-center mb-3 sm:mb-4">
            <div className="absolute inset-0 bg-black/5 rounded-full blur-xl"></div>
            <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain" />
        </div>

        {/* Stock Badge */}
        {product.stock === 0 && (
            <div className="absolute top-3 right-3">
                <Badge label="Out of Stock" color="red" customClass="text-xs px-2 py-1 rounded-lg shadow-sm" />
            </div>
        )}
        {product.stock >= 1 && product.stock < 4 && (
            <div className="absolute top-3 right-3">
                <Badge label={`${product.stock} Low Stock`} color="yellow" customClass="text-xs px-2 py-1 rounded-lg shadow-sm" />
            </div>
        )}
        {product.stock >= 4 && (
            <div className="absolute top-3 right-3 bg-[#4CAF50] text-white text-xs px-2 py-1 rounded-lg shadow-sm">
                4+ IN STOCK NOW
            </div>
        )}

        {/* Info */}
        <h3 className="text-lg sm:text-xl font-medium text-[#ED1C24] mb-2 underline text-start line-clamp-1">{product.name}</h3>
        <p className="text-start text-sm text-text-secondary font-roboto">{product.brand}</p>
        <div className="text-text-secondary text-xs sm:text-sm whitespace-pre-line my-1 sm:my-1 leading-relaxed text-start line-clamp-1">
            <div
                className=""
                dangerouslySetInnerHTML={{
                    __html: product.description
                        .replace(/<ul>/g, '<ul class="list-disc pl-4">')
                        .replace(/<ol>/g, '<ol class="list-decimal pl-4">')
                }}
            />
        </div>
        <p className="flex gap-1 text-text-secondary text-xs sm:text-sm mb-12 text-start">
            <span className='font-bold text-[#5A7184]'>Size:</span><span className='line-clamp-1'>{product.size}</span>
        </p>

        {/* Button (half in/out) */}
        <button
            onClick={(e) => {
                e.stopPropagation();
                onBuyNow(product);
            }}
            disabled={product.stock === 0}
            className={`absolute w-9/12 sm:w-3/4 md:w-2/3 left-1/2 bottom-0 translate-x-[-50%] translate-y-1/2 font-bold py-2 sm:py-3 px-8 sm:px-12 md:px-8 rounded-full transition-colors text-sm sm:text-base shadow-md ${product.stock === 0
                ? 'bg-[#D7D7D7] text-white cursor-not-allowed'
                : 'bg-primary text-white hover:bg-red-700'
                }`}
        >
            Buy Now
        </button>
    </div>
);


const FeaturedProducts = ({ homeData }) => {
    const scrollRef = React.useRef(null);
    const router = useRouter();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [masterFilters, setMasterFilters] = useState([]);

    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const res = await getAllMasterFilters({ limit: 1000 });
                setMasterFilters(res.data?.data?.items || []);
            } catch (err) {
                console.error(err);
            }
        };
        fetchFilters();
    }, []);

    const getFilterValue = (val) => {
        if (!val) return "";
        const filter = masterFilters.find(f => f._id === val || f.values === val);
        return filter ? filter.values : val;
    };

    useEffect(() => {
        if (homeData && masterFilters.length > 0) {
            try {
                const apiProducts = homeData.productData || [];
                const mapped = apiProducts.map((item) => {
                    // Handle different product categories
                    let size = '';
                    if (item.category === 'wheel' && item.wheelSpecifications) {
                        // Wheel product
                        size = `${getFilterValue(item.wheelSpecifications.size) || ''}" ${getFilterValue(item.wheelSpecifications.diameter) || ''}"`;
                    } else if (item.tyreSpecifications) {
                        // Tyre product
                        size = `${getFilterValue(item.tyreSpecifications.width) || ''}/${getFilterValue(item.tyreSpecifications.profile) || ''}${" "}${getFilterValue(item.tyreSpecifications.diameter) || ''}${" "}${getFilterValue(item.tyreSpecifications.loadRating) || ''}${getFilterValue(item.tyreSpecifications.speedRating) || ''}`;
                    }

                    return {
                        id: item._id,
                        name: item.name,
                        brand: item.brand,
                        description: item.description || '',
                        size: size.trim(),
                        image: getTyreImageUrl(item.images?.[0]),
                        category: item.category, // Store category for navigation
                        stock: item.stock || 0, // Add stock information
                        price: item.price || 0
                    };
                });
                setProducts(mapped);
            } catch (e) {
                setProducts([]);
            } finally {
                setLoading(false);
            }
        } else if (!homeData) {
            setLoading(false);
        }
    }, [homeData, masterFilters]);

    const handleBuyNow = (product) => {
        // Prevent adding to cart if product is invalid
        if (!product) {
            Toast({ message: "Invalid product", type: "error" });
            return;
        }

        // Prevent adding to cart if stock is 0
        if (product.stock === 0) {
            Toast({ message: "This product is out of stock", type: "error" });
            return;
        }

        const cart = secureGetItem("cartItems", []);
        const existingIndex = cart.findIndex((ci) => String(ci.id) === String(product.id));

        // Check if adding this item would exceed stock
        if (existingIndex >= 0) {
            const newQuantity = (cart[existingIndex].quantity || 1) + 1;
            if (newQuantity > product.stock) {
                Toast({
                    message: `Maximum available is quantity ${product.stock}`,
                    type: "error",
                });
                return;
            }
            cart[existingIndex].quantity = newQuantity;
        } else {
            // Check if we can add this item (stock > 0)
            if (product.stock > 0) {
                cart.push({
                    id: product.id,
                    image: product.image,
                    name: product.name || product.brand || "Product",
                    brand: product.brand,
                    size: product.size,
                    price: product.price,
                    quantity: 1,
                    description: `${product.brand || ""} ${product.name || ""}`.trim() || "Product",
                });
            } else {
                Toast({ message: "This product is out of stock", type: "error" });
                return;
            }
        }

        try {
            secureSetItem("cartItems", cart);
            localStorage.setItem(
                "cartCount",
                String(cart.reduce((s, it) => s + (it.quantity || 1), 0))
            );
            Toast({ message: "Added to cart", type: "success" });

            // Redirect to cart page
            router.push("/cart");
        } catch (error) {
            console.error("Error adding item to cart:", error);
            Toast({ message: "Failed to add item to cart", type: "error" });
        }
    };

    const handleViewDetails = (productId) => {
        router.push(`/productdetails/${productId}`);
    };

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = window.innerWidth < 640 ? 280 : 320;
            scrollRef.current.scrollBy({
                left: direction * scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    // Use class-based navigation to avoid ref timing issues

    if (loading) {
        return <Loader label="Loading featured products..." />;
    }

    return (
        <section className="py-12 sm:py-16 md:py-20 bg-white">
            <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 lg:px-8">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-8 sm:mb-10 md:mb-12 text-center sm:text-left">Featured Products</h2>
                <div className="relative overflow-visible">
                    <Swiper
                        slidesPerView={1}
                        spaceBetween={0}
                        freeMode={false}
                        autoplay={{
                            delay: 2500,
                            disableOnInteraction: false
                        }}
                        loop={true}
                        // centeredSlides={true}
                        // pagination={{ clickable: true }}
                        navigation={{ prevEl: '.feat-prev', nextEl: '.feat-next' }}
                        breakpoints={{
                            640: { slidesPerView: 2, spaceBetween: 16 },
                            768: { slidesPerView: 2, spaceBetween: 20 },
                            1024: { slidesPerView: 3, spaceBetween: 24 },
                            1280: { slidesPerView: 4, spaceBetween: 24 },
                        }}
                        modules={[FreeMode, Pagination, Navigation, Autoplay]}
                        className="!pb-10"
                    >
                        {(loading ? [] : products).map((product, index) => (
                            <SwiperSlide key={product.id || index} className="!h-auto flex items-center">
                                <ProductCard
                                    product={product}
                                    onBuyNow={handleBuyNow}
                                    onViewDetails={() => handleViewDetails(product.id)}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Navigation arrows (visible on sm and up) */}
                    <button className="feat-prev hidden sm:flex absolute -left-6 sm:-left-8 md:-left-10 top-1/2 -translate-y-1/2 z-20 p-2 bg-transparent rounded-full hover:bg-gray-100">
                        <ChevronLeft className="text-primary" />
                    </button>
                    <button className="feat-next hidden sm:flex absolute -right-6 sm:-right-8 md:-right-10 top-1/2 -translate-y-1/2 z-20 p-2 bg-transparent rounded-full hover:bg-gray-100">
                        <ChevronRight className="text-primary" />
                    </button>
                </div>
            </div>
        </section>
    );
};
export default FeaturedProducts;