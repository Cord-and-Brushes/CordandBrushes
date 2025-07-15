import React from "react";
import "./memberCard.css";

const MemberCard = ({ image, name, designation }) => {
  return (
    <div className="cardContainer">
      <div className="profileDiv">
        <img src={image} />
      </div>
      <div className="infoDiv">
        <div className="nameDiv">
          <p className="name">{name}</p>
          <p className="role">{designation}</p>
        </div>
      </div>
    </div>
  );
};

export default MemberCard;
