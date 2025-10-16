import React from 'react';

const CtaSection = () => {
  return (
    <section className="max-w-screen-2xl mx-auto px-3 sm:px-4 md:pt-56 lg:px-8 py-8">
      <div className="relative bg-black rounded-3xl text-white min-h-[380px] flex items-center justify-center">
        <div className="p-4 md:p-12">
          <div className="absolute z-10 order-2 md:order-1 left-0  bottom-1">
            <img
              src="/appointment/appointmentgirl.png"
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
        <img
          src="/appointment/appointmenttyre.svg"
          alt="Stack of tyres"
          className="aspect-[4/3] h-full absolute -right-5 -bottom-5 hidden md:block max-lg:h-[80%] max-lg:opacity-70"
        />
      </div>
    </section>
  );
};

export default CtaSection;