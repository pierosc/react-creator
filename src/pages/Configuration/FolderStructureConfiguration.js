import React from "react";
import { useTheme, createTheme, ThemeProvider } from "@mui/material/styles";
import { MUITheme } from "../../syles/MUITheme";
import { Button } from "@mui/material";
import { TreeView } from "@mui/x-tree-view";
import { TreeItem } from "@mui/x-tree-view";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import EditIcon from "@mui/icons-material/Edit";
import { getInitSql } from "../../initSql";

function FolderStructureConfiguration({
  entities,
  services,
  controllers,
  repositories,
  reactHooks,
  setFilesCreated,
  setInitSQL,
  tableStructure,
  CloseInitialConfModal,
  handleChangeInputMenu,
}) {
  let theme = useTheme();
  theme = createTheme(theme, MUITheme);
  return (
    <div
      className="flex flex-col gap-2 justify-between"
      style={{ height: "800px" }}
    >
      <div className="grid gap-2">
        <label className="text-white text-center font-semibold text-lg">
          FOLDER STRUCTURE
        </label>
        <div className="grid">
          <label className="text-white">* Choose your folder structure</label>
          {/* <label className="text-white">
            * Don't forget to delete all the comments of your Data Model
          </label> */}
        </div>
        <div className="flex gap-6 justify-around items-center">
          <div className="transition duration-300 transform hover:shadow-2xl hover:scale-105 bg-slate-400 rounded-lg">
            <TreeView
              aria-label="file system navigator"
              defaultCollapseIcon={<ExpandMoreIcon />}
              defaultExpandIcon={<ChevronRightIcon />}
            >
              <TreeItem nodeId="1" label="Business" disabled>
                <TreeItem nodeId="2" label="domain" />
                <TreeItem nodeId="3" label="services" />
              </TreeItem>
              <TreeItem nodeId="5" label="Documents">
                <TreeItem nodeId="10" label="OSS" />
                <TreeItem nodeId="6" label="MUI">
                  <TreeItem
                    nodeId="8"
                    label="index.js"
                    ContentComponent={(props) => <File props={props} />}
                  />
                </TreeItem>
              </TreeItem>
            </TreeView>
          </div>
          <div className="transition duration-300 transform hover:shadow-2xl hover:scale-105 bg-slate-400 rounded-lg">
            <TreeView
              aria-label="file system navigator"
              defaultCollapseIcon={<ExpandMoreIcon />}
              defaultExpandIcon={<ChevronRightIcon />}
            >
              <TreeItem nodeId="1" label="Business">
                <TreeItem nodeId="2" label="domain" />
                <TreeItem nodeId="3" label="services" />
              </TreeItem>
              <TreeItem nodeId="5" label="Documents">
                <TreeItem nodeId="10" label="OSS" />
                <TreeItem nodeId="6" label="MUI">
                  <TreeItem
                    nodeId="8"
                    label="index.js"
                    ContentComponent={(props) => <File props={props} />}
                  />
                </TreeItem>
              </TreeItem>
            </TreeView>
          </div>
          <div className="transition duration-300 transform hover:shadow-2xl hover:scale-105 bg-slate-400 rounded-lg">
            <TreeView
              aria-label="file system navigator"
              defaultCollapseIcon={<ExpandMoreIcon />}
              defaultExpandIcon={<ChevronRightIcon />}
            >
              <TreeItem nodeId="1" label="Business">
                <TreeItem nodeId="2" label="domain" />
                <TreeItem nodeId="3" label="services" />
              </TreeItem>
              <TreeItem nodeId="5" label="Documents">
                <TreeItem nodeId="10" label="OSS" />
                <TreeItem nodeId="6" label="MUI">
                  <TreeItem
                    nodeId="8"
                    label="index.js"
                    ContentComponent={(props) => <File props={props} />}
                  />
                </TreeItem>
              </TreeItem>
            </TreeView>
          </div>
        </div>
      </div>
      <ThemeProvider theme={theme}>
        <div className="flex gap-4 justify-between">
          <Button
            variant="contained"
            size="large"
            onClick={() => {
              //   setTableStructure(getEstructure(code));
              handleChangeInputMenu("2");
            }}
          >
            Back
          </Button>
          <Button
            variant="contained"
            size="large"
            onClick={() => {
              entities.setEmptyStructure();
              services.setEmptyStructure();
              controllers.setEmptyStructure();
              repositories.setEmptyStructure();
              reactHooks.setEmptyStructure();

              const initSQL = getInitSql(tableStructure);
              setInitSQL(initSQL);
              setFilesCreated(true);
              CloseInitialConfModal();
            }}
          >
            CREATE PROJECT
          </Button>
        </div>
      </ThemeProvider>
    </div>
  );
}

export default FolderStructureConfiguration;

function File(props) {
  //   console.log(props);
  return (
    <div className="flex justify-between">
      <div className="flex">
        <div
          className="w-4
  "
        ></div>
        <label>{"label"}</label>
      </div>
      <div className="flex gap-1">
        <EditIcon />
        <EditIcon />
      </div>
    </div>
  );
}
