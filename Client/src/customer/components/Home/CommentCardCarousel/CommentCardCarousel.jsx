import React, { useEffect, useState } from "react";
import { Navigation, Pagination, Scrollbar, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/autoplay";
import api from "../../../../api/api";

const CommentCardCarousel = () => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    api
      .get("/api/aboutpage/content")
      .then((res) => {
        const data = res.data;
        console.log("API response for /api/aboutpage/content:", data);
        if (data.teams) {
          console.log("Teams array:", data.teams);
          const feedbacks = data.teams
            .filter(
              (member) => member.feedback && member.feedback.trim() !== ""
            )
            .map((member, idx) => ({
              id: member._id || idx,
              name: member.name,
              designation: member.designation,
              photoUrl: member.image,
              commentText: member.feedback,
            }));
          console.log("Filtered feedbacks:", feedbacks);
          setComments(feedbacks);
        } else {
          console.warn("No teams array found in API response.");
        }
      })
      .catch((err) => {
        console.error("Failed to fetch comments:", err);
      });
  }, []);

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
                  <h2 className="text-xs sm:text-sm md:text-base lg:text-xl font-semibold mt-2">
                    {item.name}
                  </h2>
                  <p className="text-xs md:text-sm lg:text-base text-gray-600">
                    {item.designation}
                  </p>
                </div>
              </div>
              <blockquote className="mt-3 p-2 sm:p-4 text-base sm:text-lg md:text-xl font-tangerine text-center w-full break-words">
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
