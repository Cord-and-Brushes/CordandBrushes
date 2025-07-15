// src/pages/PrivacyPolicy.jsx

import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center p-6">
      <div className="bg-white rounded-lg shadow-lg max-w-4xl p-8">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <p className="mb-4">
          This Privacy Policy describes how we collect, use, and disclose your
          personal information when you visit or make a purchase from our
          website.
        </p>
        <h2 className="text-2xl font-semibold mb-4">
          1. Information We Collect
        </h2>
        <p className="mb-4">
          We collect various types of information, including information that
          you provide directly to us, information that we collect automatically,
          and information from third parties.
        </p>
        <h2 className="text-2xl font-semibold mb-4">2. Use of Information</h2>
        <p className="mb-4">
          We use the information we collect to operate our business, including
          providing and improving our services, personalizing your experience,
          and communicating with you.
        </p>
        <h2 className="text-2xl font-semibold mb-4">
          3. Sharing of Information
        </h2>
        <p className="mb-4">
          We may share your information with third parties under certain
          circumstances, including with service providers, to comply with legal
          obligations, and to protect our rights.
        </p>
        <h2 className="text-2xl font-semibold mb-4">4. Security</h2>
        <p className="mb-4">
          We take reasonable measures to protect your information from
          unauthorized access, use, or disclosure.
        </p>
        <h2 className="text-2xl font-semibold mb-4">
          5. Changes to This Policy
        </h2>
        <p className="mb-4">
          We may update this Privacy Policy from time to time. Your continued
          use of our website after any changes indicates your acceptance of the
          new policy.
        </p>
        <p className="mt-6">
          If you have any questions about this Privacy Policy, please contact
          us.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
