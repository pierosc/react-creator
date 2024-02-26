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
      // const pkName = UCC(table.attributes.find((attr) => attr.pk).name);
      const createService = getAddService(table);
      //   const readService = getListAllService(table.name);
      const updateService = getEditService(table.name);
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
    const attributesRepositoriesImports = table.attributes.map((attr) =>
      !attr.pk
        ? attr.relations.map((rel) => {
            const relRepository = `${UCC(rel.destinyTable)}Repository`;
            const relEntity = `${UCC(rel.destinyTable)}Entity`;
            const imports = `import com.${artifactId}.repositories.dB.repo.${relRepository};
import com.${artifactId}.repositories.dB.entities.${relEntity};`;
            console.log(imports);
            return imports;
          })
        : []
    );
    let AttrRepImp = Array.from(
      new Set(attributesRepositoriesImports.map(JSON.stringify)),
      JSON.parse
    ).join(`
`);

    // console.log(attributesRepositoriesImports);
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
import com.${artifactId}.repositories.dB.repo.${UCC(
      table.name
    )}Repository;${AttrRepImp}
`;
    return service;
  };

  // -------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------

  const getServiceClass = (table) => {
    const attributesRepositories = table.attributes.map((attr) =>
      !attr.pk
        ? attr.relations.map((rel) => {
            const relRepository = `${UCC(rel.destinyTable)}Repository`;
            const relRepositoryInstance = `${CC(rel.destinyTable)}Repository`;

            return `  @Autowired
  private ${relRepository} ${relRepositoryInstance};`;
          })
        : []
    );

    let uniqueAttrRep = Array.from(
      new Set(attributesRepositories.map(JSON.stringify)),
      JSON.parse
    ).join(`
`);
    // console.log(attributesRepositories);
    // console.log(uniqueAttrRep);

    const service = `@Service
public class ${UCC(table.name)}Service {

  @Autowired
  private ${UCC(table.name)}Repository ${CC(table.name)}Repository;
  ${uniqueAttrRep}
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
