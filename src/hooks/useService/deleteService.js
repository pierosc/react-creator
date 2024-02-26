import {
  CC,
  UCC,
  //   UniqueArray,
  //   JoinNewLine,
  //   removeString,
  //   sqlVarToJavaVar,
} from "../../StringFunctions";

export const getDeleteService = (table) => {
  const input = `${UCC(table.name)}DeleteDTO ${CC(table.name)}DeleteDTO`;
  const inputInstance = `${CC(table.name)}DeleteDTO`;
  const serviceName = `delete${UCC(table.name)}`;
  const repositoryInstance = `${CC(table.name)}Repository`;
  const entityClass = `${UCC(table.name)}Entity`;
  const successMsg = `"${UCC(table.name)} deleted successfully"`;

  const errorMsg = `"No se eliminó ${UCC(table.name)}" `;
  const errorNotFound = `"${UCC(table.name)} not found"`;
  const errorMoreThanOne = `filteredList.size() +" ${UCC(table.name)} found"`;
  const catchErrorMsg = `"Error deleting ${UCC(
    table.name
  )}: " + e.getMessage()`;

  const uniqueAttr = table.attributes.find((attr) => attr.unique === true);

  const findEntityToDelete = () => {
    if (uniqueAttr) {
      return `Optional<${entityClass}> entityToDelete = ${repositoryInstance}.findBy${UCC(
        uniqueAttr.name
      )}(courseCode);`;
    } else {
      return `        List<${entityClass}> filteredList = ${repositoryInstance}
  .findAll(Filter.buildSpecification(${inputInstance}));

if (filteredList.isEmpty()) {
throw new IllegalStateException(${errorNotFound});
} else if (filteredList.size() > 1) {
throw new IllegalStateException(${errorMoreThanOne});
}

${entityClass} entityToDelete = filteredList.get(0);`;
    }
  };

  // ____ ____ ____ _  _ _ ____ ____
  // [__  |___ |__/ |  | | |    |___
  // ___] |___ |  \  \/  | |___ |___

  const del = `    public JSONObject ${serviceName}(${input}) {
      try {

        List<${UCC(table.name)}Entity> filteredList = ${repositoryInstance}
            .findAll(Filter.buildSpecification(${inputInstance}));

        if (filteredList.isEmpty()) {
          throw new IllegalStateException(${errorNotFound});
        } else if (filteredList.size() > 1) {
          throw new IllegalStateException(${errorMoreThanOne});
        }

        ${UCC(table.name)}Entity entityToDelete = filteredList.get(0);
        ${repositoryInstance}.delete(entityToDelete);

        return Response.JSONObject(${successMsg});

      } catch (Exception e) {
        JSONObject jsonError = new JSONObject();
        e.printStackTrace();
        jsonError.put("error", ${catchErrorMsg});
        return jsonError;
      }
    }
`;
  const deleteServiceUniqueAttr = `    public JSONObject ${serviceName}(${input}) {
  try {

    List<${UCC(table.name)}Entity> filteredList = ${repositoryInstance}
        .findAll(Filter.buildSpecification(${inputInstance}));

    if (filteredList.isEmpty()) {
      throw new IllegalStateException(${errorNotFound});
    } else if (filteredList.size() > 1) {
      throw new IllegalStateException(${errorMoreThanOne});
    }

    ${UCC(table.name)}Entity entityToDelete = filteredList.get(0);
    ${repositoryInstance}.delete(entityToDelete);

    return Response.JSONObject(${successMsg});

  } catch (Exception e) {
    JSONObject jsonError = new JSONObject();
    e.printStackTrace();
    jsonError.put("error", ${catchErrorMsg});
    return jsonError;
  }
}
`;
  return del;
};
