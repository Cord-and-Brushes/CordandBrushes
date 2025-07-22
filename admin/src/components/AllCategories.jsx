import React, { useState, useEffect } from "react";
import { TbTrash } from "react-icons/tb";
import { RiEdit2Line } from "react-icons/ri";
import { toast, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Empty from "../assets/empty-cart.jpg";
import Modal from "react-modal";
import api from "../api/api";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [productCounts, setProductCounts] = useState({});
  const [showLoader, setShowLoader] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategoriesAndCounts = async () => {
      setShowLoader(true);
      try {
        const response = await api.get("/api/categories/allcategories");
        const categoriesData = response.data.categories || [];
        setCategories(categoriesData);

        const productCountsPromises = categoriesData.map(async (category) => {
          try {
            const res = await api.get(
              `/api/products/category/${encodeURIComponent(category.name)}`
            );
            return {
              id: category._id,
              count: res.data.products ? res.data.products.length : 0,
            };
          } catch (err) {
            console.error(
              `Error fetching products for category ${category.name}:`,
              err
            );
            return { id: category._id, count: 0 };
          }
        });

        const countsArray = await Promise.all(productCountsPromises);
        const counts = {};
        countsArray.forEach(({ id, count }) => {
          counts[id] = count;
        });

        setProductCounts(counts);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
      setShowLoader(false);
    };

    fetchCategoriesAndCounts();
  }, []);

  const deleteCategoryHandler = async (id) => {
    setShowLoader(true);
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/api/categories/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories(categories.filter((category) => category._id !== id));
      toast.success("Category removed successfully", {
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
    } catch (error) {
      console.error("Error removing category:", error);
    }
    setShowLoader(false);
    setIsModalOpen(false);
  };

  const toggleCategoryStatus = async (id) => {
    setShowLoader(true);
    try {
      const token = localStorage.getItem("token");
      await api.put(
        `/api/categories/toggle-availability/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCategories(
        categories.map((category) =>
          category._id === id
            ? { ...category, available: !category.available }
            : category
        )
      );
      toast.success("Category status toggled successfully", {
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
    } catch (error) {
      console.error("Error toggling category status:", error);
    }
    setShowLoader(false);
  };

  return (
    <div className="text-white flex-col font-anta p-8 box-border bg-black/20 w-full h-screen lg:max-w-[100%] rounded-sm mt-4 lg:m-7">
      <h1 className="bold-22 font-anta text-center mb-5">CATEGORY LIST</h1>
      <div>
        {categories.length === 0 ? (
          <div className="flex flex-col justify-center items-center bg-black/60 py-8 rounded-full">
            <img src={Empty} className="rounded-full h-64" alt="Empty cart" />
            <p className="font-anta text-white text-center mt-5">
              No Categories to show
            </p>
          </div>
        ) : (
          <div className="max-h-[77vh] overflow-auto px-4 text-center">
            <table className="w-full mx-auto">
              <thead>
                <tr className="overflow-auto border-b-2 border-orange-600">
                  <th className="p-2 font-anta uppercase">Thumbnail</th>
                  <th className="p-2 font-anta uppercase">Name</th>
                  <th className="p-2 font-anta uppercase">Products</th>
                  <th className="p-2 font-anta uppercase">Remove/Edit</th>{" "}
                  <th className="p-2 font-anta uppercase">Available</th>
                  {/* Combined column */}
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr
                    key={category._id}
                    className="border-b border-white/40 p-6 medium-14"
                  >
                    <td className="p-2">
                      <div className="flex justify-center items-center">
                        <img
                          src={category.thumbnail_image}
                          className="h-16 w-16 object-cover"
                          alt={category.name}
                        />
                      </div>
                    </td>
                    <td className="p-2 font-anta">{category.name}</td>
                    <td className="p-2 font-anta">
                      {productCounts[category._id] || 0}
                    </td>

                    <td className="p-2 flex mt-2 gap-x-5 justify-center items-center">
                      {" "}
                      {/* Combined actions */}
                      <button
                        className="hover:text-orange-600"
                        onClick={() => {
                          setCategoryToDelete(category._id);
                          setIsModalOpen(true);
                        }}
                      >
                        <TbTrash className="text-[22px]" />
                      </button>
                      <button
                        className="hover:text-orange-600"
                        onClick={() =>
                          navigate(`/admin/editcategory/${category._id}`)
                        }
                      >
                        <RiEdit2Line className="text-[22px]" />
                      </button>
                    </td>
                    <td className="p-2">
                      <div className="flex justify-center items-center">
                        <label className="switch font-anta">
                          <input
                            type="checkbox"
                            className="toggle"
                            checked={category.available}
                            onChange={() => toggleCategoryStatus(category._id)}
                          />
                          <span className="slider"></span>
                        </label>
                      </div>
                    </td>
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

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Delete Confirmation"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <h2>Confirm Deletion</h2>
        <p>Are you sure you want to delete this category?</p>
        <div className="flex gap-x-5 mt-3">
          <button
            onClick={() => setIsModalOpen(false)}
            className="btn_dark_rounded"
          >
            Cancel
          </button>
          <button
            onClick={() => deleteCategoryHandler(categoryToDelete)}
            className="btn_dark_rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default CategoryList;
