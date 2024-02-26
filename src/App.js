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
import { createRarFile } from "./FileFunctions";
import { jpaFolderStructure } from "./jpaFolferStructure";
import { getEstructure } from "./EstructureFunctions";
import { getInitSql } from "./initSql";
import Entities from "./pages/Entities";
import { getEntitiesFiles, getEntitiesList } from "./EntitiesFunctions";
import Repositories from "./pages/Repositories";
import { getRepoFiles, getRepositoriesList } from "./RepositoriesFunctions";
import { MUITheme } from "./syles/MUITheme";
import { Button, IconButton, Modal, Typography } from "@mui/material";
import Services from "./pages/Services";
import DataModel from "./pages/DataModel";

import Controllers from "./pages/Controllers";
import InitSQL from "./pages/InitSQL";
import TableJSONView from "./pages/TableJSONView";
import FolderView from "./pages/FolderView";
import DTOInput from "./pages/DTOInput";
import useService from "./hooks/useService/useService";
import { useController } from "./hooks/useController";
import { useRepositories } from "./hooks/useRepositories";
import { useDTO } from "./hooks/useDTO";
import { UCC } from "./StringFunctions";
import { useJPAProject } from "./hooks/useJPAProject";
import DTOOutput from "./pages/DTOOutput";
import { boxStyle } from "./syles/BoxStyle";
import Configuration from "./pages/Configuration";
import ServiceDTOInput from "./pages/ServiceDTOInput";
import useCustomHook from "./hooks/useCustomHook";

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

  // const [jpa, setJpa] = useState(jpaFolderStructure);
  let jpa = jpaFolderStructure;

  const textAreaRef = useRef("");
  const [code, setCode] = useState("");
  const [artifactId, setArticaftId] = useState("users");
  const [dbName, setDbName] = useState("dB");
  const [oppositeRelations, setOppositeRelations] = useState(false);

  const services = useService(tableStructure, artifactId);
  const controllers = useController(tableStructure, artifactId);
  const repositories = useRepositories(tableStructure, artifactId);
  const DTO = useDTO(tableStructure, artifactId);
  const hooks = useCustomHook();

  const JPA = useJPAProject(
    repositories,
    services,
    controllers,
    DTO,
    artifactId
  );
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
                  services.setCRUDFServices();
                  tableStructure.forEach((table) => {
                    JPA.createListEndpoint(table);
                    JPA.createDeleteEndpoint(table);
                  });
                  controllers.setCRUDFControllers();
                  repositories.setFilterRepositories();
                  tableStructure.forEach((table) => {
                    const filterDTO = DTO.getDTO(
                      table.attributes,
                      table,
                      UCC(table.name) + "FilterDTO"
                    );
                    DTO.addInputDTO(table, filterDTO);
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

                  createRarFile(jpa);
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
                // servicesList={servicesList}
                services={services}
                controllers={controllers}
                repositories={repositories}
                DTO={DTO}
                JPA={JPA}
                selectedService={selectedService}
                setSelectedService={setSelectedService}
                // setServicesList={setServicesList}
                // setRepositoriesList={setRepositoriesList}
                // setControllersList={setControllersList}
                // setIDTOList={setIDTOList}
                table={table}
                artifactId={artifactId}
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
            setArticaftId={setArticaftId}
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
            textAreaRef={textAreaRef}
          />
        </Box>
      </Modal>
    </div>
  );
}

export default APP;
