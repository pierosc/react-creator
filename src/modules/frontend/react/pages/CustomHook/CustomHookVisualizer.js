import React from "react";
import CodeEditor from "../../../../../components/CodeEditor/CodeEditor";
import { usequery } from "./CustomHookTemplate";

function CustomHookVisualizer(table) {
  console.log(usequery(table));
  return <CodeEditor codeString={usequery(table)} />;
}

export default CustomHookVisualizer;
