/* import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Heading from "../../../components/common/Heading/Heading";
import MyButton from "../../../components/common/Button/Button";
import { useNavigate } from "react-router-dom";

const PhoneVerificationForm = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("phone"); // "phone" or "otp"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();

  const handleSendOTP = async () => {
    if (!phoneNumber.trim()) {
      setError("Please enter your phone number");
      return;
    }

    if (!/^\d{10}$/.test(phoneNumber)) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/send-phone-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ number: phoneNumber }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setOtpSent(true);
        setStep("otp");
        setSuccess("OTP sent to your phone number");
        setCountdown(60); // Start 60-second countdown
        startCountdown();

        // In development, show OTP in console
        if (data.otp) {
          console.log("Development OTP:", data.otp);
        }
      } else {
        setError(data.message || "Failed to send OTP");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp.trim()) {
      setError("Please enter the OTP");
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/verify-phone-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ number: phoneNumber, otp }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess("Phone number verified successfully!");
        setTimeout(() => {
          navigate("/auth/login");
        }, 2000);
      } else {
        setError(data.message || "Invalid OTP");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/resend-phone-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ number: phoneNumber }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess("New OTP sent to your phone number");
        setCountdown(60);
        startCountdown();

        // In development, show OTP in console
        if (data.otp) {
          console.log("Development OTP:", data.otp);
        }
      } else {
        setError(data.message || "Failed to resend OTP");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
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

  const handleBackToLogin = () => {
    navigate("/auth/login");
  };

  return (
    <div className="card23 w-full max-w-md shadow-2xl ring-1 ring-orange-600 rounded-lg p-4 bg-white/85">
     
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="flexCenter flex-col gap-4 bg-white p-6 rounded-lg">
            <div className="spinner"></div>
            <div className="text-lg font-medium">
              {step === "phone" ? "Sending OTP..." : "Verifying..."}
            </div>
          </div>
        </div>
      )}

      <div className="card45">
        <form className="form">
          <Heading text="PHONE VERIFICATION" />

          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded text-center font-medium">
              {success}
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-center font-medium">
              {error}
            </div>
          )}

          {step === "phone" ? (
            <>
              <div className="mb-4">
                <p className="text-gray-600 text-center mb-4">
                  Enter your phone number to receive a verification code
                </p>
                <input
                  type="tel"
                  className="input-field w-full p-3 rounded-md border border-black focus:outline-none focus:border-orange-600"
                  placeholder="Enter 10-digit phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  maxLength={10}
                />
              </div>
              <div className="flex flex-col gap-3 justify-center items-center py-2">
                <MyButton
                  buttonText="Send OTP"
                  onClick={handleSendOTP}
                  disabled={loading}
                />
                <div className="mt-3">
                  <p>
                    Already verified?{" "}
                    <span
                      onClick={handleBackToLogin}
                      className="hover:underline hover:text-orange-600 cursor-pointer"
                    >
                      Login
                    </span>
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="mb-4">
                <p className="text-gray-600 text-center mb-4">
                  Enter the 6-digit code sent to {phoneNumber}
                </p>
                <input
                  type="text"
                  className="input-field w-full p-3 rounded-md border border-black focus:outline-none focus:border-orange-600 text-center text-2xl tracking-widest"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  maxLength={6}
                />
              </div>
              <div className="flex flex-col gap-3 justify-center items-center py-2">
                <MyButton
                  buttonText="Verify OTP"
                  onClick={handleVerifyOTP}
                  disabled={loading}
                />
                <div className="mt-3 text-center">
                  <p className="text-sm text-gray-600 mb-2">
                    Didn't receive the code?
                  </p>
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={countdown > 0 || loading}
                    className={`text-sm ${
                      countdown > 0
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-orange-600 hover:underline"
                    }`}
                  >
                    {countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
                  </button>
                </div>
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => setStep("phone")}
                    className="text-sm text-gray-600 hover:text-orange-600 hover:underline"
                  >
                    Change phone number
                  </button>
                </div>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default PhoneVerificationForm;
 */
