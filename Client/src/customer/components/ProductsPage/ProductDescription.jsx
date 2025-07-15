import React, { useState } from "react";
// import SizeChart from '../assets/sizechart.png';
import floral2 from "../../../assets/floral2.svg";

const ProductDescription = ({ product }) => {
  const [showDetails, setShowDetails] = useState(true); // State to manage which content to show

  // Function to handle button clicks
  const handleButtonClick = (contentType) => {
    setShowDetails(contentType === "description");
  };

  return (
    <div className="mt-10">
      <div className="flex gap-3 mb-4 justify-center items-center">
        <button
          className="btn_dark_rounded font-anta !rounded !text-xs !py-[6px] w-36"
          onClick={() => handleButtonClick("description")}
        >
          Description
        </button>
        {/* <button className='btn_light_rounded font-anta !rounded !text-xs !py-[6px] w-36'>Care Guide</button> */}
        <button
          className="btn_light_rounded font-anta !rounded !text-xs !py-[6px] w-36"
          onClick={() => handleButtonClick("sizeGuide")}
        >
          Size Guide
        </button>
      </div>
      <div className="pt-6 flex gap-x-2 medium-16 mb-4 w-full h-auto justify-center items-center">
        {showDetails ? (
          <p className="text-black text-sm break-words max-w-full sm:max-w-[20rem] md:max-w-[28rem] lg:max-w-[36rem] xl:max-w-[44rem]">
            {product.description}
          </p>
        ) : (
          /*  <div className="pt-6 flex gap-x-2 medium-16 mb-4 w-80 h-auto justify-center items-center">
        {showDetails ? (
          <p className="text-black text-sm">{product.description}</p> */
          /*  <img src={floral2} alt="Size Guide" className="w-[50%] h-auto" /> */
          <div className="w-full flex flex-col items-center">
            {/* <h4 className="font-anta text-black mb-2">Size Guide</h4> */}
            {/* Example table, replace with your actual size guide */}
            <table className="text-black text-xs border border-gray-300">
              <thead>
                <tr>
                  <th className="border px-2 py-1">Inch Size</th>
                  <th className="border px-2 py-1">Centimeters (cm)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-2 py-1">18"</td>
                  <td className="border px-2 py-1">
                    {(18 * 2.54).toFixed(1)} cm
                  </td>
                </tr>
                <tr>
                  <td className="border px-2 py-1">20"</td>
                  <td className="border px-2 py-1">
                    {(20 * 2.54).toFixed(1)} cm
                  </td>
                </tr>
                <tr>
                  <td className="border px-2 py-1">22"</td>
                  <td className="border px-2 py-1">
                    {(22 * 2.54).toFixed(1)} cm
                  </td>
                </tr>
                <tr>
                  <td className="border px-2 py-1">24"</td>
                  <td className="border px-2 py-1">
                    {(24 * 2.54).toFixed(1)} cm
                  </td>
                </tr>
                <tr>
                  <td className="border px-2 py-1">25"</td>
                  <td className="border px-2 py-1">
                    {(25 * 2.54).toFixed(1)} cm
                  </td>
                </tr>
                <tr>
                  <td className="border px-2 py-1">27"</td>
                  <td className="border px-2 py-1">
                    {(27 * 2.54).toFixed(1)} cm
                  </td>
                </tr>
                <tr>
                  <td className="border px-2 py-1">29"</td>
                  <td className="border px-2 py-1">
                    {(29 * 2.54).toFixed(1)} cm
                  </td>
                </tr>
              </tbody>
            </table>
            {/* Or, if you want to keep the image as well: */}
            {/* <img src={floral2} alt="Size Guide" className="w-[50%] h-auto mt-4" /> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDescription;
