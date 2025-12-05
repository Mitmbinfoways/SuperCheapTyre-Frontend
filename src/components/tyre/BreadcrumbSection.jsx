import React from 'react';

const BreadcrumbSection = ({ category = 'tyre', title, description }) => {
  // Default content based on category
  const defaultContent = {
    tyre: {
      title: 'Explore Our Tyre Range',
      description: 'Find the perfect tyres for your vehicle from leading brands trusted by the drivers worldwide.'
    },
    wheel: {
      title: 'Explore Our Wheel Range',
      description: 'Upgrade your vehicle with wheels from trusted brands built for durability, safety, and attractive.'
    }
  };

  // Use provided title/description or fall back to defaults based on category
  const displayTitle = title || defaultContent[category]?.title || 'Products Listing';
  const displayDescription = description || defaultContent[category]?.description || 'Find the perfect products for your vehicle';

  return (
    <div className="bg-[#F3F3F3] shadow-lg -mx-4 sm:-mx-6 lg:-mx-8">
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl text-[#ED1C24] font-lexend font-medium text-brand-red">
            {displayTitle}
          </h1>
          <p className="text-sm sm:text-base lg:text-lg font-lexend text-[#747474]">
            {displayDescription}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BreadcrumbSection;
