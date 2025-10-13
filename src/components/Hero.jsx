import React from 'react';
import { images } from '../assets/data';
import { ChevronDown } from 'lucide-react';
import img from '/home/tyrebanner1.png'
import BuyTyre from './BuyTyre';

const SearchForm = () => {
    return (
        <div className="relative mt-2 sm:mt-6 md:mt-8 pointer-events-auto">
            <div className="relative bg-white rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 z-10">
                <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium text-dark mb-4 sm:mb-6 text-center md:text-left">SEARCH FOR TYRES</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 items-center">
                    {['Select a Width', 'Select a Profile', 'Select a Diameter', 'Select a Brand'].map((placeholder) => (
                        <div key={placeholder} className="relative">
                            <select className="w-full h-12 sm:h-14 px-3 sm:px-4 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base">
                                <option>{placeholder}</option>
                            </select>
                            <ChevronDown className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        </div>
                    ))}
                    <button className="w-full h-12 sm:h-14 bg-primary text-white font-semibold text-sm sm:text-base lg:text-xl rounded-lg hover:bg-red-700 transition-colors col-span-1 sm:col-span-2 lg:col-span-1">
                        Select
                    </button>
                </div>
            </div>
        </div>
    );
};


const Hero = () => {
  return (
    <div className='h-fit'>
    <section className="relative bg-dark text-white overflow-hidden w-full ">
      <div className="">
        <img src={img} alt="Ford Ranger" className="w-full h-full object-cover object-[60%_center] sm:object-center lg:object-right"/>
        <div className="absolute inset-0 bg-black/30 sm:bg-black/10"></div>
      </div>

        <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 lg:px-8 relative z-10 h-full">
        <div className="grid lg:grid-cols-2 items-center h-full py-8 sm:py-12">
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
