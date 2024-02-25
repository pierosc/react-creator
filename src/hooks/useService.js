import { useState } from "react";
import { CC, UCC, removeString, sqlVarToJavaVar } from "../StringFunctions";

const useService = (tableStructue, artifactId) => {
  const [servicesList, setServicesList] = useState([]); //TODOS LOS SERVICIOS
  //   const [serviceImports, setServiceImports] = useState("");

  const addService = (table, newService) => {
    setServicesList((prevServicesList) => {
      const newServicesList = { ...prevServicesList };
      const newServices = [
        newService,
        ...newServicesList[table?.name]["services"],
      ];
      newServicesList[table?.name]["services"] = newServices;
      return newServicesList;
    });
  };

  const deleteService = (table, service) => {
    setServicesList((prevServicesList) => {
      const newServicesList = { ...prevServicesList };
      const newServices = [
        ...newServicesList[table?.name]["services"].filter(
          (serv) => serv !== service
        ),
      ];
      newServicesList[table?.name]["services"] = newServices;
      return newServicesList;
    });
  };

  const addImport = (table, serviceImport) => {
    setServicesList((prevServiceImports) => {
      const newServiceImports = { ...prevServiceImports };
      const newImports =
        newServiceImports[table?.name]["imports"] +
        `
${serviceImport}`;

      newServiceImports[table?.name]["imports"] = newImports;
      return newServiceImports;
    });
  };

  const deleteImport = (table, serviceImport) => {
    setServicesList((prevServiceImports) => {
      const newServiceImports = { ...prevServiceImports };
      const newImports = removeString(
        newServiceImports[table?.name]["imports"],
        serviceImport
      );
      //         newServiceImports[table?.name]["imports"] +
      // `
      //   ${serviceImport}`;

      newServiceImports[table?.name]["imports"] = newImports;
      return newServiceImports;
    });
  };
  const setEmptyStructure = () => {
    let services = {};
    tableStructue.forEach((table) => {
      //   const imports = getServiceImports(table);
      services[table.name] = {};
      services[table.name]["imports"] = getServiceImports(table);
      services[table.name]["classStart"] = getServiceClass(table);
      services[table.name]["services"] = [];
      services[table.name]["classEnd"] = "}";
    });
    setServicesList(services);
  };

  const setCRUDFServices = () => {
    tableStructue.forEach((table) => {
      const pkName = UCC(table.attributes.find((attr) => attr.pk).name);
      const createService = getAddService(table.name);
      //   const readService = getListAllService(table.name);
      const updateService = getEditService(table.name, pkName);
      // const deleteService = getDeleteService(table.name, pkName);
      const filterService = getFilterService(table);

      setServicesList((prevServicesList) => {
        const newServicesList = { ...prevServicesList };
        const newServices = [
          //   readService,
          createService,
          updateService,
          // deleteService,
          filterService,
          ...newServicesList[table?.name]["services"],
        ];
        newServicesList[table?.name]["services"] = newServices;
        return newServicesList;
      });
    });
    // return services;
  };

  const files = () => {
    let servicesFiles = [];
    Object.keys(servicesList).forEach((serviceName) => {
      const service = servicesList[serviceName];
      const imports = service.imports;
      const classStart = service.classStart;
      const classEnd = service.classEnd;
      const services = service.services.join(`
`);
      const file =
        imports +
        `
` +
        classStart +
        `
` +
        services +
        `
` +
        classEnd;

      servicesFiles.push({
        type: "file",
        name: `${UCC(serviceName)}Service.java`,
        content: file,
      });
    });
    return servicesFiles;
  };

  // _______  __   __       _______         _______.___________..______       __    __    ______ .___________. __    __  .______       _______
  // |   ____||  | |  |     |   ____|       /       |           ||   _  \     |  |  |  |  /      ||           ||  |  |  | |   _  \     |   ____|
  // |  |__   |  | |  |     |  |__         |   (----`---|  |----`|  |_)  |    |  |  |  | |  ,----'`---|  |----`|  |  |  | |  |_)  |    |  |__
  // |   __|  |  | |  |     |   __|         \   \       |  |     |      /     |  |  |  | |  |         |  |     |  |  |  | |      /     |   __|
  // |  |     |  | |  `----.|  |____    .----)   |      |  |     |  |\  \----.|  `--'  | |  `----.    |  |     |  `--'  | |  |\  \----.|  |____
  // |__|     |__| |_______||_______|   |_______/       |__|     | _| `._____| \______/   \______|    |__|      \______/  | _| `._____||_______|

  const getServiceImports = (table) => {
    const service = `package com.${artifactId}.business.services;
  
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.json.JSONObject;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.lang.IllegalStateException;
import com.${artifactId}.utils.Filter;
import com.${artifactId}.utils.Response;
import com.${artifactId}.business.domain.${UCC(table.name)}.${UCC(
      table.name
    )}FilterDTO;
import com.${artifactId}.repositories.dB.entities.${UCC(table.name)}Entity;
import com.${artifactId}.repositories.dB.repo.${UCC(table.name)}Repository;`;
    return service;
  };

  // -------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------

  const getServiceClass = (table) => {
    const service = `@Service
public class ${UCC(table.name)}Service {

  @Autowired
  private ${UCC(table.name)}Repository ${CC(table.name)}Repository;
`;
    return service;
  };

  //      _______. _______ .______     ____    ____  __    ______  _______     _______.
  //     /       ||   ____||   _  \    \   \  /   / |  |  /      ||   ____|   /       |
  //    |   (----`|  |__   |  |_)  |    \   \/   /  |  | |  ,----'|  |__     |   (----`
  //     \   \    |   __|  |      /      \      /   |  | |  |     |   __|     \   \
  // .----)   |   |  |____ |  |\  \----.  \    /    |  | |  `----.|  |____.----)   |
  // |_______/    |_______|| _| `._____|   \__/     |__|  \______||_______|_______/

  // -------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------

  const getListAllService = (tableName) => {
    const list = `    public List<${UCC(tableName)}ListDTO> get${UCC(
      tableName
    )}() {
        ModelMapper modelMapper = new ModelMapper();
        List<${UCC(tableName)}Entity> ${CC(tableName)}List = ${CC(
      tableName
    )}Repository.findAll();

        return ${CC(tableName)}List.stream()
                .map(${CC(tableName)} -> modelMapper.map(${CC(
      tableName
    )}, ${UCC(tableName)}ListDTO.class))
                .collect(Collectors.toList());
        }`;
    return list;
  };

  // -------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------

  const getAddService = (tableName) => {
    const repositoryInstance = `${CC(tableName)}Repository`;
    const serviceName = `add${UCC(tableName)}`;
    const input = `${UCC(tableName)}Entity ${CC(tableName)}Entity`;
    const inputInstance = `${CC(tableName)}Entity`;
    const inputClass = `${UCC(tableName)}Entity`;
    const errorMoreThanOne = `"${UCC(tableName)} already exists"`;

    const add = `  public JSONObject ${serviceName}(${input}) {
    try {
      JSONObject jsonResponse = new JSONObject();

      List<${inputClass}> filteredList = ${repositoryInstance}
      .findAll(Filter.buildSpecification(${inputInstance}));

      if ( filteredList.size() > 0) {

        throw new IllegalStateException(${errorMoreThanOne});
      
      }

      ${repositoryInstance}.save(${inputInstance});
      
      jsonResponse.put("mensaje", "${inputInstance} added successfully");
      return jsonResponse;
    
    } catch (Exception e) {
      String mensajeError = "Error adding ${UCC(tableName)}: " + e.getMessage();
      JSONObject jsonError = new JSONObject();
      jsonError.put("error", mensajeError);
      return jsonError;
    }
  }`;
    return add;
  };

  // -------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------

  const getEditService = (tableName, pk) => {
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

  // -------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------

  const getDeleteService = (tableName) => {
    const input = `${UCC(tableName)}DeleteDTO ${CC(tableName)}DeleteDTO`;
    const inputInstance = `${CC(tableName)}DeleteDTO`;
    const serviceName = `delete${UCC(tableName)}`;
    const repositoryInstance = `${CC(tableName)}Repository`;
    const successMsg = `"${UCC(tableName)} deleted successfully"`;

    const errorMsg = `"No se eliminó ${UCC(tableName)}" `;
    const errorNotFound = `"${UCC(tableName)} not found"`;
    const errorMoreThanOne = `filteredList.size() +" ${UCC(tableName)} found"`;
    const catchErrorMsg = `"Error deleting ${UCC(
      tableName
    )}: " + e.getMessage()`;

    const del = `    public JSONObject ${serviceName}(${input}) {
      try {

        List<${UCC(tableName)}Entity> filteredList = ${repositoryInstance}
            .findAll(Filter.buildSpecification(${inputInstance}));

        if (filteredList.isEmpty()) {
          throw new IllegalStateException(${errorNotFound});
        } else if (filteredList.size() > 1) {
          throw new IllegalStateException(${errorMoreThanOne});
        }

        ${UCC(tableName)}Entity entityToDelete = filteredList.get(0);
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

  // -------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------

  const getFindByService = (selectedAttributes, table) => {
    const inputs = selectedAttributes
      .map((attr) => `${sqlVarToJavaVar(attr.type)} ${CC(attr.name)}`)
      .join(", ");

    const attrsList = selectedAttributes
      .map((attr) => UCC(attr.name))
      .join("And");

    const outputs = selectedAttributes.map((attr) => CC(attr.name)).join(", ");

    const service = ` public List<${UCC(table?.name)}Entity> ${CC(
      table?.name
    )}FilterBy${attrsList} (${inputs}){
      return ${CC(table?.name)}Repository.findBy${attrsList}(${outputs});
  }`;

    return service;
  };

  // -------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------

  const getFilterService = (table) => {
    const input = `${UCC(table?.name)}FilterDTO ${CC(table?.name)}FilterDTO`;
    const inputInstance = `${CC(table?.name)}FilterDTO`;
    const output = `List<${UCC(table?.name)}Entity>`;
    const serviceName = `${CC(table?.name)}Filter`;
    const repository = `${CC(table?.name)}Repository`;

    const service = `    public ${output} ${serviceName}(${input}) {
      ${output} filteredList = ${repository}
          .findAll(Filter.buildSpecification(${inputInstance}));
    
      return filteredList;
    }
`;

    return service;
  };

  // -------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------

  const getLikeFilterService = (table) => {
    const service = `public List<${UCC(table?.name)}Entity> ${CC(
      table?.name
    )}Filter(${UCC(table?.name)}FilterDTO ${CC(table?.name)}FilterDTO) {
          Specification<${UCC(
            table?.name
          )}Entity> specification = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
    
            for (Field field : ${CC(
              table?.name
            )}FilterDTO.getClass().getDeclaredFields()) {
                field.setAccessible(true);
                try {
                    Object value = field.get(${CC(table?.name)}FilterDTO);
                    if (value != null && !value.equals(getDefaultValueForType(field.getType()))) {
                        if (field.getType() == String.class) {
                            predicates.add(criteriaBuilder.like(
                                    criteriaBuilder.lower(root.get(field.getName())),
                                    "%" + value.toString().toLowerCase() + "%"
                            ));
                        } else {
                            predicates.add(criteriaBuilder.equal(root.get(field.getName()), value));
                        }
                    }
                } catch (IllegalAccessException e) {
                    e.printStackTrace();
                }
            }
    
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    
        return ${CC(table?.name)}Repository.findAll(specification);
    }
    
    private Object getDefaultValueForType(Class<?> type) {
      if (type.isPrimitive()) {
          if (type == int.class) {
              return 0;
          } else if (type == char.class) {
              return '\u0000';
          } else if (type == boolean.class) {
              return false;
          } else if (type == byte.class) {
              return (byte) 0;
          } else if (type == short.class) {
              return (short) 0;
          } else if (type == long.class) {
              return 0L;
          } else if (type == float.class) {
              return 0.0f;
          } else if (type == double.class) {
              return 0.0d;
          }
      }
      return null;
    }`;
    return service;
  };

  return {
    addService,
    deleteService,
    addImport,
    deleteImport,
    setEmptyStructure,
    setCRUDFServices,
    // getServicesFileStructure,
    servicesList,
    files,
    //SERVICES
    getListAllService,
    getAddService,
    getEditService,
    getDeleteService,
    getFindByService,
    getFilterService,
  };
};

export default useService;
