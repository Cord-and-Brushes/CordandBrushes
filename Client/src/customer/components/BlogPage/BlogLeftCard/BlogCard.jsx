import { Link } from "react-router-dom";
import "./blogcard.css";

const extractFirst200Words = (html) => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  const textContent = tempDiv.textContent || tempDiv.innerText || "";
  const words = textContent.split(" ").slice(0, 50).join(" ");
  return words + "...";
};

// BlogPost.js
const BlogCard = ({
  imgUrl,
  title,
  author,
  date,
  description,
  quote,
  blogId,
}) => {
  const truncatedDescription = extractFirst200Words(description);

  return (
    <div className="p-5">
      {/* blog card */}
      <div className="blogcard p-5 bg-white shadow-lg flex flex-col border border-gray-200 rounded-md">
        <img
          src={imgUrl}
          alt={title}
          className="w-[100%] h-[40vh] rounded-md"
        />
        <div className="blog-post-info">
          <h2 className="blog-post-title text-[24px] text-left font-semibold">
            {title}
          </h2>
          <div className="flex gap-5">
            <p className="blog-post-author text-orange-500">
              By {author}
              <span className="font-bold"> - </span>
              {date}
            </p>
            <p className="blog-post-date"></p>
          </div>

          <p className="blog-post-description">
            <span className="prose prose-lg mb-6">{truncatedDescription}</span>
            <Link to={`/blogdetails/${blogId}`} className="text-blue-600">
              See more...
            </Link>
          </p>
        </div>
      </div>
      <img
        src="https://i.postimg.cc/VNsjGGgH/Leaf-border-removebg-preview.png"
        alt="border"
      />
      <div>
        {/* quote card */}
        <div className="custom-card text-white bg-white rounded-md">
          <div className="card-content">
            <p className="text-center text-white">{quote}</p>
          </div>
        </div>
      </div>
      <img
        src="https://i.postimg.cc/VNsjGGgH/Leaf-border-removebg-preview.png"
        alt="border"
        className="transform rotate-180"
      />
    </div>
  );
};

export default BlogCard;
