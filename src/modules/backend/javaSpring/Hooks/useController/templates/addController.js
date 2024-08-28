export const getAddTemplate = (conf) => {
  return `    @CrossOrigin
      @PostMapping("${conf.url}")
      public String ${conf.name}(${conf.input.all}) {
  
        List<String> emptyFields = ServiceUtils.validateEmptyNonNullFields(${conf.input.instance});
        if (!emptyFields.isEmpty()) {
          System.out.println("Campos vacíos: " + emptyFields);
          throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
              Response.Error("Empty fields", emptyFields));
        }
  
        return ${conf.output.service.instance}.${conf.output.service.method}(${conf.input.instance}).toString();
      }`;
};
