import React, { useState, useEffect } from "react";

const Recommendations = () => {
  const [recommendedJobs, setRecommendedJobs] = useState([]);

  useEffect(() => {
    const checkFieldsAndFetch = async () => {
      const skills = localStorage.getItem("skills");
      const experienceLevel = localStorage.getItem("experienceLevel");
      const location = localStorage.getItem("location");

      if (!skills || !experienceLevel || !location) {
        alert("Please fill in all required fields in the profile page for accurate matches.");
        return;
      }

      await fetchRecommendations();
    };

    checkFieldsAndFetch();
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
      {/* ... (existing code) */}
    </div>
  );
};

export default Recommendations;
