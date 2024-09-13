import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
// import SettingsIcon from "@mui/icons-material/Settings";
import DownloadIcon from "@mui/icons-material/Download";
import { Button, Modal } from "@mui/material";
import React, { useState, useContext } from "react";
import { jpaFolderStructure } from "../../../jpaFolferStructure";
import useEntity from "./Hooks/useEntity";
import useService from "./Hooks/useService/useService";
import { useController } from "./Hooks/useController/useController";
import { useRepositories } from "./Hooks/useRepositories";
import useUtils from "../../../hooks/useUtils/useUtils";
import { useDTO } from "./Hooks/useDTO/useDTO";
import useException from "./Hooks/useException/useException";
import useApplication from "../../../hooks/useApplication";
import useFile from "../../../hooks/useFile/useFile";
import { useJPAProject } from "./Hooks/useJPAProject";
import ServiceDTOInput from "./pages/ServiceShortcuts/ServiceDTOInput";
import Entities from "./pages/Layers/Entities";
import Repositories from "./pages/Layers/Repositories";
import Services from "./pages/Layers/Services";
import Controllers from "./pages/Layers/Controllers";
import DTOInput from "./pages/Layers/DTOInput";
import DTOOutput from "./pages/Layers/DTOOutput";
// import { useLocalStorage } from "../../../hooks/useStorage";
import DatabaseContext from "../../../context/DatabaseProvider";
import SpringContext from "./Context/SpringProvider";
import { banner } from "./Hooks/banner";
import { aplicationProperties } from "./Hooks/aplicationProperties";
import CreateProject from "./pages/CreateProject/CreateProject";

function SpringProjectManager() {
  const { db } = useContext(DatabaseContext);

  // MENU CONTROLS --------------------------------
  const [value, setValue] = React.useState("1");
  const [inputMenu, setInputMenu] = React.useState("0");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleChangeInputMenu = (event, newValue) => {
    setInputMenu(newValue);
  };

  // SELECTION CONTROLS --------------------------------
  const [table, setTable] = React.useState({});

  const handleChangeTable = (event) => {
    setTable(db?.selected?.json.find((t) => t.name === event.target.value));
  };
  //----------------------------------------------------------------

  let jpa = jpaFolderStructure;

  //CONFIGURATION DATA
  const [metaData, setMetaData] = useState({
    group: "com.users",
    artifact: "users",
    name: "users",
    packageName: "com.users",
  });

  //HOOKS
  const entities = useEntity(db?.selected?.json, metaData);
  const services = useService(db?.selected?.json, metaData);
  const controllers = useController(metaData);
  const repositories = useRepositories(db?.selected?.json, metaData);
  const utils = useUtils(metaData);
  const DTO = useDTO(metaData, utils.DTOMap);
  const exception = useException(metaData);
  const application = useApplication(metaData);

  const file = useFile();

  const JPA = useJPAProject(
    entities,
    repositories,
    services,
    controllers,
    DTO,
    metaData
  );
  const [selectedService, setSelectedService] = useState({});

  const { springProject } = useContext(SpringContext);

  return (
    <div
      className="grid grid-cols-3 gap-4 p-12 items-start"
      style={{ backgroundColor: "rgba(6,8,25)" }}
    >
      <div className="grid gap-4 ">
        <div className="flex gap-4 bg-slate-800 p-4">
          <FormControl fullWidth>
            <InputLabel>PROJECT</InputLabel>
            <Select
              defaultValue=""
              value={springProject.selected.name}
              label="PROJECT"
              onChange={(v) => {
                const projectToSelect = springProject.springProjects.find(
                  (t) => t.name === v.target.value
                );
                springProject.setSelected(projectToSelect);
                const dbToSelect = db.findByName(projectToSelect.db);
                // console.log(dbToSelect);
                db.setSelected(dbToSelect);
                // console.log(dbToSelect.json[0].name);
                setTable(dbToSelect.json[0].name);
              }}
            >
              {springProject.springProjects.map((pj, index) => (
                <MenuItem value={pj.name} key={index}>
                  {pj.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <CreateProject
            DTO={DTO}
            entities={entities}
            services={services}
            controllers={controllers}
            repositories={repositories}
            setMetaData={setMetaData}
            metaData={metaData}
          />
        </div>
        <label className="text-white">
          {`Servicio: ${selectedService?.service ?? ""}`}{" "}
        </label>
        <TabContext value={inputMenu}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChangeInputMenu}>
              <Tab label="INPUT DTO's" value="0" />
              <Tab label="OUTPUT DTO's" value="1" />
              <Tab label="CONTROLLER" value="2" />
            </TabList>
          </Box>

          <TabPanel value="0" sx={{ padding: "0" }}>
            <ServiceDTOInput
              DTO={DTO}
              table={table}
              selectedService={selectedService}
            />
          </TabPanel>
          <TabPanel value="1" sx={{ padding: "0" }}>
            {/* <TableJSONView tableStructure={tableStructure} /> */}
          </TabPanel>
          <TabPanel value="2" sx={{ padding: "0" }}>
            {/* <FolderView /> */}
          </TabPanel>
        </TabContext>
      </div>
      <div className="col-span-2 grid gap-2">
        <div className="flex gap-2 justify-between">
          <div className="flex gap-2">
            <Button
              size="large"
              onClick={() => {
                const tableStructureFromDB = db?.selected?.json;

                tableStructureFromDB.forEach((table) => {
                  JPA.createEntities(springProject.selected.name, table);
                  JPA.createListEndpoint(springProject.selected.name, table);
                  JPA.createAddEndpoint(springProject.selected.name, table);
                  JPA.createEditEndpoint(springProject.selected.name, table);
                  JPA.createDeleteEndpoint(springProject.selected.name, table);
                  JPA.createFilterEndpoint(springProject.selected.name, table);
                  JPA.createFilterExcelEndpoint(
                    springProject.selected.name,
                    table
                  );
                });
              }}
            >
              Add CRUDF Service
            </Button>
            <Button
              variant="outlined"
              size="large"
              endIcon={<DownloadIcon />}
              onClick={() => {
                // console.groupCollapsed("FILES CREATED");

                const entityFiles = entities.files();
                jpa[2].content[0].content[0].content = entityFiles;
                // console.log("entityFiles");
                // console.log(entityFiles);

                const repos = repositories.files();
                jpa[2].content[0].content[1].content = repos;
                // console.log("repos");
                // console.log(repos);

                const servicesFiles = services.files();
                jpa[0].content[1].content = servicesFiles;
                // console.log("servicesFiles");
                // console.log(servicesFiles);

                const controllersFiles = controllers.files();
                jpa[1].content = [...jpa[1].content, ...controllersFiles];
                // console.log("controllersFiles");
                // console.log(controllersFiles);

                const outputDTOFiles = DTO.files("output");
                jpa[1].content[0].content = outputDTOFiles;
                // console.log("outputDTOFiles");
                // console.log(outputDTOFiles);

                const inputDTOFiles = DTO.files("input");
                jpa[0].content[0].content = inputDTOFiles;
                // console.log("inputDTOFiles");
                // console.log(inputDTOFiles);

                const utilsFiles = utils.getFolderContent();
                jpa[3].content = utilsFiles;
                // console.log("utilsFiles");
                // console.log(utilsFiles);

                const exceptionFiles = exception.getFolderContent();
                jpa[4].content = exceptionFiles;
                // console.log("exceptionFiles");
                // console.log(exceptionFiles);

                const applicationFile = application.getFile();
                jpa = [...jpa, applicationFile];
                // console.log("applicationFile");
                // console.log(applicationFile);

                // console.groupEnd();
                jpa = [
                  {
                    type: "folder",
                    name: "main",
                    content: [
                      {
                        type: "folder",
                        name: "java",
                        content: [
                          {
                            type: "folder",
                            name: "com",
                            content: [
                              {
                                type: "folder",
                                name: metaData.artifact,
                                content: jpa,
                              },
                            ],
                          },
                        ],
                      },
                      {
                        type: "folder",
                        name: "resources",
                        content: [
                          {
                            type: "file",
                            name: "application.properties",
                            content: aplicationProperties,
                          },
                          {
                            type: "file",
                            name: "banner.txt",
                            content: banner,
                          },
                        ],
                      },
                    ],
                  },
                ];
                file.createRarFile(jpa);
                jpa = jpaFolderStructure;
              }}
            >
              Download Project
            </Button>
            <Button
              variant="outlined"
              size="large"
              // disabled={!filesCreated}
              endIcon={<DownloadIcon />}
              onClick={() => {}}
            >
              How to Use
            </Button>
          </div>
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
                  onChange={handleChangeTable}
                >
                  {db?.selected?.json?.map((table, i) => (
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
              </TabList>
            </div>
          </Box>
          <TabPanel value="0" sx={{ padding: "0" }}>
            <Entities table={table} />
          </TabPanel>
          <TabPanel value="1" sx={{ padding: "0" }}>
            <Repositories table={table} />
          </TabPanel>
          <TabPanel value="2" sx={{ padding: "0" }}>
            <Services
              JPA={JPA}
              setSelectedService={setSelectedService}
              table={table}
            />
          </TabPanel>
          <TabPanel value="3" sx={{ padding: "0" }}>
            <Controllers table={table} />
          </TabPanel>
          <TabPanel value="4" sx={{ padding: "0" }}>
            <DTOInput table={table} />
          </TabPanel>
          <TabPanel value="5" sx={{ padding: "0" }}>
            <DTOOutput table={table} />
          </TabPanel>
        </TabContext>
      </div>
    </div>
  );
}

export default SpringProjectManager;
