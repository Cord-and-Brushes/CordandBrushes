const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const connectDB = require("./config/connectDB");
const authMiddleware = require("./middleware/authMiddleware");
const errorHandler = require("./middleware/errorHandler");
const validateRequest = require("./middleware/validateRequest");
const productRoutes = require("./routes/products");
const authRoutes = require("./routes/auth");
const blogRoutes = require("./routes/posts");
const commentRoutes = require("./routes/comments");
const bannerRoutes = require("./routes/banner");
const categoryRoutes = require("./routes/category");
const liveClassRoutes = require("./routes/liveClassRoutes");
const workshopRoutes = require("./routes/workshop");
const aboutpageRoutes = require("./routes/about");

dotenv.config();

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

const allowedOrigins = [process.env.CLIENT_URL, process.env.ADMIN_URL];
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(bodyParser.json());
app.use(express.json());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));

//connect to mongoDB atlas
connectDB();

//ROUTES
//use products routes
app.use("/api/products", productRoutes);

//use auth routes
app.use("/api/auth", authRoutes);

//use post route
app.use("/api/blogs", blogRoutes);

//use banner route
app.use("/api/banners", bannerRoutes);

app.use("/api/categories", categoryRoutes);

//use comment route
app.use("/api/comments", commentRoutes);

//use live class route
app.use("/api/liveclasses", liveClassRoutes);

//use workshops route
app.use("/api/workshops", workshopRoutes);

app.use("/api/aboutpage", aboutpageRoutes);
//use error handling middleware
app.use(errorHandler);

//use validation middleware for routes that require validation
app.use("/validate", validateRequest);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
