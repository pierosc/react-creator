import useDTOMapping from "./useDTOMapping";
import useResponse from "./useResponse";
import useFilter from "./useFilter";
import useServiceUtils from "./useServiceUtils";
import useExcelUtils from "./useExcelUtils";
import useConverter from "./useConverter";

const useUtils = (metaData) => {
  const DTOMap = useDTOMapping(metaData);

  const Response = useResponse(metaData);

  const Filter = useFilter(metaData);

  const ServiceUtils = useServiceUtils(metaData);

  const ExcelUtils = useExcelUtils(metaData);

  const ConverterUtils = useConverter(metaData);

  const getFolderContent = () => {
    const DTOMapFile = DTOMap.getFile();
    const ResponseFile = Response.getFile();
    const FilterFile = Filter.getFile();
    const ServiceUtilsFile = ServiceUtils.getFile();
    const ExcelUtilsFile = ExcelUtils.getFile();
    const ConverterFile = ConverterUtils.getFile();

    return [
      DTOMapFile,
      ResponseFile,
      FilterFile,
      ServiceUtilsFile,
      ExcelUtilsFile,
      ConverterFile,
    ];
  };

  return { DTOMap, Response, getFolderContent };
};

export default useUtils;
