import React from "react";
import { CC, JoinNewLine, UCC } from "../../../../../StringFunctions";

function useInterface(springProject) {
  const addInterface = (projectName, table, newInterface) => {
    const attrFromProject = "interface";
    const attrFromTable = "interfaces";
    springProject.addElementToTable(
      projectName,
      attrFromProject,
      table,
      attrFromTable,
      newInterface
    );
  };

  const getEmptyStructure = (dataBaseStructure, metaData) => {
    let interfaces = {};
    dataBaseStructure.forEach((table) => {
      interfaces[table.name] = {};
      interfaces[table.name]["imports"] = getInterfaceImports(table, metaData);
      interfaces[table.name]["classStart"] = getInterfaceClass(table);
      interfaces[table.name]["interfaces"] = [];
      interfaces[table.name]["classEnd"] = "}";
    });
    return interfaces;
  };

  const getInterfaceImports = (table, metaData) => {
    return [
      `package ${metaData.group}.services.interfaces;
`,
      `import java.io.ByteArrayOutputStream;`,
      `import java.util.List;`,
      //   `import org.json.JSONObject;`,
      `import ${metaData.group}.dtos.requests.${UCC(table.name)}.*;`,
      `import ${metaData.group}.dtos.responses.${UCC(table.name)}.${UCC(table.name)}ListDTO;`,
    ];
  };

  const getInterfaceClass = (table) => {
    const interfaceName = `I${UCC(table?.name)}Service`;
    return `
public interface ${interfaceName} {
`;
  };

  const getListAllInterface = (table) => {
    //LIST ALL SERVICE
    const listAllServiceName = `get${UCC(table.name)}`;
    const listAllOutput = `${UCC(table.name)}ListDTO`;
    return `    List<${listAllOutput}> ${listAllServiceName}();
`;
  };

  const getAddInterface = (table) => {
    //ADD SERVICE
    const addServiceName = `add${UCC(table.name)}`;
    const addInput = `${UCC(table.name)}AddDTO dto`;
    return `    void ${addServiceName}(${addInput});
`;
  };

  const getEditInterface = (table) => {
    // EDIT SERVICE
    const editServiceName = ` edit${UCC(table.name)}`;
    const editInput = `${UCC(table.name)}EditDTO dto`;
    return `    void ${editServiceName}(${editInput});
`;
  };

  const getDeleteInterface = (table) => {
    //DELETE SERVICE
    const deleteServiceName = `delete${UCC(table.name)}`;
    const deleteInput = `${UCC(table.name)}DeleteDTO dto`;
    return `    void ${deleteServiceName}(${deleteInput});
`;
  };

  const getFilterInterface = (table) => {
    // FILTER SERVICE
    const filterOutput = `List<${UCC(table?.name)}ListDTO>`;
    const filterServiceName = `${CC(table?.name)}Filter`;
    const filterInput = `${UCC(table?.name)}FilterDTO dto`;
    return `    ${filterOutput} ${filterServiceName}(${filterInput});
`;
  };

  const getFilterExcelInterface = (table) => {
    // FILTER EXCEL
    const FExcelServiceName = `${CC(table?.name)}FilterExcel`;
    const FExcelInput = `${UCC(table?.name)}FilterDTO dto`;
    return `    ByteArrayOutputStream ${FExcelServiceName}(${FExcelInput});
`;
  };

  const files = () => {
    const interfacesList2 = springProject.selected.interface;

    let servicesFiles = [];
    Object.keys(interfacesList2).forEach((serviceName) => {
      const interface1 = interfacesList2[serviceName];
      const imports = JoinNewLine(interface1.imports);
      const classStart = interface1.classStart;
      const classEnd = interface1.classEnd;
      const interfaces = JoinNewLine(interface1.interfaces);

      const file = JoinNewLine([imports, classStart, interfaces, classEnd]);

      servicesFiles.push({
        type: "file",
        name: `I${UCC(serviceName)}Service.java`,
        content: file,
      });
    });
    return servicesFiles;
  };

  return {
    addInterface,
    getEmptyStructure,
    getListAllInterface,
    getAddInterface,
    getEditInterface,
    getDeleteInterface,
    getFilterInterface,
    getFilterExcelInterface,
    files,
  };
}

export default useInterface;
