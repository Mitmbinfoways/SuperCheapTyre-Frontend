import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Trash2, Plus, Minus } from 'lucide-react';
import { RiDeleteBin5Fill, RiDeleteBinFill, RiDeleteBinLine } from "react-icons/ri";
import { formatCurrency } from '../../Utils/Utils';

const CartItem = ({ item, productStock, loadingStock, onQuantityChange, onRemove }) => {
  const router = useRouter();

  const isIncrementDisabled = loadingStock || (productStock !== undefined && item.quantity >= productStock);

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-shrink-0 w-full sm:w-32 h-32 rounded-lg flex items-center justify-center cursor-pointer border border-black" onClick={() => router.push(`/productdetails/${item.id}`)}>
        <Image
          src={item.image}
          alt={item.name}
          width={112}
          height={112}
          className="w-28 h-28 object-contain"
        />
      </div>
      <div className="flex-grow flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-col justify-between cursor-pointer" onClick={() => router.push(`/productdetails/${item.id}`)}>
          <div>
            <h3 className="font-lexend text-xl">{item.name}</h3>
            {item.type !== 'service' ? <p className=" flex font-lexend text-sm mt-1 text-[#8C8C8C] gap-1"><p className='text-[#888888] font-bold'>Size:</p> {item.size}</p> : null}
            <p className="font-roboto text-[#8C8C8C] text-base">{item.description}</p>
          </div>
          {item.type === 'service' ? (
            <p className="font-bold text-gray-900 mb-3 text-xl">
              Starting From AU${item.price} <sup className='text-sm'>EA</sup>
            </p>
          ) : (
            <p className="font-satoshi font-bold text-2xl mt-2 sm:mt-0 text-[#000000]">{formatCurrency(item.price)}</p>
          )}
        </div>
        <div className="flex flex-col justify-between items-start sm:items-end">
          <button onClick={() => onRemove(item.id)} className="text-primary hover:text-red-700">
            <RiDeleteBinFill size={24} fill='red' className='' />
          </button>
          <div className="flex items-center gap-5 bg-[#F0F0F0] rounded-full px-5 py-3 mt-2">
            <button
              onClick={() => onQuantityChange(item.id, item.quantity - 1)}
              className={item.quantity === 1 ? "text-gray-400" : "text-black"}
              disabled={item.quantity === 1}
            >
              <Minus size={20} />
            </button>
            <span className="font-satoshi font-medium text-sm w-4 text-center">{item.quantity}</span>
            <button
              onClick={() => onQuantityChange(item.id, item.quantity + 1)}
              className={isIncrementDisabled ? "text-gray-400" : "text-black"}
              disabled={isIncrementDisabled}
            >
              <Plus size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;