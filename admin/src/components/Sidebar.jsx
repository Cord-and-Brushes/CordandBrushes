import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import {
  PlusOutlined,
  UnorderedListOutlined,
  MenuOutlined,
  CloseOutlined,
  HomeOutlined,
  UserOutlined,
  FileImageOutlined,
  FlagOutlined,
  ShoppingCartOutlined,
  FormOutlined,
  FundOutlined,
} from "@ant-design/icons";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const Sidebar = () => {
  const isDesktopOrLaptop = useMediaQuery({ query: "(min-width: 1024px)" });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    if (!isDesktopOrLaptop) {
      setIsSidebarOpen(false);
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div
      className={`py-2 flex flex-col gap-x-1 gap-y-5 w-full bg-black sm:gap-x-4 lg:max-w-[250px] ${
        isDesktopOrLaptop ? "flex-shrink-0" : ""
      } lg:flex-col lg:pt-8 lg:max-w-60 lg:h-[screen] lg:justify-start lg:pl-6 scrollable-sidebar`}
    >
      {!isDesktopOrLaptop && (
        <button
          onClick={toggleSidebar}
          className="p-3 text-white flex cursor-pointer"
        >
          {isSidebarOpen ? <CloseOutlined /> : <MenuOutlined />}
        </button>
      )}

      <div
        className={`p-3 flex medium-16 ${
          !isDesktopOrLaptop && !isSidebarOpen ? "hidden" : ""
        }`}
      >
        <Link
          to={""}
          onClick={closeSidebar}
          className={`font-anta mx-2 flex items-center gap-x-2 ${
            isActive("/admin")
              ? "border-b-2 border-orange-600 text-orange-600"
              : "border-b-black hover:border-b-white text-white"
          }`}
        >
          <HomeOutlined />
          Home
        </Link>
      </div>

      <div
        className={`p-3 flex medium-16 ${
          !isDesktopOrLaptop && !isSidebarOpen ? "hidden" : ""
        }`}
      >
        <Link
          to={"userlist"}
          onClick={closeSidebar}
          className={`font-anta mx-2 flex items-center gap-x-2 ${
            isActive("/admin/userlist")
              ? "border-b-2 border-orange-600 text-orange-600"
              : "border-b-black hover:border-b-white text-white"
          }`}
        >
          <UserOutlined />
          Users
        </Link>
      </div>
      <div
        className={`p-3 flex medium-16 ${
          !isDesktopOrLaptop && !isSidebarOpen ? "hidden" : ""
        }`}
      >
        <Link
          to={"aboutpagecontent"}
          onClick={closeSidebar}
          className={`font-anta mx-2 flex items-center gap-x-2 ${
            isActive("/admin/aboutpagecontent")
              ? "border-b-2 border-orange-600 text-orange-600"
              : "border-b-black hover:border-b-white text-white"
          }`}
        >
          <FileImageOutlined />
          About
        </Link>
      </div>
      <Accordion
        sx={{
          backgroundColor: "black",
          "&:hover": {
            backgroundColor: "black",
          },
        }}
      >
        <AccordionSummary
          expandIcon={
            <ExpandMoreIcon
              sx={{
                color: "white",
                "&:hover": {
                  color: "#ea580c",
                },
              }}
            />
          }
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography
            sx={{
              color: "white",
              "&:hover": {
                color: "#ea580c",
              },
              fontFamily: "anta",
            }}
          >
            <span className="flex justify-center items-center font-anta gap-x-2">
              <ShoppingCartOutlined /> Products
            </span>
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography component="div">
            <div className="flex flex-col gap-y-4">
              <div>
                <Link
                  to={"addproduct"}
                  onClick={closeSidebar}
                  className={`font-anta flex justify-center items-center gap-x-2 gap-y-6 ${
                    isActive("/admin/addproduct")
                      ? "border-b-2 border-orange-600 text-orange-600"
                      : "border-b-black hover:border-b-white text-white"
                  }`}
                >
                  <PlusOutlined />
                  Add Products
                </Link>
              </div>
              <div>
                <Link
                  to={"productlist"}
                  onClick={closeSidebar}
                  className={`font-anta flex justify-center items-center gap-x-2 gap-y-6 ${
                    isActive("/admin/productlist")
                      ? "border-b-2 border-orange-600 text-orange-600"
                      : "border-b-black hover:border-b-white text-white"
                  }`}
                >
                  <UnorderedListOutlined />
                  Products List
                </Link>
              </div>
            </div>
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion
        sx={{
          backgroundColor: "black",
          "&:hover": {
            backgroundColor: "black",
          },
        }}
      >
        <AccordionSummary
          expandIcon={
            <ExpandMoreIcon
              sx={{
                color: "white",
                "&:hover": {
                  color: "#ea580c",
                },
              }}
            />
          }
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography
            sx={{
              color: "white",
              "&:hover": {
                color: "#ea580c",
              },
              fontFamily: "anta",
            }}
          >
            <span className="flex justify-center items-center font-anta gap-x-2">
              <ShoppingCartOutlined /> Categories
            </span>
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography component="div">
            <div className="flex flex-col gap-y-4">
              <div>
                <Link
                  to={"addcategory"}
                  onClick={closeSidebar}
                  className={`font-anta flex justify-center items-center gap-x-2 gap-y-6 ${
                    isActive("/admin/addcategory")
                      ? "border-b-2 border-orange-600 text-orange-600"
                      : "border-b-black hover:border-b-white text-white"
                  }`}
                >
                  <PlusOutlined />
                  Add Category
                </Link>
              </div>
              <div>
                <Link
                  to={"allcategories"}
                  onClick={closeSidebar}
                  className={`font-anta flex justify-center items-center gap-x-2 gap-y-6 ${
                    isActive("/admin/allcategories")
                      ? "border-b-2 border-orange-600 text-orange-600"
                      : "border-b-black hover:border-b-white text-white"
                  }`}
                >
                  <UnorderedListOutlined />
                  Category List
                </Link>
              </div>
            </div>
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion
        sx={{
          backgroundColor: "black",
          "&:hover": {
            backgroundColor: "black",
          },
        }}
      >
        <AccordionSummary
          expandIcon={
            <ExpandMoreIcon
              sx={{
                color: "white",
                "&:hover": {
                  color: "#ea580c",
                },
              }}
            />
          }
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography
            sx={{
              color: "white",
              "&:hover": {
                color: "#ea580c",
              },
              fontFamily: "anta",
            }}
          >
            <span className="flex justify-center items-center font-anta gap-x-2">
              <FormOutlined />
              Blogs
            </span>
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography component="div">
            <div className="flex flex-col gap-y-4">
              <div>
                <Link
                  to={"addblog"}
                  onClick={closeSidebar}
                  className={`font-anta flex justify-center items-center gap-x-2 gap-y-6 ${
                    isActive("/admin/addblog")
                      ? "border-b-2 border-orange-600 text-orange-600"
                      : "border-b-black hover:border-b-white text-white"
                  }`}
                >
                  <PlusOutlined />
                  Create Blog
                </Link>
              </div>

              <div>
                <Link
                  to={"allblogs"}
                  onClick={closeSidebar}
                  className={`font-anta flex justify-center items-center gap-x-2 gap-y-6 ${
                    isActive("/admin/allblogs")
                      ? "border-b-2 border-orange-600 text-orange-600"
                      : "border-b-black hover:border-b-white text-white"
                  }`}
                >
                  <UnorderedListOutlined />
                  All Blogs
                </Link>
              </div>
            </div>
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion
        sx={{
          backgroundColor: "black",
          "&:hover": {
            backgroundColor: "black",
          },
        }}
      >
        <AccordionSummary
          expandIcon={
            <ExpandMoreIcon
              sx={{
                color: "white",
                "&:hover": {
                  color: "#ea580c",
                },
              }}
            />
          }
          aria-controls="panel3a-content"
          id="panel3a-header"
        >
          <Typography
            sx={{
              color: "white",
              "&:hover": {
                color: "#ea580c",
              },
              fontFamily: "anta",
            }}
          >
            <span className="flex justify-center items-center font-anta gap-x-2">
              <FundOutlined /> Banners
            </span>
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography component="div">
            <div className="flex flex-col gap-y-4">
              <div>
                <Link
                  to={"bannersection"}
                  onClick={closeSidebar}
                  className={`font-anta flex justify-center items-center gap-x-2 ${
                    isActive("/admin/bannersection")
                      ? "border-b-2 border-orange-600 text-orange-600"
                      : "border-b-black hover:border-b-white text-white"
                  }`}
                >
                  <FlagOutlined />
                  Upload Banner
                </Link>
              </div>
              <div>
                <Link
                  to={"allbanners"}
                  onClick={closeSidebar}
                  className={`font-anta flex justify-center items-center gap-x-2 ${
                    isActive("/admin/allbanners")
                      ? "border-b-2 border-orange-600 text-orange-600"
                      : "border-b-black hover:border-b-white text-white"
                  }`}
                >
                  <UnorderedListOutlined />
                  All Banners
                </Link>
              </div>
            </div>
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion
        sx={{
          backgroundColor: "black",
          "&:hover": {
            backgroundColor: "black",
          },
        }}
      >
        <AccordionSummary
          expandIcon={
            <ExpandMoreIcon
              sx={{
                color: "white",
                "&:hover": {
                  color: "#ea580c",
                },
              }}
            />
          }
          aria-controls="panel3a-content"
          id="panel3a-header"
        >
          <Typography
            sx={{
              color: "white",
              "&:hover": {
                color: "#ea580c",
              },
              fontFamily: "anta",
            }}
          >
            <span className="flex justify-center items-center font-anta gap-x-2">
              <FormOutlined /> LiveClasses
            </span>
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography component="div">
            <div className="flex flex-col gap-y-4">
              <div>
                <Link
                  to={"addliveclass"}
                  onClick={closeSidebar}
                  className={`font-anta flex justify-center items-center gap-x-2 ${
                    isActive("/admin/addliveclass")
                      ? "border-b-2 border-orange-600 text-orange-600"
                      : "border-b-black hover:border-b-white text-white"
                  }`}
                >
                  <PlusOutlined />
                  Upload LiveClass
                </Link>
              </div>
              <div>
                <Link
                  to={"allliveclasses"}
                  onClick={closeSidebar}
                  className={`font-anta flex justify-center items-center gap-x-2 ${
                    isActive("/admin/allliveclasses")
                      ? "border-b-2 border-orange-600 text-orange-600"
                      : "border-b-black hover:border-b-white text-white"
                  }`}
                >
                  <UnorderedListOutlined />
                  All LiveClasses
                </Link>
              </div>
            </div>
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion
        sx={{
          backgroundColor: "black",
          "&:hover": {
            backgroundColor: "black",
          },
        }}
      >
        <AccordionSummary
          expandIcon={
            <ExpandMoreIcon
              sx={{
                color: "white",
                "&:hover": {
                  color: "#ea580c",
                },
              }}
            />
          }
          aria-controls="panel3a-content"
          id="panel3a-header"
        >
          <Typography
            sx={{
              color: "white",
              "&:hover": {
                color: "#ea580c",
              },
              fontFamily: "anta",
            }}
          >
            <span className="flex justify-center items-center font-anta gap-x-2">
              <FundOutlined /> Workshops
            </span>
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography component="div">
            <div className="flex flex-col gap-y-4">
              <div>
                <Link
                  to={"addworkshop"}
                  onClick={closeSidebar}
                  className={`font-anta flex justify-center items-center gap-x-2 ${
                    isActive("/admin/addworkshop")
                      ? "border-b-2 border-orange-600 text-orange-600"
                      : "border-b-black hover:border-b-white text-white"
                  }`}
                >
                  <FlagOutlined />
                  Upload Workshop
                </Link>
              </div>
              <div>
                <Link
                  to={"allworkshops"}
                  onClick={closeSidebar}
                  className={`font-anta flex justify-center items-center gap-x-2 ${
                    isActive("/admin/allworkshops")
                      ? "border-b-2 border-orange-600 text-orange-600"
                      : "border-b-black hover:border-b-white text-white"
                  }`}
                >
                  <UnorderedListOutlined />
                  All Workshops
                </Link>
              </div>
            </div>
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default Sidebar;
