import React from "react";

function useEntity() {
  const getEntitiesFiles = (entitiesList) => {
    let entitiesFiles = [];
    Object.keys(entitiesList).forEach((entitieName) => {
      const entitie = entitiesList[entitieName];
      const top = entitie.top;
      const bottom = entitie.bottom;
      const content = entitie.content.join(`
          `);
      const file =
        top +
        `
      ` +
        content +
        `
      ` +
        bottom;
      entitiesFiles.push({
        type: "file",
        name: `${UCC(entitieName)}Entity.java`,
        content: file,
      });
    });
    return entitiesFiles;
  };

  return { getEntitiesFiles };
}

export default useEntity;
