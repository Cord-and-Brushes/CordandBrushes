import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../features/authSlice";
import { toast } from "react-toastify";
import logo from "../assets/logo2.png";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const login = async () => {
    dispatch(loginUser(formData)).then((response) => {
      console.log("Login response:", response);
      if (response.payload && response.payload.success) {
        const { user, token } = response.payload;
        localStorage.setItem("token", token);
        toast.success(`Welcome ${user.name}!`, {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        navigate("/admin");
      } else {
        toast.error("Login failed. Please check your credentials.", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Zoom,
        });
        //alert(response.payload.errors);
      }
    });
  };

  return (
    <section className="pt-36 pb-24 max_padd_container h-screen flexCenter text-white flex-col bg-gradient-to-r from-blue-400 via-orange-600 to-blue-400">
      <div className="max-w-[555px]  bg-[#ffffff4e] m-auto px-14 py-10 rounded-md">
        <div className="flex justify-center items-center">
          <img src={logo} className="w-[60px]" />
        </div>
        <h3 className="font-anta h3 text-center">Admin Login</h3>
        <div className="flex flex-col gap-4 mt-7">
          <input
            name="email"
            value={formData.email}
            onChange={changeHandler}
            type="email"
            placeholder="Email..."
            className="h-14 w-full pl-5 bg-slate-900/30 outline-none rounded-xl placeholder-white"
          />
          <input
            name="password"
            value={formData.password}
            onChange={changeHandler}
            type="password"
            placeholder="password"
            className="h-14 w-full pl-5 bg-slate-900/30 outline-none rounded-xl placeholder-white"
          />
        </div>
        <button
          onClick={() => login()}
          className="btn_dark_rounded my-5 w-full !rounded-md"
        >
          Login
        </button>

        <div className="flexCenter mt-6 gap-3">
          <p className="text-white">
            To continue, Login with the ADMIN credentials!
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;
