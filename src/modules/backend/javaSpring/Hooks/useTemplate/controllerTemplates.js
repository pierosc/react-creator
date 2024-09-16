import React from "react";
import { CC, UCC } from "../../../../../StringFunctions";

function controllerTemplates() {
  const getAdd = (conf) => {
    return `    @CrossOrigin
            @PostMapping("${conf.url}")
            public String ${conf.name}(@Valid ${conf.input.all}) {
        
              List<String> emptyFields = ServiceUtils.validateEmptyNonNullFields(${conf.input.instance});
              if (!emptyFields.isEmpty()) {
                System.out.println("Campos vacíos: " + emptyFields);
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    Response.Error("Empty fields", emptyFields));
              }
        
              return ${conf.output.service.instance}.${conf.output.service.method}(${conf.input.instance}).toString();
            }`;
  };

  const getDelete = (conf) => {
    return `   @CrossOrigin
          @DeleteMapping("${conf.url}")
          public String ${conf.name} (@Valid ${conf.input.all}) {
            return ${conf.output.service.instance}.${conf.output.service.method}(${conf.input.instance}).toString();
          }`;
  };

  const getEdit = (conf) => {
    return `   @CrossOrigin
        @PutMapping("${conf.url}")
            public String ${conf.name}(@Valid ${conf.input.all}) {
              return ${conf.output.service.instance}.${conf.output.service.method}(${conf.input.instance}).toString();
            }`;
  };

  const getFilter = (conf) => {
    return `    @CrossOrigin
        @PostMapping("${conf.url}")
            public ${conf.output.type} ${conf.name}(@Valid ${conf.input.all}) {
              return ${conf.output.service.instance}.${conf.output.service.method}(${conf.input.instance});
        }`;
  };

  const getFilterExcel = (conf) => {
    return `@CrossOrigin
        @PostMapping("${conf.url}")
        public ResponseEntity<Resource> ${conf.name}(@Valid ${conf.input.all}) {
        try {
            ByteArrayOutputStream archivo = ${conf.output.service.instance}.${conf.output.service.method}(${conf.input.instance});
            return ExcelUtils.easyExcelDownloader("${conf.fileName}.xlsx", archivo);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    
        }`;
  };

  const getList = (conf) => {
    return `   @CrossOrigin
        @GetMapping("${conf.url}")
            public ${conf.output.type} ${conf.name}() {
              return ${conf.output.service.instance}.${conf.output.service.method}();
            }`;
  };

  const getClass = (table) => {
    const controller = `@RestController
  @RequestMapping("/${CC(table.name)}")
  public class ${UCC(table.name)}Controller {
      @Autowired
      private ${UCC(table.name)}Service ${CC(table.name)}Service;
  `;
    return controller;
  };

  return {
    getAdd,
    getDelete,
    getEdit,
    getClass,
    getFilter,
    getFilterExcel,
    getList,
  };
}

export default controllerTemplates;
