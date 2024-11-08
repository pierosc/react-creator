export const getEditTemplate = (conf) => {
  return `   @CrossOrigin
      //@PreAuthorize("hasPermission('Documents', 'delete')")
      @PutMapping("${conf.url}")
      public String ${conf.name}(@Valid ${conf.input.all}) {
        return ${conf.output.service.instance}.${conf.output.service.method}(${conf.input.instance}).toString();
      }`;
};
