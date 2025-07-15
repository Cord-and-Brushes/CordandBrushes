import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProductsByCategory } from "../../../redux/features/productSlice";
import HomeProductCard2 from "../../components/Home/HomeProductCard2/HomeProductCard2";

const CategoryProducts = () => {
  const { categoryName } = useParams();
  const dispatch = useDispatch();
  const { products, currentCategory, loading, error } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    if (categoryName) {
      dispatch(getProductsByCategory(categoryName));
    }
  }, [dispatch, categoryName]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-center">
          <p className="text-lg font-semibold">
            {error.message || "Failed to fetch products"}
          </p>
          <button
            onClick={() => dispatch(getProductsByCategory(categoryName))}
            className="mt-4 px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1440px] mx-auto flex flex-col items-center py-8 px-2 sm:px-4 md:px-8">
      <div className="relative w-full flex flex-col items-center">
        {currentCategory?.bannerImage && (
          <img
            src={currentCategory.bannerImage}
            className="w-full h-[40vw] max-h-[300px] min-h-[120px] rounded-md shadow-sm"
            alt={`${categoryName} Banner`}
          />
        )}
        <div className="relative w-full flex justify-center mt-4 px-2">
          <p className="text-black text-base sm:text-lg md:text-xl text-center max-w-2xl">
            Discover our curated collection of {categoryName.replace(/-/g, " ")}{" "}
            products, designed to bring style and functionality to your space.
          </p>
        </div>
      </div>

      <div className="relative top-3 w-full flex justify-center items-center">
        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-16">
            {products.map((product) => (
              <HomeProductCard2
                key={product._id}
                productId={product._id}
                imgUrl={product.images[0]}
                price={product.new_price}
                oldPrice={product.old_price}
                productTitle={product.name}
                available={product.available}
              />
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center min-h-[200px] w-full">
            <p className="text-gray-500 text-base sm:text-lg text-center">
              No products found in this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryProducts;
