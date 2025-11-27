import React, { useEffect, useState, useRef } from "react";
import ProductInfo from "./ProductInfo";
import { getTyreById } from "../../axios/axios";
import { getTyreImageUrl } from "../../Utils/Utils";
import { formatCurrency } from "../../Utils/Utils";
import { useParams } from "react-router-dom";
import Loader from "../common/Loader";
// Import Swiper components and modules
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Thumbs } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import Badge from "../common/Badge";

const HeroSection = () => {
  const { id } = useParams(); // Get product id from URL
  const navigate = useNavigate(); // Add navigate hook
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const mainSwiperRef = useRef(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getTyreById(id);
        setProduct(response.data?.data);
      } catch (error) {
        console.error("Error fetching product:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]); // 👈 added id

  // Function to open modal with selected image
  const openModal = (index) => {
    setModalImageIndex(index);
    setShowModal(true);
  };

  // Function to close modal
  const closeModal = () => {
    setShowModal(false);
  };

  // Function to navigate to next image in modal
  const nextImage = () => {
    setModalImageIndex((prevIndex) =>
      prevIndex < product.images.length - 1 ? prevIndex + 1 : 0
    );
  };

  // Function to navigate to previous image in modal
  const prevImage = () => {
    setModalImageIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : product.images.length - 1
    );
  };

  // Handle slide change in main Swiper
  const handleSlideChange = (swiper) => {
    const realIndex = swiper.realIndex;
    setSelectedImageIndex(realIndex);
    // Update thumbnail swiper to match the current slide
    if (thumbsSwiper) {
      thumbsSwiper.slideToLoop(realIndex);
    }
  };

  // Handle thumbnail click
  const handleThumbnailClick = (index) => {
    setSelectedImageIndex(index);
    if (mainSwiperRef.current && mainSwiperRef.current.swiper) {
      mainSwiperRef.current.swiper.slideToLoop(index);
    }
  };

  // Navigation functions for main Swiper
  const goToNextSlide = () => {
    if (mainSwiperRef.current && mainSwiperRef.current.swiper) {
      mainSwiperRef.current.swiper.slideNext();
    }
  };

  const goToPrevSlide = () => {
    if (mainSwiperRef.current && mainSwiperRef.current.swiper) {
      mainSwiperRef.current.swiper.slidePrev();
    }
  };

  if (loading) {
    return <Loader label="Loading product..." />;
  }
  if (!product) {
    return <div className="text-center py-10">No product found.</div>;
  }

  // Determine if this is a wheel product
  const isWheelProduct = product.category === "wheel";
  const productTitle = isWheelProduct ? "Shop Wheels" : "Shop Tyres";

  // Function to go back to products listing
  const goBackToProducts = () => {
    if (isWheelProduct) {
      navigate("/wheels");
    } else {
      navigate("/tyres");
    }
  };

  return (
    <section className="w-full bg-[#f5f5f5] py-[12px] sm:py-[16px] md:py-[20px] lg:py-[24px]">
      <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="mx-[25px] sm:mx-[35px] md:mx-[40px] lg:mx-[50px]">
          <div className="flex flex-col gap-[16px] sm:gap-[20px] md:gap-[24px] lg:gap-[28px] w-full">
            {/* Shop Tyres/Wheels Header with Back Button */}
            <div className="flex justify-between items-center w-full">
              <h1 className="text-[20px] sm:text-[24px] md:text-[27px] lg:text-[30px] font-medium leading-[25px] sm:leading-[30px] md:leading-[34px] lg:leading-[38px] font-['Lexend'] text-[#ed1c24]">
                {productTitle}
              </h1>
              <button
                onClick={goBackToProducts}
                className="flex items-center text-[14px] sm:text-[16px] md:text-[18px] font-medium font-['Lexend'] text-[#ed1c24] hover:text-[#d11920] transition-colors"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Go back
              </button>
            </div>

            {/* Main Product Section */}
            <div className="flex flex-col lg:flex-row justify-between items-start w-full gap-6 lg:gap-8">
              {/* Left Side - Product Images */}
              <div className="flex flex-col gap-[12px] sm:gap-[16px] md:gap-[20px] lg:gap-[22px] w-full lg:w-[40%] items-center">
                {/* Main Product Image Carousel */}
                <div className="flex justify-center items-center w-full border border-[#6e6d6d] rounded-[20px] bg-white p-[48px] sm:p-[60px] md:p-[80px] lg:p-[96px_36px] relative">
                  {/* Navigation Arrows */}
                  {product.images?.length > 1 && (
                    <>
                      <button
                        className="absolute left-4 z-10 bg-white bg-opacity-80 rounded-full p-2 shadow-md hover:bg-opacity-100 transition-all"
                        onClick={goToPrevSlide}
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="text-[#ed1c24] w-6 h-6" />
                      </button>
                      <button
                        className="absolute right-4 z-10 bg-white bg-opacity-80 rounded-full p-2 shadow-md hover:bg-opacity-100 transition-all"
                        onClick={goToNextSlide}
                        aria-label="Next image"
                      >
                        <ChevronRight className="text-[#ed1c24] w-6 h-6" />
                      </button>
                    </>
                  )}

                  <Swiper
                    ref={mainSwiperRef}
                    modules={[Navigation, Thumbs]}
                    spaceBetween={0}
                    loop={true}
                    slidesPerView={1}
                    onSlideChange={handleSlideChange}
                    thumbs={{ swiper: thumbsSwiper && thumbsSwiper.initialized ? thumbsSwiper : null }}
                    className="w-full max-w-[480px] h-auto cursor-pointer"
                    onClick={() => openModal(selectedImageIndex)}
                  >
                    {product.images?.map((img, index) => (
                      <SwiperSlide key={index}>
                        <div className="flex items-center justify-center w-full h-[300px] sm:h-[400px] md:h-[500px]">
                          <img
                            src={getTyreImageUrl(img)}
                            alt={`${product.name} ${index + 1}`}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>

                {/* Thumbnail Images Carousel */}
                <div className="w-full">
                  <Swiper
                    modules={[Navigation, Thumbs, Autoplay]}
                    loop={true}
                    spaceBetween={16}
                    slidesPerView="auto"
                    autoplay={{
                      delay: 2500,
                      disableOnInteraction: false,
                    }}
                    onSwiper={setThumbsSwiper}
                    onSlideChange={(swiper) => {
                      // Update selected index when thumbnail swiper slides
                      setSelectedImageIndex(swiper.realIndex);
                    }}
                    className="w-full"
                    breakpoints={{
                      320: {
                        slidesPerView: 3,
                        spaceBetween: 16,
                      },
                      640: {
                        slidesPerView: 3,
                        spaceBetween: 16,
                      },
                      768: {
                        slidesPerView: 3,
                        spaceBetween: 20,
                      },
                      1024: {
                        slidesPerView: 3,
                        spaceBetween: 20,
                      },
                    }}
                  >
                    {product.images?.map((img, index) => (
                      <SwiperSlide
                        key={index}
                        className="w-[100px] sm:w-[120px] md:w-[140px] lg:w-[150px]"
                      >
                        <div
                          className={`flex justify-center items-center w-full h-full border rounded-[20px] bg-white p-[4px] cursor-pointer ${selectedImageIndex === index
                            ? "border-[#ed1c24]"
                            : "border-[#6e6d6d]"
                            }`}
                          onClick={() => handleThumbnailClick(index)}
                        >
                          <img
                            src={getTyreImageUrl(img)}
                            alt={`${product.name} ${index + 1}`}
                            className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 object-contain"
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </div>

              {/* Right Side - Product Information */}
              <div className="flex flex-col gap-[8px] sm:gap-[10px] md:gap-[12px] lg:gap-[12px] w-full lg:w-[52%]">
                {/* Product Title and Basic Info */}
                <div className="flex flex-col w-full">
                  <div className="flex justify-start items-center w-full py-[6px]">
                    <h2 className="text-[20px] sm:text-[23px] md:text-[25px] lg:text-[27px] font-medium leading-[25px] sm:leading-[29px] md:leading-[32px] lg:leading-[34px] font-['Lexend'] text-black">
                      {product.name}
                    </h2>
                  </div>
                  {product.isPopular && (
                    <div className="py-2">
                      <Badge
                        label={product.isPopular ? "Popular" : ""}
                        color="blue"
                      />
                    </div>
                  )}
                  <p className="text-[14px] sm:text-[15px] md:text-[16px] font-normal leading-[18px] sm:leading-[19px] md:leading-[20px] font-['Lexend'] text-[#676767] mt-[4px]">
                    {isWheelProduct
                      ? "High-quality wheels"
                      : "High-performance tyres"}
                  </p>
                  <p className="text-[20px] sm:text-[22px] md:text-[24px] font-medium leading-[25px] sm:leading-[27px] md:leading-[30px] font-['Lexend'] text-[#ff0000] mt-[8px]">
                    {formatCurrency(product.price)}
                  </p>
                  <p className="text-[14px] sm:text-[15px] md:text-[16px] font-normal leading-[18px] sm:leading-[19px] md:leading-[20px] font-['Lexend'] text-[#676767] mt-[4px]">
                    {product.pricetext}
                  </p>
                </div>

                {/* Product Description */}
                <div
                  className="text-[14px] sm:text-[15px] md:text-[16px] font-normal leading-[18px] sm:leading-[19px] md:leading-[20px] font-['Lexend'] text-[#6e6d6d] w-full mt-[6px]"
                >
                  <div
                    className="pl-5 space-y-1"
                    dangerouslySetInnerHTML={{
                      __html: product.description
                        .replace(/<ul>/g, '<ul class="list-disc pl-4">')
                        .replace(/<ol>/g, '<ol class="list-decimal pl-4">')
                    }}
                  />
                </div>


                {/* Move ProductInfo directly under description to remove large gap */}
                <div className="mt-[8px] w-full">
                  {product && <ProductInfo product={product} />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh]"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the image
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 z-10 hover:bg-opacity-75 transition"
              onClick={closeModal}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Previous Button */}
            {product.images.length > 1 && (
              <button
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full p-2 z-10 hover:bg-opacity-75 transition"
                onClick={prevImage}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            )}

            {/* Next Button */}
            {product.images.length > 1 && (
              <button
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full p-2 z-10 hover:bg-opacity-75 transition"
                onClick={nextImage}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            )}

            {/* Main Modal Image */}
            <img
              src={getTyreImageUrl(product.images?.[modalImageIndex])}
              alt={`${product.name} - Large View`}
              className="w-full max-h-[80vh] object-contain"
            />

            {/* Image Counter */}
            {product.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 rounded-full px-3 py-1 text-sm">
                {modalImageIndex + 1} / {product.images.length}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroSection;
