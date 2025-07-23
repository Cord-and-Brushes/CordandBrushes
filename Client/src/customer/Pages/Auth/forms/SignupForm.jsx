import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../../../redux/features/authSlice";
import { initializeAuth } from "../../../../redux/features/authSlice";
import Heading from "../../../components/common/Heading/Heading";
import MyButton from "../../../components/common/Button/Button";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { clearError } from "../../../../redux/features/authSlice";

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
  const [successMessage, setSuccessMessage] = useState("");
  const [phoneOTP, setPhoneOTP] = useState("");
  const [showPhoneVerification, setShowPhoneVerification] = useState(false);
  const [phoneVerificationLoading, setPhoneVerificationLoading] =
    useState(false);
  const [phoneVerificationError, setPhoneVerificationError] = useState("");
  const [phoneVerificationSuccess, setPhoneVerificationSuccess] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, user } = useSelector((state) => state.auth);

  useEffect(() => {
    // Check if user is already logged in
    if (user) {
      navigate("/");
    }
    // Clear any previous error on mount
    dispatch({ type: "auth/registerUser/rejected", payload: null });
    dispatch(clearError());
  }, [user, navigate, dispatch]);

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
    if (!formData.number.trim()) {
      errors.number = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.number)) {
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

  const handleSendOTP = async () => {
    if (!formData.number.trim()) {
      setFormErrors({
        ...formErrors,
        number: "Please enter your phone number",
      });
      return;
    }

    if (!/^\d{10}$/.test(formData.number)) {
      setFormErrors({
        ...formErrors,
        number: "Please enter a valid 10-digit phone number",
      });
      return;
    }

    setPhoneVerificationLoading(true);
    setPhoneVerificationError("");

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_APP_SERVER_BASE_URL
        }/api/auth/send-pre-registration-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ number: formData.number }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setShowPhoneVerification(true);
        setPhoneVerificationSuccess("OTP sent to your phone number");
        setCountdown(60);
        startCountdown();

        // In development, show OTP in console
        if (data.otp) {
          console.log("Development OTP:", data.otp);
        }
      } else {
        setPhoneVerificationError(data.message || "Failed to send OTP");
      }
    } catch (err) {
      setPhoneVerificationError("Network error. Please try again.");
    } finally {
      setPhoneVerificationLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!phoneOTP.trim()) {
      setPhoneVerificationError("Please enter the OTP");
      return;
    }

    if (!/^\d{6}$/.test(phoneOTP)) {
      setPhoneVerificationError("Please enter a valid 6-digit OTP");
      return;
    }

    setPhoneVerificationLoading(true);
    setPhoneVerificationError("");

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_APP_SERVER_BASE_URL
        }/api/auth/verify-pre-registration-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ number: formData.number, otp: phoneOTP }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setPhoneVerificationSuccess("Phone number verified successfully!");
        setShowPhoneVerification(false);
        setPhoneOTP("");
        // Continue with registration - call the actual registration function
        await performRegistration();
      } else {
        setPhoneVerificationError(data.message || "Invalid OTP");
      }
    } catch (err) {
      setPhoneVerificationError("Network error. Please try again.");
    } finally {
      setPhoneVerificationLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;

    setPhoneVerificationLoading(true);
    setPhoneVerificationError("");

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_APP_SERVER_BASE_URL
        }/api/auth/send-pre-registration-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ number: formData.number }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setPhoneVerificationSuccess("New OTP sent to your phone number");
        setCountdown(60);
        startCountdown();

        // In development, show OTP in console
        if (data.otp) {
          console.log("Development OTP:", data.otp);
        }
      } else {
        setPhoneVerificationError(data.message || "Failed to resend OTP");
      }
    } catch (err) {
      setPhoneVerificationError("Network error. Please try again.");
    } finally {
      setPhoneVerificationLoading(false);
    }
  };

  const startCountdown = () => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const performRegistration = async () => {
    try {
      // Dispatch registerUser action with form data
      const resultAction = await dispatch(registerUser(formData));
      if (registerUser.fulfilled.match(resultAction)) {
        // Show success message and redirect to login
        setSuccessMessage(
          "Registration successful! Please check your email to verify your account before logging in."
        );
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate("/auth/login");
        }, 2000);
      } else if (registerUser.rejected.match(resultAction)) {
        // Handle registration error
        console.error("Registration failed:", resultAction.payload);
        setPhoneVerificationError(
          resultAction.payload?.message ||
            "Registration failed. Please try again."
        );
      }
    } catch (error) {
      console.error("Registration error:", error);
      setPhoneVerificationError("Registration failed. Please try again.");
    }
  };

  const handleSignUpClick = async (e) => {
    if (e) e.preventDefault();

    console.log("Signup form data:", formData);
    console.log("Phone verification status:", showPhoneVerification);

    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      console.log("Form validation errors:", errors);
      setFormErrors(errors);
      return;
    }

    if (!agreeToTerms) {
      console.log("Terms not agreed");
      setShowWarning(true);
      return;
    }

    // If phone verification is not completed, send OTP first
    if (!showPhoneVerification) {
      console.log("Sending OTP...");
      await handleSendOTP();
      return;
    }

    // If phone verification is completed, proceed with registration
    console.log("Proceeding with registration...");
    await performRegistration();
  };

  const handleLogin = () => {
    navigate("/auth/login");
  };

  return (
    <div className="card23 w-full max-w-md shadow-2xl ring-1 ring-orange-600 rounded-lg p-4 bg-white/85">
      {/* Custom Loader Overlay */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="flexCenter flex-col gap-4 bg-white p-6 rounded-lg">
            <div className="spinner"></div>
            <div className="text-lg font-medium">Signing up...</div>
          </div>
        </div>
      )}
      <div className="card45">
        <form className="form">
          <Heading text="SIGN UP" />
          {successMessage && (
            <div className="mb-2 p-2 bg-green-100 border border-green-400 text-green-700 rounded text-center font-medium">
              {successMessage}
            </div>
          )}
          <div className="field mb-1">
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
          <div className="field mb-1">
            <input
              type="email"
              name="email"
              className={`input-field w-full p-2 rounded-md border ${
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
          <div className="field mb-1">
            <input
              type="password"
              name="password"
              className={`input-field w-full p-2 rounded-md border ${
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
          <div className="field mb-1">
            <input
              type="text"
              name="number"
              inputMode="numeric"
              pattern="\d*"
              className={`input-field w-full p-2 rounded-md border ${
                formErrors.number ? "border-red-500" : "border-black"
              } focus:outline-none focus:border-orange-600`}
              placeholder="Phone Number (10 digits)"
              value={formData.number}
              onChange={(e) => {
                // Only allow digits, max 10
                const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                handleChange({ target: { name: "number", value } });
              }}
            />
            {formErrors.number && (
              <p className="text-red-500 text-sm mt-1">{formErrors.number}</p>
            )}
          </div>

          {/* Phone Verification Section 
      This uses `type="text"` with `inputMode="numeric"` and a custom `onChange` to restrict input to digits only, without showing number input arrows.*/}
          {showPhoneVerification && (
            <div className="field grid mb-1 p-2  rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">
                Enter the 6-digit code sent to {formData.number}
              </p>
              <div className="flex w-full items-center gap-2 mb-2">
                <input
                  type="text"
                  className="w-2/3 py-1.5 px-2 rounded-md border border-black focus:outline-none focus:border-orange-600 text-center  tracking-widest"
                  placeholder="000000"
                  value={phoneOTP}
                  onChange={(e) =>
                    setPhoneOTP(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  maxLength={6}
                />
                {/*  </div>
              <div className="flex w-2/3 gap-2 mt-2"> */}
                <button
                  type="button"
                  onClick={handleVerifyOTP}
                  disabled={phoneVerificationLoading}
                  className=" w-1/3 bg-orange-600 text-white py-2 px-2 rounded-md hover:bg-orange-700 disabled:opacity-50 text-xs lg:text-sm"
                >
                  {phoneVerificationLoading ? "Verifying..." : "Verify OTP"}
                </button>
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={countdown > 0 || phoneVerificationLoading}
                  className={`px-2 py-2 rounded-md  text-xs lg:text-sm ${
                    countdown > 0
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {countdown > 0 ? `${countdown}s` : "Resend"}
                </button>
              </div>
              {phoneVerificationError && (
                <p className="text-red-500 text-xs ">
                  {phoneVerificationError}
                </p>
              )}
              {phoneVerificationSuccess && (
                <p className="text-green-500 text-xs">
                  {phoneVerificationSuccess}
                </p>
              )}
            </div>
          )}

          <div className="field mb-1 flex items-center">
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
            <p className="text-red-500 text-sm mb-2">
              Please agree to the Terms of Use before signing up.
            </p>
          )}
          {error && (
            <p className="text-red-500 text-sm mb-2">
              {error.message || "An error occurred during registration"}
            </p>
          )}
          <div className="flex flex-col gap-x-3 justify-center items-center py-1">
            <MyButton
              buttonText={
                loading
                  ? "Signing up..."
                  : showPhoneVerification
                  ? "Complete Registration"
                  : "Send OTP & Continue"
              }
              pageUrl="/"
              onClick={handleSignUpClick}
              disabled={loading || phoneVerificationLoading}
            />
            <div className="mt-1">
              <p>
                Already a user?{" "}
                <span
                  onClick={handleLogin}
                  className="hover:underline hover:text-orange-600 cursor-pointer"
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
