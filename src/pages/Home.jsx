import React, { useState } from "react";
import UrlShortenerForm from "../components/UrlShortenerForm";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper
} from "@mui/material";
import { logEvent } from "../utils/loggerMiddleware";

const Home = () => {
  const [results, setResults] = useState([]);

  const shortenUrls = async (urls) => {
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

        const data = await res.json();
        if (data.shortcode) {
          setResults((prev) => [
            ...prev,
            { original: url, shortened: data.shortcode }
          ]);
          await logEvent("frontend", "info", "url-form", `Shortened ${url}`);
        }
      } catch (err) {
        await logEvent("frontend", "error", "url-form", `Error shortening ${url}`);
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <UrlShortenerForm onSubmit={shortenUrls} />

      {results.length > 0 && (
        <Paper sx={{ mt: 4, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Shortened Results
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Original URL</TableCell>
                <TableCell>Shortcode</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.original}</TableCell>
                  <TableCell>
                    <a
                      href={`http://20.244.56.144/${row.shortened}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {row.shortened}
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  );
};

export default Home;
