/* import React from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import { HomePageCarouselData } from "../../Home/HomePageCarousel/HomePageCarouselData";
import "./HomePageCarousel.css";
// import MyButton from '../../common/Button/Button';
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const HomePageCarousel = () => {
  // const navigate=useNavigate
  const items = HomePageCarouselData.map((item) => (
    <div key={item.id} className="flex flex-col carousel-item">
      <img src={item.image} className="carousel-image" alt="img" />
    
    </div>
  ));
  return (
    <AliceCarousel
      autoPlay
      autoPlayInterval={1000}
      items={items}
      // disableButtonsControls
      disableDotsControls
      infinite
      className="mt-[30px] h-[30vh]"
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

export default HomePageCarousel; */
