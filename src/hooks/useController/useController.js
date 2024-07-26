import { useState } from "react";
import { CC, UCC, removeString, sqlVarToJavaVar } from "../../StringFunctions";
import {
  getAddTemplate,
  getDeleteController2,
  getDeleteTemplate,
  getEditTemplate,
  getFilterExcelTemplate,
  getFilterTemplate,
  getListTemplate,
} from "./deleteController";

export const useController = (tableStructue, metaData) => {
  const [controllersList, setControllersList] = useState([]); //TODOS LOS SERVICIOS
  //   const [controllerImports, setServiceImports] = useState("");

  const addController = (table, newController) => {
    setControllersList((prevControllersList) => {
      const newControllersList = { ...prevControllersList };
      const newControllers = [
        newController,
        ...newControllersList[table?.name]["controllers"],
      ];
      newControllersList[table?.name]["controllers"] = newControllers;
      return newControllersList;
    });
  };

  const deleteController = (table, controller) => {
    setControllersList((prevControllersList) => {
      const newControllersList = { ...prevControllersList };
      const newControllers = [
        ...newControllersList[table?.name]["controllers"].filter(
          (serv) => serv !== controller
        ),
      ];
      newControllersList[table?.name]["controllers"] = newControllers;
      return newControllersList;
    });
  };

  const addImport = (table, controllerImport) => {
    setControllersList((prevServiceImports) => {
      const newServiceImports = { ...prevServiceImports };
      const newImports =
        newServiceImports[table?.name]["imports"] +
        `
  ${controllerImport}`;

      newServiceImports[table?.name]["imports"] = newImports;
      return newServiceImports;
    });
  };

  const deleteImport = (table, controllerImport) => {
    setControllersList((prevServiceImports) => {
      const newServiceImports = { ...prevServiceImports };
      const newImports = removeString(
        newServiceImports[table?.name]["imports"],
        controllerImport
      );
      //         newServiceImports[table?.name]["imports"] +
      // `
      //   ${controllerImport}`;

      newServiceImports[table?.name]["imports"] = newImports;
      return newServiceImports;
    });
  };
  const setEmptyStructure = () => {
    let controllers = {};
    tableStructue.forEach((table) => {
      //   const imports = getServiceImports(table);
      controllers[table.name] = {};
      controllers[table.name]["imports"] = getControllerImports(table);
      controllers[table.name]["classStart"] = getControllerClass(table);
      controllers[table.name]["controllers"] = [];
      controllers[table.name]["classEnd"] = "}";
    });
    setControllersList(controllers);
  };
  const getEmptyStructure = (tableStructue) => {
    let controllers = {};
    tableStructue.forEach((table) => {
      //   const imports = getServiceImports(table);
      controllers[table.name] = {};
      controllers[table.name]["imports"] = getControllerImports(table);
      controllers[table.name]["classStart"] = getControllerClass(table);
      controllers[table.name]["controllers"] = [];
      controllers[table.name]["classEnd"] = "}";
    });
    // setControllersList(controllers);
    return controllers;
  };

  const files = () => {
    let controllersFiles = [];
    Object.keys(controllersList).forEach((controllerName) => {
      const controller = controllersList[controllerName];
      const imports = controller.imports;
      const classStart = controller.classStart;
      const classEnd = controller.classEnd;
      const controllers = controller.controllers.join(`
  `);
      const file =
        imports +
        `
  ` +
        classStart +
        `
  ` +
        controllers +
        `
  ` +
        classEnd;

      controllersFiles.push({
        type: "file",
        name: `${UCC(controllerName)}Controller.java`,
        content: file,
      });
    });
    return controllersFiles;
  };

  const getControllerImports = (table) => {
    const controller = `package ${metaData.packageName}.controllers;
        
import java.util.List;

import java.io.ByteArrayOutputStream;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import ${metaData.packageName}.utils.Response;
import ${metaData.packageName}.utils.ExcelUtils;
import ${metaData.packageName}.utils.ServiceUtils;
import ${metaData.packageName}.business.domain.${UCC(table.name)}.${UCC(
      table.name
    )}FilterDTO;
import ${metaData.packageName}.business.services.${UCC(table.name)}Service;
import ${metaData.packageName}.repositories.dB.entities.${UCC(
      table.name
    )}Entity;`;
    return controller;
  };

  const getControllerClass = (table) => {
    const controller = `@RestController
@RequestMapping("/${CC(table.name)}")
public class ${UCC(table.name)}Controller {
    @Autowired
    private ${UCC(table.name)}Service ${CC(table.name)}Service;
`;
    return controller;
  };
  // ____ ____ _  _ ___ ____ ____ _    _    ____ ____ ____
  // |    |  | |\ |  |  |__/ |  | |    |    |___ |__/ [__
  // |___ |__| | \|  |  |  \ |__| |___ |___ |___ |  \ ___]

  const controllerConfiguration = (table) => {
    return {
      delete: {
        url: `/delete${UCC(table.name)}`,
        name: `delete${UCC(table.name)}`,
        input: {
          class: `${UCC(table.name)}DeleteDTO`,
          instance: `${CC(table.name)}DeleteDTO`,
          all: `@RequestBody ${UCC(table.name)}DeleteDTO ${CC(
            table.name
          )}DeleteDTO`,
        },
        output: {
          service: {
            class: `${UCC(table.name)}Service`,
            instance: `${CC(table.name)}Service`,
            method: `delete${UCC(table.name)}`,
          },
        },
      },
      edit: {
        url: `/edit${UCC(table.name)}`,
        name: `edit${UCC(table.name)}`,
        input: {
          class: `${UCC(table.name)}EditDTO`,
          instance: `${CC(table.name)}EditDTO`,
          all: `@RequestBody ${UCC(table.name)}EditDTO ${CC(
            table.name
          )}EditDTO`,
        },
        output: {
          service: {
            class: `${UCC(table.name)}Service`,
            instance: `${CC(table.name)}Service`,
            method: `edit${UCC(table.name)}`,
          },
        },
      },
      list: {
        url: `/getAll${UCC(table.name)}`,
        name: `getAll${UCC(table.name)}`,
        output: {
          service: {
            class: `${UCC(table.name)}Service`,
            instance: `${CC(table.name)}Service`,
            method: `get${UCC(table.name)}`,
          },
          type: `List<${UCC(table.name)}ListDTO>`,
        },
      },
      filter: {
        url: `/${CC(table.name)}Filter`,
        name: `${CC(table.name)}Filter`,
        input: {
          class: `${UCC(table.name)}FilterDTO`,
          instance: `${CC(table.name)}FilterDTO`,
          all: `@RequestBody ${UCC(table.name)}FilterDTO ${CC(
            table.name
          )}FilterDTO`,
        },
        output: {
          service: {
            class: `${UCC(table.name)}Service`,
            instance: `${CC(table.name)}Service`,
            method: `${CC(table.name)}Filter`,
          },
          type: `List<${UCC(table.name)}ListDTO>`,
        },
      },
      filterExcel: {
        url: `/${CC(table.name)}FilterExcel`,
        name: `${CC(table.name)}FilterExcel`,
        fileName: `${UCC(table.name)}Excel`,
        input: {
          class: `${UCC(table.name)}FilterDTO`,
          instance: `${CC(table.name)}FilterDTO`,
          all: `@RequestBody ${UCC(table.name)}FilterDTO ${CC(
            table.name
          )}FilterDTO`,
        },
        output: {
          service: {
            class: `${UCC(table.name)}Service`,
            instance: `${CC(table.name)}Service`,
            method: `${CC(table.name)}FilterExcel`,
          },
        },
      },
      add: {
        url: Object.keys(table).includes("transactional")
          ? `/add${UCC(table.name)}To${UCC(table.transactional.name)}`
          : `/add${UCC(table.name)}`,
        name: `create${UCC(table.name)}`,
        input: {
          class: `${UCC(table.name)}AddDTO`,
          instance: `${CC(table.name)}AddDTO`,
          all: `@RequestBody ${UCC(table.name)}AddDTO ${CC(table.name)}AddDTO`,
        },
        output: {
          service: {
            class: `${UCC(table.name)}Service`,
            instance: `${CC(table.name)}Service`,
            method: `add${UCC(table.name)}`,
          },
        },
      },
    };
  };

  const getListController = (table) => {
    const controller = controllerConfiguration(table).list;
    return getListTemplate(controller);
  };

  const getAddController = (table) => {
    const controller = controllerConfiguration(table).add;
    return getAddTemplate(controller);
  };

  const getEditController = (table) => {
    const controller = controllerConfiguration(table).edit;
    return getEditTemplate(controller);
  };

  const getDeleteController = (table) => {
    const controller = controllerConfiguration(table).delete;
    return getDeleteTemplate(controller);
  };

  //NEW CONTROLLERS

  const getFindByController = (selectedAttributes, table) => {
    const attrsList = selectedAttributes
      .map((attr) => UCC(attr.name))
      .join("And");

    const DTOName =
      selectedAttributes.map((attr) => CC(attr.name)).join("And") + "IDTO";
    const outputs = selectedAttributes
      .map((attr) => `${DTOName}.get${UCC(attr.name)}()`)
      .join(", ");
    const controller = `    @CrossOrigin
    @PostMapping("/${CC(table?.name)}FilterBy${attrsList}")
        public List<${UCC(table?.name)}Entity> ${CC(
      table?.name
    )}FilterBy${attrsList}(@RequestBody ${attrsList}IDTO ${DTOName} ){
            return ${CC(table?.name)}Service.${CC(
      table?.name
    )}FilterBy${attrsList}(${outputs});
        }`;

    return controller;
  };

  const getFilterController = (table) => {
    const controller = controllerConfiguration(table).filter;
    return getFilterTemplate(controller);
  };

  const getFilterExcelController = (table) => {
    const controller = controllerConfiguration(table).filterExcel;
    return getFilterExcelTemplate(controller);
  };

  return {
    addController,
    deleteController,
    addImport,
    deleteImport,
    setEmptyStructure,
    getEmptyStructure,
    // setCRUDFControllers,
    controllersList,
    files,
    //CONTROLLERS
    getListController,
    getAddController,
    getEditController,
    getDeleteController,
    getFindByController,
    getFilterController,
    getFilterExcelController,
  };
};
