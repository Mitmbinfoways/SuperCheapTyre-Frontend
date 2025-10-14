import React from 'react';
import HeroSection from './HeroSection';
import SimilarProducts from './SimilarProduct';
import { useParams } from 'react-router-dom';

const ProductDetail = () => {
  const { id } = useParams(); // Get product id from URL

  return (
    <>      
      <main>
        <HeroSection />
        <SimilarProducts productId={id} />
      </main>
    </>
  );
};

export default ProductDetail;