import { useState, useEffect } from "react";
import { useLocalStorage } from "../../../../hooks/useStorage";

function useReactProject() {
  const [reactProjects, setReactProjects] = useLocalStorage(
    "reactProjects",
    []
  );

  const add = (pj) => {
    setReactProjects([...reactProjects, pj]);
  };

  const addElementToTable = (
    projectName,
    attrFromProject,
    table,
    attrFromTable,
    newElement
  ) => {
    setReactProjects((prevProjects) => {
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
    setReactProjects((prevProjects) => {
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
    setSelected(reactProjects.find((v) => v.name === pjName));
  };

  const changeAttrToSelected = (attrs) => {
    const PJNoSelected = reactProjects.filter(
      (pj) => pj.name !== selected.name
    );
    setReactProjects([...PJNoSelected, { ...selected, attrs }]);
  };

  useEffect(() => {
    console.group("NEW REACT PROJECT SELECTED");
    console.log(selected);
    console.groupEnd();
  }, [selected]);

  return {
    add,
    addToTable,
    addElementToTable,
    reactProjects,
    setReactProjects,
    select,
    selected,
    setSelected,
    changeAttrToSelected,
  };
}

export default useReactProject;
