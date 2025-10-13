import React from 'react';

const HeroBanner = () => {
  return (
    <div className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-blue-900 rounded-2xl sm:rounded-3xl mx-4 sm:mx-8 lg:mx-12 my-6 sm:my-8 lg:my-8 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="/tyre/tyrebg.svg"
          alt="Tyre Banner"
          className="w-full h-full object-cover opacity-80"
        />
      </div>
        <div className="relative z-10 flex items-center justify-center h-64 sm:h-80 lg:h-96 px-3 sm:px-4 lg:px-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-roboto font-black text-white text-center leading-tight tracking-wide">
          Grip the road. Trust your drive.
        </h1>
      </div>
    </div>
  );
};

export default HeroBanner;
