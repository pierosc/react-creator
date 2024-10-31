import MenuItem from "@mui/material/MenuItem";
import React, { useState, useContext } from "react";
import { jpaFolderStructure } from "../../../jpaFolferStructure";
import useFile from "../../../hooks/useFile/useFile";
import Entities from "./pages/Layers/Entities";
import Repositories from "./pages/Layers/Repositories";
import Services from "./pages/Layers/Services";
import Controllers from "./pages/Layers/Controllers";
import DTOInput from "./pages/Layers/DTOInput";
import DTOOutput from "./pages/Layers/DTOOutput";
// import { useLocalStorage } from "../../../hooks/useStorage";
import DatabaseContext from "../../../context/DatabaseProvider";
import SpringContext from "./Context/SpringProvider";
import BackButton from "./Components/BackButton";
import TabMenu from "../../../components/TabMenu/TabMenu";
import ServiceViewer from "./Components/ServiceViewer";
import AddCRUDButton from "./Components/AddCRUDButton";
import CSelect from "../../../components/CSelect/CSelect";
import DownloadButton from "./Components/DownloadButton";

function SpringProjectManager() {
  const { db } = useContext(DatabaseContext);

  // SELECTION CONTROLS --------------------------------
  const [table, setTable] = React.useState({});
  const isTableSelected = Object.keys(table).length !== 0;

  const handleChangeTable = (event) => {
    setTable(db?.selected?.json.find((t) => t.name === event.target.value));
  };

  //----------------------------------------------------------------

  const [selectedService, setSelectedService] = useState({});

  return (
    <div
      className="grid grid-cols-3 gap-4 items-start"
      style={{ backgroundColor: "rgba(6,8,25)" }}
    >
      <div className="col-span-3">
        <BackButton />
      </div>

      <ServiceViewer table={table} selectedService={selectedService} />

      <div className="col-span-2 grid gap-2">
        <div className="flex gap-2 justify-between">
          <div className="flex gap-2">
            <AddCRUDButton />

            {/* <Button
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
                                name: springProject?.selected?.metaData
                                  .artifact,
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
            </Button> */}

            <DownloadButton />
          </div>
        </div>
        <CSelect
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
        </CSelect>

        <TabMenu
          position="start"
          backgroundColor="rgba(0, 0, 0, 0)"
          menu={[
            {
              label: "Entities",
              disabled: !isTableSelected,
              content: <Entities table={table} />,
            },
            {
              label: "Repositories",
              disabled: !isTableSelected,
              content: <Repositories table={table} />,
            },
            {
              label: "Services",
              disabled: !isTableSelected,
              content: (
                <Services
                  setSelectedService={setSelectedService}
                  table={table}
                />
              ),
            },
            {
              label: "Controllers",
              disabled: !isTableSelected,
              content: <Controllers table={table} />,
            },
            {
              label: "IN-DTO's",
              disabled: !isTableSelected,
              content: <DTOInput table={table} />,
            },
            {
              label: "OUT-DTO's",
              disabled: !isTableSelected,
              content: <DTOOutput table={table} />,
            },
          ]}
        />
      </div>
    </div>
  );
}

export default SpringProjectManager;
