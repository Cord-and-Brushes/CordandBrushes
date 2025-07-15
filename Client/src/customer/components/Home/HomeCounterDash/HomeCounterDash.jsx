import React from "react";
import HomeSingleCounter from "../HomeSingleCounter/HomeCounter";

const HomeCounterDash = () => {
  return (
    <div> 
      <div className="border-2 rounded-md justify-between flex flex-col md:flex-row border-black p-4">
        <HomeSingleCounter
          title="Items Sold"
          initialValue={0}
          targetValue={100}
          sign="+"
        />
        <HomeSingleCounter
          title="Happy Customers"
          initialValue={0}
          targetValue={60}
        />
        <HomeSingleCounter
          title="Different Products"
          initialValue={0}
          targetValue={27}
        />
        <HomeSingleCounter
          title="Media Reviews"
          initialValue={0}
          targetValue={45}
        />
      </div>
    </div>
  );
};

export default HomeCounterDash;
