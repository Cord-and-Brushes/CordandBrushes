import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "../../../redux/features/productSlice";
import HomeProductCard2 from "../../components/Home/HomeProductCard2/HomeProductCard2";
const AllProducts = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="flexCenter flex-col gap-4">
          <div className="spinner"></div>
          <div className="text-lg font-medium">Loading products...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-red-500 text-center">
          <p className="text-lg font-semibold">
            {error.message || "Failed to load products"}
          </p>
          <button
            onClick={() => dispatch(getAllProducts())}
            className="mt-4 px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 p-4 lg:p-12">
      {/* Custom Loader Overlay */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="flexCenter flex-col gap-4 bg-white p-8 rounded-lg">
            <div className="spinner"></div>
            <div className="text-lg font-medium">Loading products...</div>
          </div>
        </div>
      )}
      {products.map((product) => (
        <HomeProductCard2
          key={product._id}
          productId={product._id}
          imgUrl={product.images[0]} // Using the first image as the main image
          price={product.new_price}
          oldPrice={product.old_price}
          productTitle={product.name}
          available={product.available}
        />
      ))}
    </div>
  );
};

export default AllProducts;
