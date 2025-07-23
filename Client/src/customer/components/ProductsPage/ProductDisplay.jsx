import React, { useContext, useEffect, useState } from "react";
import ProductImageViewer from "./ImageViewer";
import { MdStar, MdStarBorder, MdStarHalf } from "react-icons/md";
import SizeSelector from "./SizeSelector";
import ProductDescription from "./ProductDescription";
import MyButton from "../common/Button/Button";
import { handleProductBuy } from "../../Pages/Redrect/Whatsapp";
import { useSelector } from "react-redux";
import api from "../../../api/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductDisplay = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState(null);
  const [sizeAvailable, setSizeAvailable] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [sizeErrorMessage, setSizeErrorMessage] = useState("");
  const [userRating, setUserRating] = useState(() => {
    // Try to load user's rating for this product from localStorage
    const saved = localStorage.getItem(`userRating_${product._id}`);
    return saved ? Number(saved) : 0;
  });
  /* const [userFeedback, setUserFeedback] = useState(""); */
  /* const [submitted, setSubmitted] = useState(false); */
  const user = useSelector((state) => state.auth.user);

  const oldPrice = Number(product.old_price);
  const newPrice = Number(product.new_price);
  const discountPercentage =
    oldPrice > 0 ? ((oldPrice - newPrice) / oldPrice) * 100 : 0;

  // Calculate average rating
  let ratingsArr = Array.isArray(product.ratings)
    ? product.ratings.map((r) => (typeof r === "number" ? r : r.rating))
    : [];
  const averageRating = product.averageRating || 0;
  const totalRatings = product.totalRatings || 0;

  //console.log(product);

  // Handler for size selection, checks if selected size is available
  const handleSizeSelected = (size, isAvailable) => {
    setSelectedSize(size);
    if (!isAvailable) {
      setSizeAvailable(false);
      setSizeErrorMessage("Not Available");
    } else {
      setSizeAvailable(true);
      setSizeErrorMessage("");
    }
  };

  const handleRatingSubmit = async (ratingValue) => {
    if (!user) {
      setErrorMessage("You must be logged in to rate.");
      toast.error("You must be logged in to rate.", {
        position: "bottom-right",
        autoClose: 3000,
        theme: "dark",
      });
      return;
    }
    const getAuthToken = () => {
      return localStorage.getItem("token") || authToken;
    };
    const token = getAuthToken();
    try {
      const res = await api.post(
        `/api/products/${product._id}/rate`,
        { rating: ratingValue },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      //console.log(res);
      setUserRating(ratingValue);
      localStorage.setItem(`userRating_${product._id}`, ratingValue);
      setErrorMessage("");
      toast.success("Rating submitted!", {
        position: "bottom-right",
        autoClose: 3000,
        theme: "dark",
      });
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to submit rating.");
      toast.error("Failed to submit rating.", {
        position: "bottom-right",
        autoClose: 3000,
        theme: "dark",
      });
    }
  };

  // Load user's rating from localStorage on mount (in case product changes)
  useEffect(() => {
    const saved = localStorage.getItem(`userRating_${product._id}`);
    if (saved) setUserRating(Number(saved));
  }, [product._id]);

  const handleEnquiryClick = () => {
    if (!user) {
      toast.error("You must be logged in to enquire about the product.", {
        position: "bottom-right",
        autoClose: 3000,
        theme: "dark",
      });
      return;
    }
    handleProductBuy(product, user);
  };

  return (
    <section className="pt-10 md:py-0">
      <div className="flex flex-col gap-14 xl:flex-row">
        {/* LEFT SECTION */}
        <div className="sticky flex flex-col justify-start items-center">
          {product.images && product.images.length > 0 && (
            <ProductImageViewer images={product.images} />
          )}
          <div className="flex gap-x-6 mt-4">
            <MyButton
              onClick={handleEnquiryClick}
              // disabled={!selectedSize}
              buttonText={"Enquiry for buy"}
              className="btn_outline !rounded hover:bg-green-300 hover:text-black hover:border-black uppercase regular-14 font-anta tracking-widest"
            />
          </div>
          {/* User Rating Input (no average here) */}
          <div className="flex flex-col gap-2 mt-4 w-full items-center">
            <h2>Rate this product:</h2>
            <div className="flex gap-x-1 items-center justify-center">
              {[1, 2, 3, 4, 5].map((i) => (
                <span
                  key={i}
                  onClick={() => handleRatingSubmit(i)}
                  className="cursor-pointer"
                  style={{ minWidth: 20, minHeight: 20 }}
                >
                  {i <= userRating ? (
                    <MdStar className="text-orange-500" />
                  ) : (
                    <MdStarBorder className="text-gray-400" />
                  )}
                </span>
              ))}
            </div>
            {userRating > 0 && (
              <span className="mt-1 text-black font-semibold text-sm">
                You rated: {userRating}
              </span>
            )}
            {errorMessage && (
              <p className="text-red-500 mt-2 text-sm">{errorMessage}</p>
            )}
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex flex-col lg:w-3/5 overflow-visible p-4">
          <h3 className="h3 mb-0 text-black font-trucu">{product.name}</h3>
          <p className="text-black">
            <span className="medium-16 text-[black]">Category :</span>{" "}
            {typeof product.category === "object"
              ? product.category?.name
              : product.category || "Uncategorized"}
          </p>
          {/* Average Rating Display (dynamic, below category) */}
          <div className="flex flex-col gap-1 mt-2 mb-2">
            {/* <span className="font-semibold text-black">Average Rating:</span> */}
            <div className="flex gap-x-1 text-secondary medium-22 items-center">
              {[1, 2, 3, 4, 5].map((i) => {
                if (i <= Math.floor(averageRating)) {
                  return <MdStar key={i} className="text-yellow-500" />;
                } else if (
                  i === Math.floor(averageRating) + 1 &&
                  averageRating - Math.floor(averageRating) >= 0.25
                ) {
                  // Show half star if decimal part is >= 0.25
                  return <MdStarHalf key={i} className="text-yellow-500" />;
                } else {
                  return <MdStarBorder key={i} className="text-yellow-500" />;
                }
              })}
              <span className="text-black ml-2 font-semibold text-lg">
                {averageRating.toFixed(1)}
              </span>
            </div>
            <span className="text-gray-500 text-sm mt-1">
              {totalRatings} rating{totalRatings === 1 ? "" : "s"}
            </span>
          </div>
          <div className="flex text-secondary gap-x-2 medium-20 my-4">
            {newPrice < oldPrice ? (
              <>
                MRP:
                <div className="text-black">&#8377;{newPrice}</div>
                <div className="line-through text-black/80">
                  &#8377;{oldPrice}
                </div>
                <p className="flex justify-center items-center text-[#ff5050]">
                  ({discountPercentage.toFixed(0)}% Off)
                </p>
              </>
            ) : (
              <>
                MRP:
                <div className="text-black">&#8377;{newPrice}</div>
              </>
            )}
          </div>
          <div>
            {product.available ? (
              <p className="text-green-500 font-bold ">In Stock</p>
            ) : (
              <p className="text-red-500 font-bold">Out of Stock</p>
            )}
          </div>
          {/* SIZE SECTION */}
          <div className="mb-4">
            {product.sizes && product.sizes.length > 0 && (
              <>
                <SizeSelector
                  onSizeSelected={handleSizeSelected}
                  setErrorMessage={setErrorMessage}
                  sizes={product.sizes}
                  product={product}
                />
                {sizeErrorMessage && (
                  <p className="text-red-500 mt-2 font-semibold">
                    {sizeErrorMessage}
                  </p>
                )}
              </>
            )}
            <ProductDescription product={product} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDisplay;
