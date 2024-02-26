import React from "react";
import { CC, UCC } from "../StringFunctions";

const useCustomHook = (table) => {
  const varType = (attr) => `[]`;

  const state = (attr) =>
    `const [${CC(attr.name)}, set${UCC(attr.name)}] = useState(${varType(
      attr
    )});`;

  const getUseStates = () => {
    table.attribute.map((attr) => {
      return state(attr);
    });

    const states = `  const [inputDTO, setInputDTO] = useState([]);
        const [outputDTO, setOutputDTO] = useState([]);`;
    const imports = `import {useState } from "react";
        import { CC, UCC } from "../StringFunctions";
`;
    const hookFunction = `export default  const useCustomHook = (table) => {`;
    const hookReturn = `  return { getUseStates };
  };`;
  };
  return { getUseStates };
};

export default useCustomHook;
