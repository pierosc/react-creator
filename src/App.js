import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { useTheme, createTheme, ThemeProvider } from "@mui/material/styles";
import React, { useState, useRef, useEffect } from "react";
import { MUITheme } from "./syles/MUITheme";
import JavaSpring from "./modules/backend/javaSpring/JavaSpring";

function APP() {
  let theme = useTheme();
  theme = createTheme(theme, MUITheme);

  const [value, setValue] = React.useState("0");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <ThemeProvider theme={theme}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <div className="flex gap-2 justify-center">
            <TabList onChange={handleChange}>
              <Tab label="Java" value="0" />
              <Tab label="React" value="1" disabled />
            </TabList>
          </div>
        </Box>
        <TabPanel value="0" sx={{ padding: "0" }}>
          <JavaSpring />
        </TabPanel>

        <TabPanel value="1" sx={{ padding: "0" }}>
          {/* <JavaSpring /> */}
        </TabPanel>
      </TabContext>
    </ThemeProvider>
  );
}

export default APP;
