import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import Image from 'next/image';
import { ContactSection } from "./ContactSection";
import { EnquirySection } from "./EnquirySection";


export const ContactUs = () => {
  const contactData = useSelector((state) => state.contact.data);

  return (
    <div
      className="relative w-full max-w-screen-2xl mx-auto  min-h-screen bg-[#F5F5F5] overflow-hidden">
      <div className="absolute top-[31rem] left-1/2 -translate-x-1/2 w-full flex justify-center">
        <Image
          className="w-[80%] max-w-[780px] h-auto object-contain"
          alt="Tyre"
          width={781}
          height={781}
          src="/contactus/contacttyre.svg"
        />
      </div>

      <Image
        className="absolute bottom-0 -right-0 w-[466px] h-[565px]  animate-fade-in [--animation-delay:600ms]"
        alt="Ellipse"
        width={466}
        height={565}
        src="/contactus/avtar.svg"
      />

      <div className="relative w-full">

        <div className="translate-y-[-1rem] animate-fade-up  [--animation-delay:200ms]">
          <ContactSection contactData={contactData} />
        </div>

        <div className="translate-y-[-1rem] animate-fade-up  [--animation-delay:500ms]">
          <EnquirySection contactData={contactData} />
        </div>
      </div>
    </div>
  );
};
