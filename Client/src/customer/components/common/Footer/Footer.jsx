import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faFacebook,
  faLinkedin,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";

const Footer = () => {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div className="bg-[#F94C10] text-white py-12">
      <div className="px-12 lg:px-24 flex justify-between flex-col md:flex-row">
        {/* Logo and Description */}
        <div className="flex flex-col items-start">
          <div className="flex items-center mb-4">
            <img src="/logo2.png" alt="Company Logo" className="h-12 mr-2" />
            <h1 className="text-3xl font-bold">Cords & Brushes</h1>
          </div>
          <p className="text-white mb-4 text-sm">
            Your new handmade and artisan site has already been created!
          </p>
          <div className="text-white space-y-2 text-sm mb-4">
            <p className="text-white">Email: info@cordsbrushes.com</p>
            <p className="text-white">Phone: +91 91090 05499</p>
          </div>
          <div className="flex gap-4 mt-2">
            <a
              href="https://www.instagram.com/cord_brushes?igsh=bjAzZHJqOWt6OWxn"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-pink-600 transition-colors duration-300"
            >
              <FontAwesomeIcon icon={faInstagram} size="lg" />
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=100091734360086&mibextid=hu50Ix"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-blue-500 transition-colors duration-300"
            >
              <FontAwesomeIcon icon={faFacebook} size="lg" />
            </a>
            <a
              href="https://www.linkedin.com/company/cord-brushes/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-blue-700 transition-colors duration-300"
            >
              <FontAwesomeIcon icon={faLinkedin} size="lg" />
            </a>
            <a
              href="https://wa.me/+919109005499"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-green-600 transition-colors duration-300"
            >
              <FontAwesomeIcon icon={faWhatsapp} size="lg" />
            </a>
          </div>
        </div>

        <div className=" mt-5 flex lg:grid md:grid-cols-3 gap-8">
          {/* About Us Section */}
          <div>
            <h1 className="text-md font-bold mb-4">About</h1>
            <ul className="space-y-2">
              <li className="text-white hover:text-black transition-colors duration-300 text-sm">
                <Link to="/about">About Cord & Brushes</Link>
              </li>
              {/* <li className="text-white hover:text-black transition-colors duration-300 text-sm">
                <Link to="/services">Our Services</Link>
              </li> */}
              <li className="text-white hover:text-black transition-colors duration-300 text-sm">
                <Link to="/team">Our Team</Link>
              </li>
              <li className="text-white hover:text-black transition-colors duration-300 text-sm">
                <Link to="/contact">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Help Section */}
          <div>
            <h1 className="text-md font-bold mb-4">Legal</h1>
            <ul className="space-y-2">
              <li className="text-white hover:text-black transition-colors duration-300 text-sm">
                <Link to="/privacy">Privacy Policy</Link>
              </li>
              <li className="text-white hover:text-black transition-colors duration-300 text-sm">
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
          <div className="hidden lg:block">
            <h1 className="text-md font-bold mb-4">Locations</h1>
            <Accordion
              expanded={expanded === "panel1"}
              onChange={handleChange("panel1")}
              sx={{ backgroundColor: "#F94C10", color: "white" }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                sx={{ padding: 0 }}
              >
                <h2 className="text-sm font-bold hover:text-black text-white p-2">
                  Mumbai
                </h2>
              </AccordionSummary>
              <AccordionDetails
                sx={{ backgroundColor: "black", color: "white" }}
              >
                <div className="text-white text-sm">
                  <p className="text-white">123 Mumbai St.</p>
                  <p className="text-white">Mumbai, MH 400001</p>
                </div>
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={expanded === "panel2"}
              onChange={handleChange("panel2")}
              sx={{ backgroundColor: "#F94C10", color: "white" }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                sx={{ padding: 0 }}
              >
                <h2 className="text-sm font-bold hover:text-black text-white p-2">
                  Bhillai
                </h2>
              </AccordionSummary>
              <AccordionDetails
                sx={{ backgroundColor: "black", color: "white" }}
              >
                <div className="text-white text-sm">
                  <p className="text-white">456 Bhillai St.</p>
                  <p className="text-white">Bhillai, CG 490001</p>
                </div>
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={expanded === "panel3"}
              onChange={handleChange("panel3")}
              sx={{ backgroundColor: "#F94C10", color: "white" }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                sx={{ padding: 0 }}
              >
                <h2 className="text-sm font-bold hover:text-black text-white p-2">
                  Banglore
                </h2>
              </AccordionSummary>
              <AccordionDetails
                sx={{ backgroundColor: "black", color: "white" }}
              >
                <div className="text-white text-sm">
                  <p className="text-white">_____</p>
                  <p className="text-white">_______</p>
                </div>
              </AccordionDetails>
            </Accordion>
          </div>
        </div>

        {/* Location Section */}
        <div className="lg:hidden block mt-10">
          <h1 className="text-md font-bold mb-4">Locations</h1>
          <Accordion
            expanded={expanded === "panel1"}
            onChange={handleChange("panel1")}
            sx={{ backgroundColor: "#F94C10", color: "white" }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
              sx={{ padding: 0 }}
            >
              <h2 className="text-sm font-bold hover:text-black text-white p-2">
                Mumbai
              </h2>
            </AccordionSummary>
            <AccordionDetails sx={{ backgroundColor: "black", color: "white" }}>
              <div className="text-white text-sm">
                <p className="text-white">123 Mumbai St.</p>
                <p className="text-white">Mumbai, MH 400001</p>
              </div>
            </AccordionDetails>
          </Accordion>
          <Accordion
            expanded={expanded === "panel2"}
            onChange={handleChange("panel2")}
            sx={{ backgroundColor: "#F94C10", color: "white" }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
              sx={{ padding: 0 }}
            >
              <h2 className="text-sm font-bold hover:text-black text-white p-2">
                Bhillai
              </h2>
            </AccordionSummary>
            <AccordionDetails sx={{ backgroundColor: "black", color: "white" }}>
              <div className="text-white text-sm">
                <p className="text-white">456 Bhillai St.</p>
                <p className="text-white">Bhillai, CG 490001</p>
              </div>
            </AccordionDetails>
          </Accordion>
          <Accordion
            expanded={expanded === "panel3"}
            onChange={handleChange("panel3")}
            sx={{ backgroundColor: "#F94C10", color: "white" }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
              sx={{ padding: 0 }}
            >
              <h2 className="text-sm font-bold hover:text-black text-white p-2">
                Berhampur
              </h2>
            </AccordionSummary>
            <AccordionDetails sx={{ backgroundColor: "black", color: "white" }}>
              <div className="text-white text-sm">
                <p className="text-white">789 Berhampur St.</p>
                <p className="text-white">Berhampur, OR 760001</p>
              </div>
            </AccordionDetails>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default Footer;
