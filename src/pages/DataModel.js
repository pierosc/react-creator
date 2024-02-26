import React from "react";
import { Textarea } from "@mui/joy";
import TextField from "@mui/material/TextField";
import { useTheme, createTheme, ThemeProvider } from "@mui/material/styles";
import { MUITheme } from "../syles/MUITheme";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

function DataModel({
  textAreaRef,
  code,
  setCode,
  artifactId,
  setArticaftId,
  dbName,
  setDbName,
  oppositeRelations,
  setOppositeRelations,
}) {
  let theme = useTheme();
  theme = createTheme(theme, MUITheme);

  return (
    <div className="grid gap-2">
      <ThemeProvider theme={theme}>
        <div className="flex gap-1">
          <TextField
            label="Artifact ID"
            variant="outlined"
            size="small"
            defaultValue={artifactId}
            onChange={(e) => {
              setArticaftId(e.target.value);
            }}
          />
          <TextField
            label="DB Name"
            variant="outlined"
            size="small"
            defaultValue={dbName}
            onChange={(e) => {
              setDbName(e.target.value);
            }}
          />
          <FormControlLabel
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
          />
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
