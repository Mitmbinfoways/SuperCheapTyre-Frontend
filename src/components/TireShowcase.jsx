import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { gethomedata } from "../axios/axios";
import { getTyreImageUrl, formatCurrency } from "../Utils/Utils";
import Loader from "./common/Loader";
import Badge from "./common/Badge";

const TireCard = ({ image, name, price, onClick }) => (
  <div
    onClick={onClick}
    className="bg-dark rounded-2xl overflow-hidden w-full cursor-pointer hover:opacity-90 transition-opacity border-8 border-dark"
  >
    <div className="bg-white rounded-2xl mb-0 relative overflow-hidden aspect-square">
      <img
        src={image}
        alt={name}
        className="w-full h-full object-contain p-6"
      />
    </div>
    <div className="p-4 text-white">
      <p className="font-semibold text-base sm:text-lg mb-1">
        {name}
      </p>
      <p className="font-bold text-sm sm:text-base mb-1">{price}</p>
      <p className="text-xs text-[#E0E0E0]">View Details</p>
    </div>
  </div>
);

const SidebarCard = ({ image, name, price, onClick }) => (
  <div
    onClick={onClick}
    className="bg-dark rounded-2xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity border-8 border-dark"
  >
    <div className="flex items-center gap-0">
      <div className="bg-white rounded-2xl p-4 w-32 h-32 sm:w-36 sm:h-36 flex-shrink-0">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-contain"
        />
      </div>
      <div className="text-white flex-1 min-w-0 p-4">
        <p className="font-semibold text-base sm:text-lg mb-1">
          {name}
        </p>
        <p className="font-bold text-sm sm:text-base mb-1">
          {price}
        </p>
        <p className="text-xs text-[#E0E0E0]">View Details</p>
      </div>
    </div>
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
          price: typeof item.price === "number" ? formatCurrency(item.price) : "",
          image: getTyreImageUrl(item.images?.[0]),
        });

        setBestSeller(bs.map(mapItem));
        setNewArrival(na.map(mapItem));
        if (pp) setPopularProduct(mapItem(pp));
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
    <section className="bg-dark py-10 sm:py-14 md:py-16">
      <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 lg:px-8">
        
        {/* Mobile & Tablet Layout (Below lg breakpoint) */}
        <div className="block lg:hidden space-y-6">
          {/* Best Selling */}
          <div className="bg-white rounded-2xl p-5 sm:p-6">
            <h3 className="text-xl sm:text-2xl font-bold mb-5 sm:mb-6 text-center text-gray-900">
              Best Selling
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              {bestSeller.slice(0, 2).map((p) => (
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

          {/* New Arrivals */}
          <div className="bg-white rounded-2xl p-5 sm:p-6">
            <h3 className="text-xl sm:text-2xl font-bold mb-5 text-gray-900">
              New Arrivals
            </h3>
            {newArrival.slice(0, 1).map((p) => (
              <SidebarCard
                key={p.id}
                image={p.image}
                name={p.name}
                price={p.price}
                onClick={() => navigate(`/productdetails/${p.id}`)}
              />
            ))}
          </div>

          {/* Popular */}
          <div className="bg-white rounded-2xl p-5 sm:p-6">
            <h3 className="text-xl sm:text-2xl font-bold mb-5 text-gray-900">
              Popular
            </h3>
            {popularProduct && (
              <SidebarCard
                image={popularProduct.image}
                name={popularProduct.name}
                price={popularProduct.price}
                onClick={() => navigate(`/productdetails/${popularProduct.id}`)}
              />
            )}
          </div>
        </div>

        {/* Desktop Layout (lg and above) */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-6 items-start">
          {/* Best Selling - Takes 2 columns */}
          <div className="bg-white rounded-2xl p-6 lg:col-span-2 h-full">
            <h3 className="text-2xl font-bold mb-6 text-center text-gray-900">
              Best Selling
            </h3>
            <div className="grid grid-cols-2 gap-6">
              {bestSeller.slice(0, 2).map((p) => (
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

          {/* Sidebar - Takes 1 column */}
          <div className="flex flex-col gap-6 h-full">
            {/* New Arrivals */}
            <div className="bg-white rounded-2xl p-6 flex-1">
              <h3 className="text-2xl font-bold mb-5 text-gray-900">
                New Arrivals
              </h3>
              {newArrival.slice(0, 1).map((p) => (
                <SidebarCard
                  key={p.id}
                  image={p.image}
                  name={p.name}
                  price={p.price}
                  onClick={() => navigate(`/productdetails/${p.id}`)}
                />
              ))}
            </div>

            {/* Popular */}
            <div className="bg-white rounded-2xl p-6 flex-1">
              <h3 className="text-2xl font-bold mb-5 text-gray-900">
                Popular
              </h3>
              {popularProduct && (
                <SidebarCard
                  image={popularProduct.image}
                  name={popularProduct.name}
                  price={popularProduct.price}
                  onClick={() => navigate(`/productdetails/${popularProduct.id}`)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TireShowcase;