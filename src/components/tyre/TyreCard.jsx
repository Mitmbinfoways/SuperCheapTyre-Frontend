import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { secureGetItem, secureSetItem } from '../../Utils/encryption';

const TyreCard = ({
  id,
  _id, // Also accept _id for consistency
  image,
  brand,
  name,
  size,
  price,
  rating,
}) => {
  const navigate = useNavigate();
  
  // Use either id or _id for consistency
  const productId = id || _id;

  const renderStars = () => {
    const SolidStar = ({ size = 20, className = '' }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 17.27L18.18 21 16.54 13.97 22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z" />
      </svg>
    );
    return Array.from({ length: 5 }, (_, index) => (
      <SolidStar
        key={index}
        className={`w-4 h-4 ${index < rating ? 'fill-[#FF9D00] text-[#FF9D00]' : 'fill-[#DADADA] text-[#DADADA]'
          }`}
      />
    ));
  };
    
  const handleCardClick = () => {
    navigate(`/productdetails/${id}`); // Pass the id in URL
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    const cart = secureGetItem('cartItems', []);
    const existingIndex = cart.findIndex((ci) => ci.id === productId);
    if (existingIndex >= 0) {
      cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + 1;
    } else {
      cart.push({ 
        id: productId, 
        image, 
        name: name || brand || 'Tyre', 
        brand, 
        size, 
        price, 
        quantity: 1,
        description: `${brand || ''} ${name || ''}`.trim() || 'Tyre Product'
      });
    }
    secureSetItem('cartItems', cart);
    localStorage.setItem('cartCount', String(cart.reduce((s, it) => s + (it.quantity || 1), 0)));
    toast.success('Added to cart');
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

      {/* Product Info */}
      <div className="">
        <div className="space-y-1">
          <h3 className="text-xl font-lexend font-medium text-[#ED1C24]">{brand}</h3>
          <p className="text-sm text-[#7A7A7A] font-roboto">{name}</p>
          <p className="text-sm text-[#7A7A7A] font-roboto">
            <span className="font-bold">Size:</span> <span className="font-normal">{size}</span>
          </p>
        </div>

        <div className="flex items-center space-x-1 py-1">
          {renderStars(rating)}
        </div>

        <div className="text-lg font-lexend font-medium text-black pb-5">
          ${price}
        </div>
      </div>

      {/* Add to Cart Button */}
      <div className=" flex items-center absolute bottom-0 left-1/2 translate-y-1/2 -translate-x-1/2 justify-center space-x-4">
        <button
          className="bg-[#ED1C24]  text-white rounded-lg sm:py-3 py-2 sm:px-8 px-4 text-nowrap font-lexend font-medium text-sm hover:bg-red-700 transition-colors"
          onClick={handleAddToCart}
        >
          Add To Cart
        </button>
      </div>
    </div>
  );
};

export default TyreCard;