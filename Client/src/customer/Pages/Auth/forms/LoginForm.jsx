import React, { useState } from "react";
import Heading from "../../../components/common/Heading/Heading";
import MyButton from "../../../components/common/Button/Button";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../../../redux/features/authSlice";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error, loading } = useSelector((state) => state.auth);

  const handleForgotPassword = () => {
    navigate("/auth/forgot-password");
  };

  const handleSignUp = () => {
    navigate("/auth/signup");
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError(""); // Clear previous errors

    dispatch(loginUser({ email, password }))
      .unwrap()
      .then((response) => {
        console.log(response);
        if (
          response.user &&
          (response.user.isVerified === true ||
            response.user.isVerified === "true")
        ) {
          localStorage.setItem("token", response.token);
          localStorage.setItem("user", JSON.stringify(response.user));
          navigate("/");
        } else if (
          response.user &&
          (response.user.isVerified === false ||
            response.user.isVerified === "false")
        ) {
          setLoginError("Please verify your email before logging in.");
        } else {
          setLoginError(response.message || "Login failed. Please try again.");
        }
      })
      .catch((err) => {
        console.error("Failed to login:", err);
        // Handle different types of errors
        if (err.message === "Verification link sent to your email!") {
          setLoginError(
            "Please check your email and verify your account before logging in."
          );
        } else if (err.message === "Invalid email or password!") {
          setLoginError(
            "Invalid email or password. Please check your credentials."
          );
        } else {
          setLoginError(err.message || "Login failed. Please try again.");
        }
      });
  };

  return (
    <div className="card23 w-full max-w-md shadow-2xl ring-1 ring-orange-600 rounded-lg p-6 bg-white/85">
      {/* Custom Loader Overlay */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="flexCenter flex-col gap-4 bg-white p-8 rounded-lg">
            <div className="spinner"></div>
            <div className="text-lg font-medium">Logging in...</div>
          </div>
        </div>
      )}
      <div className="card45">
        <form className="form" onSubmit={handleLogin}>
          <Heading text="LOGIN" />
          {(error || loginError) && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {loginError || error?.message || "An error occurred during login"}
            </div>
          )}
          <div className="field mb-4">
            <input
              type="email"
              className="input-field w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:border-orange-600"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="field mb-4">
            <input
              type="password"
              className="input-field w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:border-orange-600"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <p
            className="mt-3 ml-4 hover:underline hover:text-orange-600 cursor-pointer"
            onClick={handleForgotPassword}
          >
            Forgot password?
          </p>
          <div className="flex flex-col gap-x-3 justify-center items-center py-4">
            <MyButton
              buttonText={loading ? "Logging in..." : "Login"}
              pageUrl="/"
              onClick={handleLogin}
              disabled={loading}
            />
            <div className="mt-6">
              <p>
                New here?{" "}
                <span
                  onClick={handleSignUp}
                  className="mt-3 hover:underline hover:text-orange-600 cursor-pointer"
                >
                  Sign Up
                </span>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
