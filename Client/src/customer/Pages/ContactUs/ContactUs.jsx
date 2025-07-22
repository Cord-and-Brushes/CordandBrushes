import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faFacebook,
  faLinkedin,
  faWhatsapp,
  faYoutube, // Add this to the import
} from "@fortawesome/free-brands-svg-icons";
import {
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";
import api from "../../../api/api";

const ContactUs = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    api
      .get("/api/liveclasses/locations")
      .then((res) => setLocations(res.data))
      .catch(() => setLocations([]));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
    setError("");
    setSuccess("");
  };

  const validateEmail = (email) => {
    // Simple email regex
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    if (!form.name || !form.email || !form.message) {
      setError("All fields are required.");
      setSuccess("");
      return;
    }
    if (!validateEmail(form.email)) {
      setError("Please enter a valid email address.");
      setSuccess("");
      return;
    }
    // Here you would send the data to your backend or email service
    setSuccess("Thank you for contacting us! We will get back to you soon.");
    setError("");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center py-12">
      <h1 className="text-3xl font-bold mb-8">Contact Us</h1>
      <div className="bg-white shadow-lg rounded-lg w-full max-w-4xl p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div>
            <h2 className="text-xl font-bold mb-4">Send Us a Message</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              {error && <div className="text-red-500 text-sm">{error}</div>}
              {success && (
                <div className="text-green-600 text-sm">{success}</div>
              )}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                  placeholder="Your Name"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                  placeholder="Your Email"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                  rows="4"
                  placeholder="Your Message"
                  value={form.message}
                  onChange={handleChange}
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-[#F94C10] text-white rounded-md"
              >
                Send Message
              </button>
            </form>
          </div>
          {/* Contact Information */}
          <div>
            <h2 className="text-xl font-bold mb-4">Contact Information</h2>
            <ul className="space-y-4 text-gray-700">
              {/* Locations fetched from backend */}
              {locations.length > 0 && (
                <>
                  <li className="font-semibold">
                    We are available at these locations:
                  </li>
                  {locations.map((loc, idx) => (
                    <li key={idx} className="flex items-center space-x-2">
                      <FontAwesomeIcon
                        icon={faMapMarkerAlt}
                        className="text-[#F94C10] mt-1"
                      />
                      <span>{loc}</span>
                    </li>
                  ))}
                </>
              )}
              <li className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faPhone} className="text-[#F94C10]" />
                <span>+1 (123) 456-7890</span>
              </li>
              <li className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faEnvelope} className="text-[#F94C10]" />
                <span>info@ecommerce.com</span>
              </li>
            </ul>
            <div className="flex mt-6 space-x-4">
              <a
                href="https://www.instagram.com/cord_brushes?igsh=bjAzZHJqOWt6OWxn"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-pink-600 transition-colors duration-300"
              >
                <FontAwesomeIcon icon={faInstagram} size="xl" />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=100091734360086&mibextid=hu50Ix"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-500 transition-colors duration-300"
              >
                <FontAwesomeIcon icon={faFacebook} size="xl" />
              </a>
              <a
                href="https://www.linkedin.com/company/cord-brushes/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-700 transition-colors duration-300"
              >
                <FontAwesomeIcon icon={faLinkedin} size="xl" />
              </a>
              <a
                href="https://wa.me/+919109005499"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-green-600 transition-colors duration-300"
              >
                <FontAwesomeIcon icon={faWhatsapp} size="xl" />
              </a>
              <a
                href="https://www.youtube.com/@cordsbrushes"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-red-600 transition-colors duration-300"
              >
                <FontAwesomeIcon icon={faYoutube} size="xl" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
