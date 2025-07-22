import React from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import useBannerImages from "./useBannerImages";
/* import "../Home/HomePageCarousel/HomePageCarousel.css"; */
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import SoonLoader from "../common/coming_soon_loader/SoonLoader";

const Banner = ({ pageName }) => {
  const { banners, loading, error } = useBannerImages(pageName);

  const items = banners.map((imageUrl, index) => (
    <div key={index} className="flex flex-col carousel-item">
      <img
        src={imageUrl}
        className="carousel-image"
        alt={`Banner ${index + 1}`}
      />
    </div>
  ));

  if (loading) {
    return (
      <div className="mt-[30px] flex justify-center items-center">
        <div className="text-lg">Loading banners...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-[30px] flex justify-center items-center">
        <div className="text-3xl text-red-500 mb-2">⚠️</div>
        <div className="text-lg text-red-500">{error}</div>
      </div>
    );
  }

  if (banners.length === 0) {
    return (
      <div className="mt-[30px] flex justify-center items-center">
        <SoonLoader />
      </div>
    );
  }

  return (
    <AliceCarousel
      autoPlay
      autoPlayInterval={1000}
      items={items}
      disableDotsControls
      infinite
      className="mt-[30px]"
      keyboardNavigation={true}
      renderPrevButton={() => {
        return (
          <p className="p-4 absolute h-14 left-0 bg-[#f8f8f80b] top-[40%] cursor-pointer font-bold">
            <ArrowBackIosNewIcon className="h-14" />
          </p>
        );
      }}
      renderNextButton={() => {
        return (
          <p className="p-4 absolute right-0 bg-[#f8f8f80b] top-[40%] cursor-pointer">
            <ArrowForwardIosIcon />
          </p>
        );
      }}
    />
  );
};

export default Banner;
