import { useNavigate } from "react-router-dom";
import { secureGetItem, secureSetItem } from "../../Utils/encryption";
import { Toast } from "../../Utils/Toast";
import { formatCurrency } from "../../Utils/Utils";
import Badge from "../../components/common/Badge";

const TyreCard = ({
  id,
  _id,
  image,
  brand,
  name,
  size,
  price,
  pricetext,
  // rating,
  stock = 0,
  isPopular,
}) => {
  const navigate = useNavigate();

  // Use either id or _id for consistency
  const productId = String(id || _id);

  // const renderStars = () => {
  //   const SolidStar = ({ size = 20, className = "" }) => (
  //     <svg
  //       width={size}
  //       height={size}
  //       viewBox="0 0 24 24"
  //       className={className}
  //       fill="currentColor"
  //       xmlns="http://www.w3.org/2000/svg"
  //     >
  //       <path d="M12 17.27L18.18 21 16.54 13.97 22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z" />
  //     </svg>
  //   );
  //   return Array.from({ length: 5 }, (_, index) => (
  //     <SolidStar
  //       key={index}
  //       className={`w-4 h-4 ${
  //         index < rating
  //           ? "fill-[#FF9D00] text-[#FF9D00]"
  //           : "fill-[#DADADA] text-[#DADADA]"
  //       }`}
  //     />
  //   ));
  // };

  const handleCardClick = () => {
    navigate(`/productdetails/${id}`); // Pass the id in URL
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();

    // Prevent adding to cart if required props are missing
    if (productId === undefined || image === undefined || price === undefined) {
      Toast({ message: "Invalid product data", type: "error" });
      return;
    }

    // Prevent adding to cart if stock is 0
    if (stock === 0) {
      Toast({ message: "This product is out of stock", type: "error" });
      return;
    }

    const cart = secureGetItem("cartItems", []);
    const existingIndex = cart.findIndex((ci) => String(ci.id) === productId);

    // Check if adding this item would exceed stock
    if (existingIndex >= 0) {
      const newQuantity = (cart[existingIndex].quantity || 1) + 1;
      if (newQuantity > stock) {
        Toast({
          message: `Maximum available is quantity ${stock}`,
          type: "error",
        });
        return;
      }
      cart[existingIndex].quantity = newQuantity;
    } else {
      // Check if we can add this item (stock > 0)
      if (stock > 0) {
        cart.push({
          id: productId,
          image,
          name: name || brand || "Tyre",
          brand,
          size,
          price,
          quantity: 1,
          description: `${brand || ""} ${name || ""}`.trim() || "Tyre Product",
        });
      } else {
        Toast({ message: "This product is out of stock", type: "error" });
        return;
      }
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
    <div
      className="bg-white sm:p-6 p-3 space-y-8 relative  w-full max-w-[15rem] sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto  rounded-2xl shadow-[0px_0px_4px_0px_#00000040] group hover:shadow-[0px_0px_8px_1px_#00000040] transition-shadow cursor-pointer"
      // onClick={() => navigate('/productdetails')}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
    >
      {/* Product Image */}
      <div className="bg-white rounded-t-3xl flex items-center justify-center">
        <img
          src={image}
          alt={`${brand} ${name}`}
          className="w-32 h-32 sm:w-40 sm:h-40 lg:w-56 lg:h-56 object-contain"
        />
      </div>

      {stock === 0 && (
        <div className="absolute -top-5 right-3">
          <Badge label="Out of Stock" color="red" />
        </div>
      )}
      {stock >= 1 && stock <= 5 && (
        <div className="absolute -top-5 right-3">
          <Badge label="Low Stock" color="yellow" />
        </div>
      )}
      {stock > 5 && (
        <div className="absolute -top-5 right-3 bg-[#4CAF50] text-white text-xs font-bold px-2 py-1 rounded-lg shadow-sm uppercase">
          {stock} IN STOCK NOW
        </div>
      )}

      {/* Product Info */}
      <div className="">
        <div className="space-y-1">
          <h3 className="text-xl font-lexend font-medium text-[#ED1C24] line-clamp-1">
            {name}
          </h3>
          <div className="w-full flex items-center justify-between">
            <p className="w-full text-sm text-[#7A7A7A] font-roboto line-clamp-2">
              {brand}
            </p>
            {isPopular && (
              <p>
                <Badge label="Popular" color="blue" />
              </p>
            )}
          </div>
          <p className="text-sm text-[#7A7A7A] font-roboto">
            <span className="font-bold">Size:</span>{" "}
            <span className="font-normal">{size}</span>
          </p>
        </div>

        {/* <div className="flex items-center space-x-1 py-1">
          {renderStars(rating)}
        </div> */}

        <div className="text-lg font-lexend font-medium text-black pb-5">
          {formatCurrency(price)}
          <p className="text-xs text-[#7A7A7A] mt-1 line-clamp-1">
            {pricetext}
          </p>
        </div>
      </div>
      {/* Add to Cart Button - Disabled when out of stock */}
      <div className=" flex items-center absolute bottom-0 left-1/2 translate-y-1/2 -translate-x-1/2 justify-center space-x-4">
        <button
          className={`text-white rounded-lg sm:py-3 py-2 sm:px-8 px-4 text-nowrap font-lexend font-medium text-sm transition-colors ${stock === 0
            ? "bg-[#D7D7D7]  cursor-not-allowed"
            : "bg-[#ED1C24]  hover:bg-red-700 cursor-pointer"
            }`}
          onClick={handleAddToCart}
          disabled={stock === 0}
        >
          Add To Cart
        </button>
      </div>
    </div>
  );
};

export default TyreCard;
