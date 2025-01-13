import { useContext } from "react";
import { CC, JoinNewLine, UCC } from "../../../../../StringFunctions";

import { getAddTemplate } from "./templates/addController";
import { getDeleteTemplate } from "./templates/deleteController";
import { getEditTemplate } from "./templates/editController";
import { getListTemplate } from "./templates/listController";
import { getFilterTemplate } from "./templates/filterController";
import { getFilterExcelTemplate } from "./templates/filterExcelController";

import SpringContext from "../../Context/SpringProvider";
import { getControllerImports } from "./templates/imports";
import { getControllerClass } from "./templates/class";

export const useController = (springProject) => {
  // const { springProject } = useContext(SpringContext);

  const addController = (projectName, table, newController) => {
    const attrFromProject = "controller";
    const attrFromTable = "controllers";

    springProject.addElementToTable(
      projectName,
      attrFromProject,
      table,
      attrFromTable,
      newController
    );
  };

  const addImport = (projectName, table, newControllerImport) => {
    const attrFromProject = "controller";
    const attrFromTable = "imports";

    springProject.addElementToTable(
      projectName,
      attrFromProject,
      table,
      attrFromTable,
      newControllerImport
    );
  };

  const getEmptyStructure = (tableStructue, metaData) => {
    let controllers = {};
    tableStructue.forEach((table) => {
      controllers[table.name] = {};
      controllers[table.name]["imports"] = getImports(table, metaData);
      controllers[table.name]["classStart"] = getClass(table);
      controllers[table.name]["controllers"] = [];
      controllers[table.name]["classEnd"] = "}";
    });
    return controllers;
  };

  const files = () => {
    const controllersList2 = springProject.selected.controller;

    let controllersFiles = [];
    Object.keys(controllersList2).forEach((controllerName) => {
      const controller = controllersList2[controllerName];
      const imports = JoinNewLine(controller.imports);
      const classStart = controller.classStart;
      const classEnd = controller.classEnd;
      const controllers = controller.controllers.join(`
  `);
      const file = JoinNewLine([imports, classStart, controllers, classEnd]);

      controllersFiles.push({
        type: "file",
        name: `${UCC(controllerName)}Controller.java`,
        content: file,
      });
    });
    return controllersFiles;
  };

  const getImports = (table, metaData) => {
    return getControllerImports(metaData, table);
  };

  const getClass = (table) => {
    return getControllerClass(table);
  };
  // ____ ____ _  _ ___ ____ ____ _    _    ____ ____ ____
  // |    |  | |\ |  |  |__/ |  | |    |    |___ |__/ [__
  // |___ |__| | \|  |  |  \ |__| |___ |___ |___ |  \ ___]

  const controllerConfiguration = (table) => {
    return {
      delete: {
        url: `/delete${UCC(table.name)}`,
        name: `delete${UCC(table.name)}`,
        resource: `${UCC(table.name)}`,
        input: {
          class: `${UCC(table.name)}DeleteDTO`,
          instance: `${CC(table.name)}DeleteDTO`,
          all: `@RequestBody ${UCC(table.name)}DeleteDTO dto`,
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
        resource: `${UCC(table.name)}`,
        input: {
          class: `${UCC(table.name)}EditDTO`,
          instance: `${CC(table.name)}EditDTO`,
          all: `@RequestBody ${UCC(table.name)}EditDTO dto`,
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
        resource: `${UCC(table.name)}`,
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
        // url: `/${CC(table.name)}Filter`,
        name: `${CC(table.name)}Filter`,
        resource: `${UCC(table.name)}`,
        input: {
          class: `${UCC(table.name)}FilterDTO`,
          instance: `${CC(table.name)}FilterDTO`,
          all: `@RequestBody ${UCC(table.name)}FilterDTO dto`,
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
        url: `/filterExcel`,
        name: `${CC(table.name)}FilterExcel`,
        fileName: `${UCC(table.name)}Excel`,
        resource: `${UCC(table.name)}`,
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
        resource: `${UCC(table.name)}`,
        input: {
          class: `${UCC(table.name)}AddDTO`,
          instance: `${CC(table.name)}AddDTO`,
          all: `@RequestBody ${UCC(table.name)}AddDTO dto`,
        },
        output: {
          service: {
            class: `${UCC(table.name)}Service`,
            instance: `${CC(table.name)}Service`,
            method: `add${UCC(table.name)}`,
          },
          msg: `${UCC(table.name)} added succesfully`,
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
    addImport,
    getEmptyStructure,
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
