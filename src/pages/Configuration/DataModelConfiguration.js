import React, { useRef } from "react";
import { Textarea } from "@mui/joy";
function DataModelConfiguration() {
  const textAreaRef = useRef("");
  return (
    <div>
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

export default DataModelConfiguration;
