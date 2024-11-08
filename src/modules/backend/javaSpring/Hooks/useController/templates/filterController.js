export const getFilterTemplate = (conf) => {
  return `   @CrossOrigin
    //@PreAuthorize("hasPermission('Documents', 'delete')")
    @PostMapping("${conf.url}")
    public ${conf.output.type} ${conf.name}(@Valid ${conf.input.all}) {
      return ${conf.output.service.instance}.${conf.output.service.method}(${conf.input.instance});
    }`;
};
