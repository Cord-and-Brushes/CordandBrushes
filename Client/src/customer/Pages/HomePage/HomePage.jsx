import React, { useState, useEffect } from "react";
/* import HomePageCarousel from "../../components/Home/HomePageCarousel/HomePageCarousel";
 */ import HomeProductSwiper from "../../components/Home/HomeProductSwiper/HomeProductSwiper";
import HomeCategorySection from "../../components/Home/HomeCategorySection/HomeCategorySection";
import HomeCounterDash from "../../components/Home/HomeCounterDash/HomeCounterDash";
import CommentCardCarousel from "../../components/Home/CommentCardCarousel/CommentCardCarousel";
import Pic from "../../../assets/pic.svg";
import Heading from "../../components/common/Heading/Heading";
import PopularProductGrid from "../../components/Home/PopularProductGrid";
import { useNavigate } from "react-router-dom";
import MyButton from "../../components/common/Button/Button";

import Banner from "../../components/Banner/Banner";

const HomePage = () => {
  const navigate = useNavigate();
  const [showLoader, setShowLoader] = useState(false);

  // Simulate loading for demonstration
  useEffect(() => {
    setShowLoader(true);
    // Simulate some loading time
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 2000); // Show loader for 2 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center">
      {/* <HomePageCarousel /> */}
      <Banner pageName="HomePage" />
      <div className="items-center mb-10">
        <Heading text="OUR RANGE OF PRODUCTS" />
        <div className="flex items-center justify-center gap-4">
          <HomeCategorySection />
        </div>
        <div className="flex justify-center items-center">
          <MyButton
            // onClick={() => navigate("/allproducts")}
            //  className="w-10 h-6"
            buttonText={"All Products"}
            pageUrl="/allproducts"
            onClick={() => navigate("/allproducts")}
          >
            All Products
          </MyButton>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center w-full rounded-md border-2 border-black lg:my-[50px] ">
        {/*  <HomeOffersCarousel /> */}
        <Banner pageName="Offers" />
      </div>

      <div className="mb-5 relative">
        <Heading text="OUR MOST POPULAR PRODUCTS" className="" />
        <div className="my-8  flex justify-center -mt-12">
          {/* <HomeProductSwiper /> */}
          <PopularProductGrid />
        </div>
      </div>

      <div className="relative">
        <Heading text="WHAT THEY SAY ABOUT US" />
        <div className="px-5 flex flex-col lg:flex-row justify-center items-center -mt-14 lg:-mt-24">
          <div className="hidden lg:block">
            <img src={Pic} alt="" className="w-[500px] animate-rotate" />
          </div>
          <div className="flex flex-col justify-center items-center">
            <CommentCardCarousel />
            <div className="p-12 w-[100%]">
              <HomeCounterDash />
            </div>
          </div>
        </div>
      </div>

      {/* Custom Loader Overlay */}
      {showLoader && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="flexCenter flex-col gap-4 bg-white p-8 rounded-lg">
            <div className="spinner"></div>
            <div className="text-lg font-medium">Loading...</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
