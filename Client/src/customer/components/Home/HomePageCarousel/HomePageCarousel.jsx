/* import React, { useState, useEffect } from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import api from "../../../../api/api";
import "./HomePageCarousel.css";
// import MyButton from '../../common/Button/Button';
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const HomePageCarousel = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/banners/allbanners");

        // Find the HomePage banners
        const homePageBanner = response.data.find(
          (banner) => banner.pageName === "HomePage"
        );

        if (homePageBanner && homePageBanner.urls) {
          setBanners(homePageBanner.urls);
        } else {
          setBanners([]);
        }
      } catch (err) {
        console.error("Error fetching banners:", err);
        setError("Failed to load banners");
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

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
        <div className="text-lg text-red-500">{error}</div>
      </div>
    );
  }

  if (banners.length === 0) {
    return (
      <div className="mt-[30px] flex justify-center items-center">
        <div className="text-lg text-gray-500">No banners available</div>
      </div>
    );
  }

  return (
    <AliceCarousel
      autoPlay
      autoPlayInterval={1000}
      items={items}
      // disableButtonsControls
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

export default HomePageCarousel;
 */
