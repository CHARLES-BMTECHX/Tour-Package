import React, { useEffect, useState } from "react";
import axios from "axios";

const Top_destinations = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from the API
  useEffect(() => {
    const fetchTopDestinations = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/packages/get-top-destinations-by-state"
        );
        setData(response.data.data); // Set the grouped data
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTopDestinations();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-danger">Error: {error}</div>;
  }

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Top Destinations</h2>
      {Object.keys(data).map((stateName) => {
        const stateData = data[stateName];
        return (
          <div key={stateName} className="card shadow mb-4">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">{stateData.stateDetails.state}</h3>
            </div>
            <div className="card-body">
              <p><strong>Description:</strong> {stateData.stateDetails.description}</p>
              <p><strong>Type:</strong> {stateData.stateDetails.type}</p>
              <p><strong>Starting Price:</strong> ₹{stateData.stateDetails.startingPrice}</p>
              <div className="row">
                {Object.keys(stateData.cities).map((cityName) => (
                  <div key={cityName} className="col-md-6 mb-4">
                    <h4>{cityName}</h4>
                    <div className="row">
                      {stateData.cities[cityName].map((pkg) => (
                        <div key={pkg.packageId} className="col-md-12">
                          <div className="card shadow-sm mb-3">
                            <div className="row g-0">
                              <div className="col-md-4">
                                <img
                                  src={pkg.images[0]}
                                  className="img-fluid rounded-start"
                                  alt={pkg.name}
                                  style={{ height: "100px", objectFit: "cover" }}
                                />
                              </div>
                              <div className="col-md-8">
                                <div className="card-body">
                                  <h5 className="card-title">{pkg.name}</h5>
                                  <p className="card-text">
                                    <strong>Price:</strong> ₹{pkg.price} <br />
                                    <strong>Duration:</strong> {pkg.duration}
                                  </p>
                                  <p className="card-text text-muted">{pkg.description}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Top_destinations;
