import { useState, useContext, useEffect } from "react";
import { useLocalStorage } from "../../../../hooks/useStorage";
import DatabaseContext from "../../../../context/DatabaseProvider";
import useEntity from "../../../../hooks/useEntity";

function useSpringProject() {
  const { db } = useContext(DatabaseContext);
  const [springProjects, setSpringProjects] = useLocalStorage(
    "springProjects",
    []
  );

  const add = (pj) => {
    setSpringProjects([...springProjects, pj]);
  };

  const [selected, setSelected] = useState({});

  const select = (pjName) => {
    setSelected(springProjects.find((v) => v.name === pjName));
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
    springProjects,
    select,
    selected,
    setSelected,
  };
}

export default useSpringProject;
