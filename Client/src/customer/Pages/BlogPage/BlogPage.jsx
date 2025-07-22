import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import BlogCard from "../../components/BlogPage/BlogLeftCard/BlogCard";
import Heading from "../../components/common/Heading/Heading";
import Pagination from "@mui/material/Pagination";
import BlogAuthor from "../../components/BlogPage/BlogAuthor/BlogAuthor";
/* import HomePageCarousel from "../../components/Home/HomePageCarousel/HomePageCarousel";
 */ import {
  fetchBlogs,
  selectAllBlogs,
  selectBlogStatus,
  selectBlogError,
} from "../../../redux/features/blogSlice";
import Banner from "../../components/Banner/Banner";

const BlogPage = () => {
  const dispatch = useDispatch();
  const blogs = useSelector(selectAllBlogs);
  const status = useSelector(selectBlogStatus);
  const error = useSelector(selectBlogError);
  const [showLoader, setShowLoader] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  // Number of posts per page
  const postsPerPage = 2;

  // Fetch blogs when component mounts
  useEffect(() => {
    if (status === "idle") {
      setShowLoader(true);
      dispatch(fetchBlogs());
    }
  }, [status, dispatch]);

  // Hide loader when data is loaded or error occurs
  useEffect(() => {
    if (status === "succeeded" || status === "failed") {
      setShowLoader(false);
    }
  }, [status]);

  // Calculate the total number of pages
  const totalPages = Math.ceil(blogs.length / postsPerPage);

  // Function to handle page change
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = blogs.slice(indexOfFirstPost, indexOfLastPost);

  // Loading state
  if (status === "loading") {
    return (
      <div id="blog" className="py-5">
        <div className="body flex flex-col justify-center items-center">
          {/*      <HomePageCarousel /> */}
          <Banner pageName="BlogPage" />
          <div className="content lg:px-28 lg:gap-4 flex flex-col md:flex-row relative">
            <div className="left-section px-[10px] sm:px-[50px] flex-col flex justify-center items-center z-12 hide-scrollbar">
              <div className="flexCenter flex-col gap-4">
                <div className="spinner"></div>
                <div className="text-center text-lg">Loading blogs...</div>
              </div>
            </div>
            {/* <div className="right-section px-[10px] lg:w-2/5 lg:sticky top-0">
              <BlogAuthor />
            </div> */}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (status === "failed") {
    return (
      <div id="blog" className="py-5">
        <div className="body flex flex-col justify-center items-center">
          {/* <HomePageCarousel /> */}
          <Banner pageName="BlogPage" />
          <div className="content lg:px-28 lg:gap-4 flex flex-col md:flex-row relative">
            <div className="left-section px-[10px] sm:px-[50px] flex-col flex justify-center items-center z-12 hide-scrollbar">
              <div className="text-center text-lg text-red-500">
                Error loading blogs: {error}
              </div>
            </div>
            {/*  <div className="right-section px-[10px] lg:w-2/5 lg:sticky top-0">
              <BlogAuthor />
            </div> */}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="blog" className="py-5">
      <div className="body flex flex-col justify-center items-center">
        {/* <Heading text="BLOG"/> */}
        {/* <HomePageCarousel /> */}
        <Banner pageName="BlogPage" />
        <div className="content lg:pl-28 pr-8 lg:gap-4 flex flex-col md:flex-row relative">
          <div className="left-section pl-[10px] sm:pl-[50px] flex-col flex justify-center items-center z-12 hide-scrollbar">
            {/* Pagination component */}
            {currentPosts.map((post) => (
              <BlogCard
                key={post._id || post.id}
                blogId={post._id || post.id}
                imgUrl={
                  post.bannerImage ||
                  post.image ||
                  "https://i.postimg.cc/KzZVV5kH/lukas-blazek-Gnvurw-Js-Ka-Y-unsplash.jpg"
                }
                title={post.title}
                author={post.author || "Anonymous"}
                date={
                  post.createdAt
                    ? new Date(post.createdAt).toLocaleDateString()
                    : post.datePosted
                    ? new Date(post.datePosted).toLocaleDateString()
                    : "Unknown Date"
                }
                description={post.content || post.description || ""}
                quote={
                  post.quote ||
                  "Never give up on a dream just because of the time it will take to accomplish it. The time will pass anyway."
                }
              />
            ))}
            {blogs.length > 0 && (
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                siblingCount={1}
                boundaryCount={1}
                sx={{
                  "& .MuiPaginationItem-root": {
                    color: "orange", // This sets the color of the pagination items
                    "&.Mui-selected": {
                      backgroundColor: "orange", // This sets the background color of the selected pagination item
                      color: "white", // This sets the text color of the selected pagination item
                    },
                  },
                }}
              />
            )}
          </div>
          {showLoader && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
              <div className="flexCenter flex-col gap-4 bg-white p-8 rounded-lg">
                <div className="spinner"></div>
                <div className="text-lg font-medium">Loading...</div>
              </div>
            </div>
          )}
          <div className="right-section w-full md:w-4/5 lg:sticky top-0 flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-4">Watch Our Story</h2>
            <div className="w-full aspect-video mb-4">
              <video
                id="myVideo"
                className="w-full h-full rounded-3xl"
                poster=""
                autoPlay
                loop
                muted
                playsInline
              >
                <source src="/Venice_10.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="flex flex-col items-center gap-2 mb-4">
              {/*  <a
                href="https://example.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Visit Our Website
              </a> */}
              <p className="px-8 text-center">
                want to explore our more videos then{" "}
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  click here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
