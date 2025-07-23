import React, { useState } from "react";

const SizeSelector = ({ onSizeSelected, setErrorMessage, sizes }) => {
  const [selectedSize, setSelectedSize] = useState(null);
  const [unavailableSize, setUnavailableSize] = useState("");

  // Support both array of strings and array of objects with available property
  const sizeData = [
    "18'inch",
    "20'inch",
    "22'inch",
    "24'inch",
    "25'inch",
    "27'inch",
    "29'inch",
  ];

  // Build a lookup for available sizes
  const availableSizes = Array.isArray(sizes)
    ? sizes.map((s) => (typeof s === "object" ? s.size : s))
    : [];
  const sizeAvailability = Array.isArray(sizes)
    ? sizeData.map((size) => {
        const found = sizes.find((s) =>
          typeof s === "object" ? s.size === size : s === size
        );
        return typeof found === "object" ? found.available !== false : !!found;
      })
    : sizeData.map(() => false);

  const handleSizeClick = (size, isAvailable) => {
    setSelectedSize(size);
    onSizeSelected(size, isAvailable);
    if (isAvailable) {
      setErrorMessage("");
      setUnavailableSize("");
    } else {
      setErrorMessage("");
      setUnavailableSize(size);
    }
  };

  return (
    <div className="mb-4">
      <h4 className="bold-16 text-black">Select Size:</h4>
      <div className="grid grid-cols-4 lg:grid-cols-4 gap-6 lg:w-[500px] my-3 text-black">
        {sizeData.map((size, index) => {
          const isAvailable = sizeAvailability[index];
          const isSelected = selectedSize === size;
          return (
            <div
              key={index}
              className={`size-button h-10 w-20 flex items-center justify-center rounded-md transition-colors duration-200
                ${
                  isSelected && isAvailable
                    ? "bg-green-500 text-white ring-2 ring-green-500"
                    : ""
                }
                ${
                  isSelected && !isAvailable
                    ? "bg-gray-400 text-white ring-2 ring-gray-400"
                    : ""
                }
                ${
                  !isSelected && isAvailable ? "ring-2 ring-black bg-white" : ""
                }
                ${
                  !isSelected && !isAvailable
                    ? "opacity-50 cursor-not-allowed bg-gray-200 ring-2 ring-gray-300 text-gray-500"
                    : ""
                }
              `}
              onClick={() => handleSizeClick(size, isAvailable)}
            >
              {size}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SizeSelector;
