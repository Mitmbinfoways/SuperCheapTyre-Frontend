import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Pagination, Navigation, Autoplay } from "swiper/modules";
import { images } from "../assets/data";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "swiper/css/navigation";

const SolidStar = ({ size = 20, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 17.27L18.18 21 16.54 13.97 22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z" />
  </svg>
);

const StarRating = ({ rating }) => (
  <div className="flex">
    {[...Array(5)].map((_, i) => (
      <SolidStar
        key={i}
        size={20}
        className={i < rating ? "text-yellow-400" : "text-gray-300"}
      />
    ))}
  </div>
);

const VerificationIcon = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
      fill="#4CAF50"
    />
  </svg>
);

const TestimonialCard = ({ testimonial, isGoogleReview = false }) => (
  <div className="bg-white h-full space-y-4 p-4 sm:p-6 md:p-8 rounded-xl border border-gray-300 shadow-lg">
    <div className="flex items-center">
      <img
        src={
          testimonial.avatar ||
          testimonial.authorPhoto ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            testimonial.author
          )}&background=random`
        }
        alt={testimonial.author}
        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mr-3 sm:mr-4 object-cover"
      />
      <div>
        <p className="font-semibold text-blue-900 text-sm sm:text-base">
          {testimonial.author}
        </p>
        <div className="flex items-center text-xs sm:text-sm text-gray-600">
          <VerificationIcon size={14} />
          <span className="ml-1 italic">
            {isGoogleReview ? "Google Review" : "Verified customer"}
          </span>
        </div>
      </div>
    </div>
    <div>
      <StarRating rating={testimonial.rating} />
    </div>
    <p className="text-blue-900 text-sm sm:text-base md:text-lg leading-relaxed">
      {testimonial.text}
    </p>
    {isGoogleReview && testimonial.relativeTime && (
      <p className="text-xs text-gray-500 italic">{testimonial.relativeTime}</p>
    )}
  </div>
);

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const GOOGLE_PLACE_ID = "ChIJQzrFzMET1moRS49ybPsZaG8";

  useEffect(() => {
    const loadGoogleReviews = async () => {
      try {
        if (
          typeof google === "undefined" ||
          !google.maps ||
          !google.maps.places
        ) {
          console.warn("Google Maps API not loaded. Using mock data.");
          setLoading(false);
          return;
        }

        const { Place } = await google.maps.importLibrary("places");
        const place = new Place({ id: GOOGLE_PLACE_ID });
        await place.fetchFields({ fields: ["displayName", "reviews"] });

        if (place.reviews && place.reviews.length > 0) {
          const googleReviews = place.reviews.slice(0, 5).map((review) => ({
            author: review.authorAttribution?.displayName || "Anonymous",
            authorPhoto: review.authorAttribution?.photoURI || null,
            authorUri: review.authorAttribution?.uri || null,
            rating: review.rating || 5,
            text: review.text || "Great service!",
            relativeTime: review.relativePublishTimeDescription || "",
            isGoogleReview: true,
          }));
          console.log(place.reviews);
          setTestimonials(googleReviews);
        }
      } catch (error) {
        console.error("Error loading Google reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    loadGoogleReviews();
  }, []);

  const handlePlayVideo = () => {
    setIsVideoOpen(true);
  };

  return (
    <section className="bg-light py-12 sm:py-16 md:py-20">
      <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-8 sm:gap-12 md:gap-16 items-center">
          <div className="relative">
            <h2 className="font-lexend text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-6 sm:mb-8 text-center lg:text-left">
              What Customers Say About Us
            </h2>

            <Swiper
              slidesPerView={1}
              spaceBetween={20}
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
              }}
              pagination={{ clickable: true }}
              loop={true}
              navigation={{ prevEl: ".testi-prev", nextEl: ".testi-next" }}
              breakpoints={{
                640: { slidesPerView: 1, spaceBetween: 10 },
                768: { slidesPerView: 1, spaceBetween: 20 },
                1024: { slidesPerView: 2, spaceBetween: 30 },
              }}
              modules={[FreeMode, Pagination, Navigation, Autoplay]}
              className="testimonial-swiper"
            >
              {testimonials?.map((item, index) => (
                <SwiperSlide key={index} className="!h-auto">
                  <div className="w-full max-w-[600px] mx-auto p-3">
                    <TestimonialCard testimonial={item} />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            <div className="testimonials-pagination swiper-pagination !relative flex justify-center mt-4"></div>

            <div className="mt-6 sm:mt-8 flex items-center justify-center lg:justify-between">
              <button className="bg-primary text-white font-semibold py-2 sm:py-3 px-4 sm:px-20 mx-auto rounded-lg hover:bg-red-700 transition-colors text-sm">
                Read All Reviews
              </button>
            </div>
          </div>

          {/* Video Section */}
          <div className="relative w-full h-64 sm:h-80 md:h-[31rem] rounded-xl sm:rounded-2xl overflow-hidden mb-8 shadow-2xl">
            {!isVideoOpen ? (
              <>
                <img
                  src={images.videoBg}
                  alt="Tyre world"
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0 bg-black/30 flex items-center justify-center cursor-pointer group"
                  onClick={handlePlayVideo}
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-white/80 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <PlayCircleIcon className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-dark" />
                  </div>
                </div>
              </>
            ) : (
              <video
                className="w-full h-full object-cover"
                controls
                autoPlay
                src="/home/tyreshowcasevideo.mp4"
              >
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

const PlayCircleIcon = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
  </svg>
);

export default Testimonials;
