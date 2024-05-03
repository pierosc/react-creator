import { CC, UCC, UniqueArray, JoinNewLine } from "../../StringFunctions";
import { updateVarsToExclude } from "../../constants/varsToExclude";

export const getEditService = (table) => {
  const serviceName = ` edit${UCC(table.name)}`;
  // const input = `${UCC(table.name)}Entity ${CC(table.name)}Entity`;
  const input = `${UCC(table.name)}EditDTO ${CC(table.name)}EditDTO`;
  const inputInstance = `${CC(table.name)}EditDTO`;
  const inputClass = `${UCC(table.name)}EditDTO`;
  const entityClass = `${UCC(table.name)}Entity`;
  const entityInstance = `${CC(table.name)}Entity`;
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

              return rel.relation !== "OneToMany"
                ? `      if (${inputInstance}.get${attrName}() != null) {
                  entityToEdit.set${attrName}(${relRepository}
            .findAll(Filter.buildSpecification(${inputInstance}.get${attrName}())).get(0));
            ${inputInstance}.set${attrName}(null);
      }`
                : ``;
            })
          : []
      )
    )
  );

  // *************************************************************************
  // OBTENER LA ENTIDAD A EDITAR
  // Descripción: Depende de si existe un atributo 'unique' se usa una técnica
  // u otra
  // *************************************************************************

  const UniqueEntityToEdit = `
${entityClass} entityToEdit = ${repositoryInstance}.findBy${UCC(
    uniqueAttr?.name
  )}(${inputInstance}.get${UCC(uniqueAttr?.name)}());
  `;

  const ListEntityToEdit = `
List<${entityClass}> filteredList = ${repositoryInstance}
.findAll(Filter.buildSpecification(${inputInstance}));

if (filteredList.isEmpty()) {
  throw new IllegalStateException(${errorNotFound});
} else if (filteredList.size() > 1) {
  throw new IllegalStateException(${errorMoreThanOne});
}

${entityClass} entityToEdit = filteredList.get(0);
`;

  const entityToEdit =
    Object.keys(uniqueAttr).length > 0 ? UniqueEntityToEdit : ListEntityToEdit;

  // *************************************************************************
  // ASIGNAR LA VARIABLE DE TIMESTAMP
  // *************************************************************************
  const temporalAttribute = table.attributes.find((attr) =>
    updateVarsToExclude.includes(attr.name.toUpperCase())
  );

  const setUpdateTime = `
  entityToEdit.set${UCC(
    temporalAttribute?.name
  )}(new Timestamp(System.currentTimeMillis()));
`;

  // -------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------

  const edit = `  
  @Transactional
  public JSONObject ${serviceName}(${input}) {
      try {
          ${entityToEdit}
          ${attributesEntitiesSetter}
          ModelMapper modelMapper = new ModelMapper();
          modelMapper.getConfiguration().setSkipNullEnabled(true);
          modelMapper.map(${inputInstance}, entityToEdit);
          ${temporalAttribute ? setUpdateTime : ""}
          ${repositoryInstance}.save(entityToEdit);
        
          return Response.JSONObject(${successMsg});

      } catch (Exception e) {
          e.printStackTrace();      
          return Response.JSONObject(${errorCatch});
      }
    }`;

  return edit;
};
