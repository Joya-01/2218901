import React, { useState } from "react";

const defaultValidity = 30;

const UrlShortenerForm = ({ onSubmit }) => {
  const [urls, setUrls] = useState([
    { url: "", validity: defaultValidity, shortcode: "" }
  ]);
  const [error, setError] = useState("");

  const handleChange = (index, field, value) => {
    const updatedUrls = [...urls];
    updatedUrls[index][field] = value;
    setUrls(updatedUrls);
  };

  const addField = () => {
    if (urls.length >= 5) {
      setError("You can only enter up to 5 URLs.");
      return;
    }
    setUrls([...urls, { url: "", validity: defaultValidity, shortcode: "" }]);
  };

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateShortcode = (code) => {
    if (!code) return true;
    return /^[a-zA-Z0-9]{4,12}$/.test(code);
  };

  const validateValidity = (val) => {
    return Number.isInteger(Number(val)) && Number(val) > 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    for (let i = 0; i < urls.length; i++) {
      const { url, validity, shortcode } = urls[i];
      if (!url.trim()) {
        setError(`URL ${i + 1} is required.`);
        return;
      }
      if (!validateUrl(url)) {
        setError(`URL ${i + 1} is not valid.`);
        return;
      }
      if (!validateValidity(validity)) {
        setError(`Validity for URL ${i + 1} must be a positive integer.`);
        return;
      }
      if (!validateShortcode(shortcode)) {
        setError(`Shortcode for URL ${i + 1} must be 4-12 alphanumeric characters.`);
        return;
      }
    }
    onSubmit(urls);
  };

  return (
    <form onSubmit={handleSubmit}>
      {urls.map((entry, i) => (
        <div key={i} style={{ marginBottom: 8 }}>
          <input
            type="text"
            placeholder={`Enter URL ${i + 1}`}
            value={entry.url}
            onChange={e => handleChange(i, "url", e.target.value)}
            style={{ width: 250 }}
          />
          <input
            type="number"
            placeholder="Validity (min)"
            value={entry.validity}
            min={1}
            onChange={e => handleChange(i, "validity", e.target.value)}
            style={{ width: 100, marginLeft: 8 }}
          />
          <input
            type="text"
            placeholder="Shortcode (optional)"
            value={entry.shortcode}
            maxLength={12}
            onChange={e => handleChange(i, "shortcode", e.target.value)}
            style={{ width: 150, marginLeft: 8 }}
          />
        </div>
      ))}
      {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
      <button type="button" onClick={addField} disabled={urls.length >= 5} style={{ marginRight: 8 }}>
        Add Another URL
      </button>
      <button type="submit">Shorten</button>
    </form>
  );
};

export default UrlShortenerForm;
