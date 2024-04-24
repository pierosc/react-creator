import React from "react";
import DataModel from "../DataModel";
import { useTheme, createTheme, ThemeProvider } from "@mui/material/styles";
import { Button, IconButton, Modal, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import { MUITheme } from "../../syles/MUITheme";

function MetaDataConfiguration({
  setMetaData,
  metaData,
  setDbName,
  handleChangeInputMenu,
}) {
  let theme = useTheme();
  theme = createTheme(theme, MUITheme);
  return (
    <ThemeProvider theme={theme}>
      <label className="text-white text-center font-semibold text-lg">
        METADATA CONFIGURATION
      </label>
      <div className="flex gap-2 justify-evenly items-center">
        <div>
          <label className="text-white">
            * These are the tested configurations
          </label>
          <div className="relative group cursor-pointer overflow-hidden rounded-xl">
            <a
              href="https://start.spring.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <img
                src={require("../../assets/springBootInit.png")}
                alt="Spring Initializr"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 ease-in-out">
                <span className="text-white text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
                  Visit start.spring.io
                </span>
              </div>
            </a>
          </div>
        </div>

        <div className="flex flex-col justify-around  gap-16">
          <label className="text-white text-center border-b-2 border-yellow-400 p-4">
            Project Metadata
          </label>
          <TextField
            label="Group"
            variant="outlined"
            size="small"
            defaultValue={metaData.group}
            onChange={(e) => {
              setDbName(e.target.value);
              setMetaData((prevMeta) => {
                const newMeta = { ...prevMeta };
                newMeta.group = e.target.value;
                return newMeta;
              });
            }}
          />
          <TextField
            label="Artifact"
            variant="outlined"
            size="small"
            defaultValue={metaData.artifact}
            onChange={(e) => {
              setMetaData((prevMeta) => {
                const newMeta = { ...prevMeta };
                newMeta.artifact = e.target.value;
                return newMeta;
              });
            }}
          />
          <TextField
            label="Name"
            variant="outlined"
            size="small"
            defaultValue={metaData.name}
            onChange={(e) => {
              setDbName(e.target.value);
              setMetaData((prevMeta) => {
                const newMeta = { ...prevMeta };
                newMeta.name = e.target.value;
                return newMeta;
              });
            }}
          />

          <TextField
            label="Package Name"
            variant="outlined"
            size="small"
            defaultValue={metaData.packageName}
            onChange={(e) => {
              setDbName(e.target.value);
              setMetaData((prevMeta) => {
                const newMeta = { ...prevMeta };
                newMeta.packageName = e.target.value;
                return newMeta;
              });
            }}
          />
          {/* <FormControlLabel
            control={
                <Switch
                defaultChecked={oppositeRelations}
                onChange={(e) => {
                    setOppositeRelations(e.target.checked);
                }}
                />
            }
            label="Opposite Relations"
            labelPlacement="start"
        /> */}
        </div>
      </div>
      <div className="flex gap-4 justify-end">
        <Button
          variant="contained"
          size="large"
          onClick={() => {
            //   setTableStructure(getEstructure(code));
            handleChangeInputMenu("1");
          }}
        >
          Continue
        </Button>
      </div>
    </ThemeProvider>
  );
}

export default MetaDataConfiguration;
