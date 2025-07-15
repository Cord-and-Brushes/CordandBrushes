import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createLiveClass } from "../features/liveclassesSlice";
import { toast, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const initialState = {
  course: "",
  description: "",
  day: [], // <-- use 'day' not 'days'
  time: "",
  duration: "",
  seats: "",
  price: "",
  location: "",
  level: "",
  image: null,
};

const AddLiveClasses = () => {
  const dispatch = useDispatch();
  const [liveClassData, setLiveClassData] = useState(initialState);
  const [imagePreview, setImagePreview] = useState(null);
  const [showLoader, setShowLoader] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLiveClassData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDaysChange = (e) => {
    const { value, checked } = e.target;
    setLiveClassData((prev) => ({
      ...prev,
      day: checked ? [...prev.day, value] : prev.day.filter((d) => d !== value),
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setLiveClassData((prev) => ({
      ...prev,
      image: file,
    }));
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowLoader(true);
    const formData = new FormData();

    // Handle each field properly
    Object.entries(liveClassData).forEach(([key, value]) => {
      if (key === "day") {
        // Send day array as JSON string
        formData.append("day", JSON.stringify(value));
      } else if (key === "image" && value) {
        // Handle image file
        formData.append("image", value);
      } else if (value !== null && value !== undefined && value !== "") {
        // Handle other fields
        formData.append(key, value);
      }
    });

    try {
      await dispatch(createLiveClass(formData)).unwrap();
      setLiveClassData(initialState);
      setImagePreview(null);
      toast.success("LiveClass created successfully!", {
        position: "bottom-right",
        autoClose: 3000,
        theme: "dark",
        transition: Zoom,
      });
    } catch (err) {
      // Handle error
      toast.error("LiveClass cannot be created!", {
        position: "bottom-right",
        autoClose: 3000,
        theme: "dark",
        transition: Zoom,
      });
      console.error(err);
    } finally {
      setShowLoader(false);
    }
  };

  return (
    <div className="text-white font-anta p-8 box-border bg-black/15 w-full rounded-sm mt-4 lg:m-7">
      <h1 className="bold-22 font-anta text-center mb-5">Add Live Class</h1>
      <form onSubmit={handleSubmit}>
        {/* Course */}
        <div className="mb-3">
          <h4 className="font-anta bold-18 pb-2">Course:</h4>
          <input
            type="text"
            name="course"
            placeholder="Course name"
            className="bg-black/50 outline-none w-full py-3 px-4 rounded-md text-white"
            value={liveClassData.course}
            onChange={handleInputChange}
            required
          />
        </div>
        {/* Description */}
        <div className="mb-3">
          <h4 className="font-anta bold-18 pb-2">Description:</h4>
          <textarea
            name="description"
            placeholder="Description"
            className="bg-black/50 outline-none w-full py-3 px-4 rounded-md text-white"
            value={liveClassData.description}
            onChange={handleInputChange}
            required
          />
        </div>
        {/* Days  */}
        <div className="mb-3 w-full">
          <h4 className="font-anta bold-18 pb-2">Days (select one or more):</h4>
          <div className="flex flex-wrap gap-3">
            {daysOfWeek.map((day) => (
              <label key={day} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  value={day}
                  checked={liveClassData.day.includes(day)}
                  onChange={handleDaysChange}
                />
                {day}
              </label>
            ))}
          </div>
        </div>
        {/* Time, Duration, Seats  */}
        <div className="flex flex-col lg:flex-row gap-x-10">
          <div className="mb-3 w-full">
            <h4 className="font-anta bold-18 pb-2">Time:</h4>
            <input
              type="time"
              name="time"
              className="bg-black/50 outline-none w-full py-3 px-4 rounded-md text-white"
              value={liveClassData.time}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3 w-full">
            <h4 className="font-anta bold-18 pb-2">Duration (in minutes):</h4>
            <input
              type="number"
              name="duration"
              placeholder="Duration"
              className="bg-black/50 outline-none w-full py-3 px-4 rounded-md text-white"
              value={liveClassData.duration}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3 w-full">
            <h4 className="font-anta bold-18 pb-2">Seats:</h4>
            <input
              type="number"
              name="seats"
              placeholder="Seats"
              className="bg-black/50 outline-none w-full py-3 px-4 rounded-md text-white"
              value={liveClassData.seats}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        {/* Location, Level, Price */}
        <div className="flex flex-col lg:flex-row gap-x-10">
          <div className="mb-3 w-full">
            <h4 className="font-anta bold-18 pb-2">Location:</h4>
            <select
              type="text"
              name="location"
              placeholder="Location"
              className="bg-black/50 outline-none w-full py-3 px-4 rounded-md text-white"
              value={liveClassData.location}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Location</option>
              <option value="Bhillai">Bhillai</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Berhampur">Berhampur</option>
            </select>
          </div>
          <div className="mb-3 w-full">
            <h4 className="font-anta bold-18 pb-2">Level:</h4>
            <select
              name="level"
              className="bg-black/50 outline-none w-full py-3 px-4 rounded-md text-white"
              value={liveClassData.level}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
          <div className="mb-3 w-full">
            <h4 className="font-anta bold-18 pb-2">Price:</h4>
            <input
              type="number"
              name="price"
              placeholder="Price"
              className="bg-black/50 outline-none w-full py-3 px-4 rounded-md text-white"
              value={liveClassData.price}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        {/* Image */}
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
          Add LiveClass
        </button>
        {/* Loader */}
        {showLoader && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="spinner"></div>
          </div>
        )}
      </form>
    </div>
  );
};

export default AddLiveClasses;
