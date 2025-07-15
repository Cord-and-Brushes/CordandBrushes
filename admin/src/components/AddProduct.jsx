import React, { useState, useEffect } from "react";
import Upload_area from "../assets/upload.png";
import { PlusOutlined } from "@ant-design/icons";
import { toast, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../api/api";

const AddProduct = () => {
  const [showUpload, setShowUpload] = useState(true);
  const [categories, setCategories] = useState([]);
  const [productData, setProductData] = useState({
    name: "",
    categoryId: "",
    new_price: "",
    old_price: "",
    description: "",
    sizes: [],
    images: null,
    imageUrls: [],
    available: true,
  });
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/api/categories/allcategories");
        setCategories(response.data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setProductData((prevState) => ({
        ...prevState,
        [name]: e.target.checked,
        available: name === "available" ? true : false,
      }));
    } else {
      setProductData((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const handleSizeChange = (e) => {
    const { checked, value } = e.target;
    setProductData((prevState) => ({
      ...prevState,
      sizes: checked
        ? [...prevState.sizes, value]
        : prevState.sizes.filter((size) => size !== value),
    }));
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    const urls = Array.from(files).map((file) => URL.createObjectURL(file));
    setProductData((prevState) => ({
      ...prevState,
      images: files,
      imageUrls: urls,
    }));
    setShowUpload(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowLoader(true);

    const formData = new FormData();
    formData.append("name", productData.name);
    formData.append("categoryId", productData.categoryId);
    formData.append("new_price", productData.new_price);
    formData.append("old_price", productData.old_price);
    formData.append("description", productData.description);
    formData.append("sizes", productData.sizes.join(","));
    formData.append("available", productData.available);

    if (productData.images) {
      Array.from(productData.images).forEach((file, index) => {
        formData.append("images", file);
      });
    }

    try {
      const token = localStorage.getItem("token");
      const response = await api.post("/api/products/addproduct", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status >= 200 && response.status < 300) {
        toast.success("🦄 Product Added", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Zoom,
        });

        setProductData({
          name: "",
          categoryId: "",
          new_price: "",
          old_price: "",
          description: "",
          sizes: [],
          images: null,
          imageUrls: [],
          available: true,
        });
        setShowUpload(true);
      } else {
        console.error("Unexpected response status:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error uploading product. Please try again.", {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Zoom,
      });
    } finally {
      setShowLoader(false);
    }
  };

  return (
    <div className="text-white font-anta p-8 box-border bg-black/15 w-full rounded-sm mt-4 lg:m-7">
      <h1 className="bold-22 font-anta text-center mb-5">
        PRODUCT ADDING FORM!
      </h1>

      {/* NAME & CATEGORY*/}
      <div className="flex flex-col lg:flex-row gap-x-10">
        {/* NAME */}
        <div className="mb-3 max-w-[300px] w-full">
          <h4 className="font-anta bold-18 pb-2">Product Title:</h4>
          <input
            type="text"
            name="name"
            placeholder="Type here..."
            className="bg-black/50 outline-none w-full py-3 px-4 rounded-md text-white"
            value={productData.name}
            onChange={handleInputChange}
          />
        </div>

        {/* CATEGORY */}
        <div className="mb-3 max-w-[300px] w-full">
          <h4 className="font-anta bold-18 pb-2">Category:</h4>
          <select
            name="categoryId"
            value={productData.categoryId}
            onChange={handleInputChange}
            className="bg-black/50 outline-none w-full py-3 px-4 rounded-md text-white"
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option
                key={category._id}
                value={category._id}
                className="capitalize"
              >
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* AVAILABILITY */}
        <div className="mb-3 max-w-[300px] w-full">
          <h4 className="font-anta bold-18 pb-2">Availability:</h4>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="available"
              name="available"
              checked={productData.available}
              onChange={handleInputChange}
              className="form-checkbox cursor-pointer h-5 w-5 text-white mr-2 custom-checkbox"
            />
            <label htmlFor="available" className="font-anta text-sm">
              Available
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="unavailable"
              name="unavailable"
              checked={!productData.available}
              onChange={handleInputChange}
              className="form-checkbox cursor-pointer h-5 w-5 text-white mr-2 custom-checkbox"
            />
            <label htmlFor="unavailable" className="font-anta text-sm">
              Unavailable
            </label>
          </div>
        </div>
      </div>

      {/*  PRICES */}
      <div className="flex flex-col lg:flex-row  gap-x-10">
        {/* NEW PRICE */}
        <div className="mb-3 max-w-[700px] w-full">
          <h4 className="font-anta bold-18 pb-2">New Price:</h4>
          <input
            type="number"
            name="new_price"
            placeholder="Type here..."
            className="bg-black/50 outline-none w-full py-3 px-4 rounded-md text-white"
            value={productData.new_price}
            onChange={handleInputChange}
          />
        </div>

        {/* OLD PRICE */}
        <div className="mb-3 max-w-[700px] w-full">
          <h4 className="font-anta bold-18 pb-2">Old Price:</h4>
          <input
            type="number"
            name="old_price"
            placeholder="Type here..."
            className="bg-black/50 outline-none w-full py-3 px-4 rounded-md text-white"
            value={productData.old_price}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/*  DESCRIPTION*/}
      <div className="mb-3 w-full">
        <h4 className="font-anta bold-18 pb-2">Description:</h4>
        <textarea
          id="description"
          placeholder="Type here..."
          name="description"
          className="bg-black/50 outline-none w-full py-3 px-4 rounded-md text-white"
          value={productData.description}
          onChange={handleInputChange}
        />
      </div>

      {/* SIZES */}
      <div className="mb-3">
        <h4 className="font-anta bold-18 pb-2">Sizes:</h4>
        <div className="grid grid-cols-3 lg:grid-cols-7 gap-4">
          {[
            "18'inch",
            "20'inch",
            "22'inch",
            "24'inch",
            "25'inch",
            "27'inch",
            "29'inch",
          ].map((size) => (
            <div key={size}>
              <input
                type="checkbox"
                id={size}
                className="form-checkbox cursor-pointer h-5 w-5 text-gray-600"
                value={size}
                name="sizes"
                onChange={handleSizeChange}
                checked={productData.sizes.includes(size)}
              />
              <label htmlFor={size} className="ml-2 font-anta text-sm">
                {size}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/*  UPLOAD IMAGES */}
      {showUpload ? (
        <div className="mt-10">
          <h4 className="font-anta bold-18 pb-2">Add Product Images:</h4>
          <label
            htmlFor="product-images-input"
            className="flex justify-center items-center flex-col border-2 border-2-white bg-black/50 rounded-md cursor-pointer"
          >
            <img
              src={Upload_area}
              alt="upload"
              className="w-32 rouned-sm inline-block"
            />
            <h4 className="font-anta py-3 text-white">Upload</h4>
          </label>
          <input
            onChange={handleImageChange}
            type="file"
            id="product-images-input"
            name="productImage"
            multiple
            hidden
            className="bg-black/50 text-white outline-none max-w-80 w-full py-3 px-4 rounded-md"
          />
        </div>
      ) : null}

      {/* Display selected images */}
      {!showUpload && productData?.imageUrls?.length > 0 && (
        <div className="mt-10">
          <h4 className="font-anta bold-18 pb-2">Selected Images:</h4>
          <div className="grid lg:grid-cols-4 grid-cols-2 gap-x-4">
            {productData.imageUrls.map((url, index) => (
              <div
                key={index}
                className="mb-2 flex justify-center items-center text-center"
              >
                <img
                  src={url}
                  alt={`Selected ${index + 1}`}
                  className="w-32 h-32 object-cover rounded-md"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {!showUpload ? (
        <button
          onClick={() => setShowUpload(true)}
          className="btn_dark_rounded mt-5 !rounded gap-x-1 flex justify-center items-center"
        >
          Select New Images
        </button>
      ) : null}

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        className="btn_dark_rounded mt-5 !rounded gap-x-1 flex justify-center items-center"
      >
        <PlusOutlined className="font-anta" />
        Add Product
      </button>

      {/* Loader */}
      {showLoader && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
};

export default AddProduct;
