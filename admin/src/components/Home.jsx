import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
} from "chart.js";
import { Pie, Bar, Doughnut, Radar } from "react-chartjs-2";
import api from "../api/api";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers } from "../features/authSlice";
import Empty from "../assets/empty-cart.jpg";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const Home = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productCounts, setProductCounts] = useState({});
  const [showLoader, setShowLoader] = useState(false);
  const dispatch = useDispatch();
  const allUsers = useSelector((state) => state.auth.users) || [];

  useEffect(() => {
    const fetchData = async () => {
      setShowLoader(true);
      try {
        const responseProducts = await api.get("/api/products/allproducts");
        setAllProducts(responseProducts.data.products);

        const responseCategories = await api.get(
          "/api/categories/allcategories"
        );
        const categoriesData = responseCategories.data.categories || [];
        setCategories(categoriesData);

        const productCountsPromises = categoriesData.map((category) =>
          api.get(`/api/products/category/${category.name}`)
        );
        const productCountsResponses = await Promise.all(productCountsPromises);
        const counts = {};
        productCountsResponses.forEach((res, index) => {
          counts[categoriesData[index]._id] = res.data.products.length;
        });
        setProductCounts(counts);

        await dispatch(fetchAllUsers());
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setShowLoader(false);
    };

    fetchData();
  }, [dispatch]);

  const totalProducts = allProducts.length;
  const numberOfCategories = categories.length;

  const productsInEachCategory = categories.map((category) => ({
    title: category.name,
    number: productCounts[category._id] || 0,
  }));

  console.log(allProducts);
  console.log("Categories: ", categories);
  console.log("Product Counts: ", productCounts);

  const pieData = {
    labels: productsInEachCategory.map((category) => category.title),
    datasets: [
      {
        data: productsInEachCategory.map((category) => category.number),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
      },
    ],
  };

  const pieOptions = {
    plugins: {
      legend: {
        labels: {
          color: "white",
        },
      },
    },
  };

  const barData = {
    labels: productsInEachCategory.map((category) => category.title),
    datasets: [
      {
        label: "Number of Products",
        data: productsInEachCategory.map((category) => category.number),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
        borderColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "white", // y-axis values
        },
      },
      x: {
        beginAtZero: true,
        ticks: {
          color: "white", //x-axis values
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "white",
        },
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += new Number(context.parsed.y).toLocaleString();
            }
            return label;
          },
        },
      },
    },
  };

  const donutData = {
    labels: ["Mumbai", "Kolkata", "Bangalore", "Hyderabad", "Others"],
    datasets: [
      {
        data: [30, 27, 50, 34, 29],
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
      },
    ],
  };

  const donutOptions = {
    plugins: {
      legend: {
        labels: {
          color: "white",
        },
      },
    },
  };

  const radarData = {
    labels: ["Jordan", "Adidas", "Nike", "Converse", "Reebok", "Under Armour"],
    datasets: [
      {
        label: "Number of Products",
        data: [11, 5, 8, 3, 1, 5],
        backgroundColor: "rgba(255, 9, 0, 0.3)",
        borderColor: "white",
        borderWidth: 1,
      },
    ],
  };

  const radarOptions = {
    scales: {
      r: {
        beginAtZero: true,
        ticks: {
          color: "white",
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "white",
        },
      },
    },
  };

  return (
    <div className="text-white flex flex-col w-full rounded-sm mt-4 lg:m-7 p-8 box-border">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="p-5 text-center ring-1 ring-white rounded-md">
          <h3 className="font-anta text-[24px]">Total Products</h3>
          <div className="font-anta text-[30px] text-extrabold">
            {totalProducts}
          </div>
        </div>
        <div className="p-5 text-center ring-1 ring-white rounded-md">
          <h3 className="font-anta text-[24px]">No. of Categories</h3>
          <div className="font-anta text-[30px] text-extrabold">
            {numberOfCategories}
          </div>
        </div>
        <div className="p-5 text-center ring-1 ring-white rounded-md">
          <h3 className="font-anta text-[24px]">No. of Users</h3>
          <div className="font-anta text-[30px] text-extrabold">
            {allUsers.length}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h4 className="font-anta text-center text-[24px]">
          Products in Each Category
        </h4>
        {categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {productsInEachCategory.map((category, index) => (
              <div
                key={index}
                className="p-5 text-center ring-1 ring-white rounded-md"
              >
                <h5 className="font-anta text-[24px] capitalize">
                  {category.title}
                </h5>
                <p className="font-anta text-white text-[30px] text-extrabold">
                  {category.number}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center mt-6">
            <img
              src={Empty}
              alt="Empty Cart"
              className="w-64 h-64 rounded-full"
            />
            <p className="text-lg font-semibold mt-4">No categories found</p>
          </div>
        )}
      </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center items-start">
        <div className="w-full ring-1 ring-white p-6 rounded-md text-white flex flex-col items-center">
          <h4 className="font-anta text-center mt-4 text-[24px]">
            Products Distribution
          </h4>
          <Pie data={pieData} options={pieOptions} />
        </div>

        <div className="w-full ring-1 ring-white p-6 rounded-md text-white flex flex-col items-center">
          <h4 className="font-anta text-center mt-4 text-[24px]">
            Products by Brand
          </h4>
          <Radar data={radarData} options={radarOptions} />
        </div>

        <div className="w-full ring-1 ring-white p-6 rounded-md text-white flex flex-col items-center">
          <h4 className="font-anta text-center mt-4 text-[24px]">
            User Demographics
          </h4>
          <Doughnut data={donutData} options={donutOptions} />
        </div>
      </div>

      <div className="mt-10 w-full ring-1 ring-white p-6 rounded-md">
        <h4 className="font-anta text-center mt-4 text-[24px]">
          Products in Each Category
        </h4>
        <Bar data={barData} options={barOptions} className="h-[300px]" />
      </div>
    </div>
  );
};

export default Home;
