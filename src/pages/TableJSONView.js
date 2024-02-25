import React from "react";
import CodeEditor from "../components/CodeEditor/CodeEditor";

function TableJSONView({ tableStructure }) {
  return (
    <div
      className=" p-4 grid gap-2"
      style={{
        backgroundColor: "rgb(58 64 77)",
        maxHeight: "69vh",
        overflow: "auto",
      }}
    >
      <CodeEditor
        codeString={JSON.stringify(tableStructure, null, "\t")}
        language="JSON"
        title="Table JSON Structure"
        fontSize="0.8em"
        // header={false}
        // bgColor="rgba(0, 0, 0,0)"
        // padding="5px"
      />
    </div>
  );
}

export default TableJSONView;
