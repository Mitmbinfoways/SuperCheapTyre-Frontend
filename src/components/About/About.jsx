import React from 'react';
import AboutUsHero from './AboutUsHero';
import AboutUsContent from './AboutUsContent';
import AboutUsVideo from './AboutUsVideo';
import CompanyOverviewSection from './AboutCompanyOverviewSection';
import ExperienceExpertiseSection from './ExperienceExpertiseSection';

export const About = () => {
  const decorativeImages = [
    {
      src: "/about/companyoverviewimg.svg",
      alt: "Feature banner find",
    },
    {
      src: "/about/missionstatementimg.jpg",
      alt: "Tyre shop homepage",
    },
    {
      src: "/about/keyvalueimg.jpg",
      alt: "Hand selecting tyre",
    },
    {
      src: "/about/experienceimg.png",
      alt: "Tire rack pirelli",
    },
    {
      src: "/about/aboutvideoimg.svg",
      alt: "Group",
    }
  ];

  return (
    <div className="max-w-screen-2xl mx-auto">
    <div
      className="relative w-full min-h-screen bg-[#F5F5F5] overflow-hidden "
    >
     
      {/* Main Content Sections */}
      <div className="flex flex-col w-full">

        {/* About Us Section */}
        <div className="w-full">
          <AboutUsHero />
        </div>

        {/* Mission Statement Section with side image */}
        <div className="w-full py-8 px-3 sm:px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch gap-4 sm:gap-6 min-h-[320px] sm:min-h-[360px] md:min-h-[400px]">
            <div className="order-2 lg:order-none lg:col-span-8">
              <div className="h-full w-full">
                <AboutUsContent />
              </div>
            </div>
            <div className="order-1 lg:order-none lg:col-span-4 flex items-stretch">
              <div className="h-full w-full">
                <div className="w-full h-full min-h-[240px] sm:min-h-[280px] md:min-h-[320px] lg:min-h-[360px] rounded-[40px] overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    width={1200}
                    height={800}
                    alt={decorativeImages[0].alt}
                    src={decorativeImages[0].src}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Company Overview Section with side image */}
        <div className="w-full py-8 px-3 sm:px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch gap-4 sm:gap-6 min-h-[320px] sm:min-h-[360px] md:min-h-[400px]">
            <div className="order-1 lg:order-none lg:col-span-4 flex items-stretch">
              <div className="h-full w-full">
                <div className="w-full h-full min-h-[240px] sm:min-h-[280px] md:min-h-[320px] lg:min-h-[360px] rounded-[40px] overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    width={1200}
                    height={800}
                    alt={decorativeImages[1].alt}
                    src={decorativeImages[1].src}
                  />
                </div>
              </div>
            </div>
            <div className="order-2 lg:order-none lg:col-span-8">
              <div className="h-full w-full">
                <CompanyOverviewSection />
              </div>
            </div>
          </div>
        </div>

        {/* Video Section with side image */}
        <div className="w-full py-8 px-3 sm:px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12  items-stretch gap-4 sm:gap-6  min-h-[320px] sm:min-h-[360px] md:min-h-[400px]">
            <div className="order-2 lg:order-none lg:col-span-8">
              <div className="h-full w-full">
                <AboutUsVideo />
              </div>
            </div>
            <div className="order-1 lg:order-none lg:col-span-4 flex items-stretch">
              <div className="h-full w-full">
                <div className="w-full h-full min-h-[240px] sm:min-h-[280px] md:min-h-[320px] lg:min-h-[360px] rounded-[40px] overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    width={1200}
                    height={800}
                    alt={decorativeImages[2].alt}
                    src={decorativeImages[2].src}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Experience Expertise Section with side image */}
        <div className="w-full py-8 px-3 sm:px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch gap-4 sm:gap-6 min-h-[320px] sm:min-h-[360px] md:min-h-[400px]">
            <div className="order-1 lg:order-none lg:col-span-4 flex items-stretch">
              <div className="h-full w-full">
                <div className="w-full h-full min-h-[240px] sm:min-h-[280px] md:min-h-[320px] lg:min-h-[360px] rounded-[40px] overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    width={1200}
                    height={800}
                    alt={decorativeImages[3].alt}
                    src={decorativeImages[3].src}
                  />
                </div>
              </div>
            </div>
            <div className="order-2 lg:order-none lg:col-span-8">
              <div className="h-full w-full">
                <ExperienceExpertiseSection />
              </div>
            </div>
          </div>
        </div>
        
        {/* <div className="w-full py-8 px-3 sm:px-4 lg:px-8">
          <div className="relative w-full h-full min-h-[240px] sm:min-h-[280px] md:min-h-[320px] lg:min-h-[453px] rounded-[40px] overflow-hidden bg-black">
            <video
              className="absolute inset-0 w-full h-full object-cover"
              poster={decorativeImages[4].src}
              controls
              playsInline
            >
              <source src="/about/car.mp4" type="video/mp4" />
              <source src="/about/car.webm" type="video/webm" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div> */}

      </div>
    </div>
    </div>
  );
};

export default About;
