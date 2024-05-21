import React, { useRef } from "react";
// import { Textarea } from "@mui/joy";
import { Button } from "@mui/material";
import { getEstructure } from "../../../../../EstructureFunctions";
import TextField from "@mui/material/TextField";

function DataModelConfiguration({
  code,
  setCode,
  setTableStructure,
  handleChangeInputMenu,
}) {
  return (
    <div
      className="flex flex-col gap-2 justify-between"
      style={{ height: "800px" }}
    >
      <div className="grid gap-2">
        <label className="text-white text-center font-semibold text-lg">
          DATA MODEL
        </label>
        <div className="grid">
          <label className="text-white">
            * Copy and paste your model from DB diagram
          </label>
          <label className="text-white">
            * Don't forget to delete all the comments of your Data Model
          </label>
        </div>
        <div
          style={{
            maxHeight: "69vh",
            overflowY: "auto",
            overflowX: "hidden",
            height: "100%",
          }}
        >
          <TextField
            id="outlined-multiline-static"
            multiline
            rows={25}
            defaultValue={code}
            onChange={(e) => {
              setCode(e?.target?.value);
            }}
            sx={{
              backgroundColor: "rgb(40, 44, 52)",
              color: "white",
              border: "none",
              width: "100%",
              height: "100%",
            }}
          />
        </div>
      </div>
      <div className="flex gap-4 justify-between">
        <Button
          variant="contained"
          size="large"
          onClick={() => {
            handleChangeInputMenu("1");
          }}
        >
          Back
        </Button>
        <Button
          variant="contained"
          size="large"
          onClick={() => {
            setTableStructure(getEstructure(code));
            handleChangeInputMenu("3");
          }}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}

export default DataModelConfiguration;
