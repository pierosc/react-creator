import useDTOMapping from "./useDTOMapping";
import useResponse from "./useResponse";
import useFilter from "./useFilter";
import useServiceUtils from "./useServiceUtils";

const useUtils = (metaData) => {
  const DTOMap = useDTOMapping(metaData);

  const Response = useResponse(metaData);

  const Filter = useFilter(metaData);

  const ServiceUtils = useServiceUtils(metaData);

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
