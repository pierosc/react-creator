import { CC, UCC, UniqueArray, JoinNewLine } from "../../StringFunctions";

export const getEditService = (table) => {
  const serviceName = ` edit${UCC(table.name)}`;
  const input = `${UCC(table.name)}Entity ${CC(table.name)}Entity`;
  const inputClass = `${UCC(table.name)}Entity`;
  const inputInstance = `${CC(table.name)}Entity`;
  const repositoryInstance = `${CC(table.name)}Repository`;

  const successMsg = `"${UCC(table.name)} edited successfully"`;
  const errorNotFound = `"${UCC(table.name)} not found"`;
  const errorMoreThanOne = `filteredList.size() +" ${UCC(table.name)} found"`;
  const errorCatch = `"Error editing ${UCC(table.name)}: " + e.getMessage()`;
  const uniqueAttr =
    table.attributes.find((attr) => attr.unique === true) ?? {};

  // -------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------

  const attributesEntitiesSetter = JoinNewLine(
    UniqueArray(
      table.attributes.map((attr) =>
        !attr.pk
          ? attr.relations.map((rel) => {
              const relRepository = `${CC(rel.destinyTable)}Repository`;
              const attrName =
                rel.relation === "OneToOneO"
                  ? `${UCC(rel.destinyTable)}`
                  : `${UCC(attr.name)}`;

              return `      if (${inputInstance}.get${attrName}() != null) {
        ${inputInstance}.set${attrName}(${relRepository}
            .findAll(Filter.buildSpecification(${inputInstance}.get${attrName}())).get(0));
      }`;
            })
          : []
      )
    )
  );

  const UniqueEntityToEdit = `      ${inputClass} entityToEdit = ${repositoryInstance}.findBy${UCC(
    uniqueAttr?.name
  )}(${inputInstance}.get${UCC(uniqueAttr?.name)}());`;

  const ListEntityToEdit = `List<${inputClass}> filteredList = ${repositoryInstance}
.findAll(Filter.buildSpecification(${inputInstance}));

if (filteredList.isEmpty()) {
  throw new IllegalStateException(${errorNotFound});
} else if (filteredList.size() > 1) {
  throw new IllegalStateException(${errorMoreThanOne});
}

${inputClass} entityToEdit = filteredList.get(0);`;

  const entityToEdit =
    Object.keys(uniqueAttr).length > 0 ? UniqueEntityToEdit : ListEntityToEdit;

  // -------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------

  const edit = `  public JSONObject ${serviceName}(${input}) {
      try {
          ${attributesEntitiesSetter}

          ${entityToEdit}
  
              ModelMapper modelMapper = new ModelMapper();
              modelMapper.getConfiguration().setSkipNullEnabled(true);
              modelMapper.map(${inputInstance}, entityToEdit);
              ${repositoryInstance}.save(entityToEdit);
  
              return Response.JSONObject(${successMsg});
  
      } catch (Exception e) {
          JSONObject jsonError = new JSONObject();
          e.printStackTrace();
          jsonError.put("error", ${errorCatch});
          return jsonError;
      }
    }`;

  return edit;
};
