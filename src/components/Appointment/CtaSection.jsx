import React from 'react';
import Image from 'next/image';
import appointmentIllustration from '../../assets/appointment/appointmentgirl.png';

const CtaSection = () => {
  return (
    <section className="max-w-screen-2xl mx-auto px-3 sm:px-4 md:pt-42 lg:px-8 py-8">
      <div className="relative bg-black rounded-3xl text-white min-h-[380px] flex items-center justify-center">
        <div className="p-4 md:p-12">
          <div className="absolute z-10 order-2 md:order-1 left-0  bottom-1">
            <Image
              src={appointmentIllustration}
              sizes="(min-width: 1024px) 28vw, 40vw"
              alt="Professional holding a clipboard"
              className="h-auto max-lg:max-h-96 aspect-[2/3] hidden md:block max-lg:opacity-70"
            />
          </div>
          <div className="relative z-10 order-1 md:order-2 text-center  ">
            <h2 className="font-semibold text-3xl md:text-[40px] leading-tight tracking-wider">
              Right tyres, right time,<br />Just one click away.
            </h2>
          </div>
        </div>
        <Image
          src="/appointment/appointmenttyre.svg"
          alt="Stack of tyres"
          width={400}
          height={300}
          className="aspect-[4/3] h-full w-auto absolute -right-5 -bottom-5 hidden md:block max-lg:h-[80%] max-lg:opacity-70"
        />
      </div>
    </section>
  );
};

export default CtaSection;