export const getFilterTemplate = (conf) => {
  return `  @PreAuthorize("hasPermission('${conf.resource}', 'filter')")
  @PostMapping("/filter")
  public ResponseEntity<ApiResponse<${conf.output.type}>> ${conf.name}(@Valid ${conf.input.all}) {

    ${conf.output.type} list = ${conf.output.service.instance}.${conf.output.service.method}(dto);
    ApiResponse<${conf.output.type}> response = new ApiResponse<>(true, "Filtered list obtained successfully", list);
    return ResponseEntity.ok(response);
    
  }`;
};

const getFilterTemplatev0 = (conf) => {
  return `
    //@PreAuthorize("hasPermission('Documents', 'delete')")
    @PostMapping("${conf.url}")
    public ${conf.output.type} ${conf.name}(@Valid ${conf.input.all}) {
      return ${conf.output.service.instance}.${conf.output.service.method}(${conf.input.instance});
    }`;
};
