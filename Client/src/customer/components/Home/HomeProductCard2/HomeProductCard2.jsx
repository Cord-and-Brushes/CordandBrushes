import React from "react";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

const HomeProductCard2 = ({
  productId,
  imgUrl,
  price,
  oldPrice,
  productTitle,
  available,
}) => {
  const discountPercentage = oldPrice
    ? Math.round(((oldPrice - price) / oldPrice) * 100)
    : 0;

  return (
    <div className="card123 rounded-xl overflow-hidden shadow-lg bg-white transition-transform duration-300 hover:scale-105">
      <div className="bg flex flex-col">
        <div className="relative flexCenter group overflow-hidden transition-all duration-300">
          <Link
            to={`/product/${productId}`}
            className="h-12 w-12 bg-white rounded-full flexCenter absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 scale-0 group-hover:scale-100 transition-transform duration-500 z-20"
          >
            <FaSearch className="hover:rotate-90 hover:scale-125 transition-transform duration-200" />
          </Link>
          <img
            onClick={() => window.scrollTo(0, 0)}
            src={imgUrl}
            alt={productTitle}
            className="w-full h-[250px] object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
        <div className="p-4">
          <h4 className="text-black font-bold text-lg mb-2">{productTitle}</h4>
          <div className="flex justify-between">
            {available ? (
              <p className="text-green-500 font-semibold">In Stock</p>
            ) : (
              <p className="text-red-500">Out of Stock</p>
            )}
            {discountPercentage > 0 && (
              <div className="font-semibold text-sm">
                {discountPercentage}% Off
              </div>
            )}
          </div>
          <div className="flex flex-col mb-2">
            <div className="flex justify-between">
              <div className="text-black font-bold text-md">&#8377;{price}</div>
              {oldPrice && (
                <div className="text-red-500 font-semibold text-md line-through mr-2">
                  &#8377;{oldPrice}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="blob"></div>
    </div>
  );
};

export default HomeProductCard2;
