import React from "react";
import { Route, Routes, useLocation, matchPath } from "react-router-dom";
import BlogPage from "./customer/Pages/BlogPage/BlogPage";
import HomePage from "./customer/Pages/HomePage/HomePage";
import WorkShop from "./customer/Pages/WorkShop/WorkShop";
import Shop from "./customer/Pages/Shop/Shop";
import LiveClasses from "./customer/Pages/Liveclasses/LiveClasses";
import Navigation from "./customer/components/common/Navigation/Navigation";
import Footer from "./customer/components/common/Footer/Footer";
import Cart from "./customer/Pages/Cart/Cart";
import ForgotPassword from "./customer/Pages/Redrect/ForgotPassword";
import ResetPassword from "./customer/Pages/Redrect/ResetPassword";
import Product from "./customer/Pages/Product/Product";
import BlogDetails from "./customer/Pages/BlogPage/BlogDetails";
import AboutPage from "./customer/Pages/About/AboutPage";
/* import CategoryPage from "./customer/Pages/Category/CategoryPage"; */
import ContactUs from "./customer/Pages/ContactUs/ContactUs";
import PrivacyPolicy from "./customer/Pages/T&C/PrivacyPolicy";
import TermsAndConditions from "./customer/Pages/T&C/TermsAndConditions";
import Auth from "./customer/Pages/Auth/Auth";
import CategoryProducts from "./customer/Pages/Category/CategoryProducts";
/* import Blogs from "./customer/Pages/BlogPage/Blogs"; */
import AllProducts from "./customer/Pages/Product/getAllProducts";
import Team from "./customer/Pages/About/Team";
import ProfilePage from "./customer/Pages/About/ProfilePage";

const AuthPages = ["/auth/signup", "/auth/login", "/auth/forgot-password"];

function App() {
  const location = useLocation();
  const currentPath = location.pathname;

  // Check if the current path is an authentication-related page
  const isAuthPage =
    AuthPages.some((page) => currentPath.startsWith(page)) ||
    matchPath("/auth/reset-password/:userId/:token", currentPath);

  return (
    <>
      {!isAuthPage && <Navigation />}
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blogdetails/:id" element={<BlogDetails />} />
          <Route path="/workshop" element={<WorkShop />} />
          <Route path="/liveclasses" element={<LiveClasses />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/auth/*" element={<Auth />} /> {/* All auth routes */}
          <Route path="/cart" element={<Cart />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/reset-password/:userId/:token"
            element={<ResetPassword />}
          />
          {/*           <Route path="/product" element={<Product />} />*/}
          {/*  <Route path="/category" element={<CategoryPage />} /> */}
          <Route path="/allproducts" element={<AllProducts />} />
          <Route path="/product/:id" element={<Product />} />
          <Route
            path="/category/:categoryName"
            element={<CategoryProducts />}
          />
          {/*  <Route path="/blogs" element={<Blogs />} /> */}
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/team" element={<Team />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
        </Routes>
      </div>
      {!isAuthPage && <Footer />}
    </>
  );
}

export default App;
