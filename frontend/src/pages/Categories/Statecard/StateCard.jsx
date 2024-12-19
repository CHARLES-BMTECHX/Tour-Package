import React from "react";

const StateCard = ({ stateName, stateImage, startingPrice, cityCount, packageName }) => {
  return (
    <div className="card shadow-sm">
      <img
        src={stateImage} // Use dynamically constructed stateImageURL
        className="card-img-top"
        alt={stateName}
        style={{ height: "200px", objectFit: "cover" }}
      />
      <div className="card-body text-center">
        <h5 className="fw-bold">{stateName}</h5>
        <p className="text-secondary mb-1">Destinations {cityCount}+</p>
        {/* <p className="text-success fw-bold mb-0">
          Starting Price: ₹ {startingPrice}
        </p> */}
      </div>
    </div>
  );
};

export default StateCard;
