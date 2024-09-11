import React, { useContext, useState } from "react";
import AddDatabase from "./AddDatabase";
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import DBManager from "./pages/DBManager";
import JSONMigrator from "./pages/JSONMigrator";

function Databases() {
  const [inputMenu, setInputMenu] = React.useState("0");

  const handleChangeInputMenu = (event, newValue) => {
    setInputMenu(newValue);
  };

  return (
    <div className="grid gap-6 ">
      <TabContext value={inputMenu}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChangeInputMenu}>
            <Tab label="DB DIAGRAM" value="0" />
            <Tab label="JSON MIGRATOR" value="1" />
          </TabList>
        </Box>

        <TabPanel value="0" sx={{ padding: "0" }}>
          <DBManager />
        </TabPanel>
        <TabPanel value="1" sx={{ padding: "0" }}>
          <JSONMigrator />
        </TabPanel>
      </TabContext>
    </div>
  );
}

export default Databases;
