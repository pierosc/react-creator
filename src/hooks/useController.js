import { useState } from "react";
import { CC, UCC, removeString, sqlVarToJavaVar } from "../StringFunctions";

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

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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

  const getListController = (table) => {
    return `   @CrossOrigin
    @GetMapping("/getAll${UCC(table.name)}")
        public List<${UCC(table.name)}ListDTO> getAll${UCC(table.name)}() {
          return ${CC(table.name)}Service.get${UCC(table.name)}();
        }`;
  };

  const getAddController = (table) => {
    const addURL = Object.keys(table).includes("transactional")
      ? `/add${UCC(table.name)}To${UCC(table.transactional.name)}`
      : `/add${UCC(table.name)}`;

    return `    @CrossOrigin
    @PostMapping("${addURL}")
    public String create${UCC(table.name)}(@RequestBody ${UCC(
      table.name
    )}AddDTO ${CC(table.name)}) {

      List<String> emptyFields = ServiceUtils.validateEmptyNonNullFields(${CC(
        table.name
      )});
      if (!emptyFields.isEmpty()) {
        System.out.println("Campos vacíos: " + emptyFields);
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
            Response.Error("Empty fields", emptyFields));
      }

      return ${CC(table.name)}Service.add${UCC(table.name)}(${CC(
      table.name
    )}).toString();
    }`;
  };

  const getEditController = (table) => {
    return `   @CrossOrigin
    @PutMapping("/edit${UCC(table.name)}")
        public String edit${UCC(table.name)}(@RequestBody ${UCC(
      table.name
    )}EditDTO ${CC(table.name)}EditDTO) {
          return ${CC(table.name)}Service.edit${UCC(table.name)}(${CC(
      table.name
    )}EditDTO).toString();
        }`;
  };

  const getDeleteController = (table) => {
    const url = `/delete${UCC(table.name)}`;
    const controllerName = `delete${UCC(table.name)}`;
    const input = `@RequestBody ${UCC(table.name)}DeleteDTO ${CC(
      table.name
    )}DeleteDTO`;
    const inputInstance = `${CC(table.name)}DeleteDTO`;
    const serviceInstance = `${CC(table.name)}Service`;
    const deleteService = `delete${UCC(table.name)}`;

    return `   @CrossOrigin
  @DeleteMapping("${url}")
  public String ${controllerName} (${input}) {
    return ${serviceInstance}.${deleteService}(${inputInstance}).toString();
  }`;
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
    const url = `/${CC(table.name)}Filter`;

    return `    @CrossOrigin
    @PostMapping("${url}")
        public List<${UCC(table.name)}ListDTO> ${CC(
      table.name
    )}Filter(@RequestBody ${UCC(table?.name)}FilterDTO ${CC(
      table?.name
    )}FilterDTO) {
          return ${CC(table.name)}Service.${CC(table.name)}Filter(${CC(
      table?.name
    )}FilterDTO);
    }`;
  };

  return {
    addController,
    deleteController,
    addImport,
    deleteImport,
    setEmptyStructure,
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
  };
};
