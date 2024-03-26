import { JoinNewLine, UCC, UniqueArray } from "../../StringFunctions";
import { useState } from "react";
function useDTOMapping(artifactId) {
  const [attributeMap, setAttributeMap] = useState([]);
  const [imports, setImports] = useState([
    `package com.${artifactId}.utils;`,
    `import java.util.HashMap;`,
    `import java.util.Map;`,
  ]);

  const startClass = `public class DTOMapping {
          private static final Map<String, Class<?>> dtoToEntityMapping = new HashMap<>();
          
          static {`;

  const endClass = `    }
  
  public static Class<?> getEntityClass(String dtoName) {
      return dtoToEntityMapping.get(dtoName);
  }
  }`;

  // -------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------

  const getMap = (DTO) => {
    //`dtoToEntityMapping.put("com.users.controllers.responses.Genders.GendersListDTO", GendersEntity.class);`
    return `dtoToEntityMapping.put("com.${artifactId}.${
      DTO.source === "output" ? "controllers.responses" : "business.domain"
    }.${UCC(DTO.table)}.${DTO.name}", ${UCC(DTO.table)}Entity.class);`;
  };

  const getImport = (DTO) => {
    return `import com.${artifactId}.repositories.dB.entities.${UCC(
      DTO.table
    )}Entity;`;
  };

  const addDTOMap = (DTO) => {
    setAttributeMap((prevAttrMap) => {
      const newAttrMap = getMap(DTO);
      return [...prevAttrMap, newAttrMap];
    });
    setImports((prevImport) => {
      const newImport = getImport(DTO);
      return [...prevImport, newImport];
    });
  };

  const getFile = () => {
    const file = JoinNewLine([
      JoinNewLine(UniqueArray(imports)),
      startClass,
      JoinNewLine(UniqueArray(attributeMap)),
      endClass,
    ]);
    return {
      type: "file",
      name: `DTOMapping.java`,
      content: file,
    };
  };

  return { addDTOMap, getFile };
}

export default useDTOMapping;
