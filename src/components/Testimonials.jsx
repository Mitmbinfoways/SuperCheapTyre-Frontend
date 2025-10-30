import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Mock data for fallback
const mockTestimonials = [
  {
    author: "John Doe",
    avatar: "https://i.pravatar.cc/150?img=1",
    rating: 5,
    text: "Excellent service! The team was professional and the work was done quickly.",
  },
];

const SolidStar = ({ size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 17.27L18.18 21 16.54 13.97 22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z" />
  </svg>
);

const StarRating = ({ rating }) => (
  <div className="flex">
    {[...Array(5)].map((_, i) => (
      <SolidStar key={i} size={20} className={i < rating ? 'text-yellow-400' : 'text-gray-300'} />
    ))}
  </div>
);

const VerificationIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="#4CAF50"/>
  </svg>
);

const TestimonialCard = ({ testimonial, isGoogleReview = false }) => (
  <div className="bg-white h-full space-y-4 p-4 sm:p-6 md:p-8 rounded-xl border border-gray-300 shadow-lg">
    <div className="flex items-center">
      <img 
        src={testimonial.avatar || testimonial.authorPhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.author)}&background=random`} 
        alt={testimonial.author} 
        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mr-3 sm:mr-4 object-cover" 
      />
      <div>
        <p className="font-semibold text-blue-900 text-sm sm:text-base">{testimonial.author}</p>
        <div className="flex items-center text-xs sm:text-sm text-gray-600">
          <VerificationIcon size={14} />
          <span className="ml-1 italic">{isGoogleReview ? 'Google Review' : 'Verified customer'}</span>
        </div>
      </div>
    </div>
    <div>
      <StarRating rating={testimonial.rating} />
    </div>
    <p className="text-blue-900 text-sm sm:text-base md:text-lg leading-relaxed">{testimonial.text}</p>
    {isGoogleReview && testimonial.relativeTime && (
      <p className="text-xs text-gray-500 italic">{testimonial.relativeTime}</p>
    )}
  </div>
);

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState(mockTestimonials);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Configuration - Replace with your Google Places API details
  const GOOGLE_PLACE_ID = "ChIJpyiwa4Zw44kRBQSGWKv4wgA"; // Replace with your business Place ID
  const GOOGLE_API_KEY = "YOUR_API_KEY_HERE"; // Replace with your API key

  useEffect(() => {
    const loadGoogleReviews = async () => {
      try {
        // Check if Google Maps API is loaded
        if (typeof google === 'undefined' || !google.maps || !google.maps.places) {
          console.warn('Google Maps API not loaded. Using mock data.');
          setLoading(false);
          return;
        }

        const { Place } = await google.maps.importLibrary("places");
        
        const place = new Place({
          id: GOOGLE_PLACE_ID,
        });

        await place.fetchFields({
          fields: ["displayName", "reviews"],
        });

        console.log(place)

        if (place.reviews && place.reviews.length > 0) {
          const googleReviews = place.reviews.slice(0, 5).map(review => ({
            author: review.authorAttribution?.displayName || "Anonymous",
            authorPhoto: review.authorAttribution?.photoURI || null,
            authorUri: review.authorAttribution?.uri || null,
            rating: review.rating || 5,
            text: review.text || "Great service!",
            relativeTime: review.relativePublishTimeDescription || "",
            isGoogleReview: true,
          }));

          // Combine Google reviews with existing testimonials
          setTestimonials([...googleReviews, ...mockTestimonials]);
        }
      } catch (error) {
        console.error('Error loading Google reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGoogleReviews();
  }, []);

  const handlePlayVideo = () => {
    setIsVideoOpen(true);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const getVisibleTestimonials = () => {
    const visible = [];
    for (let i = 0; i < 2; i++) {
      visible.push(testimonials[(currentIndex + i) % testimonials.length]);
    }
    return visible;
  };

  return (
    <section className="bg-gray-50 py-12 sm:py-16 md:py-20">
      <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-8 sm:gap-12 md:gap-16 items-center">
          <div className="relative">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-600 mb-6 sm:mb-8 text-center lg:text-left">
              What Customers Say About Us
            </h2>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
              </div>
            ) : (
              <div className="relative">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {getVisibleTestimonials().map((testimonial, index) => (
                    <div key={index} className="w-full">
                      <TestimonialCard 
                        testimonial={testimonial} 
                        isGoogleReview={testimonial.isGoogleReview} 
                      />
                    </div>
                  ))}
                </div>

                {/* Navigation Buttons */}
                <button 
                  onClick={handlePrev}
                  className="hidden lg:flex absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                >
                  <ChevronLeft className="text-red-600" />
                </button>
                <button 
                  onClick={handleNext}
                  className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                >
                  <ChevronRight className="text-red-600" />
                </button>
              </div>
            )}

            {/* Pagination dots */}
            <div className="mt-6 flex justify-center space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-red-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <div className="mt-6 sm:mt-8 flex items-center justify-center">
              <button className="bg-red-600 text-white font-semibold py-2 sm:py-3 px-4 sm:px-20 rounded-lg hover:bg-red-700 transition-colors text-sm">
                Read All Reviews
              </button>
            </div>
          </div>

          {/* Video Section */}
          <div className="relative w-full h-64 sm:h-80 md:h-[31rem] rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl">
            {!isVideoOpen ? (
              <>
                <img 
                  src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&h=600&fit=crop" 
                  alt="Video thumbnail" 
                  className="w-full h-full object-cover" 
                />
                <div 
                  className="absolute inset-0 bg-black/30 flex items-center justify-center cursor-pointer group"
                  onClick={handlePlayVideo}
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-white/80 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <PlayCircleIcon className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-gray-900" />
                  </div>
                </div>
              </>
            ) : (
              <video
                className="w-full h-full object-cover"
                controls
                autoPlay
                src="https://www.w3schools.com/html/mov_bbb.mp4"
              >
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 lg:px-8 mt-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
          <h3 className="font-bold text-blue-900 mb-2">Setup Instructions:</h3>
          <ol className="list-decimal list-inside space-y-1 text-blue-800">
            <li>Replace <code className="bg-blue-100 px-1 rounded">GOOGLE_PLACE_ID</code> with your business's Google Place ID</li>
            <li>Replace <code className="bg-blue-100 px-1 rounded">YOUR_API_KEY_HERE</code> with your Google Maps API key</li>
            <li>Add the Google Maps script to your HTML: <code className="bg-blue-100 px-1 rounded">{'<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places"></script>'}</code></li>
            <li>Enable the Places API in your Google Cloud Console</li>
          </ol>
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