import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getProductById } from "../../../redux/features/productSlice";
import ProductHd from "../../components/ProductsPage/ProductHd";
import ProductDisplay from "../../components/ProductsPage/ProductDisplay";
import ProductDescription from "../../components/ProductsPage/ProductDescription";

const Product = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentProduct, loading, error } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    if (id) {
      dispatch(getProductById(id));
    }
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="flexCenter flex-col gap-4">
          <div className="spinner"></div>
          <div className="text-lg font-medium">Loading product...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-red-500 text-center">
          <p className="text-lg font-semibold">
            {error.message || "Failed to load product"}
          </p>
          <button
            onClick={() => dispatch(getProductById(id))}
            className="mt-4 px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!currentProduct) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-gray-500 text-lg">Product not found</p>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-[unset] px-1 lg:px-20 3xl:px-0 py-5 bg-white">
      {/* Custom Loader Overlay */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="flexCenter flex-col gap-4 bg-white p-8 rounded-lg">
            <div className="spinner"></div>
            <div className="text-lg font-medium">Loading product...</div>
          </div>
        </div>
      )}
      <div>
        <ProductHd product={currentProduct} />
        <ProductDisplay product={currentProduct} />
        {/*     <ProductDescription product={currentProduct} /> */}
      </div>
    </section>
  );
};

export default Product;
