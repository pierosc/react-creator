import { CC, UCC } from "../../.././../../../StringFunctions";

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

  const uniqueAttr =
    table.attributes.find((attr) => attr.unique === true) ?? {};
  // console.log(uniqueAttr);

  // -------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------

  const del = `    
  @Transactional
  public JSONObject ${serviceName}(${input}) {
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
  const deleteServiceUniqueAttr = `    
  @Transactional
  public JSONObject ${serviceName}(${input}) {
    try {

      ${entityClass} entityToDelete = ${repositoryInstance}.findBy${UCC(
    uniqueAttr?.name
  )}(${inputInstance}.get${UCC(uniqueAttr?.name)}());

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
  return Object.keys(uniqueAttr).length > 0 ? deleteServiceUniqueAttr : del;
};
