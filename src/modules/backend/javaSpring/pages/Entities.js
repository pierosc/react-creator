import React from "react";
import CodeEditor from "../../../../components/CodeEditor/CodeEditor";

function Entities({ entitiesList, table }) {
  console.log(entitiesList);
  //   console.log(table);
  //   console.log(entitiesList[table.name]);
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
        codeString={table?.name ? entitiesList?.[table?.name]["imports"] : ""}
        language="java"
        header={false}
        bgColor="rgba(0, 0, 0,0)"
        padding="5px"
        title="imports..."
        internalMenu
      />
      <CodeEditor
        codeString={
          table?.name ? entitiesList?.[table?.name]["classStart"] : ""
        }
        language="java"
        header={false}
        bgColor="rgba(0, 0, 0,0)"
        padding="5px"
        title="imports..."
        internalMenu
      />
      {entitiesList?.[table?.name]?.["content"]?.map((code, index) => (
        <CodeEditor
          key={index}
          codeString={code}
          language="java"
          header={false}
          bgColor="rgb(40, 44, 52)"
          padding="5px"
          internalMenu
        />
      ))}
      <CodeEditor
        codeString={table?.name ? entitiesList[table?.name]["classEnd"] : ""}
        language="java"
        header={false}
        bgColor="rgba(0, 0, 0,0)"
        padding="5px"
      />
    </div>
  );
}

export default Entities;
