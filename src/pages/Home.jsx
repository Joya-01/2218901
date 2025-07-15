import React, { useState } from "react";
import UrlShortenerForm from "../components/UrlShortenerForm";

const Home = () => {
  const [results, setResults] = useState([]);
  const [apiError, setApiError] = useState("");

  const shortenUrls = async (urls) => {
    setApiError("");
    for (let url of urls) {
      try {
        const res = await fetch("http://20.244.56.144/shorten", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_ACCESS_TOKEN}`
          },
          body: JSON.stringify({ url, expiry: 30 })
        });

        if (!res.ok) {
          setApiError("Failed to shorten URL. Please check your input or try again later.");
          continue;
        }
        const data = await res.json();
        if (data.shortcode) {
          setResults((prev) => [
            ...prev,
            { original: url, shortened: data.shortcode }
          ]);
        } else {
          setApiError("Failed to shorten URL. Please check your input or try again later.");
        }
      } catch (err) {
        setApiError("Network error. Please try again later.");
      }
    }
  };

  return (
    <div>
      <h2>URL Shortener</h2>
      <p>Enter a URL below to generate a short link. You can also specify validity (in minutes) and an optional shortcode.</p>
      <UrlShortenerForm onSubmit={shortenUrls} />
      {apiError && <div style={{ color: 'red', marginTop: 8 }}>{apiError}</div>}
      {results.length > 0 && (
        <table border="1" cellPadding="5" style={{ marginTop: 20 }}>
          <thead>
            <tr>
              <th>Original URL</th>
              <th>Shortcode</th>
            </tr>
          </thead>
          <tbody>
            {results.map((row, index) => (
              <tr key={index}>
                <td>{row.original}</td>
                <td>
                  <a href={`http://20.244.56.144/${row.shortened}`} target="_blank" rel="noopener noreferrer">
                    {row.shortened}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Home;
