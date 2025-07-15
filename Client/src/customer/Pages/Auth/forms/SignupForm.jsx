/* import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../../../redux/features/authSlice";
import Heading from "../../../components/common/Heading/Heading";
import MyButton from "../../../components/common/Button/Button";
import { Link, useNavigate } from "react-router-dom";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    number: "",
  });
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = () => {
    setAgreeToTerms(!agreeToTerms);
    setShowWarning(false); // Hide warning when checkbox is toggled
  };

  const handleSignUpClick = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    if (!agreeToTerms) {
      setShowWarning(true);
    } else {
      // Dispatch registerUser action with form data
      const resultAction = await dispatch(registerUser(formData));
      if (registerUser.fulfilled.match(resultAction)) {
        console.log("Signup successful!");
        navigate("/");
      } else {
        console.error("Signup failed:", resultAction.payload);
      }
    }
  };

  const handleLogin = () => {
    navigate("/auth/login");
  };

  return (
    <div className="card23 w-full max-w-md shadow-2xl ring-1 ring-orange-600 rounded-lg p-6 bg-white/85">
      <div className="card45">
        <form className="form">
          <Heading text="SIGN UP" />
          <div className="field mb-4">
            <input
              type="text"
              name="name"
              className="input-field w-full p-3 rounded-md border border-black focus:outline-none focus:border-orange-600"
              placeholder="Username"
              autoComplete="off"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="field mb-4">
            <input
              type="email"
              name="email"
              className="input-field w-full p-3 rounded-md border border-black focus:outline-none focus:border-orange-600"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="field mb-4">
            <input
              type="password"
              name="password"
              className="input-field w-full p-3 rounded-md border border-black focus:outline-none focus:border-orange-600"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="field mb-4">
            <input
              type="number"
              name="number"
              className="input-field w-full p-3 rounded-md border border-black focus:outline-none focus:border-orange-600"
              placeholder="Phone Number"
              value={formData.number}
              onChange={handleChange}
            />
          </div>
          <div className="field mb-4 flex items-center">
            <input
              type="checkbox"
              id="terms"
              className="mr-2"
              checked={agreeToTerms}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="terms">
              I agree to the{" "}
              <Link to="/terms" className="text-orange-600 hover:underline">
                Terms of Use
              </Link>
            </label>
          </div>
          {showWarning && (
            <p className="text-red-500 text-sm mb-4">
              Please agree to the Terms of Use before signing up.
            </p>
          )}
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <div className="flex flex-col gap-x-3 justify-center items-center py-4">
            <MyButton
              buttonText="Sign Up"
              pageUrl="/"
              onClick={handleSignUpClick}
              disabled={loading} // Disable button when loading
            />
            <div className="mt-6">
              <p>
                Already a user?{" "}
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

export default SignupForm;
 */

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../../../redux/features/authSlice";
import Heading from "../../../components/common/Heading/Heading";
import MyButton from "../../../components/common/Button/Button";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    number: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, user } = useSelector((state) => state.auth);

  useEffect(() => {
    // Check if user is already logged in
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    if (formData.number && !/^\d{10}$/.test(formData.number)) {
      errors.number = "Phone number must be 10 digits";
    }
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" });
    }
  };

  const handleCheckboxChange = () => {
    setAgreeToTerms(!agreeToTerms);
    setShowWarning(false);
  };

  const handleSignUpClick = async (e) => {
    e.preventDefault();

    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    if (!agreeToTerms) {
      setShowWarning(true);
      return;
    }

    // Dispatch registerUser action with form data
    const resultAction = await dispatch(registerUser(formData));
    if (registerUser.fulfilled.match(resultAction)) {
      // Show verify message and redirect to login, but do NOT log in
      alert(
        "Registration successful! Please check your email to verify your account before logging in."
      );
      navigate("/auth/login");
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
            <div className="text-lg font-medium">Signing up...</div>
          </div>
        </div>
      )}
      <div className="card45">
        <form className="form">
          <Heading text="SIGN UP" />
          <div className="field mb-4">
            <input
              type="text"
              name="name"
              className={`input-field w-full p-3 rounded-md border ${
                formErrors.name ? "border-red-500" : "border-black"
              } focus:outline-none focus:border-orange-600`}
              placeholder="Username"
              autoComplete="off"
              value={formData.name}
              onChange={handleChange}
            />
            {formErrors.name && (
              <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
            )}
          </div>
          <div className="field mb-4">
            <input
              type="email"
              name="email"
              className={`input-field w-full p-3 rounded-md border ${
                formErrors.email ? "border-red-500" : "border-black"
              } focus:outline-none focus:border-orange-600`}
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
            {formErrors.email && (
              <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
            )}
          </div>
          <div className="field mb-4">
            <input
              type="password"
              name="password"
              className={`input-field w-full p-3 rounded-md border ${
                formErrors.password ? "border-red-500" : "border-black"
              } focus:outline-none focus:border-orange-600`}
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            {formErrors.password && (
              <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>
            )}
          </div>
          <div className="field mb-4">
            <input
              type="number"
              name="number"
              className={`input-field w-full p-3 rounded-md border ${
                formErrors.number ? "border-red-500" : "border-black"
              } focus:outline-none focus:border-orange-600`}
              placeholder="Phone Number (optional)"
              value={formData.number}
              onChange={handleChange}
            />
            {formErrors.number && (
              <p className="text-red-500 text-sm mt-1">{formErrors.number}</p>
            )}
          </div>
          <div className="field mb-4 flex items-center">
            <input
              type="checkbox"
              id="terms"
              className="mr-2"
              checked={agreeToTerms}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="terms">
              I agree to the{" "}
              <Link to="/terms" className="text-orange-600 hover:underline">
                Terms of Use
              </Link>
            </label>
          </div>
          {showWarning && (
            <p className="text-red-500 text-sm mb-4">
              Please agree to the Terms of Use before signing up.
            </p>
          )}
          {error && (
            <p className="text-red-500 text-sm mb-4">
              {error.message || "An error occurred during registration"}
            </p>
          )}
          <div className="flex flex-col gap-x-3 justify-center items-center py-4">
            <MyButton
              buttonText={loading ? "Signing up..." : "Sign Up"}
              pageUrl="/"
              onClick={handleSignUpClick}
              disabled={loading}
            />
            <div className="mt-6">
              <p>
                Already a user?{" "}
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

export default SignupForm;
