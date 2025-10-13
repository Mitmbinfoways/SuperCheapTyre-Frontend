import React from 'react';
import { images, whyChooseUsItems } from '../assets/data';

const WhyChooseUs = () => {
    return (
        <section className="relative py-12 sm:py-16 md:py-20 bg-white">
            <div className="absolute inset-0">
                <img src={images.whyChooseUsBg} alt="Mechanic working on a car" className="w-full h-full object-cover opacity-100 rounded-2xl border border-black" />
            </div>
            <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 lg:px-8 relative z-10">
                <div className="flex justify-center mb-8 sm:mb-12 md:mb-16">
                    <div className="bg-[#00000099] rounded-full px-16 py-4 border border-gray-600">
                        <h2 className="text-2xl sm:text-3xl md:text-[36px] text-[#FFFFFF] text-center">Why Choose Us</h2>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 max-w-screen-2xl mx-auto">
                    {whyChooseUsItems.map((item, index) => (
                        <div key={index} className="bg-medium-gray/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border-2 border-[#B7B7B7] shadow-lg text-center flex flex-col items-center hover:scale-105 transition-transform duration-200">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mb-4 sm:mb-6">
                                <img src={item.icon} alt={item.title} className="w-full h-full object-contain" />
                            </div>
                            <h3 className="text-white text-base sm:text-lg md:text-xl font-semibold">{item.title}</h3>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
