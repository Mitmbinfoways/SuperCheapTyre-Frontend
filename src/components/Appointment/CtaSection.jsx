import React from 'react';

const CtaSection = () => {
  return (
    <section className="max-w-screen-2xl mx-auto px-3 sm:px-4 lg:px-8 py-8">
      <div className="relative bg-black rounded-3xl text-white min-h-[380px] flex items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 p-4 md:p-12">
          <div className="absolute z-10 order-2 md:order-1 left-0 bottom-1">
            <img
              src="/appointment/appointmentgirl.svg"
              alt="Professional holding a clipboard"
              className="w-full h-full mx-auto"
            />
          </div>
          <div className="relative z-10 order-1 md:order-2 text-center md:text-left -right-72 -top-24">
            <h2 className="font-semibold text-3xl md:text-[40px] leading-tight tracking-wider">
              Right tyres, right time,<br />Just one click away.
            </h2>
          </div>
        </div>
        <img
          src="/appointment/appointmenttyre.svg"
          alt="Stack of tyres"
          className="absolute -right-5 -bottom-5"
        />
      </div>
    </section>
  );
};

export default CtaSection;