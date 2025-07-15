import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Heading from "../../../components/common/Heading/Heading";
import MyButton from "../../../components/common/Button/Button";
import { forgotPassword } from "../../../../redux/features/authSlice"; // Import the action

const ForgotPasswordForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await dispatch(forgotPassword({ email }));
    setLoading(false);
    if (response.payload?.success) {
      navigate("/auth/reset-password");
    } else {
      alert(
        response.payload?.message || "Failed to send reset password email."
      );
    }
  };

  const handleLogin = () => {
    navigate("/auth/login");
  };

  return (
    <div className="card23 w-full max-w-md shadow-2xl ring-1 ring-orange-600 rounded-lg p-6 bg-white/85">
      {/* Custom Loader Overlay */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="flexCenter flex-col gap-4 bg-white p-8 rounded-lg">
            <div className="spinner"></div>
            <div className="text-lg font-medium">Processing...</div>
          </div>
        </div>
      )}
      <div className="card45">
        <form onSubmit={handleForgotPassword} className="form">
          <Heading text="FORGOT PASSWORD" />
          <div className="field mb-4">
            <input
              type="email"
              className="input-field w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:border-orange-600"
              placeholder="Enter Your Registered Email!"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-x-3 justify-center items-center py-4">
            <MyButton buttonText="Proceed" onClick={handleForgotPassword} />
            <div className="mt-6">
              <p>
                Remembered your password?{" "}
                <span
                  onClick={handleLogin}
                  className="mt-3 hover:underline hover:text-orange-600 cursor-pointer"
                >
                  Login
                </span>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
