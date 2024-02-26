import { CC, UCC } from "../../StringFunctions";

export const getEditService = (tableName) => {
  const serviceName = ` edit${UCC(tableName)}`;
  const input = `${UCC(tableName)}Entity ${CC(tableName)}Entity`;
  const inputClass = `${UCC(tableName)}Entity`;
  const inputInstance = `${CC(tableName)}Entity`;
  const repositoryInstance = `${CC(tableName)}Repository`;

  const successMsg = `"${UCC(tableName)} edited successfully"`;
  const errorNotFound = `"${UCC(tableName)} not found"`;
  const errorMoreThanOne = `filteredList.size() +" ${UCC(tableName)} found"`;
  const errorCatch = `"Error editing ${UCC(tableName)}: " + e.getMessage()`;

  const edit = `  public JSONObject ${serviceName}(${input}) {
      try {
          JSONObject jsonResponse = new JSONObject();
  
          List<${inputClass}> filteredList = ${repositoryInstance}
            .findAll(Filter.buildSpecification(${inputInstance}));

            if (filteredList.isEmpty()) {
              throw new IllegalStateException(${errorNotFound});
            } else if (filteredList.size() > 1) {
              throw new IllegalStateException(${errorMoreThanOne});
            }
    
            ${inputClass} entityToEdit = filteredList.get(0);
  
              ModelMapper modelMapper = new ModelMapper();
              modelMapper.getConfiguration().setSkipNullEnabled(true);
              modelMapper.map(${inputInstance}, entityToEdit);
              ${repositoryInstance}.save(entityToEdit);
  
              jsonResponse.put("mensaje", ${successMsg});
              return jsonResponse;
  
      } catch (Exception e) {
          JSONObject jsonError = new JSONObject();
          e.printStackTrace();
          jsonError.put("error", ${errorCatch});
          return jsonError;
      }
    }`;
  return edit;
};
