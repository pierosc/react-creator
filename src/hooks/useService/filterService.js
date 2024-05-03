import { CC, UCC, UniqueArray, JoinNewLine } from "../../StringFunctions";

export const getFilterService = (table) => {
  const input = `${UCC(table?.name)}FilterDTO ${CC(table?.name)}FilterDTO`;
  const inputInstance = `${CC(table?.name)}FilterDTO`;
  const output = `List<${UCC(table?.name)}ListDTO>`;
  const outputInstanceClass = `${UCC(table?.name)}`;
  const entityClass = `${UCC(table?.name)}Entity`;
  const serviceName = `${CC(table?.name)}Filter`;
  const repository = `${CC(table?.name)}Repository`;

  const service = `  
  @Transactional
  public ${output} ${serviceName}(${input}) {
  List<${entityClass}> filteredList = ${repository}
          .findAll(Filter.buildSpecification(${inputInstance}));
    
          ${output} dtoList = filteredList.stream()
          .map(entity -> modelMapper.map(entity, ${outputInstanceClass}ListDTO.class))
          .collect(Collectors.toList());
  
      return dtoList;
  }
`;

  return service;
};
