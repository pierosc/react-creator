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

  const getDTO = (attributes, table, DTOName, destination, relations) => {
    // console.log("----------");
    // console.groupCollapsed(table.name);
    // console.log(attributes);
    let dto = {};
    const DTOAttributes =
      getDTOAttributes(attributes, relations, destination) ?? [];
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
        const newImport = `import com.${artifactId}.${
          destination === "output"
            ? `controllers.responses.${UCC(rel.destinyTable)}`
            : `repositories.dB.entities`
        }.${UCC(rel.destinyTable)}${
          destination === "output" ? `ListDTO` : `Entity`
          // `ListDTO`
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

  const getDTOAttributes = (attributes, relations, destination) => {
    let attrs = [];
    // let imports = [];
    attributes.forEach((attr) => {
      // console.groupCollapsed(attr.name);
      // console.log(relations);
      // console.log(attr.relations);
      // console.log(getRelations(attr));
      // if (!attr.pk) {
      let relationsData = relations ? getRelations(attr, destination) : [];
      // console.log(relationsData);
      const attrVar =
        relationsData.length === 0
          ? `   private ${sqlVarToJavaVar(attr.type)} ${CC(attr.name)};`
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

  const getRelations = (attr, destination) => {
    // attributes.forEach((attr) => {
    const object = destination === "output" ? `ListDTO` : `Entity`;
    // const object = `ListDTO`;,
    let rels = [];
    // let imports = [];
    attr.relations.forEach((rel) => {
      const MTO = `   private ${UCC(rel.destinyTable)}${object} ${CC(
        attr.name
      )};`;
      const OTO = `   private ${UCC(rel.destinyTable)}${object} ${CC(
        rel.destinyTable
      )};`;
      const OTM = `   private List<${UCC(rel.destinyTable)}${object}> ${
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
