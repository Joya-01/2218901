import React from "react";

const StatisticsPage = () => {
  const stats = JSON.parse(localStorage.getItem("shortenedUrls")) || [];

  return (
    <div>
      {stats.length === 0 ? (
        <div>No statistics available yet.</div>
      ) : (
        <ul>
          {stats.map((item, index) => (
            <li key={index}>
              Original: <strong>{item.originalUrl}</strong> → Short: <strong>{item.shortcode}</strong>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StatisticsPage;
