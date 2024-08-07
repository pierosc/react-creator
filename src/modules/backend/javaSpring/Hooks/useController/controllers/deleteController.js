export const getDeleteTemplate = (conf) => {
  return `   @CrossOrigin
  @DeleteMapping("${conf.url}")
  public String ${conf.name} (${conf.input.all}) {
    return ${conf.output.service.instance}.${conf.output.service.method}(${conf.input.instance}).toString();
  }`;
};

export const getEditTemplate = (conf) => {
  return `   @CrossOrigin
    @PutMapping("${conf.url}")
        public String ${conf.name}(${conf.input.all}) {
          return ${conf.output.service.instance}.${conf.output.service.method}(${conf.input.instance}).toString();
        }`;
};

export const getListTemplate = (conf) => {
  return `   @CrossOrigin
    @GetMapping("${conf.url}")
        public ${conf.output.type} ${conf.name}() {
          return ${conf.output.service.instance}.${conf.output.service.method}();
        }`;
};

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

export const getFilterTemplate = (conf) => {
  return `    @CrossOrigin
    @PostMapping("${conf.url}")
        public ${conf.output.type} ${conf.name}(${conf.input.all}) {
          return ${conf.output.service.instance}.${conf.output.service.method}(${conf.input.instance});
    }`;
};

export const getFilterExcelTemplate = (conf) => {
  return `@CrossOrigin
    @PostMapping("${conf.url}")
    public ResponseEntity<Resource> ${conf.name}(${conf.input.all}) {
    try {
        ByteArrayOutputStream archivo = ${conf.output.service.instance}.${conf.output.service.method}(${conf.input.instance});
        return ExcelUtils.easyExcelDownloader("${conf.fileName}.xlsx", archivo);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
    }

    }`;
};

// const getFindByController = (selectedAttributes, table) => {
//     const attrsList = selectedAttributes
//       .map((attr) => UCC(attr.name))
//       .join("And");

//     const DTOName =
//       selectedAttributes.map((attr) => CC(attr.name)).join("And") + "IDTO";
//     const outputs = selectedAttributes
//       .map((attr) => `${DTOName}.get${UCC(attr.name)}()`)
//       .join(", ");

//     return `    @CrossOrigin
//     @PostMapping("/${CC(table?.name)}FilterBy${attrsList}")
//         public List<${UCC(table?.name)}Entity> ${CC(
//       table?.name
//     )}FilterBy${attrsList}(@RequestBody ${attrsList}IDTO ${DTOName} ){
//             return ${CC(table?.name)}Service.${CC(
//       table?.name
//     )}FilterBy${attrsList}(${outputs});
//         }`;

//     // return controller;
//   };
