import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { gethomedata } from "../axios/axios";
import { getTyreImageUrl } from "../Utils/Utils";
import Loader from './common/Loader';

const TireCard = ({ image, name, price, onClick }) => (
  <div onClick={onClick} className="bg-dark rounded-xl sm:rounded-2xl p-3 text-white w-full cursor-pointer">
    <div className="bg-white rounded-xl sm:rounded-2xl mb-2 sm:mb-3">
      <img
        src={image}
        alt={name}
        className="w-full h-56 sm:h-64 md:h-72 object-contain rounded-xl"
      />
    </div>
    <p className="font-medium text-sm sm:text-lg md:text-xl">{name}</p>
    <p className="font-medium text-xs sm:text-sm md:text-base my-2">{price}</p>
    <p className="text-xs text-[#E0E0E0] mt-1">View Details</p>
  </div>
);

const TireShowcase = () => {
  const [bestSeller, setBestSeller] = useState([]);
  const [newArrival, setNewArrival] = useState([]);
  const [popularProduct, setPopularProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const res = await gethomedata();
        const bs = res?.data?.data?.bestSeller || [];
        const na = res?.data?.data?.newArrival || [];
        const pp = res?.data?.data?.popularProduct || null;

        const mapItem = (item) => ({
          id: item._id,
          name: item.name || item.brand,
          price: typeof item.price === 'number' ? `$ ${item.price}` : '',
          image: getTyreImageUrl(item.images?.[0])
        });

        setBestSeller(bs.map(mapItem));
        setNewArrival(na.map(mapItem));
        if (pp) {
          setPopularProduct(mapItem(pp));
        }
      } catch (e) {
        setBestSeller([]);
        setNewArrival([]);
        setPopularProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  if (loading) {
    return <Loader label="Loading home data..." />;
  }

  return (
    <section className="bg-dark py-10 sm:py-14 md:py-10 sm:h-[37rem]">
        <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 lg:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          
          {/* Best Selling Section */}
          <div className="bg-white rounded-lg p-4 sm:p-6 lg:col-span-2 w-full h-full flex flex-col">
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4 sm:mb-6 text-center">
              Best Selling
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 flex-1">
              {(loading ? [] : bestSeller).slice(0, 2).map((p) => (
                <TireCard
                  key={p.id}
                  image={p.image}
                  name={p.name}
                  price={p.price}
                  onClick={() => navigate(`/productdetails/${p.id}`)}
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
              {(loading ? [] : newArrival).slice(0, 1).map((p) => (
                <div key={p.id} onClick={() => navigate(`/productdetails/${p.id}`)} className="bg-dark rounded-xl p-3 sm:p-2 flex items-center gap-3 sm:gap-4 flex-1 cursor-pointer">
                  <div className="bg-white rounded-lg sm:rounded-xl p-2 h-24 sm:h-32">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="text-white mb-8">
                    <p className="font-medium text-sm sm:text-lg md:text-xl">{p.name}</p>
                    <p className="font-medium text-xs sm:text-sm md:text-base">{p.price}</p>
                    <p className="text-xs text-[#E0E0E0] mt-1">View Details</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Popular */}
            <div className="bg-white rounded-lg p-4 sm:p-6 flex-1 flex flex-col">
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-3 sm:mb-4">
                Popular
              </h3>
              {popularProduct && (
                <div key={popularProduct.id} onClick={() => navigate(`/productdetails/${popularProduct.id}`)} className="bg-dark rounded-xl p-3 sm:p-2 flex items-center gap-3 sm:gap-4 flex-1 cursor-pointer">
                  <div className="bg-white rounded-lg sm:rounded-xl p-2  h-24 sm:h-32">
                    <img
                      src={popularProduct.image}
                      alt={popularProduct.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="text-white mb-8">
                    <p className="font-medium text-sm sm:text-lg md:text-xl">{popularProduct.name}</p>
                    <p className="font-medium text-xs sm:text-sm md:text-base">{popularProduct.price}</p>
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