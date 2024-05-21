import React, { useRef } from "react";
import TextField from "@mui/material/TextField";

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
  return (
    <div className="grid gap-2">
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
      <div
        style={{ maxHeight: "69vh", overflowY: "auto", overflowX: "hidden" }}
      >
        <TextField
          id="outlined-multiline-static"
          // label="Multiline"
          multiline
          rows={4}
          defaultValue={code}
          onChange={(e) => {
            setCode(e?.target?.value);
          }}
          sx={{
            backgroundColor: "rgb(40, 44, 52)",
            color: "white",
            border: "none",
            width: "100%",
          }}
        />
      </div>
    </div>
  );
}

export default DataModel;
