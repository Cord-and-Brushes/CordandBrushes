import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HomeCategoryCard2 from "../HomeCategoryCard2/HomeCategoryCard2";
import api from "../../../../api/api";

const HomeCategorySection = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/categories/allcategories");
        // Filter only available categories
        const availableCategories = response.data.categories.filter(
          (category) => category.available
        );
        setCategories(availableCategories);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (category) => {
    navigate(`/category/${category.name.toLowerCase().replace(/\s+/g, "-")}`, {
      state: { category },
    });
  };

  if (loading) {
    return (
      <div className="mb-12 mt-[70px] flex justify-center items-center">
        <div className="text-lg">Loading categories...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-12 mt-[70px] flex justify-center items-center">
        <div className="text-3xl text-red-500 mb-2">⚠️</div>
        <div className="text-lg text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="mb-12 mt-[70px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-14">
      {categories.map((category, index) => (
        <div
          key={category._id || index}
          onClick={() => handleCategoryClick(category)}
          className="cursor-pointer"
        >
          <HomeCategoryCard2
            imageUrl={category.thumbnail_image}
            backText={category.name}
          />
        </div>
      ))}
    </div>
  );
};

export default HomeCategorySection;
