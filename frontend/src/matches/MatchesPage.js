import React, { useState, useEffect } from "react";

const Recommendations = () => {
  const [recommendedJobs, setRecommendedJobs] = useState([]);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/getRecommendations", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Access-Control-Allow-Origin": "http://127.0.0.1:3000",
          "Access-Control-Allow-Credentials": "true",
        },
        method: "GET",
      });
      const data = await response.json();
      console.log(data.data);
      setRecommendedJobs(data);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
  };

  return (
    <div>
      <h2 class="d-flex justify-content-center my-5">Recommended Jobs</h2>
      <table
        classname="table my-4"
        style={{
          boxShadow: "0px 5px 12px 0px rgba(0,0,0,0.1)",
          marginTop: 30,
          marginLeft: "10%",
        }}
      >
        <thead>
          <tr>
            <th
              className="p-3"
              style={{
                fontSize: 18,
                fontWeight: "500",
                backgroundColor: "#2a6e85",
                color: "#fff",
              }}
            >
              Company Name
            </th>
            <th
              className="p-3"
              style={{
                fontSize: 18,
                fontWeight: "500",
                backgroundColor: "#2a6e85",
                color: "#fff",
              }}
            >
              Job Title
            </th>
            <th
              className="p-3"
              style={{
                fontSize: 18,
                fontWeight: "500",
                backgroundColor: "#2a6e85",
                color: "#fff",
              }}
            >
              Link
            </th>
            <th
              className="p-3"
              style={{
                fontSize: 18,
                fontWeight: "500",
                backgroundColor: "#2a6e85",
                color: "#fff",
              }}
            >
              Location
            </th>
            {/* Add more fields as needed */}
          </tr>
        </thead>
        <tbody>
          {console.log(recommendedJobs)}
          {recommendedJobs.map((job, index) => (
            <tr key={index}>
              <td className="p-3">{job.companyName}</td>
              <td className="p-3">{job.jobTitle}</td>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={job["data-share-url"]}
              >
                <button
                  type="button"
                  class="btn btn-primary d-flex align-items-center"
                  style={{
                    backgroundColor: "#2a6e85",
                    margin: "5px",
                    width: "100px",
                    verticalAlign: "middle",
                  }}
                >
                  Job Link
                </button>
              </a>
              <td className="p-3">{job.location}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Recommendations;
