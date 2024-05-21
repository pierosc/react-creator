import { Button } from "@mui/material";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import React from "react";
import FolderView from "./FolderView";
import TableJSONView from "./TableJSONView";
import { getEstructure } from "../../../../EstructureFunctions";
import { getInitSql } from "../../../../initSql";
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
  const [inputMenu, setInputMenu] = React.useState("0");
  const handleChangeInputMenu = (event, newValue) => {
    setInputMenu(newValue);
  };

  return (
    <div className="grid gap-4 p-4">
      <TabContext value={inputMenu}>
        <TabList onChange={handleChangeInputMenu}>
          <Tab label="Data model" value="0" />
          <Tab label="table json" value="1" />
          <Tab label="folder structure" value="2" />
        </TabList>

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
      </div>
    </div>
  );
}

export default Configuration;
