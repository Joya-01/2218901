import React, { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";

const UrlShortenerForm = ({ onSubmit }) => {
  const [urls, setUrls] = useState([""]);
  const [error, setError] = useState("");

  const handleChange = (index, value) => {
    const updatedUrls = [...urls];
    updatedUrls[index] = value;
    setUrls(updatedUrls);
  };

  const addField = () => {
    if (urls.length >= 5) {
      setError("You can only enter up to 5 URLs.");
      return;
    }
    setUrls([...urls, ""]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const hasEmpty = urls.some((u) => u.trim() === "");
    if (hasEmpty) {
      setError("Please fill all URL fields before submitting.");
      return;
    }
    setError("");
    onSubmit(urls);
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "0 auto", p: 2 }}>
      <Typography variant="h5" gutterBottom>
        URL Shortener
      </Typography>
      <form onSubmit={handleSubmit}>
        {urls.map((url, i) => (
          <TextField
            key={i}
            fullWidth
            label={`Enter URL ${i + 1}`}
            value={url}
            onChange={(e) => handleChange(i, e.target.value)}
            margin="normal"
          />
        ))}
        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}
        <Box sx={{ mt: 2 }}>
          <Button onClick={addField} disabled={urls.length >= 5}>
            Add Another URL
          </Button>
          <Button type="submit" variant="contained" sx={{ ml: 2 }}>
            Shorten
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default UrlShortenerForm;
