import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Empty from "../assets/empty-cart.jpg";
import api from "../api/api";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers } from "../features/authSlice";

const UserList = () => {
  // const [allUsers, setAllUsers] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const dispatch = useDispatch();
  const allUsers = useSelector((state) => state.auth.users);

  useEffect(() => {
    const fetchInfo = async () => {
      setShowLoader(true);
      await dispatch(fetchAllUsers());
      setShowLoader(false);
    };

    fetchInfo();
  }, [dispatch]);

  console.log(allUsers);

  return (
    <div className="text-white flex-col font-anta p-8 box-border bg-black/20 w-full h-screen lg:max-w-[100%] rounded-sm mt-4 lg:m-7">
      <h1 className="bold-22 font-anta text-center mb-5">USER LIST</h1>
      <div>
        {allUsers?.length === 0 ? (
          <div className="flex flex-col justify-center items-center bg-black/60 py-8 rounded-full">
            <img src={Empty} className="rounded-full h-64" />
            <p className="font-anta text-white text-center mt-5">
              No Products to show
            </p>
          </div>
        ) : (
          <div className="max-h-[77vh] overflow-auto px-4 text-center">
            <table className="w-full mx-auto">
              <thead>
                <tr className="overflow-auto border-b-2 border-orange-600">
                  <th className="p-2 uppercase">User Name</th>
                  <th className="p-2 uppercase">Email</th>
                  <th className="p-2 uppercase">Phone Number</th>
                  <th className="p-2 uppercase">Role</th>
                </tr>
              </thead>
              <tbody>
                {allUsers?.map((user, index) => (
                  <tr
                    key={index}
                    className="border-b border-white/40 p-6 medium-14"
                  >
                    <td className="p-2">{user.name}</td>
                    <td className="p-2">{user.email}</td>
                    <td className="p-2">{`+91${user.number}`}</td>
                    <td className="p-2">{user.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {showLoader && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="spinner"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;
