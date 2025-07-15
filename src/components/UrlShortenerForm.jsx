import React, { useState } from "react";
import { TextField, Button, Box, Typography, Grid } from "@mui/material";
import { logEvent } from "../utils/loggerMiddleware";

const defaultValidity = 30;

const UrlShortenerForm = ({ onSubmit }) => {
  const [urls, setUrls] = useState([
    { url: "", validity: defaultValidity, shortcode: "" }
  ]);
  const [error, setError] = useState("");
  const [results, setResults] = useState([]);

  const handleChange = (index, field, value) => {
    const updatedUrls = [...urls];
    updatedUrls[index][field] = value;
    setUrls(updatedUrls);
  };

  const addField = async () => {
    if (urls.length >= 5) {
      setError("You can only enter up to 5 URLs.");
      await logEvent("frontend", "error", "url-form", "User tried to add more than 5 URLs");
      return;
    }
    setUrls([...urls, { url: "", validity: defaultValidity, shortcode: "" }]);
  };

  const saveToStats = (originalUrl, shortcode, expiry) => {
    const stats = JSON.parse(localStorage.getItem("shortenedUrls")) || [];
    stats.push({ originalUrl, shortcode, expiry });
    localStorage.setItem("shortenedUrls", JSON.stringify(stats));
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
    setResults([]);

    for (let i = 0; i < urls.length; i++) {
      const { url, validity, shortcode } = urls[i];
      if (!url.trim()) {
        setError(`URL ${i + 1} is required.`);
        await logEvent("frontend", "error", "url-form", `URL ${i + 1} is empty`);
        return;
      }
      if (!validateUrl(url)) {
        setError(`URL ${i + 1} is not valid.`);
        await logEvent("frontend", "error", "url-form", `URL ${i + 1} is not valid: ${url}`);
        return;
      }
      if (!validateValidity(validity)) {
        setError(`Validity for URL ${i + 1} must be a positive integer.`);
        await logEvent("frontend", "error", "url-form", `Invalid validity for URL ${i + 1}: ${validity}`);
        return;
      }
      if (!validateShortcode(shortcode)) {
        setError(`Shortcode for URL ${i + 1} must be 4-12 alphanumeric characters.`);
        await logEvent("frontend", "error", "url-form", `Invalid shortcode for URL ${i + 1}: ${shortcode}`);
        return;
      }
    }

    const token = process.env.REACT_APP_ACCESS_TOKEN;
    let newResults = [];

    for (const { url, validity, shortcode } of urls) {
      try {
        const body = {
          url,
          validity: Number(validity),
        };
        if (shortcode) body.shortcode = shortcode;
        const response = await fetch("http://20.244.56.144/url-shortener/shorten", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        });
        const data = await response.json();
        if (response.ok && data.shortcode) {
          const expiry = new Date(Date.now() + Number(validity) * 60000).toLocaleString();
          saveToStats(url, data.shortcode, expiry);
          newResults.push({ url, shortcode: data.shortcode, expiry });
        } else {
          await logEvent("frontend", "error", "url-form", `Shortening failed: ${JSON.stringify(data)}`);
        }
      } catch (err) {
        await logEvent("frontend", "error", "url-form", `Error while shortening URL: ${err}`);
      }
    }
    setResults(newResults);
    onSubmit(urls);
  };

  return (
    <Box sx={{ maxWidth: 700, margin: "0 auto", p: 2 }}>
      <Typography variant="h5" gutterBottom>
        URL Shortener
      </Typography>
      <form onSubmit={handleSubmit}>
        {urls.map((entry, i) => (
          <Grid container spacing={2} key={i} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={`Enter URL ${i + 1}`}
                value={entry.url}
                onChange={(e) => handleChange(i, "url", e.target.value)}
                margin="normal"
              />
            </Grid>
            <Grid item xs={6} md={2}>
              <TextField
                fullWidth
                label="Validity (min)"
                type="number"
                value={entry.validity}
                onChange={(e) => handleChange(i, "validity", e.target.value)}
                margin="normal"
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid item xs={6} md={4}>
              <TextField
                fullWidth
                label="Shortcode (optional)"
                value={entry.shortcode}
                onChange={(e) => handleChange(i, "shortcode", e.target.value)}
                margin="normal"
                inputProps={{ maxLength: 12 }}
              />
            </Grid>
          </Grid>
        ))}
        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}
        <Box sx={{ mt: 2 }}>
          <Button onClick={() => addField()} disabled={urls.length >= 5}>
            Add Another URL
          </Button>
          <Button type="submit" variant="contained" sx={{ ml: 2 }}>
            Shorten
          </Button>
        </Box>
      </form>
      {results.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Shortened Results
          </Typography>
          <Grid container spacing={2}>
            {results.map((res, idx) => (
              <Grid item xs={12} key={idx}>
                <Typography>
                  Original: <strong>{res.url}</strong> → Short: <strong>{res.shortcode}</strong> (Expires: {res.expiry})
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default UrlShortenerForm;
