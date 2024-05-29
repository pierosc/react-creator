import { useContext } from "react";
import { useLocalStorage } from "../../../../hooks/useStorage";
import DatabaseContext from "../../../../context/DatabaseProvider";
import useEntity from "../../../../hooks/useEntity";

function useSpringProject() {
  const { database } = useContext(DatabaseContext);
  const [springProjects, setSpringProjects] = useLocalStorage(
    "springProjects",
    []
  );

  const add = (pj) => {
    setSpringProjects([...springProjects, pj]);
  };

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

  const springProject = {
    name: "",
    entity: [],
    repository: [],
    service: [],
    controller: [],
    dto: [],
    db: "",
    metaData: {},
  };

  return {
    add,
    springProjects,
  };
}

export default useSpringProject;
