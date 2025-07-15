import React from "react";
import { List, ListItem, Paper, Typography } from "@mui/material";

const StatisticsPage = () => {
  const stats = JSON.parse(localStorage.getItem("shortenedUrls")) || [];

  return (
    <Paper sx={{ p: 2 }}>
      {stats.length === 0 ? (
        <Typography>No statistics available yet.</Typography>
      ) : (
        <List>
          {stats.map((item, index) => (
            <ListItem key={index}>
              Original: <strong>{item.originalUrl}</strong> → Short: <strong>{item.shortcode}</strong>
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default StatisticsPage;
