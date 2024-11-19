import { Button } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import React, { useContext } from "react";
import SpringContext from "../Context/SpringProvider";
import useFile from "../../../../hooks/useFile/useFile";
import { aplicationProperties } from "../Hooks/aplicationProperties";
import { banner } from "../Hooks/banner";

function DownloadButton() {
  const file = useFile();

  const {
    springProject,
    entities,
    services,
    interfaces,
    validators,
    controllers,
    repositories,
    utils,
    DTO,
    exception,
    application,
    audit,
    config,
  } = useContext(SpringContext);

  return (
    <Button
      variant="outlined"
      size="large"
      endIcon={<DownloadIcon />}
      onClick={() => {
        const resourcesFolder = {
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
        };

        const projectFolder = [
          {
            type: "folder",
            name: "dtos",
            content: [
              {
                type: "folder",
                name: "requests",
                content: DTO.files("input"),
              },
              {
                type: "folder",
                name: "responses",
                content: DTO.files("output"),
              },
            ],
          },
          {
            type: "folder",
            name: "controllers",
            content: controllers.files(),
          },
          {
            type: "folder",
            name: "repositories",
            content: repositories.files(),
          },
          {
            type: "folder",
            name: "utils",
            content: utils.getFolderContent(),
          },
          {
            type: "folder",
            name: "exceptions",
            content: exception.getFolderContent(),
          },
          {
            type: "folder",
            name: "validators",
            content: validators.files(),
          },
          {
            type: "folder",
            name: "entities",
            content: entities.files(),
          },
          {
            type: "folder",
            name: "config",
            content: config.files(),
          },
          {
            type: "folder",
            name: "services",
            content: [
              ...services.files(),
              {
                type: "folder",
                name: "interfaces",
                content: interfaces.files(),
              },
            ],
          },
          {
            type: "folder",
            name: "audit",
            content: audit.files(),
          },
          application.getFile(),
        ];

        const jpa = [
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
                            content: projectFolder,
                          },
                        ],
                      },
                    ],
                  },
                  resourcesFolder,
                ],
              },
            ],
          },
        ];
        file.createRarFile(jpa);
      }}
    >
      Download Project
    </Button>
  );
}

export default DownloadButton;
