import React from "react";
import InstagramEmbed from "./InstagramEmbed";
// import { InstagramEmbed } from "react-social-media-embed";


const BlogAuthor = () => {
  return (
    <div className="py-4 px-0">
      <div>
        <h1 className="text-xl mb-2">ABOUT AUTHOR</h1>
        <p className="leading-snug mb-1">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eius, quis
          eaque. Blanditiis, similique aliquam sapiente, odit voluptas
          laudantium corrupti error veritatis ipsam nobis eos? Rem deserunt
          temporibus accusantium libero dolore?
        </p>
        <img
          src="https://krafti.qodeinteractive.com/wp-content/uploads/2019/07/autor-img-1.jpg"
          alt="author"
        />
      </div>
      <div className="instagram">
        {/* <div style={{ display: "flex", justifyContent: "center" }}>
          <InstagramEmbed
            url="https://www.instagram.com/p/C1hxVVFhvzr/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=="
            width={328}
          />
        </div> */}
        {/* <InstagramEmbed /> */}
      </div>
    </div>
  );
};

export default BlogAuthor;
