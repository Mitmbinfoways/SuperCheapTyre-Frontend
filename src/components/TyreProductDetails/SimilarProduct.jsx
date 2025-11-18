import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Link from './ui/Link';
import { getSimilarProducts, getTyreById } from '../../axios/axios';
import { formatCurrency, getTyreImageUrl } from '../../Utils/Utils';
import Loader from '../common/Loader';

const SimilarProducts = ({ productCategory }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentProductCategory, setCurrentProductCategory] = useState(productCategory || 'tyre');

  useEffect(() => {
    const fetchSimilarProducts = async () => {
      if (!id) return;

      try {
        setLoading(true);
        
        // Fetch current product to determine its category if not provided
        if (!productCategory) {
          try {
            const productResponse = await getTyreById(id);
            setCurrentProductCategory(productResponse.data.data.category || 'tyre');
          } catch (productError) {
            console.error('Error fetching current product:', productError);
          }
        }

        const response = await getSimilarProducts(id);

        // Determine the category from the first product if not provided and current product fetch failed
        if (response.data.data.length > 0 && !productCategory) {
          setCurrentProductCategory(response.data.data[0].category || 'tyre');
        }

        // Map the API response to match the component's expected structure
        const mappedProducts = response.data.data.map(product => {
          // Check if this is a wheel product
          const isWheel = product.category === 'wheel';

          return {
            id: product._id,
            brand: product.brand,
            name: product.name,
            price: product.price,
            image: getTyreImageUrl(product.images?.[0]) || '/home/product.svg',
            description: isWheel
              ? product.description || `${product.wheelSpecifications?.size || ''}" ${product.wheelSpecifications?.diameter || ''}`
              : product.description || `${product.tyreSpecifications?.width || ''}/${product.tyreSpecifications?.profile || ''}${" "}${product.tyreSpecifications?.diameter || ''}${" "}${product.tyreSpecifications?.loadRating || ' '}${product.tyreSpecifications?.speedRating || ''}`,
            size: isWheel
              ? product.wheelSpecifications
                ? `${product.wheelSpecifications.size || ''}" ${product.wheelSpecifications.diameter || ''}`
                : 'N/A'
              : product.tyreSpecifications
                ? `${product.tyreSpecifications?.width || ''}/${product.tyreSpecifications?.profile || ''}${" "}${product.tyreSpecifications?.diameter || ''}${" "}${product.tyreSpecifications?.loadRating || ' '}${product.tyreSpecifications?.speedRating || ''}`.trim()
                : 'N/A',
            category: product.category || 'tyre'
          };
        });
        setSimilarProducts(mappedProducts);
      } catch (err) {
        setError('Failed to load similar products');
        console.error('Error fetching similar products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarProducts();
  }, [id, productCategory]);

  // Determine display text based on category
  const categoryTitle = currentProductCategory === 'wheel' ? 'Wheels' : 'Tyres';
  const sectionTitle = `Similar ${categoryTitle}`;
  const viewMoreLink = `/${currentProductCategory === 'wheel' ? 'wheels' : 'tyres'}`;

  if (loading) {
    return <Loader label={`Loading similar ${currentProductCategory === 'wheel' ? 'wheels' : 'tyres'}...`} />;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  // Check if there are no similar products
  if (!similarProducts || similarProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg border border-gray-200 mx-4 my-8">
        <div className="text-5xl mb-4 text-gray-300">🔍</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Similar Products Found</h3>
        <p className="text-gray-500 text-center max-w-md">
          We couldn't find any similar products to recommend. Try exploring our full collection.
        </p>
        <Link 
          href={currentProductCategory === 'wheel' ? '/wheels' : '/tyres'}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#ed1c24] hover:bg-[#d0171f] focus:outline-none"
        >
          Browse All {currentProductCategory === 'wheel' ? 'Wheels' : 'Tyres'}
        </Link>
      </div>
    );
  }

  return (
    <section className="w-full bg-[#f5f5f5] py-[20px] sm:py-[25px] md:py-[30px] lg:py-[40px]">
      <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="mx-[25px] sm:mx-[35px] md:mx-[40px] lg:mx-[50px]">
          <div className="flex justify-center items-center w-full">
            <div className="border border-[#dadada] rounded-[14px] bg-white p-[16px] w-full">
              <div className="flex flex-col gap-[16px] sm:gap-[18px] md:gap-[20px] lg:gap-[22px] w-full max-w-[94%] mx-auto mb-[16px]">
                {/* Section Header */}
                <div className="flex justify-between items-start w-full">
                  <h2 className="text-[24px] sm:text-[28px] md:text-[30px] lg:text-[32px] font-medium leading-[30px] sm:leading-[35px] md:leading-[38px] lg:leading-[40px] font-['Lexend'] text-[#ed1c24] self-center">
                    {sectionTitle}
                  </h2>
                  <Link
                    href={viewMoreLink}
                    className="text-[12px] sm:text-[13px] md:text-[14px] font-normal leading-[16px] sm:leading-[17px] md:leading-[18px] font-['Lexend'] text-black underline mt-[8px] sm:mt-[10px] md:mt-[12px] hover:text-[#ed1c24] transition-colors"
                  >
                    View more
                  </Link>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[20px] sm:gap-[25px] md:gap-[30px] lg:gap-[40px] w-full">
                  {similarProducts?.map((product) => (
                    <div
                      key={product?.id}
                      onClick={() => navigate(`/productdetails/${product.id}`)}
                      className="flex flex-col justify-end items-start w-full border border-[#c8c8c8] rounded-[10px] bg-white p-[20px] sm:p-[24px] md:p-[26px] lg:p-[28px_30px] hover:shadow-lg transition-shadow cursor-pointer"
                    >
                      {/* Product Image and Rating */}
                      <div className="flex flex-col gap-[6px] items-center w-full mb-[20px] sm:mb-[24px] md:mb-[26px] lg:mb-[28px]">
                        <img
                          src={product?.image}
                          alt={`${product?.brand} ${categoryTitle.slice(0, -1)} Product`}
                          className="w-full max-w-[218px] h-[218px] object-contain"
                        />
                      </div>
                      {/* Product Brand */}
                      <div
                        className="text-[18px] line-clamp-1 sm:text-[19px] md:text-[20px] font-medium leading-[23px] sm:leading-[24px] md:leading-[25px] tracking-[1px] font-['Lexend'] text-[#ed1c24] underline hover:opacity-80 transition-opacity"
                      >
                        {product?.name}
                      </div>

                      {/* Product Details */}
                      <div className="flex flex-col gap-[4px] w-full mt-[6px]">
                        <p className="text-[14px] sm:text-[15px] md:text-[16px] font-normal leading-[16px] sm:leading-[17px] md:leading-[18px] font-['Roboto'] text-[#5a7184] whitespace-pre-line">
                          {product?.brand}
                        </p>
                        <p className="text-[14px] sm:text-[15px] md:text-[16px] leading-[17px] sm:leading-[18px] md:leading-[19px] font-['Roboto'] text-[#5a7184]">
                          <span className="font-bold text-[#888888]">Size: </span>
                          <span className="font-normal">{product?.size}</span>
                        </p>
                        <div className="text-lg font-lexend font-medium text-black pb-5">
                          {formatCurrency(product?.price)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SimilarProducts;