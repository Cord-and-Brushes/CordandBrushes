import React, { useEffect, useState } from "react";
import api from "../../../../api/api"; // Adjust the import path as needed
import "./ClassList.css";
import MyButton from "../../common/Button/Button";

const ClassList = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");

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

  return (
    <div>
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
            /*    buttonText={location}  </MyButton>*/
          )
        )}
      </div>
      <div className="class-list-container mb-5">
        {loading ? (
          <div>Loading...</div>
        ) : filteredClasses.length === 0 ? (
          <div>No live classes found.</div>
        ) : (
          filteredClasses.map((cls) => (
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
                <div
                  className={`class-level-badge ${cls.level?.toLowerCase()}`}
                >
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
                    <i
                      className="fas fa-clock"
                      style={{ color: "#f59e42" }}
                    ></i>{" "}
                    {cls.time}
                  </span>
                  <span>
                    <i
                      className="fas fa-hourglass-half"
                      style={{ color: "#f59e42" }}
                    ></i>{" "}
                    {cls.duration} mins
                  </span>
                </div>
                <div className="class-details-row">
                  <span>
                    <i
                      className="fas fa-chair"
                      style={{ color: "#f59e42" }}
                    ></i>{" "}
                    {cls.seats} seats left
                  </span>
                  <span className="class-price">&#8377;{cls.price}</span>
                </div>
                <div className="class-details-row">
                  {cls.available ? (
                    <span className="text-green-500 font-bold">Available</span>
                  ) : (
                    <span className="text-red-500 font-bold">
                      Not Available
                    </span>
                  )}
                </div>
                <MyButton buttonText={"Enroll Now"} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ClassList;
