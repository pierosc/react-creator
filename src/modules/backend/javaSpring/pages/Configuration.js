import { useTheme, createTheme, ThemeProvider } from "@mui/material/styles";
import { Button, IconButton, Modal, Typography } from "@mui/material";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import React from "react";
import FolderView from "./FolderView";
import TableJSONView from "./TableJSONView";
import { getEstructure } from "../../../../EstructureFunctions";
import { getInitSql } from "../../../../initSql";
import { MUITheme } from "../../../../syles/MUITheme";
import DataModel from "./DataModel";

function Configuration({
  setTableStructure,
  // setEntitiesList,
  setFilesCreated,
  setInitSQL,
  // artifactId,
  dbName,
  setDbName,
  code,
  setCode,
  tableStructure,
  oppositeRelations,
  setOppositeRelations,
  entities,
  services,
  controllers,
  repositories,
  reactHooks,
  handleClose,
  setMetaData,
  metaData,
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
        <ThemeProvider theme={theme}>
          <TabList onChange={handleChangeInputMenu}>
            <Tab label="Data model" value="0" />
            <Tab label="table json" value="1" />
            <Tab label="folder structure" value="2" />
          </TabList>
        </ThemeProvider>

        <TabPanel value="0" sx={{ padding: "0" }}>
          <DataModel
            code={code}
            setCode={setCode}
            dbName={dbName}
            setDbName={setDbName}
            oppositeRelations={oppositeRelations}
            setOppositeRelations={setOppositeRelations}
            setMetaData={setMetaData}
            metaData={metaData}
          />
        </TabPanel>
        <TabPanel value="1" sx={{ padding: "0" }}>
          <TableJSONView tableStructure={tableStructure} />
        </TabPanel>
        <TabPanel value="2" sx={{ padding: "0" }}>
          <FolderView />
        </TabPanel>
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
              entities.setEmptyStructure();
              services.setEmptyStructure();
              controllers.setEmptyStructure();
              repositories.setEmptyStructure();
              reactHooks.setEmptyStructure();

              const initSQL = getInitSql(tableStructure);
              setInitSQL(initSQL);
              setFilesCreated(true);
              handleClose();
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
