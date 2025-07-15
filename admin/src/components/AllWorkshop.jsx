import React, { useState, useEffect } from "react";
import { fetchAllWorkshops } from "../features/workshopsSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import api from "../api/api";
import { toast, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-modal";
import { TbTrash } from "react-icons/tb";
import { RiEdit2Line } from "react-icons/ri";
import Empty from "../assets/empty-cart.jpg";

const AllWorkshop = () => {
  const [showLoader, setShowLoader] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [workshopToDelete, setWorkshopToDelete] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { workshops, loading } = useSelector((state) => state.workshops);

  // Fetch all workshops initially
  useEffect(() => {
    dispatch(fetchAllWorkshops());
  }, [dispatch]);

  const handleRemoveWorkshop = (id) => {
    setWorkshopToDelete(id);
    setIsModalOpen(true);
  };

  const deleteWorkshop = async (id) => {
    setShowLoader(true);
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/api/workshops/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Workshop removed successfully", {
        position: "bottom-right",
        autoClose: 3000,
        theme: "dark",
        transition: Zoom,
      });

      dispatch(fetchAllWorkshops());
    } catch (error) {
      toast.error("Error removing workshop", {
        position: "bottom-right",
        autoClose: 3000,
        theme: "dark",
        transition: Zoom,
      });
      console.error("Error removing workshop:", error);
    }
    setShowLoader(false);
    setIsModalOpen(false);
  };

  const handleEditWorkshop = (id) => {
    setShowLoader(true);
    navigate(`/admin/editworkshop/${id}`);
    setShowLoader(false);
  };

  const toggleworkshopStatus = async (id) => {
    setShowLoader(true);
    try {
      const token = localStorage.getItem("token");
      const workshop = workshops.find((w) => w._id === id);
      if (!workshop) return;
      const updated = {
        ...workshop,
        available: !workshop.available,
      };
      await api.put(`/api/workshops/edit/${id}`, updated, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Workshop status updated", {
        position: "bottom-right",
        autoClose: 2000,
        theme: "dark",
        transition: Zoom,
      });

      dispatch(fetchAllWorkshops());
    } catch (error) {
      toast.error("Error updating status", {
        position: "bottom-right",
        autoClose: 2000,
        theme: "dark",
        transition: Zoom,
      });
      console.error("Error updating status:", error);
    }
    setShowLoader(false);
  };

  return (
    <div className="text-white flex-col font-anta p-8 box-border bg-black/20 w-full h-screen lg:max-w-[100%] rounded-sm mt-4 lg:m-7">
      <h1 className="bold-22 font-anta text-center mb-5">WORKSHOP LIST</h1>
      <div>
        {loading || showLoader ? (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="spinner"></div>
          </div>
        ) : workshops?.length === 0 ? (
          <div className="flex flex-col justify-center items-center bg-black/60 py-8 rounded-full">
            <img src={Empty} className="rounded-full h-64" alt="Empty cart" />
            <p className="font-anta text-white text-center mt-5">
              No Workshops to show
            </p>
          </div>
        ) : (
          <div className="max-h-[77vh] overflow-auto px-4 text-center">
            <table className="w-full mx-auto">
              <thead>
                <tr className="overflow-auto border-b-2 border-orange-600">
                  <th className="p-2 font-anta uppercase">Title</th>
                  <th className="p-2 font-anta uppercase">StartDate</th>
                  <th className="p-2 font-anta uppercase">Time</th>
                  <th className="p-2 font-anta uppercase">Location</th>
                  <th className="p-2 font-anta uppercase">Mode</th>
                  <th className="p-2 font-anta uppercase">Seats</th>
                  <th className="p-2 font-anta uppercase">Remove/Edit</th>
                  <th className="p-2 font-anta uppercase">Available</th>
                </tr>
              </thead>
              <tbody>
                {workshops.map((workshop) => (
                  <tr
                    key={workshop._id}
                    className="border-b border-white/40 p-6 medium-14"
                  >
                    <td className="p-2 font-anta">{workshop.title}</td>
                    <td className="p-2 font-anta">
                      {workshop.startDate?.slice(0, 10)}
                    </td>
                    <td className="p-2 font-anta">{workshop.time}</td>
                    <td className="p-2 font-anta">{workshop.location}</td>
                    <td className="p-2 font-anta">{workshop.mode}</td>
                    <td className="p-2 font-anta">{workshop.seats}</td>
                    <td className="p-2 flex mt-2 gap-x-5 justify-center items-center">
                      <button
                        className="hover:text-orange-600"
                        onClick={() => handleRemoveWorkshop(workshop._id)}
                      >
                        <TbTrash className="text-[22px]" />
                      </button>
                      <button
                        className="hover:text-orange-600"
                        onClick={() => handleEditWorkshop(workshop._id)}
                      >
                        <RiEdit2Line className="text-[22px]" />
                      </button>
                    </td>
                    <td className="p-2">
                      <label className="switch font-anta">
                        <input
                          type="checkbox"
                          className="toggle"
                          checked={!!workshop.available}
                          onChange={() => toggleworkshopStatus(workshop._id)}
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
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Delete Confirmation"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <h2>Confirm Deletion</h2>
        <p>Are you sure you want to delete this workshop?</p>
        <div className="flex gap-x-5 mt-3">
          <button
            onClick={() => setIsModalOpen(false)}
            className="btn_dark_rounded"
          >
            Cancel
          </button>
          <button
            onClick={() => deleteWorkshop(workshopToDelete)}
            className="btn_dark_rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default AllWorkshop;
