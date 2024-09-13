import React, { useContext } from "react";
import CodeEditor from "../../../../../components/CodeEditor/CodeEditor";
import DatabaseContext from "../../../../../context/DatabaseProvider";
import SpringContext from "../../Context/SpringProvider";
import { JoinNewLine } from "../../../../../StringFunctions";

function Entities({ table }) {
  const { springProject } = useContext(SpringContext);
  const entitiesList = springProject?.selected?.entity ?? {};

  console.group("Entities view inputs");
  console.log(table);
  console.groupEnd();

  return (
    <div
      className=" p-4 grid gap-2"
      style={{
        backgroundColor: "rgb(58 64 77)",
        maxHeight: "69vh",
        overflow: "auto",
      }}
    >
      {/* {entitiesList?.[table?.name]?.["imports"]?.map((code, index) => ( */}
      <CodeEditor
        codeString={JoinNewLine(entitiesList?.[table?.name]?.["imports"])}
        language="java"
        header={false}
        bgColor="rgba(0, 0, 0,0)"
        padding="5px"
        title="imports..."
        internalMenu
      />
      {/* ))} */}
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
