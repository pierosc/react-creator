import { useTheme, createTheme, ThemeProvider } from "@mui/material/styles";
import { Button, IconButton, Modal, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import React from "react";
import FolderView from "./FolderView";
import TableJSONView from "./TableJSONView";
import { getEstructure } from "../EstructureFunctions";
import { getEntitiesList } from "../EntitiesFunctions";
import { getInitSql } from "../initSql";
import { MUITheme } from "../syles/MUITheme";
import DataModel from "./DataModel";

function Configuration({
  setTableStructure,
  setEntitiesList,
  setFilesCreated,
  setInitSQL,
  artifactId,
  setArticaftId,
  dbName,
  setDbName,
  code,
  setCode,
  tableStructure,
  oppositeRelations,
  setOppositeRelations,
  services,
  controllers,
  repositories,
  textAreaRef,
}) {
  let theme = useTheme();
  //   let newMUITheme = MUITheme;
  //   const styles = {
  //     ...newMUITheme.components.MuiTabs.styleOverrides,
  //     flexContainer: { display: "grid" },
  //   };
  //   newMUITheme.components.MuiTabs.styleOverrides = styles;

  //   console.log(newMUITheme);
  theme = createTheme(theme, MUITheme);
  const [inputMenu, setInputMenu] = React.useState("0");
  const handleChangeInputMenu = (event, newValue) => {
    setInputMenu(newValue);
  };

  return (
    <div className="grid gap-4 p-4">
      <TabContext value={inputMenu}>
        {/* <div className="flex"> */}
        <ThemeProvider theme={theme}>
          <TabList onChange={handleChangeInputMenu}>
            <Tab label="Data model" value="0" />
            <Tab label="table json" value="1" />
            <Tab label="folder structure" value="2" />
          </TabList>
        </ThemeProvider>

        <TabPanel value="0" sx={{ padding: "0" }}>
          <DataModel
            textAreaRef={textAreaRef}
            code={code}
            setCode={setCode}
            artifactId={artifactId}
            setArticaftId={setArticaftId}
            dbName={dbName}
            setDbName={setDbName}
            oppositeRelations={oppositeRelations}
            setOppositeRelations={setOppositeRelations}
          />
        </TabPanel>
        <TabPanel value="1" sx={{ padding: "0" }}>
          <TableJSONView tableStructure={tableStructure} />
        </TabPanel>
        <TabPanel value="2" sx={{ padding: "0" }}>
          <FolderView />
        </TabPanel>
        {/* </div> */}
      </TabContext>
      <div className="flex gap-4">
        <ThemeProvider theme={theme}>
          <Button
            variant="outlined"
            size="large"
            onClick={() => {
              setTableStructure(getEstructure(code));
            }}
          >
            Get Structure
          </Button>
          <Button
            variant="outlined"
            size="large"
            disabled={tableStructure.length === 0}
            onClick={() => {
              const entitites = getEntitiesList(tableStructure, artifactId);
              setEntitiesList(entitites);
              services.setEmptyStructure();
              controllers.setEmptyStructure();
              repositories.setEmptyStructure();

              const initSQL = getInitSql(tableStructure);
              setInitSQL(initSQL);
              setFilesCreated(true);
            }}
          >
            Get EMPTY Files
          </Button>
        </ThemeProvider>
      </div>
    </div>
  );
}

export default Configuration;
