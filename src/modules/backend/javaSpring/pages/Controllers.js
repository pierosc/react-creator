import React, { useContext } from "react";
import CodeEditor from "../../../../components/CodeEditor/CodeEditor";
import SpringContext from "../../../../context/SpringProvider";

function Controllers({ table }) {
  const { springProject } = useContext(SpringContext);
  const controllersList = springProject?.selected?.controller ?? {};

  console.group("Controllers view inputs");
  console.log(table);
  console.groupEnd();

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
          table?.name ? controllersList?.[table?.name]["imports"] : ""
        }
        language="java"
        header={false}
        bgColor="rgba(0, 0, 0,0)"
        padding="5px"
      />
      <CodeEditor
        codeString={
          table?.name ? controllersList?.[table?.name]["classStart"] : ""
        }
        language="java"
        header={false}
        bgColor="rgba(0, 0, 0,0)"
        padding="5px"
      />
      {controllersList?.[table?.name]?.["controllers"]?.map((code, index) => (
        <CodeEditor
          key={index}
          codeString={code}
          language="java"
          header={false}
          bgColor="rgb(40, 44, 52)"
          padding="5px"
        />
      ))}
      <CodeEditor
        codeString={table?.name ? controllersList[table?.name]["classEnd"] : ""}
        language="java"
        header={false}
        bgColor="rgba(0, 0, 0,0)"
        padding="5px"
      />
    </div>
  );
}

export default Controllers;