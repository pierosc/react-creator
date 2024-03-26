import useDTOMapping from "./useDTOMapping";
import useResponse from "./useResponse";
import useFilter from "./useFilter";
import useServiceUtils from "./useServiceUtils";

const useUtils = (artifactId) => {
  const DTOMap = useDTOMapping(artifactId);

  const Response = useResponse(artifactId);

  const Filter = useFilter(artifactId);

  const ServiceUtils = useServiceUtils(artifactId);

  const getFolderContent = () => {
    const DTOMapFile = DTOMap.getFile();
    const ResponseFile = Response.getFile();
    const FilterFile = Filter.getFile();
    const ServiceUtilsFile = ServiceUtils.getFile();
    return [DTOMapFile, ResponseFile, FilterFile, ServiceUtilsFile];
  };

  return { DTOMap, Response, getFolderContent };
};

export default useUtils;
