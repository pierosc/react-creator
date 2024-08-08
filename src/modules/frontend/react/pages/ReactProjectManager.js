import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab } from "@mui/material";
import React from "react";
import ChartsIndex from "./Charts/ChartsIndex";
import FormsIndex from "./Forms/FormsIndex";

function ReactProjectManager() {
  // MENU CONTROLS --------------------------------
  const [inputMenu, setInputMenu] = React.useState("0");

  const handleChangeInputMenu = (event, newValue) => {
    setInputMenu(newValue);
  };

  return (
    <div>
      <TabContext value={inputMenu}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChangeInputMenu}>
            <Tab label="CHARTS" value="0" />
            <Tab label="FORMS" value="1" />
          </TabList>
        </Box>
        <TabPanel value="0" sx={{ padding: "0" }}>
          <ChartsIndex />
        </TabPanel>
        <TabPanel value="1" sx={{ padding: "0" }}>
          <FormsIndex />
        </TabPanel>
      </TabContext>
    </div>
  );
}

export default ReactProjectManager;
