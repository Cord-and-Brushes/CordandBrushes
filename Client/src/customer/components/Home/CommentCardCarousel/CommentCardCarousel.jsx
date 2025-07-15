import { Navigation, Pagination, Scrollbar, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/autoplay";


const CommentCardCarousel = () => {
  const comments = [
    {
      id: 1,
      name: "John Doe",
      designation: "Software Engineer",
      photoUrl:
        "/path/to/john-doe.jpghttps://i.postimg.cc/SKg41d0W/react-logo.png",
      commentText:
        "We Nurture Innovation And Growth, Providing A Collaborative Environment Where Your Skills And Ideas Can Thrive. Unleash Your Potential As You Contribute To Cutting-Edge Projects, Making A Tangible Impact On The Digital Landscape. Be Part Of A Community That Values Creativity, Expertise, And Teamwork, Shaping The Future Of Technology Together. Discover Your Career Path With Us Today!",
    },
    {
      id: 2,
      name: "Doe John",
      designation: "Software Engineer",
      photoUrl: "https://i.postimg.cc/SKg41d0W/react-logo.png",
      commentText:
        "We Nurture Innovation And Growth, Providing A Collaborative Environment Where Your Skills And Ideas Can Thrive. Unleash Your Potential As You Contribute To Cutting-Edge Projects, Making A Tangible Impact On The Digital Landscape. Be Part Of A Community That Values Creativity, Expertise, And Teamwork, Shaping The Future Of Technology Together. Discover Your Career Path With Us Today!",
    },
    {
      id: 3,
      name: "Dohn Joe",
      designation: "Software Engineer",
      photoUrl: "https://i.postimg.cc/SKg41d0W/react-logo.png",
      commentText:
        "We Nurture Innovation And Growth, Providing A Collaborative Environment Where Your Skills And Ideas Can Thrive. Unleash Your Potential As You Contribute To Cutting-Edge Projects, Making A Tangible Impact On The Digital Landscape. Be Part Of A Community That Values Creativity, Expertise, And Teamwork, Shaping The Future Of Technology Together. Discover Your Career Path With Us Today!",
    },
    {
      id: 4,
      name: "Eohn Doj",
      designation: "Software Engineer",
      photoUrl: "https://i.postimg.cc/SKg41d0W/react-logo.png",
      commentText:
        "We Nurture Innovation And Growth, Providing A Collaborative Environment Where Your Skills And Ideas Can Thrive. Unleash Your Potential As You Contribute To Cutting-Edge Projects, Making A Tangible Impact On The Digital Landscape. Be Part Of A Community That Values Creativity, Expertise, And Teamwork, Shaping The Future Of Technology Together. Discover Your Career Path With Us Today!",
    },
    {
      id: 5,
      name: "John Doe",
      designation: "Software Engineer",
      photoUrl: "https://i.postimg.cc/SKg41d0W/react-logo.png",
      commentText:
        "We Nurture Innovation And Growth, Providing A Collaborative Environment Where Your Skills And Ideas Can Thrive. Unleash Your Potential As You Contribute To Cutting-Edge Projects, Making A Tangible Impact On The Digital Landscape. Be Part Of A Community That Values Creativity, Expertise, And Teamwork, Shaping The Future Of Technology Together. Discover Your Career Path With Us Today!",
    },
  ];

  return (
    <div className="p-0 lg:p-0">
      <Swiper
        className="custom-swiper w-[80vw] lg:w-[60vw]"
        modules={[Scrollbar, Navigation, Pagination, Autoplay]}
        spaceBetween={50}
        slidesPerView={1}
        autoplay={{ delay: 3500 }} 
        pagination={{
          dynamicBullets: true,
        }}
        navigation={true}
      >
        {comments.map((item) => (
          <SwiperSlide key={item.id} className="p-4 lg:p-10">
            <div className="flex flex-col items-center justify-center p-4 m-4 lg:m-12 bg-orange-100 shadow-lg rounded-lg">
              <div className="flex gap-3">
                <img
                  src={item.photoUrl}
                  alt={item.name}
                  className="w-14 h-14 rounded-full"
                />
                <div>
                  <h2 className="text-xl font-semibold mt-2">{item.name}</h2>
                  <p className="text-sm text-gray-600">{item.designation}</p>
                </div>
              </div>
              <blockquote className="mt-2 p-5 text-xl font-tangerine">
                &ldquo; {item.commentText} &rdquo;
              </blockquote>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CommentCardCarousel;
