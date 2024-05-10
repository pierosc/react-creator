import { useState } from "react";
import {
  CC,
  UCC,
  UniqueArray,
  JoinNewLine,
  removeString,
  sqlVarToJavaVar,
} from "../../StringFunctions";
import { getDeleteService } from "./deleteService";
import { getAddService } from "./addService";
import { getEditService } from "./editService";
import { getFilterService } from "./filterService";
import useDependencyInjection from "./useDependencyInjection";
import { getFilterExcelService } from "./filterExcelService";

const useService = (tableStructue, metaData) => {
  const [servicesList, setServicesList] = useState([]); //TODOS LOS SERVICIOS
  const depInjection = useDependencyInjection(false); // true use Autowired fields, false use Constructor Injection
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

      newServiceImports[table?.name]["imports"] = newImports;
      return newServiceImports;
    });
  };

  //   const addRepo = (table, repo) => {
  //     setServicesList((prevRepos) => {
  //       const newServiceRepos = { ...prevRepos };
  //       const newRepos =
  //         newServiceRepos[table?.name]["classStart"] +
  //         `
  // ${repo}`;

  //       newServiceRepos[table?.name]["classStart"] = newRepos;
  //       return newServiceRepos;
  //     });
  //   };

  // -------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------

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

  const files = () => {
    let servicesFiles = [];
    Object.keys(servicesList).forEach((serviceName) => {
      const service = servicesList[serviceName];
      const imports = service.imports;
      const classStart = service.classStart;
      const classEnd = service.classEnd;
      const services = JoinNewLine(service.services);

      const file = JoinNewLine([imports, classStart, services, classEnd]);

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
    const isTransactional = Object.keys(table).includes("transactional");

    let attributesRepositoriesImports = UniqueArray(
      table.attributes.map((attr) =>
        !attr.pk
          ? attr.relations.map((rel) => {
              const relRepository = `${UCC(rel.destinyTable)}Repository`;
              const relEntity = `${UCC(rel.destinyTable)}Entity`;
              const destinyTable = `${UCC(rel.destinyTable)}`;
              const imports =
                rel.relation !== "OneToMany"
                  ? `import ${metaData.packageName}.repositories.dB.repo.${relRepository};
import ${metaData.packageName}.controllers.responses.${destinyTable}.${destinyTable}ListDTO;`
                  : ``;
              return imports;
            })
          : []
      )
    );

    if (isTransactional) {
      const transactionalRepo = `import ${
        metaData.packageName
      }.repositories.dB.repo.${UCC(table.transactional.name)}Repository;`;
      attributesRepositoriesImports = [
        ...attributesRepositoriesImports,
        transactionalRepo,
      ];
    }

    const service = `package ${metaData.packageName}.business.services;
  
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.sql.Timestamp;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import org.json.JSONObject;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.lang.IllegalStateException;
import ${metaData.packageName}.utils.Filter;
import ${metaData.packageName}.utils.Response;
import ${metaData.packageName}.business.domain.${UCC(table.name)}.${UCC(
      table.name
    )}FilterDTO;
import ${metaData.packageName}.repositories.dB.entities.${UCC(
      table.name
    )}Entity;
import ${metaData.packageName}.repositories.dB.repo.${UCC(
      table.name
    )}Repository;${JoinNewLine(attributesRepositoriesImports)}
`;
    return service;
  };

  // *************************************************************************
  // ASIGNAR ANOTACIONES, NOMBRE DE SERVICIO Y REPOSITORIOS
  // Descripción:
  // *************************************************************************

  const getServiceClass = (table) => {
    const service = `@Service
public class ${UCC(table.name)}Service {
 ${depInjection.getDependencyInjection(table)}
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
    const serviceName = `get${UCC(tableName)}`;
    const output = `${UCC(tableName)}ListDTO`;
    const repositoryInstance = `${CC(tableName)}Repository`;
    const entityClass = `${UCC(tableName)}Entity`;
    const entityListName = `${CC(tableName)}List`;
    // const entityInstance = `${CC(tableName)}Entity`;

    const list = `    public List<${output}> ${serviceName}() {
        ModelMapper modelMapper = new ModelMapper();
        List<${entityClass}> ${entityListName} = ${repositoryInstance}.findAll();

        return ${entityListName}.stream()
                .map(entity -> modelMapper.map(entity, ${output}.class))
                .collect(Collectors.toList());
    }`;
    return list;
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

  //   const getFilterService = (table) => {
  //     const input = `${UCC(table?.name)}FilterDTO ${CC(table?.name)}FilterDTO`;
  //     const inputInstance = `${CC(table?.name)}FilterDTO`;
  //     const output = `List<${UCC(table?.name)}Entity>`;
  //     const serviceName = `${CC(table?.name)}Filter`;
  //     const repository = `${CC(table?.name)}Repository`;

  //     const service = `    public ${output} ${serviceName}(${input}) {
  //       ${output} filteredList = ${repository}
  //           .findAll(Filter.buildSpecification(${inputInstance}));

  //       return filteredList;
  //     }
  // `;

  //     return service;
  //   };

  // -------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------

  return {
    addService,
    deleteService,
    addImport,
    deleteImport,
    setEmptyStructure,
    // setCRUDFServices,
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
    getFilterExcelService,
  };
};

export default useService;
