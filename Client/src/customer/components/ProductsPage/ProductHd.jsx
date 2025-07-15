import React from "react";
// import {TbArrowRight} from 'react-icons/tb';
// import { FaGreaterThan } from "react-icons/fa6";
import { FaGreaterThan } from "react-icons/fa";

const ProductHd = ({ product }) => {
  return (
    <div className="flex py-10 text-black items-center flex-wrap gap-x-2 medium-16">
      Home <FaGreaterThan /> Shop <FaGreaterThan /> {product.category.name}{" "}
      <FaGreaterThan /> {product.name}
    </div>
  );
};

export default ProductHd;
