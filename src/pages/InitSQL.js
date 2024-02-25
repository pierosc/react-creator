import React from "react";
import CodeEditor from "../components/CodeEditor/CodeEditor";

function InitSQL({ initSQL }) {
  //   console.log(initSQL);
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
        codeString={initSQL}
        language="SQL"
        title="init.sql"
        // header={false}
        // bgColor="rgba(0, 0, 0,0)"
        // padding="5px"
      />
    </div>
  );
}

export default InitSQL;
