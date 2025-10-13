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
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};
export default ExperienceExpertiseSection;