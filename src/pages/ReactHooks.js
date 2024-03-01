import React from "react";
import CodeEditor from "../components/CodeEditor/CodeEditor";

function ReactHooks({ hooks, table }) {
  console.log(hooks.customHooksList);
  console.log(
    table?.name ? hooks.customHooksList?.[table?.name]["imports"] : ""
  );

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
          table?.name ? hooks.customHooksList?.[table?.name]["imports"] : ""
        }
        language="javascript"
        header={false}
        bgColor="rgba(0, 0, 0,0)"
        padding="5px"
      />
      <CodeEditor
        codeString={
          table?.name
            ? hooks.customHooksList?.[table?.name]["hookFunction"]
            : ""
        }
        language="javascript"
        header={false}
        bgColor="rgba(0, 0, 0,0)"
        padding="5px"
      />
      {hooks.customHooksList?.[table?.name]?.["useStates"]?.map(
        (code, index) => (
          <CodeEditor
            key={index}
            codeString={code}
            language="javascript"
            header={false}
            bgColor="rgb(40, 44, 52)"
            padding="5px"
          />
        )
      )}
      <CodeEditor
        codeString={
          table?.name ? hooks.customHooksList[table?.name]["hookReturn"] : ""
        }
        language="javascript"
        header={false}
        bgColor="rgba(0, 0, 0,0)"
        padding="5px"
      />
    </div>
  );
}

export default ReactHooks;
