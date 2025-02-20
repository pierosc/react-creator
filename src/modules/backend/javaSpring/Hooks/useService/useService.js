import { useState } from "react";
import {
  CC,
  UCC,
  UniqueArray,
  JoinNewLine,
  removeString,
  sqlVarToJavaVar,
} from "../../../../../StringFunctions";
// SERVICES
import { getDeleteService } from "./services/deleteService";
import { getAddService } from "./services/addService";
import { getEditService } from "./services/editService";
import { getFilterService } from "./services/filterService";
import { getFilterExcelService } from "./services/filterExcelService";

import useDependencyInjection from "./useDependencyInjection";
// import SpringContext from "../../Context/SpringProvider";

const useService = (springProject) => {
  // const { springProject } = useContext(SpringContext);
  const [servicesList, setServicesList] = useState([]); //TODOS LOS SERVICIOS
  const depInjection = useDependencyInjection(false); // true use Autowired fields, false use Constructor Injection

  const addService = (projectName, table, newService) => {
    const attrFromProject = "service";
    const attrFromTable = "services";

    springProject.addElementToTable(
      projectName,
      attrFromProject,
      table,
      attrFromTable,
      newService
    );
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

  const addImport = (projectName, table, newServiceImport) => {
    const attrFromProject = "service";
    const attrFromTable = "imports";

    springProject.addElementToTable(
      projectName,
      attrFromProject,
      table,
      attrFromTable,
      newServiceImport
    );
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

  const getEmptyStructure = (tableStructue, metaData) => {
    let services = {};
    tableStructue.forEach((table) => {
      services[table.name] = {};
      services[table.name]["imports"] = getServiceImports(table, metaData);
      services[table.name]["classStart"] = getServiceClass(table);
      services[table.name]["services"] = [];
      services[table.name]["classEnd"] = "}";
    });
    return services;
    // setServicesList(services);
  };

  const files = () => {
    const servicesList2 = springProject.selected.service;

    let servicesFiles = [];
    Object.keys(servicesList2).forEach((serviceName) => {
      const service = servicesList2[serviceName];
      const imports = JoinNewLine(service.imports);
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

  const getServiceImports = (table, metaData) => {
    const isTransactional = Object.keys(table).includes("transactional");

    let attributesRepositoriesImports = UniqueArray(
      table.attributes.map((attr) =>
        !attr.pk
          ? attr.relations.map((rel) => {
              const relRepository = `${UCC(rel.destinyTable)}Repository`;
              // const relEntity = `${UCC(rel.destinyTable)}Entity`;
              const destinyTable = `${UCC(rel.destinyTable)}`;
              const imports =
                rel.relation !== "OneToMany"
                  ? `import ${metaData.packageName}.repositories.${relRepository};
import ${metaData.packageName}.dtos.responses.${destinyTable}.${destinyTable}ListDTO;`
                  : ``;
              return imports;
            })
          : []
      )
    );

    if (isTransactional) {
      const transactionalRepo = `import ${
        metaData.packageName
      }.repositories.${UCC(table.transactional.name)}Repository;`;

      attributesRepositoriesImports = [
        ...attributesRepositoriesImports,
        transactionalRepo,
      ];
    }

    const service = [
      `package ${metaData.packageName}.services;`,
      `import java.util.ArrayList;`,
      `import java.util.List;`,
      `import java.util.Optional;`,
      `import java.sql.Timestamp;`,
      `import java.util.stream.Collectors;`,
      `import ${metaData.packageName}.audit.Auditable;`,
      `import org.springframework.http.HttpStatus;`,
      `import org.springframework.web.server.ResponseStatusException;`,
      `import org.json.JSONObject;`,
      `import org.json.JSONArray;`,
      `import org.modelmapper.ModelMapper;`,
      `import org.springframework.beans.factory.annotation.Autowired;`,
      `import org.springframework.stereotype.Service;`,
      `import java.lang.IllegalStateException;`,
      `import java.io.ByteArrayOutputStream;`,
      `import jakarta.transaction.Transactional;`,
      `import ${metaData.packageName}.utils.Converter;`,
      `import ${metaData.packageName}.utils.ExcelUtils;`,
      `import ${metaData.packageName}.utils.Filter;`,
      `import ${metaData.packageName}.utils.Response;`,
      `import ${metaData.packageName}.services.interfaces.I${UCC(table.name)}Service;`,
      `import ${metaData.packageName}.dtos.requests.${UCC(table.name)}.${UCC(
        table.name
      )}FilterDTO;`,
      `import ${metaData.packageName}.validators.${UCC(table.name)}Validator;`,
      `import ${metaData.packageName}.entities.${UCC(table.name)}Entity;`,
      `import ${metaData.packageName}.repositories.${UCC(
        table.name
      )}Repository;`,
      ...attributesRepositoriesImports,
    ];

    return service;
  };

  // *************************************************************************
  // ASIGNAR ANOTACIONES, NOMBRE DE SERVICIO Y REPOSITORIOS
  // Descripción:
  // *************************************************************************

  const getServiceClass = (table) => {
    const service = `@Service
public class ${UCC(table.name)}Service implements I${UCC(table.name)}Service {
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
    // const entityListName = `${CC(tableName)}List`;
    // const entityInstance = `${CC(tableName)}Entity`;

    const list = `    
  @Override
  public List<${output}> ${serviceName}() {
      
    List<${entityClass}> entities = ${repositoryInstance}.findAll();
    return entities.stream()
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
    // setEmptyStructure,
    getEmptyStructure,
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
