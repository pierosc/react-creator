import { JoinNewLine, UniqueArray } from "../../StringFunctions";

function useDTOMapping(artifactId) {
  const imports = [
    `package com.${artifactId}.utils;`,
    `import java.util.HashMap;`,
    `import java.util.Map;`,
  ];

  const startClass = `public class DTOMapping {
          private static final Map<String, Class<?>> dtoToEntityMapping = new HashMap<>();
          
          static {`;

  const attributeMap = [];
  const endClass = `    }
  
  public static Class<?> getEntityClass(String dtoName) {
      return dtoToEntityMapping.get(dtoName);
  }
  }`;

  // -------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------

  const getMap = (DTO) => {
    //`dtoToEntityMapping.put("com.users.controllers.responses.Genders.GendersListDTO", GendersEntity.class);`
    return `dtoToEntityMapping.put("com.${artifactId}.controllers.responses.${DTO.table}.${DTO.name}", ${DTO.table}Entity.class);`;
  };

  const getImport = (DTO) => {
    return `import com.${artifactId}.repositories.dB.entities.${DTO.table}Entity;`;
  };

  const addDTOMap = (DTO) => {
    const newAttrMap = getMap(DTO);
    attributeMap.push(newAttrMap);
    const newImport = getImport(DTO);
    imports.push(newImport);
    console.log(imports);
    console.log(attributeMap);
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
