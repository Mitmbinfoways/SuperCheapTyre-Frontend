import React, { useRef } from 'react';
import { images, testimonials } from '../assets/data';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import img from '/home/true.png'

const SolidStar = ({ size = 20, className = '' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 17.27L18.18 21 16.54 13.97 22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z" />
    </svg>
);

const StarRating = ({ rating }) => (
    <div className="flex">
        {[...Array(5)].map((_, i) => (
            <SolidStar key={i} size={20} className={i < rating ? 'text-star-yellow' : 'text-gray-300'} />
        ))}
    </div>
);

const VerificationIcon = ({ size = 16 }) => (
    <img src={img} alt="Verified" width={size} height={size} className="object-contain" />
);

const TestimonialCard = ({ testimonial }) => (
    <div className="bg-white space-y-4 p-4 sm:p-6 md:p-8 rounded-xl border border-[#A6A6A6] shadow-[0_8px_24px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.08)]">
        <div className="flex items-center">
            <img src={testimonial.avatar} alt={testimonial.author} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mr-3 sm:mr-4" />
            <div>
                <p className="font-semibold font-open-sans text-brand-blue text-sm sm:text-base">{testimonial.author}</p>
                <div className="flex items-center text-xs sm:text-sm text-text-secondary">
                    <VerificationIcon size={14} />
                    <span className="font-open-sans ml-1 italic">Verified customer</span>
                </div>
            </div>
        </div>
        <div className="">
            <StarRating rating={testimonial.rating} />
        </div>
        <p className="text-brand-blue font-open-sans text-sm sm:text-base md:text-lg leading-relaxed">{testimonial.text}</p>

    </div>
);

const Testimonials = () => {
    // Use class selectors for Navigation to avoid ref timing issues

    return (
        <section className="bg-light py-12 sm:py-16 md:py-20">
            <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 lg:px-8">
                <div className="grid lg:grid-cols-2 grid-cols-1 gap-8 sm:gap-12 md:gap-16 items-center">
                    <div className="relative">
                        <h2 className="font-lexend text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-6 sm:mb-8 text-center lg:text-left">What Customers Say About Us</h2>

                        <div className="relative">
                            <Swiper
                                slidesPerView={1}
                                spaceBetween={20}
                                // freeMode
                                pagination={{ clickable: true }}
                                navigation={{ prevEl: '.testi-prev', nextEl: '.testi-next' }}
                                breakpoints={{
                                    640: { slidesPerView: 1, spaceBetween: 10 },
                                    768: { slidesPerView: 1, spaceBetween: 20 },
                                    1024: { slidesPerView: 2, spaceBetween: 30 },
                                }}
                                onBeforeInit={(swiper) => {
                                    // Attach external pagination element via ref before init
                                    const el = document.querySelector('.testimonials-pagination');
                                    if (el) {
                                        swiper.params.pagination.el = el;
                                    }
                                }}
                                modules={[FreeMode, Pagination, Navigation]}
                                className="testimonial-swiper"
                            >
                                {testimonials.map((item, index) => (
                                    <SwiperSlide key={index} className="!h-auto">
                                        <div className="w-full max-w-[600px] mx-auto p-3">
                                            <TestimonialCard testimonial={item} />
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>

                            {/* <button className="testi-prev hidden sm:flex absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-100">
                                <ChevronLeft className="text-primary" />
                            </button>
                            <button className="testi-next hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-100">
                                <ChevronRight className="text-primary" />
                            </button> */}
                        </div>

                        {/* Pagination container (external) */}
                        <div className="testimonials-pagination swiper-pagination !relative flex justify-center"></div>

                        <div className="mt-6 sm:mt-8 flex items-center justify-center lg:justify-between">
                            {/* <div className="hidden lg:flex space-x-2">
                                <span className="w-2 h-2 sm:w-3 sm:h-3 bg-dark rounded-full"></span>
                                <span className="w-2 h-2 sm:w-3 sm:h-3 bg-gray-300 rounded-full"></span>
                                <span className="w-2 h-2 sm:w-3 sm:h-3 bg-gray-300 rounded-full"></span>
                                <span className="w-2 h-2 sm:w-3 sm:h-3 bg-gray-300 rounded-full"></span>
                            </div> */}
                            <button className="bg-primary text-white font-semibold py-2 sm:py-3 px-4 sm:px-20 mx-auto rounded-lg hover:bg-red-700 transition-colors text-sm">
                                Read All Reviews
                            </button>
                        </div>
                    </div>
                    <div className="relative w-full h-64 sm:h-80 md:h-[31rem] rounded-xl sm:rounded-2xl overflow-hidden group cursor-pointer mb-8 shadow-2xl">
                        <img src={images.videoBg} alt="Tyre world" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-white/80 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                <PlayCircleIcon className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-dark" />
                            </div>
                        </div>
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
