import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import "./Workshop.css";
import MyButton from "../../components/common/Button/Button";

const Workshop = () => {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch workshops from API
  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/workshops/getallworkshops");
        setWorkshops(response.data);
      } catch (err) {
        console.error("Error fetching workshops:", err);
        setError("Failed to load workshops");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkshops();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format time for display
  const formatTime = (timeString) => {
    if (!timeString) return "";
    return timeString;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto min-h-screen">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Workshop</h1>
          <div className="flexCenter flex-col gap-4">
            <div className="spinner"></div>
            <div className="text-lg font-medium">Loading workshops...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto min-h-screen">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Workshop</h1>
          <p className="text-lg text-red-600 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto min-h-screen">
      {/* Custom Loader Overlay */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="flexCenter flex-col gap-4 bg-white p-8 rounded-lg">
            <div className="spinner"></div>
            <div className="text-lg font-medium">Loading workshops...</div>
          </div>
        </div>
      )}
      <div className="text-center mb-4 py-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 drop-shadow-sm">
          Workshop
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          Join our Workshop and enhance your artistic skills
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 px-4 mb-3">
        {workshops.map((workshop, index) => (
          <div
            key={workshop._id}
            className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:scale-105 border border-gray-100 backdrop-blur-sm animate-fadeInUp"
            style={{ animationDelay: `${(index + 1) * 0.1}s` }}
          >
            <div className="relative h-96 overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600">
              <img
                src={
                  workshop.image ||
                  "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1000"
                }
                alt={workshop.title}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wide shadow-lg">
                {workshop.mode}
              </div>
            </div>

            {/*  <div className="relative">
              <div className="absolute top-[-2rem] left-0 right-0 mx-4 z-10">
                <MyButton buttonText={"Enroll Now"} />
              </div>
            </div> */}

            <div className="px-8 py-4">
              <h3 className="text-2xl font-bold text-gray-800 mb-1">
                {workshop.title}
              </h3>
              <p className="text-gray-600 text-base leading-relaxed mb-2 line-clamp-3">
                {workshop.description}
              </p>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center gap-3 text-gray-700 text-sm font-semibold">
                  <i
                    className="fas fa-calendar text-lg"
                    style={{ color: "#f59e42" }}
                  ></i>
                  <span className="truncate">
                    {formatDate(workshop.startDate)} -{" "}
                    {formatDate(workshop.endDate)}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-gray-700 text-sm font-semibold">
                  <i
                    className="fas fa-clock text-lg"
                    style={{ color: "#f59e42" }}
                  ></i>
                  <span>{formatTime(workshop.time)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="flex items-center gap-3 text-gray-700 text-sm font-semibold">
                  <i
                    className="fas fa-chair text-lg"
                    style={{ color: "#f59e42" }}
                  ></i>
                  <span>{workshop.seats} seats left</span>
                </div>
                {workshop.mode === "Offline" && workshop.location && (
                  <div className="flex items-center gap-3 text-gray-700 text-sm font-semibold">
                    <i
                      className="fas fa-map-marker-alt text-lg"
                      style={{ color: "#f59e42" }}
                    ></i>
                    <span className="truncate">{workshop.location}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="px-8 pb-6 w-full flex justify-center">
              <MyButton buttonText={"Enroll Now"} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Workshop;
