import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Heading from "../../../components/common/Heading/Heading";
import MyButton from "../../../components/common/Button/Button";
import { resetPassword } from "../../../../redux/features/authSlice"; // Import the action

const ResetPasswordForm = () => {
  const { userId, token } = useParams();
  const dispatch = useDispatch();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [match, setMatch] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setMatch(e.target.value === confirmPassword);
    setShowWarning(e.target.value !== confirmPassword);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setMatch(e.target.value === password);
    setShowWarning(e.target.value !== password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!match) {
      alert("Passwords do not match.");
      return;
    }
    const response = await dispatch(
      resetPassword({ id: userId, token, password })
    );
    if (response.payload.message === "Password updated successfully!") {
      alert("Password reset successful!");
      navigate("/auth/login");
    } else {
      alert("Failed to reset password.");
    }
  };

  return (
    <div className="card23 w-full max-w-md rounded-lg p-6 shadow-2xl ring-1 ring-orange-600 bg-white/85">
      {/* Custom Loader Overlay */}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="flexCenter flex-col gap-4 bg-white p-8 rounded-lg">
            <div className="spinner"></div>
            <div className="text-lg font-medium">Resetting password...</div>
          </div>
        </div>
      )}
      <div className="card45">
        <form onSubmit={handleSubmit} className="form">
          <Heading text="PASSWORD RESET" />
          <div className="field mb-4">
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="New Password"
              className="input-field w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:border-orange-600"
              required
            />
          </div>
          <div className="field mb-4">
            <input
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              placeholder="Confirm New Password"
              className="input-field w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:border-orange-600"
              required
            />
          </div>
          {showWarning && (
            <p className="text-red-500 text-sm mb-4">
              The password and confirm password do not match
            </p>
          )}
          {error && (
            <p className="text-red-500 text-sm mb-4">
              {error.message || "Failed to reset password."}
            </p>
          )}
          <div className="flex flex-col gap-x-3 justify-center items-center py-4">
            <MyButton
              buttonText="Reset Password"
              onClick={handleSubmit}
              disabled={!match || isLoading}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
