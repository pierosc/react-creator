import React, { useRef } from "react";
import { Textarea } from "@mui/joy";
import { Button } from "@mui/material";
import { useTheme, createTheme, ThemeProvider } from "@mui/material/styles";
// import { MUITheme } from "../../syles/MUITheme";
// import { getEstructure } from "../../EstructureFunctions";
import { MUITheme } from "../../../../../syles/MUITheme";
import { getEstructure } from "../../../../../EstructureFunctions";

function DataModelConfiguration({
  code,
  setCode,
  setTableStructure,
  handleChangeInputMenu,
}) {
  const textAreaRef = useRef("");
  let theme = useTheme();
  theme = createTheme(theme, MUITheme);
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
              // height: "500px",
              //   maxHeight: "69vh",
              //   overflow: "auto",
            }}
          />
        </div>
      </div>
      <ThemeProvider theme={theme}>
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
      </ThemeProvider>
    </div>
  );
}

export default DataModelConfiguration;
