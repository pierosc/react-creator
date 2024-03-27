import React, { useRef } from "react";
import { Textarea } from "@mui/joy";
import TextField from "@mui/material/TextField";
import { useTheme, createTheme, ThemeProvider } from "@mui/material/styles";
import { MUITheme } from "../syles/MUITheme";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

function DataModel({
  code,
  setCode,

  dbName,
  setDbName,
  oppositeRelations,
  setOppositeRelations,
  setMetaData,
  metaData,
}) {
  let theme = useTheme();
  theme = createTheme(theme, MUITheme);
  const textAreaRef = useRef("");
  return (
    <div className="grid gap-2">
      <ThemeProvider theme={theme}>
        <div className="flex gap-1">
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
      </ThemeProvider>
      <div
        style={{ maxHeight: "69vh", overflowY: "auto", overflowX: "hidden" }}
      >
        <Textarea
          // variant="outlined"
          ref={textAreaRef}
          minRows={2}
          defaultValue={code}
          onChange={(e) => {
            setCode(e?.target?.value);
          }}
          sx={{
            backgroundColor: "rgb(40, 44, 52)",
            color: "white",
            border: "none",
            //   maxHeight: "69vh",
            //   overflow: "auto",
          }}
        />
      </div>
    </div>
  );
}

export default DataModel;
