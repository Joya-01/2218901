import React, { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import StatisticsPage from "../components/StatisticsPage";

const Stats = () => {
  useEffect(() => {
    import("../utils/loggerMiddleware.js").then(({ logEvent }) => {
      logEvent("frontend", "info", "stats-page", "User viewed statistics page");
    });
  }, []);
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        URL Statistics
      </Typography>
      <StatisticsPage />
    </Box>
  );
};

export default Stats;
