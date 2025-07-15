import React, { useState } from "react";
import Upload_area from "../assets/upload.png";
import { PlusOutlined } from "@ant-design/icons";
import { toast, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../api/api";

const AddCategory = () => {
  const [showUpload2, setShowUpload2] = useState(true);
  const [showUpload3, setShowUpload3] = useState(true);
  const [categoryData, setCategoryData] = useState({
    name: "",
    categoryThumbnail: null,
    categoryBanner: null,
    thumbnailUrl: [],
    bannerUrl: [],
    available: true,
  });
  const [showLoader, setShowLoader] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setCategoryData((prevState) => ({
        ...prevState,
        [name]: e.target.checked,
      }));
    } else {
      setCategoryData((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const handleImageChange2 = (e) => {
    const files = e.target.files;
    const urls = Array.from(files).map((file) => URL.createObjectURL(file));
    setCategoryData((prevState) => ({
      ...prevState,
      categoryThumbnail: files,
      thumbnailUrl: urls,
    }));
    setShowUpload2(false);
  };

  const handleImageChange3 = (e) => {
    const files = e.target.files;
    const urls = Array.from(files).map((file) => URL.createObjectURL(file));
    setCategoryData((prevState) => ({
      ...prevState,
      categoryBanner: files,
      bannerUrl: urls,
    }));
    setShowUpload3(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowLoader(true);
    const formData = new FormData();
    formData.append("name", categoryData.name);
    formData.append("available", categoryData.available);
    if (categoryData.categoryThumbnail) {
      formData.append("thumbnailImage", categoryData.categoryThumbnail[0]);
    }
    if (categoryData.categoryBanner) {
      formData.append("bannerImage", categoryData.categoryBanner[0]);
    }

    try {
      const token = localStorage.getItem("token");
      const response = await api.post("/api/categories/addcategory", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      const data = response.data;
      console.log(data);
      if (response.status >= 200 && response.status < 300) {
        toast.success("🦄 Category Added", {
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
      } else {
        console.error("Unexpected response status:", response.status);
      }

      setCategoryData({
        name: "",
        categoryThumbnail: null,
        categoryBanner: null,
        thumbnailUrl: [],
        bannerUrl: [],
        available: true,
      });
      setShowUpload3(true);
      setShowUpload2(true);
      setShowLoader(false);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error uploading category. Please try again.", {
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
      setShowLoader(false);
    }
  };

  return (
    <div className="text-white font-anta p-8 box-border bg-black/15 w-full rounded-sm mt-4 lg:m-7">
      <h1 className="bold-22 font-anta text-center mb-5">
        CATEGORY ADDING FORM!
      </h1>

      {/* NAME */}
      <div className="mb-3 max-w-[300px] w-full">
        <h4 className="font-anta bold-18 pb-2">Category Name:</h4>
        <input
          type="text"
          name="name"
          placeholder="Type here..."
          className="bg-black/50 outline-none w-full py-3 px-4 rounded-md text-white"
          value={categoryData.name}
          onChange={handleInputChange}
        />
      </div>

      {/* AVAILABILITY */}
      <div className="mb-3 max-w-[300px] w-full">
        <h4 className="font-anta bold-18 pb-2">Availability:</h4>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="available"
            name="available"
            checked={categoryData.available}
            onChange={handleInputChange}
            className="form-checkbox cursor-pointer h-5 w-5 text-white mr-2 custom-checkbox"
          />
          <label htmlFor="available" className="font-anta text-sm">
            Available
          </label>
        </div>
      </div>

      {/* CATEGORY IMAGES */}
      <div className="flex gap-x-10 justify-evenly">
        {/* THUMBNAIL IMAGE */}
        {showUpload2 ? (
          <div className="mt-10">
            <h4 className="font-anta bold-18 pb-2">
              Add Category Thumbnail Image:
            </h4>
            <label
              htmlFor="thumbnail-input"
              className="flex justify-center items-center max-w-50 w-full flex-col border-2 border-2-white rounded-md bg-black/50 cursor-pointer"
            >
              <img
                src={Upload_area}
                alt="upload"
                className="w-32 rouned-sm inline-block"
              />
              <h4 className="font-anta py-3 text-white">Upload</h4>
            </label>
            <input
              onChange={handleImageChange2}
              type="file"
              id="thumbnail-input"
              name="thumbnailImages"
              multiple
              hidden
              className="bg-black/50 text-white outline-none max-w-80 w-full py-3 px-4 rounded-md"
            />
          </div>
        ) : null}
        {!showUpload2 && categoryData?.thumbnailUrl?.length > 0 && (
          <div className="mt-10">
            <h4 className="font-anta bold-18 pb-2">
              Selected Thumbnail Image:
            </h4>
            <div className="grid lg:grid-cols-1 gap-x-4">
              {categoryData.thumbnailUrl.map((url, index) => (
                <div
                  key={index}
                  className="mb-2 flex flex-col justify-center items-center text-center"
                >
                  <img
                    src={url}
                    alt={`Selected ${index + 1}`}
                    className="w-32 h-32 object-cover rounded-md"
                  />
                  <button
                    onClick={() => setShowUpload2(true)}
                    className="btn_dark_rounded mt-5 !rounded gap-x-1 flex justify-center items-center"
                  >
                    Select New Images
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* BANNER IMAGE */}
      {showUpload3 ? (
        <div className="mt-10">
          <h4 className="font-anta bold-18 pb-2">Add Category Banner Image:</h4>
          <label
            htmlFor="banner-input"
            className="flex justify-center items-center max-w-50 w-full flex-col border-2 border-2-white rounded-md bg-black/50 cursor-pointer"
          >
            <img
              src={Upload_area}
              alt="upload"
              className="w-32 rouned-sm inline-block"
            />
            <h4 className="font-anta py-3 text-white">Upload</h4>
          </label>
          <input
            onChange={handleImageChange3}
            type="file"
            id="banner-input"
            name="bannerImage"
            multiple
            hidden
            className="bg-black/50 text-white outline-none max-w-50 w-full py-3 px-4 rounded-md"
          />
        </div>
      ) : null}
      {!showUpload3 && categoryData?.bannerUrl?.length > 0 && (
        <div className="mt-10">
          <h4 className="font-anta bold-18 pb-2">Selected Banner Images:</h4>
          <div className="grid lg:grid-cols-1 grid-cols-1 gap-x-4">
            {categoryData.bannerUrl.map((url, index) => (
              <div
                key={index}
                className="mb-2 flex flex-col justify-center items-center text-center"
              >
                <img
                  src={url}
                  alt={`Selected ${index + 1}`}
                  className="w-full h-full object-cover rounded-md"
                />
                <button
                  onClick={() => setShowUpload3(true)}
                  className="btn_dark_rounded mt-5 !rounded gap-x-1 flex justify-center items-center"
                >
                  Select New Images
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handleSubmit}
        className="btn_dark_rounded mt-5 !rounded gap-x-1 flex justify-center items-center"
      >
        <PlusOutlined className="font-anta" />
        Add Category
      </button>

      {showLoader && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
};

export default AddCategory;
