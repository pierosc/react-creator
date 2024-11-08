export const getFilterExcelTemplate = (conf) => {
  return `@CrossOrigin
    //@PreAuthorize("hasPermission('Documents', 'delete')")
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
