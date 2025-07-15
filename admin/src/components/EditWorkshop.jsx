import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import { toast, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchAllWorkshops } from "../features/workshopsSlice";
import { useDispatch } from "react-redux";

const EditWorkshop = () => {
  const { id: workshopId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [workshopData, setWorkshopData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    time: "",
    mode: "",
    location: "",
    seats: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [showLoader, setShowLoader] = useState(false);
  const [notFound, setNotFound] = useState(false);

  // Fetch existing data
  useEffect(() => {
    async function fetchData() {
      setShowLoader(true);
      try {
        const token = localStorage.getItem("token");
        const res = await api.get(`/api/workshops/${workshopId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data;
        if (!data) throw new Error("Not found");

        const formatDate = (dateStr) =>
          dateStr ? new Date(dateStr).toISOString().slice(0, 10) : "";
        const formatTime = (timeStr) =>
          timeStr && timeStr.length >= 5 ? timeStr.slice(0, 5) : "";
        setWorkshopData({
          ...data,
          startDate: formatDate(data.startDate),
          endDate: formatDate(data.endDate),
          time: formatTime(data.time),
          image: null, //only preview
        });
        if (data.image) setImagePreview(data.image);
      } catch (err) {
        setNotFound(true);
      } finally {
        setShowLoader(false);
      }
    }
    if (workshopId) fetchData();
  }, [workshopId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setWorkshopData((prev) => {
      if (name === "mode" && value === "Online") {
        return { ...prev, [name]: value, location: "" }; // Clear location if switching to Online
      }
      return { ...prev, [name]: value };
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setWorkshopData((prev) => ({ ...prev, image: file }));
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
      const formData = new FormData();
      Object.entries(workshopData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) formData.append(key, value);
      });
      const token = localStorage.getItem("token");
      await api.put(`/api/workshops/edit/${workshopId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(fetchAllWorkshops());
      toast.success("Workshop updated successfully!", {
        position: "bottom-right",
        autoClose: 3000,
        theme: "dark",
        transition: Zoom,
      });
      navigate("/admin/allworkshops");
    } catch (err) {
      toast.error("Error updating workshop", {
        position: "bottom-right",
        autoClose: 3000,
        theme: "dark",
        transition: Zoom,
      });
      console.error("Error updating workshop:", err);
    } finally {
      setShowLoader(false);
    }
  };

  if (notFound) {
    return <div className="text-white p-8">Workshop not found.</div>;
  }

  if (!workshopId) {
    return <div className="text-white p-8">No workshop ID provided.</div>;
  }

  return (
    <div className="text-white font-anta p-8 box-border bg-black/15 w-full rounded-sm mt-4 lg:m-7">
      <h1 className="bold-22 font-anta text-center mb-5">Edit Workshop</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <h4 className="font-anta bold-18 pb-2">Title:</h4>
          <input
            type="text"
            name="title"
            placeholder="Workshop Title"
            className="bg-black/50 outline-none w-full py-3 px-4 rounded-md text-white"
            value={workshopData.title || ""}
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
            value={workshopData.description || ""}
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
              value={workshopData.startDate || ""}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3 w-full">
            <h4 className="font-anta bold-18 pb-2">EndDate:</h4>
            <input
              type="date"
              name="endDate"
              className="bg-black/50 outline-none w-full py-3 px-4 rounded-md text-white"
              placeholder="End Date"
              value={workshopData.endDate || ""}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3 w-full">
            <h4 className="font-anta bold-18 pb-2">Time:</h4>
            <input
              type="time"
              name="time"
              className="bg-black/50 outline-none w-full py-3 px-4 rounded-md text-white"
              value={workshopData.time || ""}
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
            value={workshopData.seats || ""}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3 w-full">
          <h4 className="font-anta bold-18 pb-2">Mode:</h4>
          <select
            name="mode"
            className="bg-black/50 outline-none w-full py-3 px-4 rounded-md text-white"
            value={workshopData.mode || ""}
            onChange={handleInputChange}
            required
          >
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
              value={workshopData.location || ""}
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
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-md mt-2"
            />
          )}
        </div>
        <button
          type="submit"
          className="btn_dark_rounded mt-5 !rounded gap-x-1 flex justify-center items-center"
        >
          Update Workshop
        </button>
        {showLoader && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="spinner"></div>
          </div>
        )}
      </form>
    </div>
  );
};

export default EditWorkshop;
