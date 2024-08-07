import { CC, UCC } from "../../../../../../StringFunctions";

export const getFilterExcelService = (table) => {
  const input = `${UCC(table?.name)}FilterDTO ${CC(table?.name)}FilterDTO`;
  const inputInstance = `${CC(table?.name)}FilterDTO`;
  const output = `List<${UCC(table?.name)}ListDTO>`;
  const outputInstanceClass = `${UCC(table?.name)}`;
  const entityClass = `${UCC(table?.name)}Entity`;
  const serviceName = `${CC(table?.name)}FilterExcel`;
  const repository = `${CC(table?.name)}Repository`;

  const service = `  
  public ByteArrayOutputStream ${serviceName}(${input}) {
    List<${entityClass}> filteredList = ${repository}
        .findAll(Filter.buildSpecification(${inputInstance}));
        ${output} dtoList = filteredList.stream()
        .map(entity -> modelMapper.map(entity, ${outputInstanceClass}ListDTO.class))
        .collect(Collectors.toList());

    JSONArray newArrayList = Converter.ListToJsonArray(dtoList);
    ByteArrayOutputStream file = ExcelUtils.jsonArrayToFile(newArrayList, ${outputInstanceClass}ListDTO.class);
    return file;
  }
`;

  return service;
};
