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

const SearchForm = () => {
    const [width, setWidth] = useState('');
    const [profile, setProfile] = useState('');
    const [diameter, setDiameter] = useState('');
    const [brand, setBrand] = useState('');

    const widthOptions = [
        { value: '', label: 'Select a Width' }
    ];

    const profileOptions = [
        { value: '', label: 'Select a Profile' }
    ];

    const diameterOptions = [
        { value: '', label: 'Select a Diameter' }
    ];

    const brandOptions = [
        { value: '', label: 'Select a Brand' }
    ];

    return (
        <div className="relative mt-2 sm:mt-6 md:mt-8 pointer-events-auto">
            <div className="relative bg-white rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 z-10">
                <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium text-dark mb-4 sm:mb-6 text-center md:text-left">SEARCH FOR TYRES</h3>
                {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 items-center">
                    <div className="relative">
                        <SingleSelect
                            options={widthOptions}
                            value={width}
                            onChange={setWidth}
                            selectStyle="w-full h-12 sm:h-14 px-3 sm:px-4 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                        />
                    </div>
                    <div className="relative">
                        <SingleSelect
                            options={profileOptions}
                            value={profile}
                            onChange={setProfile}
                            selectStyle="w-full h-12 sm:h-14 px-3 sm:px-4 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                        />
                    </div>
                    <div className="relative">
                        <SingleSelect
                            options={diameterOptions}
                            value={diameter}
                            onChange={setDiameter}
                            selectStyle="w-full h-12 sm:h-14 px-3 sm:px-4 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                        />
                    </div>
                    <div className="relative">
                        <SingleSelect
                            options={brandOptions}
                            value={brand}
                            onChange={setBrand}
                            selectStyle="w-full h-12 sm:h-14 px-3 sm:px-4 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                        />
                    </div>
                    <button className="w-full h-12 sm:h-14 bg-primary text-white font-semibold text-sm sm:text-base lg:text-xl rounded-lg hover:bg-red-700 transition-colors col-span-1 sm:col-span-2 lg:col-span-1">
                        Select
                    </button>
                </div> */}
            </div>
        </div>
    );
};


const Hero = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await getBanners();
      if (response.data && response.data.data) {
        const activeBanners = response.data.data.filter(
          banner => banner.isActive && !banner.isDelete
        );
        setBanners(activeBanners);
      }
    } catch (error) {
      console.error('Error fetching banners:', error);
      // Fallback to empty array on error
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
    <section className="relative bg-dark text-white overflow-hidden w-full ">
      <div className="relative">
        {loading ? (
          <div className="w-full h-[400px] md:h-[600px] bg-gray-800 flex items-center justify-center">
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
              pagination={{ clickable: true }}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              loop={banners.length > 1}
              className="hero-carousel w-full h-[400px] md:h-[600px]"
            >
              {banners.map((banner) => (
                <SwiperSlide key={banner._id}>
                  <div className="relative w-full h-[400px] md:h-[600px]">
                    <img
                      src={getImageUrl(banner.laptopImage)}
                      alt="Banner"
                      className="w-full h-[400px] md:h-[600px] hidden md:block object-cover object-center"
                      onError={(e) => {
                        console.error('Failed to load laptop image:', e.target.src);
                        e.target.style.display = 'none';
                      }}
                    />
                    <img
                      src={getImageUrl(banner.mobileImage)}
                      alt="Banner"
                      className="w-full h-[400px] md:h-[600px] md:hidden object-cover object-center"
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
                <button className="hero-prev hidden sm:flex absolute left-4 md:left-6 lg:left-8 top-1/2 -translate-y-1/2 z-20 p-2 bg-transparent rounded-full hover:bg-gray-100">
                  <ChevronLeft className="text-primary" />
                </button>
                <button className="hero-next hidden sm:flex absolute right-4 md:right-6 lg:right-8 top-1/2 -translate-y-1/2 z-20 p-2 bg-transparent rounded-full hover:bg-gray-100">
                  <ChevronRight className="text-primary" />
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="relative w-full h-[400px] md:h-[600px]">
            <img 
              src={img} 
              alt="Super Cheap Tyres Banner" 
              className="w-full h-[400px] md:h-[600px] hidden md:block object-cover object-center"
            />
            <img 
              src={mobile} 
              alt="Super Cheap Tyres Banner" 
              className="w-full h-[400px] md:h-[600px] md:hidden object-cover object-center"
            />
          </div>
        )}
        <div className="absolute inset-0 bg-black/30 sm:bg-black/10 pointer-events-none"></div>
      </div>

        <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 lg:px-8 relative z-10 h-full">
        <div className="grid lg:grid-cols-2 items-center h-full pb-8 sm:py-12">
          <div className="relative text-center lg:text-left">
            {/* Left side content can be added here if needed */}
          </div>
          <div className="relative flex flex-col items-center lg:items-end text-center lg:text-right self-center lg:pr-16 xl:pr-28 2xl:pr-40 mx-4 sm:mx-10 lg:mx-0 gap-2">
            {/* <h1 className="font-roboto font-black text-3xl md:text-4xl lg:text-7xl leading-[0.95] italic drop-shadow-md">
              SUPER VALUE.
              <br />
              SUPER SAFE.
            </h1>
            <h2 className="font-roboto font-black text-4xl md:text-5xl lg:text-7xl text-primary italic drop-shadow-md">
              SupercheapTyres
            </h2> */}
            {/* <div className="absolute -right-20 -top-20 w-[480px] h-auto hidden lg:block">
              <img src={images.heroTire} alt="Tire" className="w-full h-auto opacity-20" />
            </div> */}
          </div>
        </div>
      </div>
      
      <div className="relative -mb-8 sm:-mb-12 md:-mb-16 lg:-mb-24 xl:-mb-28 z-50">
        {/* <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{backgroundImage: `url(${images.searchFormBg})`}}></div> */}
        <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 lg:px-8 relative z-20">
            {/* <SearchForm /> */}
        </div>
        
      </div>
         </section>
         <BuyTyre />

    </div>
  );
};

export default Hero;