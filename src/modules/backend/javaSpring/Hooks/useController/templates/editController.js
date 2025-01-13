export const getEditTemplate = (conf) => {
  return `  @PreAuthorize("hasPermission('${conf.resource}', 'edit')")
  @PutMapping("/edit")
  public ResponseEntity<ApiResponse<Void>> ${conf.name}(@Valid ${conf.input.all}) {
    ${conf.output.service.instance}.${conf.output.service.method}(dto);
    ApiResponse<Void> response = new ApiResponse<>(true, "edited successfully", null);
    return ResponseEntity.ok(response);
  }
`;
};

const getEditTemplatev0 = (conf) => {
  return `   @CrossOrigin
      //@PreAuthorize("hasPermission('Documents', 'delete')")
      @PutMapping("${conf.url}")
      public String ${conf.name}(@Valid ${conf.input.all}) {
        return ${conf.output.service.instance}.${conf.output.service.method}(${conf.input.instance}).toString();
      }`;
};
