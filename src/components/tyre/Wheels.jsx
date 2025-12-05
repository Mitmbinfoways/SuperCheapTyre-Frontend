import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import BreadcrumbSection from "./BreadcrumbSection";
import WheelFilterSidebar from "./WheelFilterSidebar";
import TyreGrid from "./TyreGrid";
import Pagination from "./Pagination";
import HeroBannerWheel from "./HeroBannerWheel";
import { getTyres } from "../../axios/axios";
import { getTyreImageUrl } from "../../Utils/Utils";
import Loader from "../common/Loader";

function Wheels() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageSize] = useState(6); // Set page size to 6 as in original

  // Get filter values from URL query parameters
  const brand = searchParams.get("brand") || "";
  const size = searchParams.get("size") || "";
  const color = searchParams.get("color") || "";
  const diameter = searchParams.get("diameter") || "";
  const fitments = searchParams.get("fitments") || "";
  const price = searchParams.get("price") || "";
  const search = searchParams.get("search") || ""; // Get search parameter

  // Fetch data from API with axios and pagination
  useEffect(() => {
    const fetchWheels = async () => {
      try {
        setLoading(true);
        setError(null);

        // Build API parameters
        const apiParams = {
          page: currentPage,
          limit: pageSize,
          category: "wheel",
          isActive: true,
        };

        // Add filter parameters if they exist
        if (brand) apiParams.brand = brand;
        if (size) apiParams.size = size;
        if (color) apiParams.color = color;
        if (diameter) apiParams.diameter = diameter;
        if (fitments) apiParams.fitments = fitments;
        if (price) apiParams.sortBy = price; // price is for sorting
        if (search) apiParams.search = search; // Add search parameter

        const response = await getTyres(apiParams);

        // extract and map response
        const items = response.data?.data?.items || [];
        const pagination = response.data?.data?.pagination || {};

        const mappedProducts = items.map((item) => ({
          id: item._id,
          _id: item._id, // Also pass _id for compatibility
          image: getTyreImageUrl(item.images?.[0]), // fallback image
          brand: item.brand,
          name: item.name,
          size: item.wheelSpecifications
            ? `${item.wheelSpecifications.size}" ${item.wheelSpecifications.diameter}"`
            : "N/A",
          price: item.price,
          pricetext: item.pricetext,
          rating: 4, // API doesn't return rating → you can adjust
          stock: item.stock || 0, // Add stock information
        }));

        setProducts(mappedProducts);
        setTotalPages(pagination.totalPages || 1);

        // Set error state if no products are found
        if (mappedProducts.length === 0) {
          setError("Product not found");
        }
      } catch (error) {
        console.error("Error fetching wheels:", error);
        setProducts([]);
        setTotalPages(1);
        setError("Product not found");
      } finally {
        setLoading(false);
      }
    };

    fetchWheels();
  }, [currentPage, pageSize, brand, size, color, diameter, fitments, price, search]); // Add search to dependency array

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentPage]);

  if (loading) {
    return <Loader label="Loading wheels..." />;
  }

  // Show error message if there's an error and no products to display
  if (error && products.length === 0) {
    return (
      <main className="bg-[#F3F3F3]">
        <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 lg:px-8">
          <BreadcrumbSection category="wheel" />
          <div className="py-6 sm:py-8">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              {/* Left Sidebar */}
              <div className="w-full lg:w-auto lg:flex-shrink-0">
                <WheelFilterSidebar />
              </div>

              {/* Right Content */}
              <div className="flex-1">
                <div className="mb-6 sm:mb-8">
                  <h2 className="text-2xl sm:text-3xl font-lexend font-regular text-black py-3 pb-8">
                    Wheels
                  </h2>
                  <p className="text-sm sm:text-base font-lexend font-regular text-[#7A7A7A] max-w-xl">
                    Browse our large selection of premium wheels that are designed to improve the performance, handling and the overall look of your car.
                  </p>
                </div>

                {/* Error Message */}
                <div className="flex flex-col items-center justify-center py-16 px-4">
                  <div className="mb-6">
                    <svg
                      className="w-24 h-24 text-[#ED1C24] mx-auto"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-lexend font-semibold text-gray-800 mb-2">
                    Sorry, no products were found
                  </h3>
                  <p className="text-base font-lexend text-gray-600 max-w-md text-center mb-6">
                    We couldn't find any wheels matching your current selection.
                    Please try adjusting your filters or check back later.
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-3 bg-[#ED1C24] text-white font-lexend font-medium rounded-lg hover:bg-[#d11920] transition-colors duration-300"
                  >
                    Refresh Page
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="sm:ps-96">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>

          <HeroBanner />
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#F3F3F3]">
      <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 lg:px-8">
        <BreadcrumbSection category="wheel" />
        <div className="py-6 sm:py-8">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Left Sidebar */}
            <div className="w-full lg:w-auto lg:flex-shrink-0">
              <WheelFilterSidebar />
            </div>

            {/* Right Content */}
            <div className="flex-1">
              <div className="mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl font-lexend font-regular text-black py-3 pb-8">
                  Wheels
                </h2>
                <p className="text-sm sm:text-base font-lexend font-regular text-[#7A7A7A] max-w-xl">
                  Browse our large selection of premium wheels that are designed to improve the performance, handling and the overall look of your car.
                </p>
              </div>

              {/* Product Grid */}
              <TyreGrid products={products} />
            </div>
          </div>
        </div>

        <div className="sm:ps-96">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>

        <HeroBannerWheel />
      </div>
    </main>
  );
}

export default Wheels;