import { JoinNewLine } from "../../../StringFunctions";

function useFilterController() {
  const inputDTO = {
    class: `${UCC(table.name)}FilterDTO`,
    instance: `${CC(table?.name)}FilterDTO`,
  };
  const requestBody = `@RequestBody ${inputDTO.class} ${input.instance}`;
  const outputDTO = `${UCC(table.name)}ListDTO`;

  const controllerName = `${CC(table.name)}Filter`;

  //ANNOTATIONS
  const url = `/${CC(table.name)}Filter`;

  const annotations = JoinNewLine(["@CrossOrigin", `@PostMapping("${url}")`]);

  //RESPONSE
  const service = {
    class: `${CC(table.name)}Service`,
    method: `${CC(table.name)}Filter`,
  };

  const responseOk = (resp) => `ResponseEntity.ok(${resp})`;

  ////////////////////////////////////

  const controller = `
    ${annotations}
    public ResponseEntity<List<${outputDTO}>> ${controllerName}(${requestBody}) {
        return ${responseOk(
          `${service.class}.${service.method}(${inputDTO.instance})`
        )};
    }`;

  return { controller };
}

export default useFilterController;
