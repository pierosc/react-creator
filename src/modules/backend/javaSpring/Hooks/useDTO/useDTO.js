import { useState, useContext } from "react";
import {
  CC,
  JoinNewLine,
  TC,
  UCC,
  sqlVarToJavaVar,
} from "../../../../../StringFunctions";
import { excludeVars } from "./variablesToExclude";

export const useDTO = (springProject) => {
  const [inputDTO, setInputDTO] = useState([]);
  const [outputDTO, setOutputDTO] = useState([]);
  // const { springProject } = useContext(SpringContext);
  const metaData = springProject?.selected?.metaData ?? {};

  const addInputDTO = (projectName, table, newIDTO) => {
    //AGREGAR DTOMAP
    // const DTOName = newIDTO[Object.keys(newIDTO)[0]].className
    //   .split("class ")[1]
    //   .split(" {")[0];
    // DTOMap.addDTOMap({ table: table.name, name: DTOName, source: "input" });
    const attrFromProject = "inputDTO";
    // const attrFromTable = "content";

    // setInputDTO((prevIDTOList) => {
    //   const newIDTOList = { ...prevIDTOList };
    //   const newIDTOs = { ...newIDTO, ...newIDTOList?.[UCC(table?.name)] };
    //   newIDTOList[UCC(table?.name)] = newIDTOs;
    //   return newIDTOList;
    // });
    springProject.addToTable(
      projectName,
      attrFromProject,
      table,
      // attrFromTable,
      newIDTO
    );
  };

  // const addService = (projectName, table, newService) => {
  //   const attrFromProject = "service";
  //   const attrFromTable = "services";

  //   springProject.addElementToTable(
  //     projectName,
  //     attrFromProject,
  //     table,
  //     attrFromTable,
  //     newService
  //   );
  // };

  const addOutputDTO = (projectName, table, newIDTO) => {
    //AGREGAR DTOMAP
    // const DTOName = newIDTO[Object.keys(newIDTO)[0]].className
    //   .split("class ")[1]
    //   .split(" {")[0];
    // DTOMap.addDTOMap({ table: table.name, name: DTOName, source: "output" });
    const attrFromProject = "outputDTO";
    // const attrFromTable = "content";

    // setInputDTO((prevIDTOList) => {
    //   const newIDTOList = { ...prevIDTOList };
    //   const newIDTOs = { ...newIDTO, ...newIDTOList?.[UCC(table?.name)] };
    //   newIDTOList[UCC(table?.name)] = newIDTOs;
    //   return newIDTOList;
    // });
    springProject.addToTable(
      projectName,
      attrFromProject,
      table,
      // attrFromTable,
      newIDTO
    );
  };

  const getDTO = (
    initialAttributes,
    table,
    DTOName,
    destination,
    relations,
    attributesWithNoId = true
  ) => {
    // console.log("----------");
    // console.log(table);
    // console.log(table.name);
    // console.log(destination);
    // console.log(initialAttributes);
    const attributes = excludeVars(initialAttributes);
    // console.log("----------");
    let dto = {};
    const DTOAttributes =
      getDTOAttributes(
        attributes,
        relations,
        destination,
        attributesWithNoId
      ) ?? [];
    const DTOClass = getDTOClass(DTOName) ?? "";
    const DTOImports =
      getDTOImports(table, attributes, destination, relations) ?? "";
    // console.groupEnd();
    // --------------------------
    dto[DTOName] = {};
    dto[DTOName]["imports"] = DTOImports;
    dto[DTOName]["className"] = DTOClass;
    dto[DTOName]["attributes"] = DTOAttributes;
    dto[DTOName]["bottom"] = "}";
    return dto;
  };

  const getDTOImports = (table, attributes, destination, relations) => {
    let RelImports = [];
    attributes.forEach((attr) => {
      attr.relations.forEach((rel) => {
        const newImport = `import ${metaData.packageName}.${
          // destination === "output"
          //   ? `controllers.responses.${UCC(rel.destinyTable)}`
          //   : `inputDTO.dB.entities`
          `controllers.responses.${UCC(rel.destinyTable)}`
        }.${UCC(rel.destinyTable)}${
          // destination === "output" ? `ListDTO` : `Entity`
          `ListDTO`
        };`;

        RelImports = [...RelImports, newImport];
      });
    });
    const newDTOImports = relations
      ? RelImports.filter((value, index, self) => self.indexOf(value) === index)
          .join(`
`)
      : "";

    const packageFolder =
      destination === "output" ? `controllers.responses` : `business.domain`;

    const imports = [
      `package ${metaData.packageName}.${packageFolder}.${UCC(table.name)};`,
      `import java.util.UUID;`,
      `import java.util.List;`,
      `import lombok.AllArgsConstructor;`,
      `import lombok.Builder;`,
      `import lombok.Data;`,
      `import lombok.NonNull;`,
      `import lombok.NoArgsConstructor;`,
      `import jakarta.validation.constraints.NotNull;`,
      `${newDTOImports}`,
    ];
    return imports;
  };

  const getDTOClass = (DTOName) => {
    const dtoclass = `@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ${UCC(DTOName)} {`;
    return dtoclass;
  };

  const getDTOAttributes = (
    attributes,
    relations,
    destination,
    attributesWithNoId
  ) => {
    let attrs = [];
    // let imports = [];
    attributes.forEach((attr) => {
      // console.groupCollapsed(attr.name);
      // console.log(relations);
      // console.log(attr.relations);
      // console.log(getRelations(attr));
      // if (!attr.pk) {
      let relationsData = relations
        ? getRelations(attr, destination, attributesWithNoId)
        : [];
      // console.log(relationsData);
      const attrVar =
        relationsData.length === 0
          ? `  ${!attr.nullabe ? `@NotNull(message = "${TC(attr.name)} is required")` : ""}
          private ${sqlVarToJavaVar(attr.type)} ${CC(attr.name)};`
          : "";
      const attrsVars =
        relationsData.length === 0 && !attr.pk ? [attrVar] : relationsData;
      attrs = [...attrs, ...attrsVars];
      // imports = [...imports, ...relationsData.imports];
      // }
      // console.groupEnd();
    });
    return attrs;
  };

  const getRelations = (attr, destination, attributesWithNoId) => {
    // attributes.forEach((attr) => {
    // const object = attributesWithNoId ? `ListDTO` : `Entity`;
    const object = `ListDTO`;
    let rels = [];
    // let imports = [];
    attr.relations.forEach((rel) => {
      const MTO = `  private ${UCC(rel.destinyTable)}${object} ${CC(attr.name)};
`;
      const OTO = `  private ${UCC(rel.destinyTable)}${object} ${CC(
        rel.destinyTable
      )};
`;
      const OTM = `  private List<${UCC(rel.destinyTable)}${object}> ${
        CC(rel.destinyTable) + UCC(rel.destinyAttr)
      };
`;

      if (rel.relation === "ManyToOne") {
        rels = [...rels, MTO];
      }
      if (rel.relation === "OneToMany") {
        rels = [...rels, OTM];
      }
      if (rel.relation === "OneToOneO") {
        rels = [...rels, OTO];
      }
      // console.log("---");
      // console.log(rel);
      // console.log(rels);
      // console.log("---");
      // imports = [...imports, `${UCC(rel.destinyTable)}ListDTO`];
      // if (rel.relation === "OneToOneD") {
      //   rels += OTODRef;
      // }
    });
    return rels;

    // });
  };

  const files = (source) => {
    let DTOFolders = [];
    // console.log(inputDTO);
    const dtoSource =
      source === "input"
        ? springProject.selected.inputDTO
        : springProject.selected.outputDTO;

    Object.keys(dtoSource).forEach((dtoName) => {
      let DTOsFiles = [];
      const dtosFromTable = dtoSource[dtoName];

      Object.keys(dtosFromTable).forEach((dtoFromTableName) => {
        const dto = dtosFromTable[dtoFromTableName];
        const imports = JoinNewLine(dto.imports);
        const className = dto.className;
        const bottom = dto.bottom;
        const attributes = dto.attributes.join(`
  `);
        const file = JoinNewLine([imports, className, attributes, bottom]);
        DTOsFiles.push({
          type: "file",
          name: `${dtoFromTableName}.java`,
          content: file,
        });
      });
      DTOFolders.push({
        type: "folder",
        name: `${UCC(dtoName)}`,
        content: DTOsFiles,
      });
    });
    return DTOFolders;
  };

  // const getInputEmptyStructure = (tableStructure, metaData) => {
  //   let inputDTO = {};
  //   tableStructure.forEach((table) => {
  //     //   const imports = getServiceImports(table);
  //     const uniqueAttr = table.attributes.find((attr) => attr.unique);
  //     // console.log(table.attributes);

  //     inputDTO[table.name] = {};
  //     inputDTO[table.name]["imports"] = getDTOImports;
  //     inputDTO[table.name]["classStart"] = getDTOClass(table);
  //     inputDTO[table.name]["inputDTO"] = [];
  //     inputDTO[table.name]["classEnd"] = "}";
  //   });
  //   // setRepositoriesList(inputDTO);
  //   return inputDTO;
  // };

  return {
    inputDTO,
    outputDTO,
    getDTO,
    // getOutputDTO,
    addInputDTO,
    addOutputDTO,
    files,
    // outputFiles,
  };
};
