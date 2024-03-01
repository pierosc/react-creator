import { useState } from "react";
import { CC, UCC } from "../StringFunctions";

const useCustomHook = (tableStructure) => {
  const [customHooksList, setCustomHooksList] = useState([]); //TODOS LOS CUSTOM HOOKS

  // const varType = (attr) => `[]`;

  const state = (attr) =>
    `  const [${CC(attr.name)}, set${UCC(attr.name)}] = useState(${varType(
      attr.type
    )});`;

  const getUseStates = (table) => {
    let states = [];
    table.attributes.map((attr) => {
      // console.log(state(attr));
      states = [...states, state(attr)];
    });
    return states;
  };

  const imports = `import {useState } from "react";
        import { CC, UCC } from "../StringFunctions";
`;
  const hookFunction = (table) =>
    `export default  const use${UCC(table.name)} = (table) => {`;
  const hookReturn = `  return { 
    getUseStates 
  
  };
};`;

  const setEmptyStructure = () => {
    let hooks = {};
    tableStructure.forEach((table) => {
      //   const imports = getServiceImports(table);
      hooks[table.name] = {};
      hooks[table.name]["imports"] = imports;
      hooks[table.name]["hookFunction"] = hookFunction(table);
      hooks[table.name]["useStates"] = getUseStates(table);
      hooks[table.name]["hookReturn"] = hookReturn;
    });
    setCustomHooksList(hooks);
  };

  return { getUseStates, setEmptyStructure, customHooksList };
};

export default useCustomHook;

const varType = (value) => {
  if (Array.isArray(value)) {
    return [];
  } else {
    if (
      value == "date" ||
      value == "timestamp" ||
      value.split("(")[0] == "varchar" ||
      value == "timestamp" ||
      value == "uuid"
    ) {
      return '""';
    }
    if (value == "serial" || value == "int" || value.split("(")[0] == "float") {
      return 0;
    }
    if (value == "boolean") {
      return false;
    }
  }
};
