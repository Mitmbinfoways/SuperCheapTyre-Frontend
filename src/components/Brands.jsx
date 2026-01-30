import React, { useState, useEffect } from "react";
import Image from "next/image";
import { getAllBrands } from "../axios/axios";
import brandsBg from "../assets/bglogo.png";
import Loader from "./common/Loader";

const Brands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        const response = await getAllBrands();

        if (response.data.statusCode === 200) {
          // Filter active brands only
          const activeBrands = response.data.data.items.filter(brand => brand.isActive);
          setBrands(activeBrands);
        } else {
          throw new Error("Failed to fetch brands");
        }
      } catch (err) {
        console.error("Error fetching brands:", err);
        setError("Failed to load brands");
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  if (loading) {
    return (
      <section className="py-12 sm:py-16 md:py-16 bg-white relative">
        <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-center">
            <Loader label="Loading brands..." />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 sm:py-16 md:py-16 bg-white relative">
        <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-center">
            <p className="text-red-500">Error: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  // Duplicate brands to fill more space as in the design
  const displayBrands = [...brands, ...brands.slice(0, 0)];

  return (
    <section className="py-12 sm:py-16 md:py-16 bg-white relative">
      <Image
        src={brandsBg}
        alt=""
        loading="lazy"
        decoding="async"
        className="h-[300px] w-[500px] absolute right-2 -top-5"
      />
      <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex ">
          <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-8 sm:mb-10 md:mb-12 text-center md:text-left">
            OUR BRANDS
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
          {displayBrands.map((brand, index) => (
            <div
              key={brand._id || index}
              className="bg-light p-3  sm:p-4 md:p-6 rounded-xl sm:rounded-2xl shadow-md flex items-center justify-center h-20 sm:h-24 md:h-28 hover:shadow-xl hover:scale-105 z-10 transition-all duration-300"
            >
              <BrandDisplay brand={brand} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const BrandDisplay = ({ brand }) => {
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && !imageError && (
        <div className="flex items-center justify-center h-full">
          <div className="w-6 h-6 border-t-2 border-r-2 border-red-500 rounded-full animate-spin"></div>
        </div>
      )}

      {imageError ? (
        <div className="max-h-12 sm:max-h-14 md:max-h-20 w-auto object-contain text-center font-bold text-gray-700 flex items-center justify-center"
          style={{ fontSize: 'clamp(12px, 2vw, 16px)' }}>
          {brand.name}
        </div>
      ) : (
        <Image
          src={`${process.env.NEXT_PUBLIC_BASE_URL}/Brand/${brand.image}`}
          alt={brand.name}
          width={200}
          height={100}
          className={`max-h-12 sm:max-h-14 md:max-h-20 w-auto object-contain ${loading ? 'hidden' : 'block'}`}
          onLoad={() => setLoading(false)}
          onError={() => {
            setImageError(true);
            setLoading(false);
          }}
        />
      )}
    </>
  );
};

export default Brands;