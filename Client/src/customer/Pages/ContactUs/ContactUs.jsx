import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInstagram,
  faFacebook,
  faLinkedin,
  faWhatsapp,
} from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faPhone, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

const ContactUs = () => {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center py-12">
      <h1 className="text-3xl font-bold mb-8">Contact Us</h1>
      <div className="bg-white shadow-lg rounded-lg w-full max-w-4xl p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div>
            <h2 className="text-xl font-bold mb-4">Send Us a Message</h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  id="name"
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                  placeholder="Your Name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  id="email"
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                  placeholder="Your Email"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                <textarea
                  id="message"
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                  rows="4"
                  placeholder="Your Message"
                ></textarea>
              </div>
              <button type="submit" className="w-full py-2 px-4 bg-[#F94C10] text-white rounded-md">
                Send Message
              </button>
            </form>
          </div>
          {/* Contact Information */}
          <div>
            <h2 className="text-xl font-bold mb-4">Contact Information</h2>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-[#F94C10]" />
                <span>123 Ecommerce St, City, Country</span>
              </li>
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
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-pink-600 transition-colors duration-300"
              >
                <FontAwesomeIcon icon={faInstagram} size="lg" />
              </a>
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-500 transition-colors duration-300"
              >
                <FontAwesomeIcon icon={faFacebook} size="lg" />
              </a>
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-700 transition-colors duration-300"
              >
                <FontAwesomeIcon icon={faLinkedin} size="lg" />
              </a>
              <a
                href="https://wa.me/+1234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-green-600 transition-colors duration-300"
              >
                <FontAwesomeIcon icon={faWhatsapp} size="lg" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
