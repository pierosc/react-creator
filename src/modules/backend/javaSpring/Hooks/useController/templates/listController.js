export const getListTemplate = (conf) => {
  return `   @CrossOrigin
      @GetMapping("${conf.url}")
          public ${conf.output.type} ${conf.name}() {
            return ${conf.output.service.instance}.${conf.output.service.method}();
          }`;
};
