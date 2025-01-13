export const getListTemplate = (conf) => {
  return `  @PreAuthorize("hasPermission('${conf.resource}', 'get')")
  @GetMapping("/getAll")
  public ResponseEntity<ApiResponse<${conf.output.type}>> ${conf.name}() {
    ${conf.output.type} list = ${conf.output.service.instance}.${conf.output.service.method}();
    ApiResponse<${conf.output.type}> response = new ApiResponse<>(true, "List obtained successfully", list);
    return ResponseEntity.ok(response);
  }
`;
};

const getListTemplatev0 = (conf) => {
  return `
    //@PreAuthorize("hasPermission('Documents', 'delete')")
    @GetMapping("${conf.url}")
    public ${conf.output.type} ${conf.name}() {
      return ${conf.output.service.instance}.${conf.output.service.method}();
    }`;
};
