import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { featuredProducts } from '../assets/data'; // replaced by API data
import { ChevronLeft, ChevronRight } from 'lucide-react';
// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { gethomedata } from '../axios/axios';
import { getTyreImageUrl } from '../Utils/Utils';
import Loader from './common/Loader';

const ProductCard = ({ product, onClick }) => (
    <div onClick={onClick} className="flex-shrink-0 w-64 sm:w-72 bg-light rounded-2xl sm:rounded-3xl shadow-lg text-center p-4 sm:p-6 mx-2 sm:mx-4 h-[25rem] relative cursor-pointer">
      
      {/* Image */}
      <div className="relative h-40 sm:h-48 md:h-52 flex items-center justify-center mb-3 sm:mb-4">
        <div className="absolute inset-0 bg-black/5 rounded-full blur-xl"></div>
        <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain" />
      </div>
  
      {/* Info */}
      <h3 className="text-lg sm:text-xl font-medium text-[#ED1C24] mb-2 underline text-start">{product.brand}</h3>
      <p className="text-start text-sm text-text-secondary font-roboto">{product.name}</p>
      <p className="text-text-secondary text-xs sm:text-sm whitespace-pre-line my-1 sm:my-1 leading-relaxed text-start">
        {product.description}
      </p>
      <p className="flex gap-1 text-text-secondary text-xs sm:text-sm mb-12 text-start">
        <span className='font-bold text-[#5A7184]'>Size:</span>{product.size}
      </p>
  
      {/* Button (half in/out) */}
      <button onClick={onClick} className="absolute w-9/12 sm:w-3/4 md:w-2/3  left-1/2 bottom-0 translate-x-[-50%] translate-y-1/2 bg-primary text-white font-bold py-2 sm:py-3 px-8 sm:px-12 md:px-8 rounded-full hover:bg-red-700 transition-colors text-sm sm:text-base shadow-md">
        Buy Now
      </button>
    </div>
  );
  


const FeaturedProducts = () => {
    const scrollRef = React.useRef(null);
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                const res = await gethomedata();
                const apiProducts = res?.data?.data?.productData || [];
                const mapped = apiProducts.map((item) => ({
                    id: item._id,
                    name: item.name ,
                    brand: item.brand,
                    description: item.description || '',
                    size: item.tyreSpecifications ? `${item.tyreSpecifications.width || ''}/${item.tyreSpecifications.profile || ''}${item.tyreSpecifications.speedRating || ''}${item.tyreSpecifications.diameter || ''}`.trim() : '',
                    image: getTyreImageUrl(item.images?.[0])
                }));
                setProducts(mapped);
            } catch (e) {
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchHomeData();
    }, []);

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
                        slidesPerView={1.15}
                        spaceBetween={0}
                        freeMode={false}
                        // pagination={{ clickable: true }}
                        navigation={{ prevEl: '.feat-prev', nextEl: '.feat-next' }}
                        breakpoints={{
                            640: { slidesPerView: 2.2, spaceBetween: 16 },
                            768: { slidesPerView: 2.6, spaceBetween: 20 },
                            1024: { slidesPerView: 3.2, spaceBetween: 24 },
                            1280: { slidesPerView: 4, spaceBetween: 24 },
                        }}
                        modules={[FreeMode, Pagination, Navigation]}
                        className="!pb-10"
                    >
                        {(loading ? [] : products).map((product, index) => (
                            <SwiperSlide key={product.id || index} className="!h-auto">
                                <ProductCard 
                                  product={product} 
                                  onClick={() => navigate(`/productdetails/${product.id}`)}
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
