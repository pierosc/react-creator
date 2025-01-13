export const getDeleteTemplate = (conf) => {
  return `@PreAuthorize("hasPermission('${conf.resource}', 'delete')")  
  @DeleteMapping("/delete")
  public ResponseEntity<ApiResponse<Void>> ${conf.name} (@Valid ${conf.input.all}) {

    ${conf.output.service.instance}.${conf.output.service.method}(dto);
    ApiResponse<Void> response = new ApiResponse<>(true, "deleted successfully", null);
    return ResponseEntity.ok(response);

  }
`;
};

const getDeleteTemplatev0 = (conf) => {
  return `   @CrossOrigin
    //@PreAuthorize("hasPermission('Documents', 'delete')")  
    @DeleteMapping("${conf.url}")
    public String ${conf.name} (@Valid ${conf.input.all}) {
      return ${conf.output.service.instance}.${conf.output.service.method}(${conf.input.instance}).toString();
    }`;
};
