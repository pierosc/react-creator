import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { useTheme, createTheme, ThemeProvider } from "@mui/material/styles";
import DownloadIcon from "@mui/icons-material/Download";
import React, { useState, useRef, useEffect } from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import { jpaFolderStructure } from "./jpaFolferStructure";
import Entities from "./pages/Entities";
import { getEntitiesFiles, getEntitiesList } from "./EntitiesFunctions";
import Repositories from "./pages/Repositories";
import { MUITheme } from "./syles/MUITheme";
import { Button, IconButton, Modal, Typography } from "@mui/material";
import Services from "./pages/Services";

import Controllers from "./pages/Controllers";
import InitSQL from "./pages/InitSQL";
import TableJSONView from "./pages/TableJSONView";
import FolderView from "./pages/FolderView";
import DTOInput from "./pages/DTOInput";
import ReactHooks from "./pages/ReactHooks";
import useService from "./hooks/useService/useService";
import { useController } from "./hooks/useController";
import { useRepositories } from "./hooks/useRepositories";
import { useDTO } from "./hooks/useDTO/useDTO";
import { useJPAProject } from "./hooks/useJPAProject";
import DTOOutput from "./pages/DTOOutput";
import { boxStyle } from "./syles/BoxStyle";
import Configuration from "./pages/Configuration";
import ServiceDTOInput from "./pages/ServiceDTOInput";
import useCustomHook from "./hooks/useCustomHook";
import useUtils from "./hooks/useUtils/useUtils";
import useException from "./hooks/useException/useException";
import useApplication from "./hooks/useApplication";
import useFile from "./hooks/useFile/useFile";

function APP() {
  const [open, setOpen] = React.useState(true);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [value, setValue] = React.useState("1");
  const [inputMenu, setInputMenu] = React.useState("0");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleChangeInputMenu = (event, newValue) => {
    setInputMenu(newValue);
  };
  const [table, setTable] = React.useState({});

  const handleChangeTable = (event) => {
    setTable(tableStructure.find((t) => t.name === event.target.value));
  };

  const [tableStructure, setTableStructure] = useState([]);
  const [filesCreated, setFilesCreated] = useState(false);

  const [entitiesList, setEntitiesList] = useState({});

  const [initSQL, setInitSQL] = useState("");

  let theme = useTheme();
  theme = createTheme(theme, MUITheme);

  let jpa = jpaFolderStructure;

  const [code, setCode] = useState("");
  const [artifactId, setArticaftId] = useState("users");
  const [dbName, setDbName] = useState("dB");
  const [metaData, setMetaData] = useState({
    group: "com.users",
    artifact: "users",
    name: "users",
    packageName: "com.users",
  });

  //OPTIONS
  const [oppositeRelations, setOppositeRelations] = useState(false);

  //HOOKS
  const services = useService(tableStructure, metaData);
  const controllers = useController(tableStructure, metaData);
  const repositories = useRepositories(tableStructure, metaData);
  const utils = useUtils(metaData);
  const DTO = useDTO(metaData, utils.DTOMap);
  const exception = useException(metaData);
  const application = useApplication(metaData);

  const reactHooks = useCustomHook(tableStructure);
  const file = useFile();

  const JPA = useJPAProject(repositories, services, controllers, DTO, metaData);
  const [selectedService, setSelectedService] = useState({});

  return (
    <div
      className="grid grid-cols-3 gap-4 p-12 items-start"
      style={{ backgroundColor: "rgba(6,8,25)" }}
    >
      <div className="grid gap-4">
        <label className="text-white">
          {`Servicio: ${selectedService?.service ?? ""}`}{" "}
        </label>
        <TabContext value={inputMenu}>
          <ThemeProvider theme={theme}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList onChange={handleChangeInputMenu}>
                <Tab label="INPUT DTO's" value="0" />
                <Tab label="OUTPUT DTO's" value="1" />
                <Tab label="CONTROLLER" value="2" />
              </TabList>
            </Box>
          </ThemeProvider>

          <TabPanel value="0" sx={{ padding: "0" }}>
            <ServiceDTOInput
              DTO={DTO}
              table={table}
              selectedService={selectedService}
            />
          </TabPanel>
          <TabPanel value="1" sx={{ padding: "0" }}>
            <TableJSONView tableStructure={tableStructure} />
          </TabPanel>
          <TabPanel value="2" sx={{ padding: "0" }}>
            <FolderView />
          </TabPanel>
        </TabContext>
      </div>
      <ThemeProvider theme={theme}>
        <div className="col-span-2 grid gap-2">
          <div className="flex gap-2 justify-between">
            <div>
              <Button
                variant="outlined"
                size="large"
                onClick={() => {
                  tableStructure.forEach((table) => {
                    JPA.createListEndpoint(table);
                    JPA.createAddEndpoint(table);
                    JPA.createEditEndpoint(table);
                    JPA.createDeleteEndpoint(table);
                    JPA.createFilterEndpoint(table);
                  });
                }}
              >
                Add CRUDF Service
              </Button>
              <Button
                variant="outlined"
                size="large"
                disabled={!filesCreated}
                endIcon={<DownloadIcon />}
                onClick={() => {
                  const entities = getEntitiesFiles(entitiesList);
                  jpa[2].content[0].content[0].content = entities;

                  const repos = repositories.files();
                  jpa[2].content[0].content[1].content = repos;

                  const servicesFiles = services.files();
                  jpa[0].content[1].content = servicesFiles;

                  const controllersFiles = controllers.files();
                  jpa[1].content = [...jpa[1].content, ...controllersFiles];

                  const outputDTOFiles = DTO.files("output");
                  jpa[1].content[0].content = outputDTOFiles;

                  const inputDTOFiles = DTO.files("input");
                  jpa[0].content[0].content = inputDTOFiles;

                  const utilsFiles = utils.getFolderContent();
                  jpa[3].content = utilsFiles;

                  const exceptionFiles = exception.getFolderContent();
                  jpa[4].content = exceptionFiles;

                  const applicationFile = application.getFile();
                  jpa = [...jpa, applicationFile];

                  jpa = [
                    { type: "folder", name: metaData.artifact, content: jpa },
                  ];
                  file.createRarFile(jpa);
                  jpa = jpaFolderStructure;
                }}
              >
                Download Project
              </Button>
            </div>
            <IconButton onClick={handleOpen}>
              <SettingsIcon sx={{ color: "white" }} fontSize="small" />
            </IconButton>
          </div>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <div className="flex gap-2">
                <FormControl>
                  <InputLabel>Tables</InputLabel>
                  <Select
                    label="Tables"
                    defaultValue=""
                    value={table.name}
                    disabled={!filesCreated}
                    onChange={handleChangeTable}
                  >
                    {tableStructure.map((table, i) => (
                      <MenuItem value={table.name} key={i}>
                        {table.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TabList onChange={handleChange}>
                  <Tab label="Entities" value="0" />
                  <Tab label="Repositories" value="1" />
                  <Tab label="Services" value="2" />
                  <Tab label="Controllers" value="3" />
                  <Tab label="IN-DTO's" value="4" />
                  <Tab label="OUT-DTO's" value="5" />
                  <Tab label="init sql" value="6" />
                  <Tab label="react hooks" value="7" />
                </TabList>
              </div>
            </Box>
            <TabPanel value="0" sx={{ padding: "0" }}>
              <Entities entitiesList={entitiesList} table={table} />
            </TabPanel>
            <TabPanel value="1" sx={{ padding: "0" }}>
              <Repositories
                repositoriesList={repositories.repositoriesList}
                table={table}
              />
            </TabPanel>
            <TabPanel value="2" sx={{ padding: "0" }}>
              <Services
                services={services}
                JPA={JPA}
                setSelectedService={setSelectedService}
                table={table}
              />
            </TabPanel>
            <TabPanel value="3" sx={{ padding: "0" }}>
              <Controllers controllers={controllers} table={table} />
            </TabPanel>
            <TabPanel value="4" sx={{ padding: "0" }}>
              <DTOInput DTO={DTO} table={table} />
            </TabPanel>
            <TabPanel value="5" sx={{ padding: "0" }}>
              <DTOOutput DTO={DTO} table={table} />
            </TabPanel>
            <TabPanel value="6" sx={{ padding: "0" }}>
              <InitSQL initSQL={initSQL} />
            </TabPanel>
            <TabPanel value="7" sx={{ padding: "0" }}>
              <ReactHooks reactHooks={reactHooks} table={table} />
            </TabPanel>
          </TabContext>
        </div>
      </ThemeProvider>
      <Modal open={open} onClose={handleClose}>
        <Box sx={boxStyle}>
          <Configuration
            setTableStructure={setTableStructure}
            setEntitiesList={setEntitiesList}
            setFilesCreated={setFilesCreated}
            setInitSQL={setInitSQL}
            artifactId={artifactId}
            dbName={dbName}
            setDbName={setDbName}
            code={code}
            setCode={setCode}
            tableStructure={tableStructure}
            oppositeRelations={oppositeRelations}
            setOppositeRelations={setOppositeRelations}
            services={services}
            controllers={controllers}
            repositories={repositories}
            reactHooks={reactHooks}
            handleClose={handleClose}
            setMetaData={setMetaData}
            metaData={metaData}
          />
        </Box>
      </Modal>
    </div>
  );
}

export default APP;
