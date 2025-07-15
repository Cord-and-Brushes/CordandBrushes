// src/pages/TermsAndConditions.jsx

import React from 'react';

const TermsAndConditions = () => {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center p-6">
      <div className="bg-white rounded-lg shadow-lg max-w-4xl p-8">
        <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>
        <p className="mb-4">
          Welcome to our eCommerce platform. By accessing and using our website, you agree to be bound by the following terms and conditions:
        </p>
        <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
        <p className="mb-4">
          By accessing our website, you acknowledge that you have read, understood, and agree to comply with these terms and conditions.
        </p>
        <h2 className="text-2xl font-semibold mb-4">2. Use of the Website</h2>
        <p className="mb-4">
          You agree to use the website for lawful purposes and in a way that does not infringe the rights of others.
        </p>
        <h2 className="text-2xl font-semibold mb-4">3. Intellectual Property</h2>
        <p className="mb-4">
          All content on this website, including text, graphics, logos, and images, is the property of our company or our content suppliers and is protected by copyright laws.
        </p>
        <h2 className="text-2xl font-semibold mb-4">4. Limitation of Liability</h2>
        <p className="mb-4">
          We are not liable for any damages arising from the use of our website.
        </p>
        <h2 className="text-2xl font-semibold mb-4">5. Changes to Terms</h2>
        <p className="mb-4">
          We reserve the right to change these terms at any time. Your continued use of the website following any changes indicates your acceptance of the new terms.
        </p>
        <p className="mt-6">
          If you have any questions about these Terms and Conditions, please contact us.
        </p>
      </div>
    </div>
  );
};

export default TermsAndConditions;
