import React, { useState, useEffect } from 'react';
import { images } from '../assets/data';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import img from '/home/tyrebanner1.png'
import mobile from '/home/mobilebanner.png';
import BuyTyre from './BuyTyre';
import SingleSelect from './common/SingleSelect';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { getBanners } from '../axios/axios';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';


const Hero = ({ homeData }) => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      
      if (homeData.banners) {
        const activeBanners = homeData.banners.filter(
          banner => banner.isActive && !banner.isDelete
        );
        setBanners(activeBanners);
      }
    } catch (error) {
      console.error('Error fetching banners:', error);
      setBanners([]);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imagePath) => {
    const baseURL = import.meta.env.VITE_BASE_URL;
    const fullUrl = `${baseURL}${imagePath}`;
    return fullUrl;
  };

  return (
    <div className='h-fit'>
      <section className="relative bg-dark text-white overflow-hidden w-full">
        <div className="relative">
          {loading ? (
            <div className="w-full h-[520px] md:h-[500px] lg:h-[600px] xl:h-[650px] bg-gray-800 flex items-center justify-center">
              <div className="text-white text-xl">Loading...</div>
            </div>
          ) : banners.length > 0 ? (
            <div className="relative">
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={0}
                slidesPerView={1}
                navigation={{
                  prevEl: '.hero-prev',
                  nextEl: '.hero-next',
                }}
                // pagination={{ clickable: true }}
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false,
                }}
                loop={banners.length > 1}
                className="hero-carousel w-full md:aspect-video aspect-[4/5]"
              >
                {banners.map((banner) => (
                  <SwiperSlide key={banner._id}>
                    <div className="relative w-full">
                      <img
                        src={getImageUrl(banner.laptopImage)}
                        alt="Banner"
                        className="w-full h-full aspect-video hidden md:block object-cover object-center"
                        onError={(e) => {
                          console.error('Failed to load laptop image:', e.target.src);
                          e.target.style.display = 'none';
                        }}
                      />
                      <img
                        src={getImageUrl(banner.mobileImage)}
                        alt="Banner"
                        className="w-full h-full aspect-[4/5] md:hidden block object-cover object-center"
                        onError={(e) => {
                          console.error('Failed to load mobile image:', e.target.src);
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Custom Navigation Arrows */}
              {banners.length > 1 && (
                <>
                  <button className="hero-prev hidden sm:flex absolute left-2 sm:left-4 md:left-6 lg:left-8 top-1/2 -translate-y-1/2 z-20 p-1.5 sm:p-2 bg-transparent rounded-full hover:bg-gray-100 transition-colors">
                    <ChevronLeft className="text-primary w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                  <button className="hero-next hidden sm:flex absolute right-2 sm:right-4 md:right-6 lg:right-8 top-1/2 -translate-y-1/2 z-20 p-1.5 sm:p-2 bg-transparent rounded-full hover:bg-gray-100 transition-colors">
                    <ChevronRight className="text-primary w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="relative w-full h-[520px] md:h-[500px] lg:h-[600px] xl:h-[650px]">
              <img
                src={img}
                alt="Super Cheap Tyres Banner"
                className="w-full h-full hidden md:block object-cover object-center"
              />
              <img
                src={mobile}
                alt="Super Cheap Tyres Banner"
                className="w-full h-full md:hidden object-cover object-center"
              />
            </div>
          )}
          <div className="absolute inset-0 bg-black/30 sm:bg-black/10 pointer-events-none"></div>
        </div>

      </section>
      <BuyTyre />

    </div>
  );
};

export default Hero;