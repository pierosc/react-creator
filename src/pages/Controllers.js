import React from "react";
import CodeEditor from "../components/CodeEditor/CodeEditor";

function Controllers({ controllers, table }) {
  console.log(controllers.controllersList);
  return (
    <div
      className=" p-4 grid gap-2"
      style={{
        backgroundColor: "rgb(58 64 77)",
        maxHeight: "65vh",
        overflow: "auto",
      }}
    >
      <CodeEditor
        codeString={
          table?.name
            ? controllers.controllersList?.[table?.name]["imports"]
            : ""
        }
        language="java"
        header={false}
        bgColor="rgba(0, 0, 0,0)"
        padding="5px"
      />
      <CodeEditor
        codeString={
          table?.name
            ? controllers.controllersList?.[table?.name]["classStart"]
            : ""
        }
        language="java"
        header={false}
        bgColor="rgba(0, 0, 0,0)"
        padding="5px"
      />
      {controllers.controllersList?.[table?.name]?.["controllers"]?.map(
        (code, index) => (
          <CodeEditor
            key={index}
            codeString={code}
            language="java"
            header={false}
            bgColor="rgb(40, 44, 52)"
            padding="5px"
          />
        )
      )}
      <CodeEditor
        codeString={
          table?.name
            ? controllers.controllersList[table?.name]["classEnd"]
            : ""
        }
        language="java"
        header={false}
        bgColor="rgba(0, 0, 0,0)"
        padding="5px"
      />
    </div>
  );
}

export default Controllers;
