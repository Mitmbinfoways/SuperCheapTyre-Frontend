import React from 'react';
import { images } from '../assets/data';
import img from '/home/appointmentgirl.png';
import { Link } from 'react-router-dom';

const AppointmentBanner = () => {
  return (
    <section className="relative h-72 bg-gray-900 bg-white/10">
      <img
        src={images.appointmentBg}
        alt="Tires stacked"
        className="absolute inset-0 w-full h-full object-cover opacity-100"
      />
      <div className="relative h-full">
        {/* Tyre image anchored to container */}
        <div className="hidden sm:block pointer-events-none absolute bottom-0 sm:-bottom-12 md:bottom-0 sm:right-0 md:-right-6 lg:-right-14 xl:-right-24 z-0">
          <img
            src={img}
            alt="Two tires"
            className="w-40 xs:w-48 sm:w-60 md:w-72 lg:w-96 xl:w-[460px] sm:h-[454px] md:h-[360px] h-[554px]  object-contain drop-shadow-xl"
          />
        </div>

        <div className="w-full h-full flex justify-center items-center z-10">
          <div className="flex items-center justify-center">
            <div className="border-2 border-red-600 rounded-full">
              <Link
                to="/appointment"
                className="mx-auto bg-primary p-2 border-2 border-white text-white font-bold text-sm sm:text-base md:text-lg lg:text-xl py-3 sm:py-4 px-16 md:px-20 sm:px-8 xl:px-56 lg:px-44 rounded-full shadow-lg hover:bg-red-700 transition-all duration-200 transform hover:scale-105 active:scale-95 text-center block"
              >
                Appointment Booking
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppointmentBanner;
