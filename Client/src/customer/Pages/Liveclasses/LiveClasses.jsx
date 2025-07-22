import React, { useEffect, useState } from "react";
import api from "../../../api/api"; // Adjust the import path as needed
import "./LiveClasses.css";
import MyButton from "../../components/common/Button/Button";
import SoonLoader from "../../components/common/coming_soon_loader/SoonLoader";
import { handleLiveClassBook } from "../../Pages/Redrect/Whatsapp";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
const LiveClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    setLoading(true);
    api
      .get("/api/liveclasses/getclasses")
      .then((res) => {
        // Support both { liveClasses: [...] } and [...] response
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.liveClasses || [];
        setClasses(data);
      })
      .catch(() => setClasses([]))
      .finally(() => setLoading(false));
  }, []);
  console.log(classes);

  const filteredClasses = selectedLocation
    ? classes.filter((cls) => cls.location === selectedLocation)
    : classes;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto min-h-screen">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">LiveClasses</h1>
          <div className="flexCenter flex-col gap-4">
            <div className="spinner"></div>
            <div className="text-lg font-medium">Loading live classes...</div>
          </div>
        </div>
      </div>
    );
  }

  if (filteredClasses.length === 0) {
    return (
      <div className="max-w-7xl mx-auto min-h-screen">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">LiveClasses</h1>
          <SoonLoader />
        </div>
      </div>
    );
  }

  const handleBookEnquiry = (liveclass) => {
    if (!user) {
      toast.error("You must be logged in to enquire about the live class.", {
        position: "bottom-right",
        autoClose: 3000,
        theme: "dark",
      });
      return;
    }
    handleLiveClassBook(liveclass, user);
  };

  return (
    <div className="max-w-7xl mx-auto min-h-screen">
      <div className="text-center mb-4 py-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 drop-shadow-sm">
          LiveClasses
        </h1>
        <p className="text-lg text-center text-gray-700">
          Choose a location to find live classes available in your area.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-4 mt-6">
        {Array.from(new Set(classes.map((cls) => cls.location))).map(
          (location) => (
            <MyButton
              key={location}
              className={`px-4 py-2 rounded shadow transition ${
                selectedLocation === location ? "" : ""
              }`}
              onClick={() => setSelectedLocation(location)}
              buttonText={location}
            />
          )
        )}
      </div>
      <div className="class-list-container mb-5">
        {filteredClasses.map((cls) => (
          <div key={cls._id || cls.id} className="class-card">
            <div className="class-image-wrapper">
              <img
                src={
                  cls.image ||
                  "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1000"
                }
                alt={cls.course || cls.title}
                className="class-image"
              />
              <div className={`class-level-badge ${cls.level?.toLowerCase()}`}>
                {cls.level}
              </div>
            </div>
            <div className="class-info">
              <h3>{cls.course || cls.title}</h3>
              <p>{cls.description}</p>
              <div className="class-details-row">
                <span>
                  <i
                    className="fas fa-calendar-day"
                    style={{ color: "#f59e42" }}
                  ></i>{" "}
                  {Array.isArray(cls.day)
                    ? cls.day.map((d) => d.slice(0, 3)).join(", ")
                    : typeof cls.day === "string"
                    ? cls.day.slice(0, 3)
                    : ""}
                </span>
                <span>
                  <i
                    className="fas fa-map-marker-alt"
                    style={{ color: "#f59e42" }}
                  ></i>{" "}
                  {cls.location}
                </span>
              </div>
              <div className="class-details-row">
                <span>
                  <i className="fas fa-clock" style={{ color: "#f59e42" }}></i>{" "}
                  {cls.time}
                </span>
                <span>
                  <i className="fas fa-child" style={{ color: "#f59e42" }}></i>{" "}
                  {cls.level === "Beginner"
                    ? "5-8 yrs"
                    : cls.level === "Intermediate"
                    ? "9-12 yrs"
                    : cls.level === "Advance"
                    ? "13+ yrs"
                    : "13+ yrs"}
                </span>
              </div>
              <div className="class-details-row">
                <span>
                  <i className="fas fa-chair" style={{ color: "#f59e42" }}></i>{" "}
                  {cls.seats} seats left
                </span>
                <span className="class-price">&#8377;{cls.price}</span>
              </div>
              <div className="class-details-row">
                {cls.available ? (
                  <span className="text-green-500 font-bold">Available</span>
                ) : (
                  <span className="text-red-500 font-bold">Not Available</span>
                )}
              </div>
              <MyButton
                buttonText={"Enquire about class"}
                onClick={() => handleBookEnquiry(cls)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveClasses;
