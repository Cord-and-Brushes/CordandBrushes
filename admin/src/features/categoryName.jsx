import React, { useState, useEffect } from "react";
import api from "../api/api";

const CategoryName = ({ categoryId }) => {
  const [categoryName, setCategoryName] = useState("Loading...");

  useEffect(() => {
    const fetchCategoryName = async () => {
      try {
        const response = await api.get(`/api/categories/${categoryId}`);
        console.log("response:", response)
        setCategoryName(response.data.category.name);
      } catch (error) {
        console.error(`Error fetching category with ID ${categoryId}:`, error);
        setCategoryName("Unknown");
      }
    };

    fetchCategoryName();
  }, [categoryId]);

  return <>{categoryName}</>;
};

export default CategoryName;
