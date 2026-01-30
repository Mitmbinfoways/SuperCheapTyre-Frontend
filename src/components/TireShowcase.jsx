import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getTyreImageUrl, formatCurrency } from "../Utils/Utils";
import Loader from "./common/Loader";
import Badge from "./common/Badge";

const TireCard = ({ image, name, price, onClick }) => (
  <div
    onClick={onClick}
    className="bg-dark rounded-xl sm:rounded-2xl p-3 text-white w-full cursor-pointer"
  >
    <div className="bg-white rounded-xl sm:rounded-2xl mb-2 sm:mb-3 relative w-full h-56 sm:h-64 md:h-72">
      <Image
        src={image}
        alt={name}
        fill
        className="object-contain rounded-xl"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
      <div className="absolute top-2 right-2 z-40">
        <Badge label="Best Selling" color="purple" />
      </div>
    </div>
    <p className="font-medium text-sm sm:text-lg md:text-xl line-clamp-1">
      {name}
    </p>
    <p className="font-medium text-xs sm:text-sm md:text-base my-2">{price}</p>
    <p className="text-xs text-[#E0E0E0] mt-1">View Details</p>
  </div>
);

const TireShowcase = ({ homeData }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Fixed: Correct keys from your API response
  const bestSelling = homeData?.bestSeller || [];           // ← was bestSelling → bestSeller
  const newArrival = homeData?.newArrival || null;          // ← was undefined variable
  const popularProduct = homeData?.popularProduct || null;  // ← was undefined variable

  // Helper to get full image URL
  const getImage = (imgArray) => {
    if (!imgArray || imgArray.length === 0) return "";
    return getTyreImageUrl ? getTyreImageUrl(imgArray[0]) : imgArray[0];
  };

  // Helper for price
  const getPrice = (price) => (formatCurrency ? formatCurrency(price) : price);

  if (loading) {
    return <Loader label="Loading home data..." />;
  }

  return (
    <section className="bg-dark py-10 sm:py-14 md:py-10 lg:h-[37rem]">
      <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 lg:px-8 h-full">
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch h-full">
          {/* Best Selling Section */}
          <div className="bg-white rounded-lg p-4 sm:p-6 lg:col-span-2 w-full h-full flex flex-col">
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4 sm:mb-6 text-center">
              Best Selling
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 flex-1">
              {bestSelling.slice(0, 2).map((p) => (
                <TireCard
                  key={p._id}
                  image={getImage(p.images)}
                  name={p.name}
                  price={getPrice(p.price)}
                  onClick={() => router.push(`/productdetails/${p._id}`)}
                />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full h-full flex flex-col space-y-6 sm:space-y-8">
            {/* New Arrivals */}
            <div className="bg-white rounded-lg p-4 sm:p-6 flex-1 flex flex-col">
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-3 sm:mb-4">
                New Arrivals
              </h3>
              {newArrival && (
                <div
                  key={newArrival._id}
                  onClick={() => router.push(`/productdetails/${newArrival._id}`)}
                  className="bg-dark rounded-xl p-3 sm:p-2 flex items-center gap-3 sm:gap-4 flex-1 cursor-pointer"
                >
                  <div className="relative bg-white rounded-lg sm:rounded-xl p-2 h-24 w-24 sm:h-32 sm:w-32 flex-shrink-0">
                    <Image
                      src={getImage(newArrival.images)}
                      alt={newArrival.name}
                      fill
                      className="object-contain rounded-lg"
                      sizes="150px"
                    />
                  </div>
                  <div className="text-white mb-8">
                    <p className="font-medium text-sm sm:text-lg md:text-xl line-clamp-2">
                      {newArrival.name}
                    </p>
                    <p className="font-medium text-xs sm:text-sm md:text-base">
                      {getPrice(newArrival.price)}
                    </p>
                    <p className="text-xs text-[#E0E0E0] mt-1">View Details</p>
                  </div>
                </div>
              )}
            </div>

            {/* Popular */}
            <div className="bg-white rounded-lg p-4 sm:p-6 flex-1 flex flex-col">
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-3 sm:mb-4">
                Popular
              </h3>
              {popularProduct && (
                <div
                  key={popularProduct._id}
                  onClick={() => router.push(`/productdetails/${popularProduct._id}`)}
                  className="bg-dark rounded-xl p-3 sm:p-2 flex items-center gap-3 sm:gap-4 flex-1 cursor-pointer"
                >
                  <div className="relative bg-white rounded-lg sm:rounded-xl p-2 h-24 w-24 sm:h-32 sm:w-32 flex-shrink-0">
                    <Image
                      src={getImage(popularProduct.images)}
                      alt={popularProduct.name}
                      fill
                      className="object-contain rounded-lg"
                      sizes="150px"
                    />
                  </div>
                  <div className="text-white mb-8">
                    <p className="font-medium text-sm sm:text-lg md:text-xl line-clamp-2">
                      {popularProduct.name}
                    </p>
                    <p className="font-medium text-xs sm:text-sm md:text-base">
                      {getPrice(popularProduct.price)}
                    </p>
                    <p className="text-xs text-[#E0E0E0] mt-1">View Details</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TireShowcase;