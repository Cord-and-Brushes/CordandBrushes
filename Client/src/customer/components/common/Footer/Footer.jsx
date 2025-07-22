import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faFacebook,
  faLinkedin,
  faWhatsapp,
  faYoutube, // Add this to the import
} from "@fortawesome/free-brands-svg-icons";
import api from "../../../../api/api";
import { Link } from "react-router-dom";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";

const Footer = () => {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    // Fetch locations from backend
    api
      .get("/api/liveclasses/locations")
      .then((res) => setLocations(res.data))
      .catch(() => setLocations([]));
  }, []);

  return (
    <div className="bg-[#F94C10] text-white py-12">
      <div className="px-12 lg:px-24 flex justify-between flex-col md:flex-row">
        {/* Logo and Description */}
        <div className="flex flex-col items-start">
          <div className="flex items-center mb-4">
            <img
              src="/src/assets/2.png"
              alt="Company Logo"
              className="h-20 sm:h-20 md:h-24 lg:h-28 mr-2"
            />
            <h1 className="text-3xl font-bold">Cords & Brushes</h1>
          </div>
          <p className="text-white mb-4 px-5 text-base">
            Your new handmade and artisan site has already been created!
          </p>
          <div className="text-white space-y-2 text-base mb-4 px-5">
            <p className="text-white">Email: info@cordsbrushes.com</p>
            <p className="text-white">Phone: +91 91090 05499</p>
          </div>
          <div className="flex gap-4 mt-2 px-5">
            <a
              href="https://www.instagram.com/cord_brushes?igsh=bjAzZHJqOWt6OWxn"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-pink-600 transition-colors duration-300"
            >
              <FontAwesomeIcon icon={faInstagram} size="xl" />
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=100091734360086&mibextid=hu50Ix"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-blue-500 transition-colors duration-300"
            >
              <FontAwesomeIcon icon={faFacebook} size="xl" />
            </a>
            <a
              href="https://www.linkedin.com/company/cord-brushes/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-blue-700 transition-colors duration-300"
            >
              <FontAwesomeIcon icon={faLinkedin} size="xl" />
            </a>
            <a
              href="https://wa.me/+919109005499"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-green-600 transition-colors duration-300"
            >
              <FontAwesomeIcon icon={faWhatsapp} size="xl" />
            </a>
            <a
              href="https://www.youtube.com/@cordsbrushes" // Replace with actual channel if different
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-red-600 transition-colors duration-300"
            >
              <FontAwesomeIcon icon={faYoutube} size="xl" />
            </a>
          </div>
        </div>

        <div className="mt-5 flex flex-col items-center text-center sm:grid sm:grid-cols-3 md:items-start md:text-left gap-8 md:gap-16 lg:mt-10">
          {/* About Us Section */}
          <div>
            <h1 className="text-xl font-bold mb-4 text-orange-50">About</h1>
            {/*   <div className="w-5 h-1 items-center bg-white"></div> */}
            <ul className="space-y-2">
              <li className="text-white hover:text-black transition-colors duration-300 text-base">
                <Link to="/about">About Us</Link>
              </li>
              {/* <li className="text-white hover:text-black transition-colors duration-300 text-sm">
                <Link to="/services">Our Services</Link>
              </li> */}
              <li className="text-white hover:text-black transition-colors duration-300 text-base">
                <Link to="/team">Our Team</Link>
              </li>
              <li className="text-white hover:text-black transition-colors duration-300 text-base">
                <Link to="/contact">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Help Section */}
          <div>
            <h1 className="text-xl font-bold mb-4 text-orange-50">Legal</h1>
            <ul className="space-y-2">
              <li className="text-white hover:text-black transition-colors duration-300 text-base">
                <Link to="/privacy">Privacy Policy</Link>
              </li>
              <li className="text-white hover:text-black transition-colors duration-300 text-base">
                <Link to="/terms">Terms & Conditions</Link>
              </li>
              {/* <li className="text-white hover:text-black transition-colors duration-300 text-sm">
                <Link to="/discounts">Discounts</Link>
              </li> */}
              {/* <li className="text-white hover:text-black transition-colors duration-300 text-sm">
                <Link to="/returns">Returns</Link>
              </li> */}
            </ul>
          </div>

          {/* Location Section */}
          <div>
            <h1 className="text-xl font-bold mb-4 text-orange-50">Locations</h1>
            <ul className="space-y-2">
              {locations.length === 0 ? (
                <li className="text-white text-base">No locations available</li>
              ) : (
                locations.map((loc, idx) => (
                  <li key={idx} className="text-white text-base">
                    {loc}
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>

        {/* Location Section for mobile is now unified above */}
      </div>
    </div>
  );
};

export default Footer;
