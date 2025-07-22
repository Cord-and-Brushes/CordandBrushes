import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const EditLiveClass = ({ fetchLiveClass, updateLiveClass }) => {
  const { id: liveClassId } = useParams();
  const navigate = useNavigate();

  const [liveClassData, setLiveClassData] = useState({
    course: "",
    description: "",
    day: [],
    time: "",
    duration: "",
    seats: "",
    price: "",
    location: "",
    level: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [showLoader, setShowLoader] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // Fetch existing data
  useEffect(() => {
    async function fetchData() {
      setShowLoader(true);
      try {
        let data;
        if (fetchLiveClass) {
          data = await fetchLiveClass(liveClassId);
        } else {
          // console.log(liveClassId);
          const res = await fetch(`/api/liveclasses/${liveClassId}`);
          if (!res.ok) throw new Error("Not found");
          const text = await res.text();
          // Check for HTML response BEFORE parsing as JSON
          if (text.trim().startsWith("<")) {
            throw new Error("Not found");
          }
          data = JSON.parse(text);
        }
        // Convert date from dd-MM-yyyy to yyyy-MM-dd if needed
        let formattedDate = data.liveClass.date || "";
        if (formattedDate && formattedDate.includes("-")) {
          const parts = formattedDate.split("-");
          if (parts[0].length === 2 && parts[2].length === 4) {
            // dd-MM-yyyy -> yyyy-MM-dd
            formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
          }
        }
        setLiveClassData({
          ...data.liveClass,
          date: formattedDate,
          day: Array.isArray(data.liveClass.day)
            ? data.liveClass.day
            : data.liveClass.day
            ? [data.liveClass.day]
            : [],
          time: data.liveClass.time ? data.liveClass.time.slice(0, 5) : "",
          duration: data.liveClass.duration
            ? parseInt(data.liveClass.duration)
            : "",
          image: null, // Don't set image file, only preview
        });
        if (data.liveClass && data.liveClass.image)
          setImagePreview(data.liveClass.image);
      } catch (err) {
        toast.error("Liveclass cannot be updated!", {
          position: "bottom-right",
          autoClose: 3000,
          theme: "dark",
          transition: Zoom,
        });
        console.error("Error fetching live class data:", err);
        setNotFound(true);
      } finally {
        setShowLoader(false);
      }
    }
    if (liveClassId) fetchData();
  }, [liveClassId, fetchLiveClass]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLiveClassData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDayCheckbox = (e) => {
    const { value, checked } = e.target;
    setLiveClassData((prev) => {
      if (checked) {
        return { ...prev, day: [...prev.day, value] };
      } else {
        return { ...prev, day: prev.day.filter((d) => d !== value) };
      }
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setLiveClassData((prev) => ({ ...prev, image: file }));
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowLoader(true);
    try {
      let formData = new FormData();
      Object.entries(liveClassData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) formData.append(key, value);
      });
      if (updateLiveClass) {
        await updateLiveClass(liveClassId, formData);
      } else {
        // Example PUT, replace with your API
        const token = localStorage.getItem("token");
        const response = await fetch(`/api/liveclasses/edit/${liveClassId}`, {
          method: "PUT",
          body: JSON.stringify({
            course: liveClassData.course,
            time: liveClassData.time,
            location: liveClassData.location,
            duration: liveClassData.duration,
            day: liveClassData.day,
            price: liveClassData.price,
            level: liveClassData.level,
            seats: liveClassData.seats,
            available: liveClassData.available,
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          navigate("/admin/allliveclasses");
          toast.success("LiveClass updated successfully!", {
            position: "bottom-right",
            autoClose: 3000,
            theme: "dark",
            transition: Zoom,
          });
        } else {
          const errorData = await response.json();
          navigate("/admin/allliveclasses");
          toast.error(errorData.message || "Error updating live class", {
            position: "bottom-right",
            autoClose: 3000,
            theme: "dark",
            transition: Zoom,
          });
        }
      }
    } catch (err) {
      toast.error("Error updating live class", {
        position: "bottom-right",
        autoClose: 3000,
        theme: "dark",
        transition: Zoom,
      });
      // console.error("Error updating live class:", err);
    } finally {
      setShowLoader(false);
    }
  };

  if (notFound) {
    return <div className="text-white p-8">Live class not found.</div>;
  }

  if (!liveClassId) {
    return <div className="text-white p-8">No live class ID provided.</div>;
  }

  return (
    <div className="text-white font-anta p-8 box-border bg-black/15 w-full rounded-sm mt-4 lg:m-7">
      <h1 className="bold-22 font-anta text-center mb-5">Edit Live Class</h1>
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
        {/* Date, Day, Time */}
        <div className="flex flex-col lg:flex-row gap-x-10">
          <div className="mb-3 w-full">
            <h4 className="font-anta bold-18 pb-2">Days:</h4>
            <div className="flex flex-wrap gap-2">
              {daysOfWeek.map((day) => (
                <label key={day} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    value={day}
                    checked={liveClassData.day.includes(day)}
                    onChange={handleDayCheckbox}
                  />
                  {day}
                </label>
              ))}
            </div>
          </div>
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
        </div>
        {/* Duration, Seats, Price */}
        <div className="flex flex-col lg:flex-row gap-x-10">
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
        {/* Location */}
        <div className="mb-3">
          <h4 className="font-anta bold-18 pb-2">Location:</h4>
          <input
            type="text"
            name="location"
            placeholder="Location"
            className="bg-black/50 outline-none w-full py-3 px-4 rounded-md text-white"
            value={liveClassData.location}
            onChange={handleInputChange}
            required
          />
        </div>
        {/* Level */}
        <div className="mb-3">
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
        {/* Image */}
        <div className="mb-3">
          <h4 className="font-anta bold-18 pb-2">Image:</h4>
          <input
            type="file"
            name="image"
            accept="image/*"
            className="bg-black/50 outline-none w-full py-3 px-4 rounded-md text-white"
            onChange={handleImageChange}
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
          Update LiveClass
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

export default EditLiveClass;
