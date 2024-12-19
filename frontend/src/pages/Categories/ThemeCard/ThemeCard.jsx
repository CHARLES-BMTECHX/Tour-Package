import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSuitcase } from "@fortawesome/free-solid-svg-icons";

const ThemeCard = ({ themeImage, themename, packageCount }) => {
  return (
    <div className="card theme-card text-center shadow-sm">
      <img
        src={themeImage}
        className="card-img-top rounded-circle mx-auto mt-3"
        alt={themename}
        style={{
          width: "120px",
          height: "120px",
          objectFit: "cover",
        }}
      />
      <div className="card-body">
        <h5 className="card-title fw-bold">{themename}</h5>
        <p className="card-text d-flex justify-content-center align-items-center gap-2">
          <FontAwesomeIcon icon={faSuitcase} className="text-danger" />
          {packageCount} Packages
        </p>
      </div>
    </div>
  );
};

export default ThemeCard;
