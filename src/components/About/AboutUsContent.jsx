import React from 'react';
import { Card, CardContent } from './Card';

const AboutUsContent = () => {

  return (
    <div className="w-full h-full  mx-auto">
      <Card className="bg-white rounded-[20px] shadow-sm border-0 h-full flex flex-col">
        <CardContent className="p-6 sm:p-8 md:p-10 lg:p-[40px] flex flex-col">
          <h2 className="font-lexend font-medium text-black text-2xl sm:text-3xl md:text-[32px] leading-[1.2] mb-6 sm:mb-8 md:mb-[30px]">
            Company Overview
          </h2>

          <p className="font-lexend text-[#6e6d6d] text-base sm:text-lg md:text-xl leading-7 md:leading-[30px] max-w-[741px]">
            Supercheap Tyres is a local based tyre shop which deals in the full gamut of tyres, wheels and servicing. We have reputable brands, good prices and enormous choices of cars, SUVs, utes, vans, 4X4 vehicles and work fleets. We are your one stop partner whether you require one tyre replacement, a complete set of replacement including fitting, balancing, and alignment. We proudly serve Melbourne drivers, while also supporting customers Australia-wide with product delivery, quality advice and outstanding service.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutUsContent;
