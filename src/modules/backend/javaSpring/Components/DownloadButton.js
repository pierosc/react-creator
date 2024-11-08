import { Button } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import React, { useContext } from "react";
import SpringContext from "../Context/SpringProvider";
import { jpaFolderStructure } from "../../../../jpaFolferStructure";
import useFile from "../../../../hooks/useFile/useFile";
import { aplicationProperties } from "../Hooks/aplicationProperties";
import { banner } from "../Hooks/banner";

function DownloadButton() {
  let jpa = jpaFolderStructure;
  const file = useFile();

  const {
    springProject,
    entities,
    services,
    interfaces,
    controllers,
    repositories,
    utils,
    DTO,
    exception,
    application,
    JPA,
  } = useContext(SpringContext);

  return (
    <Button
      variant="outlined"
      size="large"
      endIcon={<DownloadIcon />}
      onClick={() => {
        // console.groupCollapsed("FILES CREATED");

        const entityFiles = entities.files();
        jpa[5].content = entityFiles;
        // console.log("entityFiles");
        // console.log(entityFiles);

        const repos = repositories.files();
        jpa[2].content = repos;
        // console.log("repos");
        // console.log(repos);

        const servicesFiles = services.files();
        jpa[0].content[1].content = [
          ...jpa[0].content[1].content,
          ...servicesFiles,
        ];
        // console.log("servicesFiles");
        // console.log(servicesFiles);

        const interfacesFiles = interfaces.files();
        jpa[0].content[1].content[0].content = interfacesFiles;

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
            name: "src",
            content: [
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
                            name: springProject?.selected?.metaData.artifact,
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
            ],
          },
        ];
        file.createRarFile(jpa);
        jpa = jpaFolderStructure;
      }}
    >
      Download Project
    </Button>
  );
}

export default DownloadButton;
