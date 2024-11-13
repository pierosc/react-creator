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
import useInterface from "../Hooks/useInterface/useInterface";
import useAudit from "../Hooks/useAudit/useAudit";

const SpringContext = createContext();

function SpringProvider({ children }) {
  const springProject = useSpringProject();

  const entities = useEntity(springProject);
  const services = useService(springProject);
  const interfaces = useInterface(springProject);
  const controllers = useController(springProject);
  const repositories = useRepositories(springProject);
  const utils = useUtils(springProject);
  const DTO = useDTO(springProject);
  const exception = useException(springProject);
  const application = useApplication(springProject);
  const audit = useAudit(springProject);

  const JPA = useJPAProject(
    entities,
    repositories,
    services,
    interfaces,
    controllers,
    DTO,
    springProject
  );

  return (
    <SpringContext.Provider
      value={{
        springProject,
        entities,
        services,
        interfaces,
        controllers,
        repositories,
        utils,
        DTO,
        exception,
        application,
        JPA,
        audit,
      }}
    >
      {children}
    </SpringContext.Provider>
  );
}
export { SpringProvider };
export default SpringContext;
