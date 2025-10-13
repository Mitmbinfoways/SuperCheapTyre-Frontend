import React from 'react';
import Hero from './Hero';
import BuyTyre from './BuyTyre';
import FeaturedProducts from './FeaturedProducts';
import TireShowcase from './TireShowcase';
import Brands from './Brands';
import WhyChooseUs from './WhyChooseUs';
import Testimonials from './Testimonials';
import AppointmentBanner from './AppointmentBanner';


function Home() {
  return (
    <main>
      <Hero />
      {/* <BuyTyre /> */}
      <FeaturedProducts />
      <TireShowcase />
      <Brands />
      <WhyChooseUs />
      <Testimonials />
      <AppointmentBanner />
    </main>
  );
}

export default Home;