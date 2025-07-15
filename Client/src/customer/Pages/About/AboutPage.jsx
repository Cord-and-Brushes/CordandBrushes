import React, { useEffect, useState } from "react";

import {
  FaLinkedin,
  FaFacebook,
  FaInstagram,
  FaEnvelope,
} from "react-icons/fa";
import { RiDoubleQuotesL, RiDoubleQuotesR } from "react-icons/ri";
import { Link } from "react-router-dom";
import MemberCard from "../../components/AboutPage/MemberCard/MemberCard";

import api from "../../../api/api";
const AboutPage = () => {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get("/api/aboutpage/content")
      .then((res) => {
        setAbout(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching about data:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flexCenter flex-col gap-4">
          <div className="spinner"></div>
          <div className="text-lg font-medium">Loading about page...</div>
        </div>
      </div>
    );
  }

  if (!about) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-red-600 font-medium">
            Failed to load about page data
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Custom Loader Overlay */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="flexCenter flex-col gap-4 bg-white p-8 rounded-lg">
            <div className="spinner"></div>
            <div className="text-lg font-medium">Loading about page...</div>
          </div>
        </div>
      )}
      <div className="container mx-auto px-4 py-12">
        {/* Our Story */}
        <section className="text-left mb-12 font-cat px-4">
          <h2 className="text-4xl font-dosis font-bold mb-4">
            {about.storyTitle}
          </h2>
          <div className="flex flex-col-reverse lg:flex-row gap-x-4">
            <div className="text-md text-justify w-full lg:w-2/5 flex justify-start items-start pt-4">
              <div className="ring-2 ring-black rounded-md p-2">
                <div className="flex justify-start">
                  <RiDoubleQuotesL className="text-[20px]" />
                </div>
                <p className="p-6 text-[18px]">{about.storyText}</p>
                <div className="flex justify-end">
                  <RiDoubleQuotesR className="text-[20px]" />
                </div>
              </div>
            </div>
            <div className="w-full lg:w-3/5 pl-10 p-6 flex justify-center items-center">
              <img
                src={about.storyImage}
                className="rounded-md h-full w-full"
                alt="Our Story"
              />
            </div>
          </div>
        </section>
        {/* Our Leaders */}
        {about.leaders &&
          about.leaders.map((leader, idx) => (
            <section className="text-left mb-12 font-cat px-4" key={leader._id}>
              <h2 className="text-4xl font-dosis font-bold mb-4">
                {idx === 0 ? "Our Leaders" : ""}
              </h2>
              <div
                className={`flex flex-col-reverse ${
                  idx % 2 === 0 ? "lg:flex-row-reverse" : "lg:flex-row"
                } gap-x-2`}
              >
                <div className="text-md text-justify w-full lg:w-3/5 flex flex-col justify-start items-start pt-4">
                  <div className="ring-2 ring-black rounded-md p-2">
                    <h1 className="text-2xl pl-2 font-dosis font-semibold">
                      {leader.name}
                    </h1>
                    <h3 className="text-gray-400 pl-2 font-dosis font-medium">
                      {leader.designation}
                    </h3>
                    <div>
                      <div className="flex justify-start">
                        <RiDoubleQuotesL className="text-[20px]" />
                      </div>
                      <p className="p-6 text-[18px]">{leader.description}</p>
                      <div className="flex justify-end">
                        <RiDoubleQuotesR className="text-[20px]" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full lg:w-2/5 pl-0 p-0 lg:p-4">
                  <div className="cards flex justify-center items-center">
                    <img
                      src={leader.image}
                      alt={leader.name}
                      className="border-5 rounded-md"
                    />
                  </div>
                </div>
              </div>
            </section>
          ))}
        {/* Our Team */}
        <div className="items-center lg:justify-none">
          <h2 className="text-left font-dosis text-4xl font-bold mb-4 pb-4 p-4">
            Our Team
          </h2>
          <div className="flex flex-col justify-center items-center lg:justify-none">
            <section className="grid grid-cols-1 justify-center items-center sm:grid-cols-2 sm:gap-16 md:grid-cols-2 lg:grid-cols-4 gap-y-16 md:gap-x-20 lg:gap-x-20 p-4 sm:p-8 md:p-12 lg:p-20 max-w-full">
              {about.teams &&
                about.teams.map((member) => (
                  <MemberCard
                    key={member._id}
                    image={member.image}
                    name={member.name}
                    designation={member.designation}
                  />
                ))}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
