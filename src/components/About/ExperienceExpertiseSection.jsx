import React from "react";
import { Card, CardContent } from "./Card";

const ExperienceExpertiseSection = () => {
  return (
    <section className="w-full h-full mx-auto">
      <Card className="bg-white rounded-[20px] shadow-sm border-0 h-full flex">
        <CardContent className="p-6 sm:p-8 md:p-10 lg:p-[40px] flex flex-col">
          <header className="mb-6 sm:mb-8 md:mb-[30px]">
            <h2 className="font-lexend font-medium text-black text-2xl sm:text-3xl md:text-[32px] leading-[1.2]">
              Experience &amp; Expertise
            </h2>
          </header>

          <div>
            <p className="font-lexend text-[#6e6d6d] text-base sm:text-lg md:text-xl leading-7 md:leading-[30px]">
              Our team comprises of skilled tyre technicians and industry experts who have been working in the field of tyre fitting, wheel balancing, vehicle repair services and vehicle safety over several years. We deal with tyre brands and we deal with new installations of tyres, all the way up to intricate puncture repair. Whether you drive city streets in Melbourne or travel long highway routes across Australia, we know the expectations of the Australian conditions and suggest the products that are designed to work.
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};
export default ExperienceExpertiseSection;