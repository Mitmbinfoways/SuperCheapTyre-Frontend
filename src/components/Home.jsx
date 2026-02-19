import React, { useEffect, useState } from "react";
import Hero from "./Hero";
import BuyTyre from "./BuyTyre";
import FeaturedProducts from "./FeaturedProducts";
import TireShowcase from "./TireShowcase";
import Brands from "./Brands";
import WhyChooseUs from "./WhyChooseUs";
import Testimonials from "./Testimonials";
import AppointmentBanner from "./AppointmentBanner";
import { gethomedata } from "../axios/axios";
import Loader from "./common/Loader";

function Home() {
  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchHomeData = async () => {
    try {
      const response = await gethomedata();
      setHomeData(response.data.data);
    } catch (error) {
      console.error("Error fetching home data:", error);
      setHomeData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeData();
  }, []);

  if (loading) {
    return <Loader label="Loading home data..." />;
  }

  return (
    <main className="overflow-x-hidden overflow-y-hidden">
      <Hero homeData={homeData} />
      {/* <BuyTyre /> */}
      <FeaturedProducts homeData={homeData} />
      <TireShowcase homeData={homeData} />
      <Brands />
      <WhyChooseUs />
      <Testimonials />
      <AppointmentBanner />
    </main>
  );
}

export default Home;
