import {
  CC,
  UCC,
  UniqueArray,
  JoinNewLine,
  //   removeString,
  //   sqlVarToJavaVar,
} from "../../StringFunctions";

export const getAddService = (table) => {
  const repositoryInstance = `${CC(table.name)}Repository`;
  //TODO: revisar si lo tienen como lista de otra cosa para poner addXtoY
  const serviceName = `add${UCC(table.name)}`;
  const input = `${UCC(table.name)}AddDTO ${CC(table.name)}AddDTO`;
  const inputInstance = `${CC(table.name)}AddDTO`;
  // const inputClass = `${UCC(table.name)}AddDTO`;
  const inputEntityClass = `${UCC(table.name)}Entity`;
  const inputEntityInstance = `${CC(table.name)}Entity`;
  const errorMoreThanOne = `"${UCC(table.name)} already exists"`;
  const successMsg = `"${inputInstance} added successfully"`;
  const errorMsg = `"Error adding ${UCC(table.name)}: " + e.getMessage()`;

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

  // -------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------

  const add = `  public JSONObject ${serviceName}(${input}) {
    try {
      
      ${attributesEntitiesSetter}

      List<${inputEntityClass}> filteredList = ${repositoryInstance}
      .findAll(Filter.buildSpecification(${inputInstance}));

      if (!filteredList.isEmpty()) {
        throw new IllegalStateException(${errorMoreThanOne});  
      }

      ${inputEntityClass} ${inputEntityInstance} = modelMapper.map(${inputInstance}, ${inputEntityClass}.class);
      ${repositoryInstance}.save(${inputEntityInstance});
      
      return Response.JSONObject(${successMsg});
    
    } catch (Exception e) {
      return Response.JSONObject(${errorMsg});
    }
  }`;
  return add;
};
