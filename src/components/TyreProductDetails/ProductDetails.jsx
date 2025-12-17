import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import HeroSection from './HeroSection';
import SimilarProducts from './SimilarProduct';
import Loader from "../common/Loader";
import NotFound from "../common/NotFound";
import { getTyreById } from "../../axios/axios";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await getTyreById(id);
        setProduct(response.data?.data);
      } catch (error) {
        console.error("Error fetching product:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  if (loading) {
    return <Loader label="Loading product..." />;
  }

  if (!product || !product.isActive) {
    return <NotFound />;
  }

  return (
    <main>
      <HeroSection product={product} />
      <SimilarProducts productId={id} />
    </main>
  );
};

export default ProductDetail;