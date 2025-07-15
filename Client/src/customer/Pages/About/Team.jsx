import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import MemberCard from "../../components/AboutPage/MemberCard/MemberCard";

const Team = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    api
      .get("/api/aboutpage/content")
      .then((res) => {
        setTeams(res.data.teams || []);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load team data");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flexCenter flex-col gap-4">
          <div className="spinner"></div>
          <div className="text-lg font-medium">Loading team...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-red-600 font-medium">{error}</div>
        </div>
      </div>
    );
  }

  if (!teams.length) return null;

  return (
    <div className="relative">
      <div className="container mx-auto px-4 py-12">
        <div className="items-center lg:justify-none">
          <h2 className="text-left font-dosis text-4xl font-bold mb-4 pb-4 p-4">
            Our Team
          </h2>
          <div className="flex flex-col justify-center items-center lg:justify-none">
            <section className="grid grid-cols-1 justify-center items-center sm:grid-cols-2 sm:gap-16 md:grid-cols-2 lg:grid-cols-4 gap-y-16 md:gap-x-20 lg:gap-x-20 p-4 sm:p-8 md:p-12 lg:p-20 max-w-full">
              {teams.map((member) => (
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

export default Team;
