import { useState } from "react";
import { CC, UCC, removeString, sqlVarToJavaVar } from "../StringFunctions";

export const useDTO = (tableStructue, artifactId) => {
  const [inputDTO, setInputDTO] = useState([]);
  const [outputDTO, setOutputDTO] = useState([]);

  const addInputDTO = (table, newIDTO) => {
    setInputDTO((prevIDTOList) => {
      const newIDTOList = { ...prevIDTOList };
      const newIDTOs = { ...newIDTO, ...newIDTOList?.[UCC(table?.name)] };
      newIDTOList[UCC(table?.name)] = newIDTOs;
      return newIDTOList;
    });
  };

  const addOutputDTO = (table, newIDTO) => {
    setOutputDTO((prevIDTOList) => {
      const newIDTOList = { ...prevIDTOList };
      const newIDTOs = { ...newIDTO, ...newIDTOList?.[UCC(table?.name)] };
      newIDTOList[UCC(table?.name)] = newIDTOs;
      return newIDTOList;
    });
  };

  const getDTO = (attributes, table, DTOName, destination) => {
    console.log("----------");
    console.groupCollapsed(table.name);
    console.log(attributes);
    let dto = {};
    const DTOAttributes = getDTOAttributes(attributes, destination) ?? [];
    const DTOClass = getDTOClass(DTOName) ?? "";
    const DTOImports = getDTOImports(table, attributes, destination) ?? "";
    console.groupEnd();
    // --------------------------
    dto[DTOName] = {};
    dto[DTOName]["imports"] = DTOImports;
    dto[DTOName]["className"] = DTOClass;
    dto[DTOName]["attributes"] = DTOAttributes;
    dto[DTOName]["bottom"] = "}";
    return dto;
  };

  const getDTOImports = (table, attributes, destination) => {
    let RelImports = [];
    // console.log(attributes);
    attributes.forEach((attr) => {
      // console.log(attr);
      attr.relations.forEach((rel) => {
        RelImports = [
          ...RelImports,
          `import com.${artifactId}.controllers.responses.${UCC(
            rel.destinyTable
          )}.${UCC(rel.destinyTable)}ListDTO;`,
        ];
      });
    });
    const newDTOImports =
      destination === "output"
        ? RelImports.filter(
            (value, index, self) => self.indexOf(value) === index
          ).join(`
`)
        : "";

    const packageFolder =
      destination === "output" ? `controllers.responses` : `business.domain`;

    const imports = `package com.${artifactId}.${packageFolder}.${UCC(
      table.name
    )};
import java.util.UUID;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
${newDTOImports}
`;
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

  const getDTOAttributes = (attributes, destination) => {
    let attrs = [];
    // let imports = [];
    attributes.forEach((attr) => {
      console.groupCollapsed(attr.name);
      console.log(destination);
      console.log(attr.relations);
      // console.log(getRelations(attr));
      // if (!attr.pk) {
      let relationsData = destination == "output" ? getRelations(attr) : [];
      console.log(relationsData);
      const attrVar =
        relationsData.length === 0
          ? `   private ${sqlVarToJavaVar(attr.type)} ${CC(attr.name)};`
          : "";
      const attrsVars =
        relationsData.length === 0 && !attr.pk ? [attrVar] : relationsData;
      attrs = [...attrs, ...attrsVars];
      // imports = [...imports, ...relationsData.imports];
      // }
      console.groupEnd();
    });
    return attrs;
  };

  const getRelations = (attr) => {
    // attributes.forEach((attr) => {
    let rels = [];
    // let imports = [];
    attr.relations.forEach((rel) => {
      const MTO = `   private ${UCC(rel.destinyTable)}ListDTO ${CC(
        attr.name
      )};`;
      const OTO = `   private ${UCC(rel.destinyTable)}ListDTO ${CC(
        rel.destinyTable
      )};`;
      const OTM = `   private List<${UCC(rel.destinyTable)}ListDTO> ${
        CC(rel.destinyTable) + UCC(rel.destinyAttr)
      };`;

      if (rel.relation === "ManyToOne") {
        rels = [...rels, MTO];
      }
      if (rel.relation === "OneToMany") {
        rels = [...rels, OTM];
      }
      if (rel.relation === "OneToOneO") {
        rels = [...rels, OTO];
      }
      console.log("---");
      console.log(rel);
      console.log(rels);
      console.log("---");
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
    const dtoSource = source === "input" ? inputDTO : outputDTO;
    Object.keys(dtoSource).forEach((dtoName) => {
      let DTOsFiles = [];
      const dtosFromTable = dtoSource[dtoName];

      Object.keys(dtosFromTable).forEach((dtoFromTableName) => {
        const dto = dtosFromTable[dtoFromTableName];
        const imports = dto.imports;
        const className = dto.className;
        const bottom = dto.bottom;
        const attributes = dto.attributes.join(`
  `);
        const file =
          imports +
          `
  ` +
          className +
          `
  ` +
          attributes +
          `
  ` +
          bottom;
        DTOsFiles.push({
          type: "file",
          name: `${dtoFromTableName}.java`,
          content: file,
        });
      });
      DTOFolders.push({
        type: "folder",
        name: `${dtoName}`,
        content: DTOsFiles,
      });
    });
    return DTOFolders;
  };

  const outputFiles = () => {
    let DTOsFiles = [];
    // console.log(inputDTO);
    Object.keys(outputDTO).forEach((dtoName) => {
      const dtosFromTable = outputDTO[dtoName];
      Object.keys(dtosFromTable).forEach((dtoFromTableName) => {
        const dto = dtosFromTable[dtoFromTableName];
        // console.log(dto);
        // console.log(dto.attributes);
        const imports = dto.imports;
        const className = dto.className;
        const bottom = dto.bottom;
        const attributes = dto.attributes.join(`
  `);
        //   console.log(attributes);
        const file =
          imports +
          `
  ` +
          className +
          `
  ` +
          attributes +
          `
  ` +
          bottom;
        DTOsFiles.push({
          type: "file",
          name: `${UCC(dtoName)}DTO.java`,
          content: file,
        });
      });
    });
    return DTOsFiles;
  };

  return {
    inputDTO,
    outputDTO,
    getDTO,
    // getOutputDTO,
    addInputDTO,
    addOutputDTO,
    files,
    outputFiles,
  };
};
