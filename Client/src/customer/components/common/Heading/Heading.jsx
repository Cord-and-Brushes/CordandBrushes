import React from "react";
import Floral2 from "../../../../assets/floral2.svg";

const Heading = ({ text }) => {
  return (
    <div className="relative flex justify-center items-center flex-col bg-white/10 w-full px-2">
      <div className="absolute z-10 w-full flex justify-center">
        <h1 className="mb-8 sm:mb-12 lg:mb-[72px] text-center text-base sm:text-lg md:text-2xl lg:text-3xl font-bold tracking-[.10em] leading-[1.23em] font-alegreya break-words whitespace-normal max-w-full px-2">
          {text}
        </h1>
      </div>
      <div className="w-full mt-5 max-w-xs sm:max-w-md lg:w-[400px] relative">
        <img src={Floral2} alt="" className="z-0 w-full" />
      </div>
    </div>
  );
};

export default Heading;
