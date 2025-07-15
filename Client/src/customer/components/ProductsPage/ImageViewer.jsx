import React, { useEffect, useState } from 'react';

const ProductImageViewer = ({ images }) => {
  const [imageArray, setImageArray] = useState(images);
const [hoveredImage, setHoveredImage] = useState(images[0]);

useEffect(() => {
  setHoveredImage(images[0]);
  setImageArray(images);
}, [images]);

 return (
    <div className="flex flex-col md:flex-row gap-x-2 gap-y-2">
      <div className="flex flex-row md:flex-col gap-[7px] flex-wrap">
        {imageArray.map((image, index) => (
          <img
            key={index}
            src={image}
            alt="productImg"
            className="max-h-[75px] cursor-pointer ring-1 ring-black rounded-md"
            onMouseEnter={() => setHoveredImage(image)}
          />
        ))}
      </div>
      <div>
        <img src={hoveredImage} alt="productImg" className="max-w-[400px] ring-1 ring-black rounded-md" />
      </div>
    </div>
 );
};

export default ProductImageViewer;