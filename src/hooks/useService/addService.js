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
  const input = `${UCC(table.name)}Entity ${CC(table.name)}Entity`;
  const inputInstance = `${CC(table.name)}Entity`;
  const inputClass = `${UCC(table.name)}Entity`;
  const errorMoreThanOne = `"${UCC(table.name)} already exists"`;
  const successMsg = `"${inputInstance} added successfully"`;
  const errorMsg = `"Error adding ${UCC(table.name)}: " + e.getMessage();`;

  const attributesEntitiesSetter = table.attributes.map((attr) =>
    !attr.pk
      ? attr.relations.map((rel) => {
          const relRepository = `${CC(rel.destinyTable)}Repository`;
          const attrName = `${UCC(attr.name)}`;

          return `      if (${inputInstance}.get${attrName}() != null) {
        ${inputInstance}.set${attrName}(${relRepository}
            .findAll(Filter.buildSpecification(${inputInstance}.get${attrName}())).get(0));
      }`;
        })
      : []
  );

  // -------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------

  const add = `  public JSONObject ${serviceName}(${input}) {
    try {
      
      ${JoinNewLine(UniqueArray(attributesEntitiesSetter))}

      List<${inputClass}> filteredList = ${repositoryInstance}
      .findAll(Filter.buildSpecification(${inputInstance}));

      if ( filteredList.size() > 0) {
        throw new IllegalStateException(${errorMoreThanOne});  
      }

      ${repositoryInstance}.save(${inputInstance});
      
      return Response.JSONObject(${successMsg});
    
    } catch (Exception e) {
      Response.JSONObject(${errorMsg});
    }
  }`;
  return add;
};
