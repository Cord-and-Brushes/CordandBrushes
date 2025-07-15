import React, { useState } from "react";
import logo from "../assets/logo2.png";
import image from "../assets/image.png";
import { useDispatch } from "react-redux";
import { logout } from "../features/authSlice";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = () => {
    setIsModalOpen(true);
  };

  const handleConfirmLogout = () => {
    dispatch(logout());
    navigate("/");
    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <nav className="max_padd_container flexBetween bg-black py-1 px-4 relative">
      <div className="font-anta text-white">
        <img src={image} alt="logo" height={48} width={48} />
      </div>
      <div className="font-anta text-white bold-22 bg-[black]/60 px-3 rounded-md tracking-widest line-clamp-1 max-xs:bold-18 max-xs:py-2 max-xs:px-1">
        ADMIN PANEL
      </div>
      <div>
        <button className="btn_dark_rounded" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Delete Confirmation"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <h2>Confirm Logout</h2>
        <p>Are you sure you want to logout?</p>
        <div className="flex gap-x-5 mt-3">
          <button onClick={handleCloseModal} className="btn_dark_rounded">
            Cancel
          </button>
          <button
            onClick={handleConfirmLogout}
            className="btn_dark_rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </Modal>
    </nav>
  );
};

export default Navbar;
