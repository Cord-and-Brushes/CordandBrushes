import React from "react";

import ClassList from "../../components/LiveClasses/ClassList/ClassList";

const LiveClasses = () => {
  return (
    <div>
      <h1 className="text-3xl justify-center text-center font-bold mb-4 mt-2">
        LiveClasses
      </h1>
      <p className="text-lg text-center text-gray-700">
        Choose a location to find live classes available in your area.
      </p>
      {/*    <Location /> */}
      <ClassList />
    </div>
  );
};

export default LiveClasses;
