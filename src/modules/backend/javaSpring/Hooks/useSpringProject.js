import { useState, useContext, useEffect } from "react";
import { useLocalStorage } from "../../../../hooks/useStorage";
// import DatabaseContext from "../../../../context/DatabaseProvider";

function useSpringProject() {
  // const { db } = useContext(DatabaseContext);
  // CONTROLA ASPECTOS GENERALES DEL PROYECTO COMO CARPETA
  const [springProjects, setSpringProjects] = useLocalStorage(
    "springProjects",
    []
  );

  const add = (pj) => {
    setSpringProjects([...springProjects, pj]);
  };

  const addElementToTable = (
    projectName,
    attrFromProject,
    table,
    attrFromTable,
    newElement
  ) => {
    setSpringProjects((prevProjects) => {
      const otherProjects = prevProjects.filter(
        (pj) => pj.name !== projectName
      );
      let modifiedProject = prevProjects.find((pj) => pj.name === projectName);
      // console.log("----");
      // console.log(modifiedProject);
      // console.log(attrFromProject);
      // console.log(attrFromTable);
      // console.log("----");

      let modifiedProject2 = {
        ...modifiedProject,
        [attrFromProject]: {
          ...modifiedProject[attrFromProject],
          [table.name]: {
            ...modifiedProject[attrFromProject][table.name],
            [attrFromTable]: [
              ...modifiedProject[attrFromProject][table.name][attrFromTable],
              newElement,
            ],
          },
        },
      };

      // console.log(modifiedProject2[attrFromProject][table.name][attrFromTable]);
      // console.groupEnd();
      return [...otherProjects, modifiedProject2];
    });
  };

  const addToTable = (projectName, attrFromProject, table, newElement) => {
    setSpringProjects((prevProjects) => {
      const otherProjects = prevProjects.filter(
        (pj) => pj.name !== projectName
      );
      let modifiedProject = prevProjects.find((pj) => pj.name === projectName);

      let modifiedProject2 = {
        ...modifiedProject,
        [attrFromProject]: {
          ...modifiedProject[attrFromProject],
          [table.name]: {
            ...modifiedProject[attrFromProject][table.name],
            ...newElement,
            // [attrFromTable]: [
            //   ...modifiedProject[attrFromProject][table.name][attrFromTable],
            //   newElement,
            // ],
          },
        },
      };

      return [...otherProjects, modifiedProject2];
    });
  };

  const [selected, setSelected] = useState({});

  const select = (pjName) => {
    setSelected(springProjects.find((v) => v.name === pjName));
  };

  const changeAttrToSelected = (attrs) => {
    const PJNoSelected = springProjects.filter(
      (pj) => pj.name !== selected.name
    );
    setSpringProjects([...PJNoSelected, { ...selected, attrs }]);
  };

  useEffect(() => {
    console.group("NEW SPRING PROJECT SELECTED");
    console.log(selected);
    console.groupEnd();
  }, [selected]);

  //base seleccionada

  //HOOKS
  //   const entities = useEntity(database.selected.json, metaData);
  //   const services = useService(tableStructure, metaData);
  //   const controllers = useController(tableStructure, metaData);
  //   const repositories = useRepositories(tableStructure, metaData);
  //   const utils = useUtils(metaData);
  //   const DTO = useDTO(metaData, utils.DTOMap);
  //   const exception = useException(metaData);
  //   const application = useApplication(metaData);

  // const springProject = {
  //   name: "",
  //   entity: [],
  //   repository: [],
  //   service: [],
  //   controller: [],
  //   dto: [],
  //   db: "",
  //   metaData: {},
  // };

  return {
    add,
    addToTable,
    addElementToTable,
    springProjects,
    setSpringProjects,
    select,
    selected,
    setSelected,
    changeAttrToSelected,
  };
}

export default useSpringProject;
