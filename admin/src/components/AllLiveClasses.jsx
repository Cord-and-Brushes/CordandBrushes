import React, { useState, useEffect } from "react";
import { TbTrash } from "react-icons/tb";
import { RiEdit2Line } from "react-icons/ri";
import { toast, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useLocation } from "react-router-dom";
import Modal from "react-modal";
import Empty from "../assets/empty-cart.jpg";
import api from "../api/api";
import { useDispatch } from "react-redux";
import {
  fetchClassesByLocation,
  fetchAllLiveClasses,
} from "../features/liveclassesSlice";

const AllLiveClasses = () => {
  const [allLiveClasses, setAllLiveClasses] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState(null);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  // Fetch all locations for filter dropdown
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await api.get("/api/liveclasses/locations");
        setLocations(res.data);
      } catch (err) {
        setLocations([]);
      }
    };
    fetchLocations();
  }, []);

  // Fetch all live classes initially or by location
  useEffect(() => {
    const fetchInfo = async () => {
      setShowLoader(true);
      try {
        const response = await dispatch(fetchAllLiveClasses()).unwrap();
        setAllLiveClasses(response.liveClasses || response.classes || []);
      } catch (error) {
        setAllLiveClasses([]);
        console.error("Error fetching live classes:", error);
      }
      setShowLoader(false);
    };
    fetchInfo();
  }, [dispatch]);

  const handleRemoveClass = async (id) => {
    setClassToDelete(id);
    setIsModalOpen(true);
  };

  const deleteLiveClass = async (id) => {
    setShowLoader(true);
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/api/liveclasses/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllLiveClasses(allLiveClasses.filter((item) => item._id !== id));
      setIsModalOpen(false); // Close modal first
      setShowLoader(false); // Hide loader before showing toast
      toast.success("Live class removed successfully", {
        position: "bottom-right",
        autoClose: 3000,
        theme: "dark",
        transition: Zoom,
      });
    } catch (error) {
      setShowLoader(false);
      setIsModalOpen(false);
      toast.error("Error removing live class", {
        position: "bottom-right",
        autoClose: 3000,
        theme: "dark",
        transition: Zoom,
      });
      console.error("Error removing live class:", error);
    }
  };

  const handleEditClass = (id) => {
    setShowLoader(true);
    navigate(`/admin/editliveclass/${id}`);
    setShowLoader(false);
  };

  // Toggle availability
  const toggleClassStatus = async (id) => {
    setShowLoader(true);
    try {
      const token = localStorage.getItem("token");
      await api.put(
        `/api/liveclasses/toggle-availability/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAllLiveClasses(
        allLiveClasses.map((item) =>
          item._id === id ? { ...item, available: !item.available } : item
        )
      );
      toast.success("Live class status toggled successfully", {
        position: "bottom-right",
        autoClose: 3000,
        theme: "dark",
        transition: Zoom,
      });
    } catch (error) {
      console.error("Error toggling live class status:", error);
    }
    setShowLoader(false);
  };

  const uniqueLocations = Array.from(
    new Set(allLiveClasses.map((cls) => cls.location))
  );

  const filteredClasses = selectedLocation
    ? allLiveClasses.filter((cls) => cls.location === selectedLocation)
    : allLiveClasses;

  return (
    <div className="text-white flex-col font-anta p-8 box-border bg-black/20 w-full h-screen lg:max-w-[100%] rounded-sm mt-4 lg:m-7">
      <h1 className="bold-22 font-anta text-center mb-5">LIVE CLASS LIST</h1>
      <div className="mb-4 flex flex-wrap gap-4 items-center">
        <label className="font-anta">Filter by Location:</label>
        <select
          className="text-black rounded px-2 py-1"
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
        >
          <option value="">All Locations</option>
          {uniqueLocations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>
      <div>
        {filteredClasses?.length === 0 ? (
          <div className="flex flex-col justify-center items-center bg-black/60 py-8 rounded-full">
            <img src={Empty} className="rounded-full h-64" alt="Empty cart" />
            <p className="font-anta text-white text-center mt-5">
              No Live Classes to show
            </p>
          </div>
        ) : (
          <div className="max-h-[77vh] overflow-auto px-4 text-center">
            <table className="w-full mx-auto">
              <thead>
                <tr className="overflow-auto border-b-2 border-orange-600">
                  <th className="p-2 font-anta uppercase">Course</th>
                  <th className="p-2 font-anta uppercase">Price</th>
                  <th className="p-2 font-anta uppercase">Time</th>
                  <th className="p-2 font-anta uppercase">Location</th>
                  <th className="p-2 font-anta uppercase">Level</th>
                  <th className="p-2 font-anta uppercase">Seats</th>
                  <th className="p-2 font-anta uppercase">Remove/Edit</th>
                  <th className="p-2 font-anta uppercase">Available</th>
                </tr>
              </thead>
              <tbody>
                {filteredClasses?.map((liveClass) => (
                  <tr
                    key={liveClass._id}
                    className="border-b border-white/40 p-6 medium-14"
                  >
                    <td className="p-2 font-anta">{liveClass.course}</td>
                    <td className="p-2 font-anta">{liveClass.price}</td>
                    <td className="p-2 font-anta">{liveClass.time}</td>
                    <td className="p-2 font-anta">{liveClass.location}</td>
                    <td className="p-2 font-anta">{liveClass.level}</td>
                    <td className="p-2 font-anta">{liveClass.seats}</td>
                    <td className="p-2 flex mt-2 gap-x-5 justify-center items-center">
                      <button
                        className="hover:text-orange-600"
                        onClick={() => handleRemoveClass(liveClass._id)}
                      >
                        <TbTrash className="text-[22px]" />
                      </button>
                      <button
                        className="hover:text-orange-600"
                        onClick={() => handleEditClass(liveClass._id)}
                      >
                        <RiEdit2Line className="text-[22px]" />
                      </button>
                    </td>
                    <td className="p-2">
                      <label className="switch font-anta">
                        <input
                          type="checkbox"
                          className="toggle"
                          checked={!!liveClass.available}
                          onChange={() => toggleClassStatus(liveClass._id)}
                        />
                        <span className="slider"></span>
                      </label>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {showLoader && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="spinner"></div>
          </div>
        )}
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Delete Confirmation"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <h2>Confirm Deletion</h2>
        <p>Are you sure you want to delete this live class?</p>
        <div className="flex gap-x-5 mt-3">
          <button
            onClick={() => setIsModalOpen(false)}
            className="btn_dark_rounded"
          >
            Cancel
          </button>
          <button
            onClick={() => deleteLiveClass(classToDelete)}
            className="btn_dark_rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default AllLiveClasses;
