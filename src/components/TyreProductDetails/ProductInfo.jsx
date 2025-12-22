import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "./ui/Button";
import QuantityInput from "./ui/QuantityInput";
import { secureGetItem, secureSetItem } from "../../Utils/encryption";
import { getTyreImageUrl } from "../../Utils/Utils";
import { Toast } from "../../Utils/Toast";
import WheelProductInfo from "./WheelProductInfo";
// Import React Icons from appropriate libraries
import { FaWeight, FaTachometerAlt } from "react-icons/fa";
import { GiWeightScale } from "react-icons/gi";
import { MdSpeed } from "react-icons/md";
import { BsSpeedometer2 } from "react-icons/bs";
import { getTyreSize, getAllMasterFilters } from "../../axios/axios";

const ProductInfo = ({ product }) => {
  const navigate = useNavigate();

  // Check if this is a wheel product
  const isWheelProduct = product.category === "wheel";

  // If it's a wheel product, render the wheel-specific component
  if (isWheelProduct) {
    return <WheelProductInfo product={product} navigate={navigate} />;
  }

  // Otherwise, render the tyre-specific component (existing logic)
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("specification");
  const [relatedData, setRelatedData] = useState([]);
  const [masterFilters, setMasterFilters] = useState([]);

  const fetchdata = async () => {
    try {
      const [res, filtersRes] = await Promise.all([
        getTyreSize(product?._id),
        getAllMasterFilters({ limit: 1000 })
      ]);
      setRelatedData(res.data.data);
      setMasterFilters(filtersRes.data.data.items || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchdata();
  }, [product?._id]);

  const getFilterValue = (val, subCat = "") => {
    if (!val) return "N/A";
    const filter = masterFilters.find(
      (f) => f._id === val || f.values === val
    );
    // If we have a subcategory, we can be more specific, but ID should be unique enough usually. 
    // Ideally we match category too if passed, but for display valid ID is likely enough.
    return filter ? filter.values : val;
  };

  const productStock = product?.stock || 0;

  const specifications = [
    {
      label: "Brand :",
      value: product?.brand || "N/A",
      icon: "/productdetails/brand.svg",
    },
    // {
    //   label: "Size :",
    //   value: product?.tyreSpecifications
    //     ? `${product.tyreSpecifications.width}/${
    //         product.tyreSpecifications.profile
    //       }${" "}${product.tyreSpecifications.diameter}${" "}${
    //         product.tyreSpecifications.loadRating
    //       }${product.tyreSpecifications.speedRating}`
    //     : "N/A",
    //   icon: "/productdetails/size.svg",
    // },
    // { label: 'Bolt pattern :', value: 'Bolt pattern', icon: '/productdetails/bolt.svg' },
    // { label: 'Offset :', value: 'offset', icon: '/productdetails/Offset.svg' },
    {
      label: "Pattern :",
      value: getFilterValue(product?.tyreSpecifications?.pattern),
      icon: "/productdetails/tread.svg",
    },
    {
      label: "Stock :",
      value:
        productStock === 0 ? (
          <p className="text-red-600 ml-3">Out of stock</p>
        ) : (
          productStock
        ),
      icon: "/productdetails/stock.svg",
    },
  ];

  // Add individual tyre specification fields
  if (product?.tyreSpecifications) {
    specifications.splice(1, 0,
      {
        label: "Width :",
        value: getFilterValue(product.tyreSpecifications.width),
        icon: <FaWeight className="w-[20px] h-[20px] text-gray-700" />,
      },
      {
        label: "Profile :",
        value: getFilterValue(product.tyreSpecifications.profile),
        icon: <BsSpeedometer2 className="w-[20px] h-[20px] text-gray-700" />,
      },
      {
        label: "Diameter :",
        value: getFilterValue(product.tyreSpecifications.diameter),
        icon: <GiWeightScale className="w-[20px] h-[20px] text-gray-700" />,
      },
      {
        label: "Load Rating :",
        value: getFilterValue(product.tyreSpecifications.loadRating),
        icon: <FaTachometerAlt className="w-[20px] h-[20px] text-gray-700" />,
      },
      {
        label: "Speed Rating :",
        value: getFilterValue(product.tyreSpecifications.speedRating),
        icon: <MdSpeed className="w-[20px] h-[20px] text-gray-700" />,
      }
    );
  }

  const handleQuantityChange = (newQuantity) => {
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    // Prevent adding to cart if stock is 0
    if (!product || productStock === 0) {
      Toast({ message: "This product is out of stock", type: "error" });
      return;
    }

    // Check if the requested quantity exceeds available stock
    if (!product || quantity > productStock) {
      Toast({
        message: `Maximum quantity available is ${productStock}`,
        type: "error",
      });
      return;
    }

    const cart = secureGetItem("cartItems", []);
    const productId = String(product?.id || product?._id || "");
    const existingIndex = cart.findIndex((ci) => String(ci.id) === productId);

    if (existingIndex >= 0) {
      // Check if adding this quantity would exceed stock
      const newQuantity = (cart[existingIndex].quantity || 1) + quantity;
      if (newQuantity > productStock) {
        Toast({
          message: `Maximum quantity available is ${productStock}`,
          type: "error",
        });
        return;
      }
      cart[existingIndex].quantity = newQuantity;
    } else {
      cart.push({
        id: productId,
        image: product?.images?.[0]
          ? getTyreImageUrl(product.images[0])
          : "/cart/carttyre.svg",
        name: product?.name || "Tyre",
        brand: product?.brand || "Unknown",
        size: product?.tyreSpecifications
          ? `${getFilterValue(product.tyreSpecifications.width)}/${getFilterValue(product.tyreSpecifications.profile)} ${getFilterValue(product.tyreSpecifications.diameter)} ${getFilterValue(product.tyreSpecifications.loadRating)}${getFilterValue(product.tyreSpecifications.speedRating)}`
          : "N/A",
        price: product?.price || 0,
        quantity,
        description:
          `${product?.brand || ""} ${product?.name || ""
            }`.trim() || "Tyre Product",
      });
    }
    try {
      secureSetItem("cartItems", cart);
      localStorage.setItem(
        "cartCount",
        String(cart.reduce((s, it) => s + (it.quantity || 1), 0))
      );
      Toast({ message: "Added to cart", type: "success" });

      // Redirect to cart page
      navigate("/cart");
    } catch (error) {
      console.error("Error adding item to cart:", error);
      Toast({ message: "Failed to add item to cart", type: "error" });
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col gap-[8px] sm:gap-[12px] md:gap-[14px] lg:gap-[16px] w-full">
        {/* Product Specifications */}
        <div className="flex flex-col w-full">
          {/* Specification Header */}
          {/* <div className="flex justify-center items-center w-auto border border-white mb-[-2px]">
                
              </div> */}

          {/* Specifications List */}
          <div className="border border-[#e0e0e0] rounded-[14px] bg-white px-[16px] sm:px-[18px] md:px-[20px] lg:px-[22px] py-[10px]">
            <div className="flex gap-6 border-b border-gray-200 mb-4 px-[6px]">
              <button
                className={`text-[18px] sm:text-[19px] md:text-[20px] font-medium leading-[23px] sm:leading-[24px] md:leading-[25px] font-['Lexend'] py-[12px] transition-colors relative ${activeTab === "specification"
                  ? "text-[#ed1c24]"
                  : "text-gray-500 hover:text-gray-700"
                  }`}
                onClick={() => setActiveTab("specification")}
              >
                Product Specification
                {activeTab === "specification" && (
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#ed1c24]" />
                )}
              </button>
              <button
                className={`text-[18px] sm:text-[19px] md:text-[20px] font-medium leading-[23px] sm:leading-[24px] md:leading-[25px] font-['Lexend'] py-[12px] transition-colors relative ${activeTab === "tyreSize"
                  ? "text-[#ed1c24]"
                  : "text-gray-500 hover:text-gray-700"
                  }`}
                onClick={() => setActiveTab("tyreSize")}
              >
                Other Size
                {activeTab === "tyreSize" && (
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#ed1c24]" />
                )}
              </button>
            </div>
            {activeTab === "specification" ? specifications?.map((spec, index) => (
              <div
                key={index}
                className={`flex justify-start items-center w-full ${index > 0 ? "mt-[-2px]" : ""
                  } ${index === specifications?.length - 1 ? "mb-[8px]" : ""}`}
              >
                {typeof spec?.icon === 'string' ? (
                  <img
                    src={spec?.icon}
                    alt="specification icon"
                    className="w-[20px] h-[20px] object-contain flex-shrink-0"
                  />
                ) : (
                  spec?.icon
                )}
                <span className="text-[14px] sm:text-[15px] font-normal leading-[18px] sm:leading-[19px] md:leading-[20px] font-['Lexend'] text-black border border-white py-[10px] px-[10px] w-[140px] flex-shrink-0">
                  {spec?.label}
                </span>
                <Button
                  text={spec?.value}
                  text_font_size="16"
                  text_font_family="Lexend"
                  text_font_weight="400"
                  text_line_height="20px"
                  text_color="#6e6d6d"
                  border_border="1px solid #ffffff"
                  padding="10px"
                  margin="0 0 0 14px"
                />
              </div>
            )) : activeTab === "tyreSize" && (
              relatedData?.length > 0 ? (
                <div className="grid xl:grid-cols-4 lg:grid-cols-3 grid-cols-2 gap-3 max-h-72 overflow-y-auto h-fit ">
                  {relatedData.map((item) => (
                    <div key={item._id} >
                      <Link to={isWheelProduct ? `/wheel/${item._id}` : `/productdetails/${item._id}`}>
                        <div className="hover:underline underline-offset-2">
                          {getFilterValue(item?.tyreSpecifications?.width)}/
                          {getFilterValue(item?.tyreSpecifications?.profile)}
                          {getFilterValue(item?.tyreSpecifications?.diameter)}<br />
                          {getFilterValue(item?.tyreSpecifications?.loadRating)}
                          {getFilterValue(item?.tyreSpecifications?.speedRating)}
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex justify-center items-center h-36 w-full">
                  <p className="text-gray-500 font-['Lexend'] text-lg">No tyre found</p>
                </div>
              )
            )}
          </div>
        </div>

        {/* Quantity Selection */}
        {productStock > 0 && (
          <div className="flex justify-center items-center w-full py-[10px] px-[10px]">
            <span className="flex-none text-[18px] sm:text-[19px] md:text-[20px] font-medium leading-[23px] sm:leading-[24px] md:leading-[25px] font-['Lexend'] text-black">
              Quantity :
            </span>
            <div className="flex justify-start items-center w-full ml-[10px]">
              <QuantityInput
                initialValue={quantity}
                min={1}
                max={productStock}
                onChange={handleQuantityChange}
                className="px-3"
              />
            </div>
          </div>
        )}

        {product && productStock >= 1 && productStock <= 5 && (
          <p className="text-yellow-600 ml-3">
            Only {productStock} left in stock!
          </p>
        )}

        <Button
          text="Add To Cart"
          text_font_size="16"
          text_font_family="Lexend"
          text_font_weight="600"
          text_line_height="20px"
          text_color="#ffffff"
          fill_background_color={(!product || productStock === 0) ? "#D7D7D7" : "#ed1c24"}
          border_border_radius="10px"
          layout_width="100%"
          padding="14px 34px"
          onClick={handleAddToCart}
          disabled={!product || productStock === 0}
          className={(!product || productStock === 0) ? "cursor-not-allowed" : ""}
          layout_align_self=""
          position=""
          variant=""
          size=""
          margin=""
        />
      </div>
    </div>
  );
};

export default ProductInfo;