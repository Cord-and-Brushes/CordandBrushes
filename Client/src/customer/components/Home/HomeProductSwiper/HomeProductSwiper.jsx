// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/scrollbar";
import { Scrollbar } from "swiper/modules";
// Import Swiper styles
import "swiper/css";
import "swiper/css/scrollbar";
// import HomeProductCard from "../HomeProductCard/HomeProductCard";
import { useMediaQuery } from 'react-responsive';
import HomeProductCard2 from "../HomeProductCard2/HomeProductCard2";


const HomeProductSwiper = () => {

  const isDesktopOrLaptop = useMediaQuery({ minWidth:  1224 });
  const isTabletOrMobileDevice = useMediaQuery({ maxWidth:  1224 });
  // eslint-disable-next-line
  const isPortraitOrientation = useMediaQuery({ orientation: 'portrait' });
  const isLandscapeOrientation = useMediaQuery({ orientation: 'landscape' })

  const products = [
    {
      id: 1,
      name: "Product 1",
      imgUrl: "https://picsum.photos/200/300/?blur",
      price: "1500",
    },
    {
      id: 2,
      name: "Product 2",
      imgUrl: "https://picsum.photos/200/300?grayscale",
      price: "2000",
    },
    {
      id: 3,
      name: "Product 3",
      imgUrl: "https://picsum.photos/seed/picsum/200/300",
      price: "3000",
    },
    {
      id: 4,
      name: "Product 4",
      imgUrl: "https://picsum.photos/id/237/200/300",
      price: "4000",
    },
    {
      id: 5,
      name: "Product 4",
      imgUrl: "https://picsum.photos/id/237/200/300",
      price: "4000",
    },
    {
      id: 6,
      name: "Product 4",
      imgUrl: "https://picsum.photos/id/237/200/300",
      price: "4000",
    },
    {
      id: 7,
      name: "Product 4",
      imgUrl: "https://i.postimg.cc/SKg41d0W/react-logo.png",
      price: "4000",
    },
  ];



  let slidesPerView =  1;
  if (isDesktopOrLaptop && isLandscapeOrientation) {
    slidesPerView =  5;
  } else if (isTabletOrMobileDevice && isLandscapeOrientation) {
    slidesPerView =  2;
  }

  return (
    <Swiper
      className="w-[80vw]"
      modules={[Scrollbar]}
      spaceBetween={50}
      slidesPerView={slidesPerView}
      onSlideChange={() => console.log("slide change")}
      onSwiper={(swiper) => console.log(swiper)}
      scrollbar={{ draggable: true }}
    >
      {products.map((product) => (
        <SwiperSlide className="pb-5 flex justify-center items-center" key={product.id}>
          <HomeProductCard2
            imgUrl={product.imgUrl} 
            price={product.price} 
            productTitle={product.name}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
export default HomeProductSwiper;