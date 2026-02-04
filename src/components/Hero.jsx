import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { images } from '../assets/data';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import heroDesktopFallback from '../assets/home/tyrebanner1.png';
import heroMobileFallback from '../assets/home/mobilebanner.png';
import BuyTyre from './BuyTyre';
import SingleSelect from './common/SingleSelect';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { getBanners } from '../axios/axios';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';


const Hero = ({ homeData }) => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const swiperRef = useRef(null);
  const autoplayTimeoutRef = useRef(null);
  const currentSlideIndexRef = useRef(0);

  useEffect(() => {
    fetchBanners();
    return () => {
      // Clean up timeout on unmount
      if (autoplayTimeoutRef.current) {
        clearTimeout(autoplayTimeoutRef.current);
      }
    };
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);

      if (homeData.banners) {
        const activeBanners = homeData.banners
          .filter(banner => banner.isActive && !banner.isDelete)
          .sort((a, b) => (a.sequence || 0) - (b.sequence || 0));
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
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
    const fullUrl = `${baseURL}${imagePath}`;
    return fullUrl;
  };

  // Helper function to check if a file is a video based on its extension
  const isVideoFile = (filePath) => {
    if (!filePath) return false;
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.wmv'];
    return videoExtensions.some(ext => filePath.toLowerCase().endsWith(ext));
  };

  // Component to render either video or image based on file type
  const renderMedia = (src, alt, className, isDesktop = true, onVideoEnd) => {
    if (!src) return null;

    if (isVideoFile(src)) {
      return (
        <video
          src={getImageUrl(src)}
          alt={alt}
          className={className}
          autoPlay
          loop={false}
          muted
          playsInline
          preload="none"
          onEnded={onVideoEnd}
          onError={(e) => {
            console.error(`Failed to load ${isDesktop ? 'laptop' : 'mobile'} video:`, e.target.src);
            e.target.style.display = 'none';
          }}
        />
      );
    } else {
      return (
        <Image
          src={getImageUrl(src)}
          alt={alt}
          fill
          sizes="100vw"
          className={className}
          onError={(e) => {
            console.error(`Failed to load ${isDesktop ? 'laptop' : 'mobile'} image:`, src);
            // Handling undefined display logic on Image component might be different, but typically we handle via state if needed.
            // keeping simple for now as changing other things is discouraged.
          }}
        />
      );
    }
  };

  // Handle slide change
  const handleSlideChange = (swiper) => {
    // Clear any existing timeouts
    if (autoplayTimeoutRef.current) {
      clearTimeout(autoplayTimeoutRef.current);
    }

    // Update current slide index
    currentSlideIndexRef.current = swiper.activeIndex;

    // Reset all videos when slide changes
    const videos = document.querySelectorAll('.hero-carousel video');
    videos.forEach(video => {
      video.currentTime = 0;
      video.play().catch(e => console.log("Autoplay prevented:", e));
    });

    // Start autoplay logic for the new slide
    handleAutoplay();
  };

  // Handle video end to move to next slide
  const handleVideoEnd = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext();
    }
  };

  // Handle autoplay manually to respect video duration
  const handleAutoplay = () => {
    // Clear any existing timeouts
    if (autoplayTimeoutRef.current) {
      clearTimeout(autoplayTimeoutRef.current);
    }

    if (swiperRef.current && swiperRef.current.swiper) {
      const activeIndex = swiperRef.current.swiper.activeIndex;
      const activeBanner = banners[activeIndex];

      // Update current slide index
      currentSlideIndexRef.current = activeIndex;

      // Check if current banner has a video
      const isLaptopVideo = activeBanner && isVideoFile(activeBanner.laptopImage);
      const isMobileVideo = activeBanner && isVideoFile(activeBanner.mobileImage);

      // If it's a video, don't auto advance - let the video end handler do it
      if (isLaptopVideo || isMobileVideo) {
        // Don't advance for videos, let them finish naturally
        return;
      }

      // For images, use the standard 5 second delay
      autoplayTimeoutRef.current = setTimeout(() => {
        if (swiperRef.current && swiperRef.current.swiper) {
          // Double-check that we're still on the same slide before advancing
          if (swiperRef.current.swiper.activeIndex === currentSlideIndexRef.current) {
            swiperRef.current.swiper.slideNext();
          }
        }
      }, 5000);
    }
  };

  // Initialize autoplay after first render
  const handleInit = (swiper) => {
    // Update current slide index
    if (swiper) {
      currentSlideIndexRef.current = swiper.activeIndex;
    }

    // Start the manual autoplay logic
    setTimeout(() => {
      handleAutoplay();
    }, 100); // Small delay to ensure swiper is fully initialized
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
                ref={swiperRef}
                modules={[Navigation, Pagination]}
                spaceBetween={0}
                slidesPerView={1}
                navigation={{
                  prevEl: '.hero-prev',
                  nextEl: '.hero-next',
                }}
                loop={banners.length > 1}
                className="hero-carousel w-full md:aspect-video aspect-[4/5] max-h-[750px]"
                onSlideChange={handleSlideChange}
                onInit={handleInit}
              >
                {banners.map((banner, index) => {
                  const isFirstSlide = index === 0;
                  return (
                    <SwiperSlide key={banner._id}>
                      <div className="relative w-full">
                        {/* Desktop Media */}
                        <div className="relative w-full h-full aspect-video hidden md:block">
                          {renderMedia(
                            banner.laptopImage,
                            "Banner",
                            "w-full h-full object-cover object-center",
                            true,
                            handleVideoEnd
                          )}
                        </div>

                        {/* Mobile Media */}
                        <div className="relative w-full h-full aspect-[4/5] md:hidden block">
                          {renderMedia(
                            banner.mobileImage,
                            "Banner",
                            "w-full h-full object-cover object-center",
                            false,
                            handleVideoEnd
                          )}
                        </div>
                      </div>
                    </SwiperSlide>
                  );
                })}
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
              <Image
                src={heroDesktopFallback}
                alt="Super Cheap Tyres Banner"
                className="w-full h-full hidden md:block object-cover object-center"
                loading="eager"
                fill
                sizes="100vw"
                priority
              />
              <Image
                src={heroMobileFallback}
                alt="Super Cheap Tyres Banner"
                className="w-full h-full md:hidden object-cover object-center"
                loading="eager"
                fill
                sizes="100vw"
                priority
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