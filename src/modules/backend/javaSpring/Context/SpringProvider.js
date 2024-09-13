import { createContext } from "react";
import useSpringProject from "../Hooks/useSpringProject";
import useService from "../Hooks/useService/useService";
import { useController } from "../Hooks/useController/useController";
import { useRepositories } from "../Hooks/useRepositories";
import useUtils from "../../../../hooks/useUtils/useUtils";
import { useDTO } from "../Hooks/useDTO/useDTO";
import useApplication from "../../../../hooks/useApplication";
import useException from "../Hooks/useException/useException";
import { useJPAProject } from "../Hooks/useJPAProject";
import useEntity from "../Hooks/useEntity";

const SpringContext = createContext();

function SpringProvider({ children }) {
  const springProject = useSpringProject();

  const entities = useEntity();
  const services = useService();
  const controllers = useController();
  const repositories = useRepositories();
  const utils = useUtils();
  const DTO = useDTO();
  const exception = useException();
  const application = useApplication();

  const JPA = useJPAProject(entities, repositories, services, controllers, DTO);

  return (
    <SpringContext.Provider
      value={{
        springProject,
        entities,
        services,
        controllers,
        repositories,
        utils,
        DTO,
        exception,
        application,
        JPA,
      }}
    >
      {children}
    </SpringContext.Provider>
  );
}
export { SpringProvider };
export default SpringContext;
