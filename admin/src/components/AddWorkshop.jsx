import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createWorkshop } from "../features/workshopsSlice";
import { useNavigate } from "react-router-dom";
import { toast, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const initialState = {
  title: "",
  description: "",
  startDate: "",
  endDate: "",
  time: "",
  mode: "",
  location: "",
  seats: "",
  image: null,
};

const AddWorkshop = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [workshopData, setWorkshopData] = useState(initialState);
  const [imagePreview, setImagePreview] = useState(null);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setWorkshopData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setWorkshopData((prev) => ({
      ...prev,
      image: file,
    }));
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", workshopData.title);
    formData.append("description", workshopData.description);
    formData.append("startDate", workshopData.startDate);
    formData.append("endDate", workshopData.endDate);
    formData.append("time", workshopData.time);
    formData.append("mode", workshopData.mode);
    formData.append("seats", workshopData.seats);

    if (workshopData.mode === "Offline" && workshopData.location) {
      formData.append("location", workshopData.location);
    }

    if (workshopData.image) {
      formData.append("image", workshopData.image);
    }
    try {
      await dispatch(createWorkshop(formData)).unwrap();
      setWorkshopData(initialState);
      setImagePreview(null);
      toast.success("Workshop created successfully!", {
        position: "bottom-right",
        autoClose: 3000,
        theme: "dark",
        transition: Zoom,
      });
    } catch (error) {
      toast.error("Error creating workshop!", {
        position: "bottom-right",
        autoClose: 3000,
        theme: "dark",
        transition: Zoom,
      });
    }
  };
  return (
    <div className="text-white font-anta p-8 box-border bg-black/15 w-full rounded-sm mt-4 lg:m-7">
      <h1 className="bold-22 font-anta text-center mb-5">Add Workshop</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <h4 className="font-anta bold-18 pb-2">Title:</h4>
          <input
            type="text"
            name="title"
            placeholder="Workshop Title"
            className="bg-black/50 outline-none w-full py-3 px-4 rounded-md text-white"
            value={workshopData.title}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <h4 className="font-anta bold-18 pb-2">Description:</h4>
          <textarea
            name="description"
            placeholder="Description"
            className="bg-black/50 outline-none w-full py-3 px-4 rounded-md text-white"
            value={workshopData.description}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-x-10">
          <div className="mb-3 w-full">
            <h4 className="font-anta bold-18 pb-2">StartDate:</h4>
            <input
              type="date"
              name="startDate"
              className="bg-black/50 outline-none w-full py-3 px-4 rounded-md text-white"
              placeholder="Start Date"
              value={workshopData.startDate}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3 w-full">
            <h4 className="font-anta bold-18 pb-2">EndDate:</h4>
            <input
              type="date"
              name="endDate"
              className="bg-black/50 outline-none w-full py-3 px-4 rounded-md text-white"
              placeholder="Start Date"
              value={workshopData.endDate}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3 w-full">
            <h4 className="font-anta bold-18 pb-2">Time:</h4>
            <input
              type="time"
              name="time"
              className="bg-black/50 outline-none w-full py-3 px-4 rounded-md text-white"
              value={workshopData.time}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="mb-3 w-full">
          <h4 className="font-anta bold-18 pb-2">Seats:</h4>
          <input
            type="number"
            name="seats"
            placeholder="Seats"
            className="bg-black/50 outline-none w-full py-3 px-4 rounded-md text-white"
            value={workshopData.seats}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3 w-full">
          <h4 className="font-anta bold-18 pb-2">Mode:</h4>
          <select
            name="mode"
            className="bg-black/50 outline-none w-full py-3 px-4 rounded-md text-white"
            value={workshopData.mode}
            onChange={handleInputChange}
            required
          >
            {" "}
            <option value="">Select Mode</option>
            <option value="Online">Online</option>
            <option value="Offline">Offline</option>
          </select>
        </div>
        {workshopData.mode === "Offline" && (
          <div className="mb-3 w-full">
            <h4 className="font-anta bold-18 pb-2">Location:</h4>
            <input
              type="text"
              name="location"
              placeholder="Location"
              className="bg-black/50 outline-none w-full py-3 px-4 rounded-md text-white"
              value={workshopData.location}
              onChange={handleInputChange}
              required={workshopData.mode === "Offline"}
            />
          </div>
        )}
        <div className="mb-3">
          <h4 className="font-anta bold-18 pb-2">Image:</h4>
          <input
            type="file"
            name="image"
            accept="image/*"
            className="bg-black/50 outline-none w-full py-3 px-4 rounded-md text-white"
            onChange={handleImageChange}
            required
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-md mt-2"
            />
          )}
        </div>
        {/* Submit button */}
        <button
          type="submit"
          className="btn_dark_rounded mt-5 !rounded gap-x-1 flex justify-center items-center"
        >
          Add Workshop
        </button>
      </form>
    </div>
  );
};

export default AddWorkshop;
