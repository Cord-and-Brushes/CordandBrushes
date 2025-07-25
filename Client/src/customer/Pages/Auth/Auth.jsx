import React, { useState, useEffect } from "react";
import logo from "../../../assets/2.png";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import LoginForm from "./forms/LoginForm";
import SignupForm from "./forms/SignupForm";
import ForgotPasswordForm from "./forms/ForgotPasswordForm";
import ResetPasswordForm from "./forms/ResetPasswordForm";

const Auth = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [alertShown, setAlertShown] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const images = [
    "https://i.postimg.cc/qvWBNBYC/andres-perez-se0-GXEsgt-Pk-unsplash.jpg",
    "https://i.postimg.cc/fRVTWSHN/estee-janssens-MUf7-Ly04s-OI-unsplash.jpg",
    "https://i.postimg.cc/ydy7pmNF/md-jerry-y3-SQOb-Xr2-Lw-unsplash.jpg",
    "https://i.postimg.cc/d0dsrPPN/pawel-czerwinski-l8-DUam8vtbc-unsplash.jpg",
    "https://i.postimg.cc/gJV0F9gL/pawel-czerwinski-ru-Jm3d-BXCqw-unsplash.jpg",
    "https://i.postimg.cc/Y9Hpxntr/sydney-rae-Llqd-Lp6-KU0-U-unsplash.jpg",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFadingOut(true);
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        setIsFadingOut(false);
      }, 300); // Duration of fade-out transition
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    if (!alertShown) {
      const queryParams = new URLSearchParams(location.search);
      if (queryParams.get("verified") === "true") {
        alert("Your email has been verified. You can now log in.");
        setAlertShown(true);
      }
    }
  }, [location, alertShown]);

  // Simulate loading for 1.5s on mount
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white relative">
      {/* Custom Loader Overlay */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="flexCenter flex-col gap-4 bg-white p-8 rounded-lg">
            <div className="spinner"></div>
            <div className="text-lg font-medium">Loading...</div>
          </div>
        </div>
      )}

      {/* MOBILE: Form above, images as background */}
      <div className="block lg:hidden relative min-h-screen w-full">
        <div className="absolute inset-0 z-0">
          <img
            src={images[currentImageIndex]}
            alt={`Slide ${currentImageIndex + 1}`}
            className={`w-full h-full object-cover transition-opacity duration-500 ${
              isFadingOut ? "opacity-0" : "opacity-100"
            }`}
          />
        </div>
        <div className="relative z-10 flex flex-col justify-center items-center min-h-screen bg-white/20 px-6 py-8 sm:py-8 md:px-8">
          <div className="flex justify-center items-center w-full mt-2 mb-6">
            <img src={logo} alt="Company Logo" className="h-[70px] w-auto" />
          </div>
          <Routes>
            <Route path="login" element={<LoginForm />} />
            <Route path="signup" element={<SignupForm />} />
            <Route path="forgot-password" element={<ForgotPasswordForm />} />
            <Route
              path="reset-password/:userId/:token"
              element={<ResetPasswordForm />}
            />
          </Routes>
        </div>
      </div>

      {/* DESKTOP: Side by side */}
      <div className="hidden lg:flex w-full h-screen">
        {/* LEFT SECTION: Images */}
        <div className="w-3/5 bg-gray-100 relative h-full">
          <div className="absolute top-5 left-5 z-10">
            <img src={logo} alt="Company Logo" className="h-[80px]" />
          </div>
          <div className="h-full flex justify-center items-center overflow-hidden">
            <img
              src={images[currentImageIndex]}
              alt={`Slide ${currentImageIndex + 1}`}
              className={`w-full h-full object-cover transition-opacity duration-500 ${
                isFadingOut ? "opacity-0" : "opacity-100"
              }`}
            />
          </div>
        </div>
        {/* RIGHT SECTION: Form */}
        <div className="w-2/5 flex flex-col justify-center items-center px-8 py-0 relative z-10 bg-white min-h-[400px]">
          <Routes>
            <Route path="login" element={<LoginForm />} />
            <Route path="signup" element={<SignupForm />} />
            <Route path="forgot-password" element={<ForgotPasswordForm />} />
            <Route
              path="reset-password/:userId/:token"
              element={<ResetPasswordForm />}
            />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Auth;
