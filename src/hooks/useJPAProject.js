import React from "react";
import { UCC } from "../StringFunctions";

export const useJPAProject = (
  repositories,
  services,
  controllers,
  DTO,
  metaData
) => {
  // -------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------

  const createListEndpoint = (table) => {
    const newService = services.getListAllService(table.name);
    const newServiceImport = `import ${
      metaData.packageName
    }.controllers.responses.${UCC(table.name)}.${UCC(table.name)}ListDTO;
`;
    const newController = controllers.getListController(table);
    const newControllerImport = `import ${
      metaData.packageName
    }.controllers.responses.${UCC(table.name)}.${UCC(table.name)}ListDTO;
`;
    const newOutputDTO = DTO.getDTO(
      table.attributes,
      table,
      UCC(table.name) + "ListDTO",
      "output",
      true
    );

    services.addService(table, newService);
    services.addImport(table, newServiceImport);
    controllers.addController(table, newController);
    controllers.addImport(table, newControllerImport);
    DTO.addOutputDTO(table, newOutputDTO);
  };

  // -------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------

  const createAddEndpoint = (table) => {
    const newService = services.getAddService(table);
    const newController = controllers.getAddController(table);
    const isTransactional = Object.keys(table).includes("transactional");

    // EXTRAEMOS LOS ATRIBUTOS

    let inputAttributes = table.attributes;

    // QUITAR ATRIBUTOS QUE SOLO SIRVAN COMO CONEXIÓN DE UNA RELACIÓN ONETOMANY

    inputAttributes = inputAttributes.filter((attr) => {
      return !(
        attr.relations.length === 1 &&
        attr.relations?.[0]?.relation === "OneToMany"
      );
    });

    // QUITAR LAS RELACIONES ONETOMANY DE LOS ATRIBUTOS

    inputAttributes = inputAttributes.map((attr) => {
      return {
        ...attr,

        relations: attr.relations.filter((rel) => rel.relation !== "OneToMany"),
      };
    });

    //AGREGAR ATRIBUTO UNICO DE TABLA A LA QUE SE AGREGARÁ ESTA ENTIDAD

    if (isTransactional) {
      const uniqueAttr = table.transactional.attributes.find(
        (attr) => attr.unique
      );
      // console.log(uniqueAttr);
      inputAttributes = [
        ...inputAttributes.filter(
          (attr) => attr.name !== table.transactional.linkAttr
        ),
        uniqueAttr,
      ];
    }

    // console.log(table.name);
    // console.log(inputAttributes);

    const newInputDTO = DTO.getDTO(
      inputAttributes,
      table,
      UCC(table.name) + "AddDTO",
      "input",
      true
    );
    const newInputDTOImport = `import ${
      metaData.packageName
    }.business.domain.${UCC(table.name)}.${UCC(table.name)}AddDTO;
`;

    services.addService(table, newService);
    services.addImport(table, newInputDTOImport);
    controllers.addController(table, newController);
    controllers.addImport(table, newInputDTOImport);
    DTO.addInputDTO(table, newInputDTO);
  };

  // -------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------

  const createEditEndpoint = (table) => {
    const newService = services.getEditService(table);

    const newController = controllers.getEditController(table);

    const isTransactional = Object.keys(table).includes("transactional");

    const inputAttributes = table.attributes.map((attr) => {
      return {
        ...attr,
        relations: attr.relations.filter((rel) => rel.relation !== "OneToMany"),
      };
    });

    const newInputDTO = DTO.getDTO(
      inputAttributes,
      table,
      UCC(table.name) + "EditDTO",
      "input",
      true
    );
    const newInputDTOImport = `import ${
      metaData.packageName
    }.business.domain.${UCC(table.name)}.${UCC(table.name)}EditDTO;
    `;

    services.addService(table, newService);
    services.addImport(table, newInputDTOImport);
    controllers.addController(table, newController);
    controllers.addImport(table, newInputDTOImport);
    DTO.addInputDTO(table, newInputDTO);
  };

  // -------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------

  const createDeleteEndpoint = (table) => {
    const newService = services.getDeleteService(table);
    const newServiceImport = `import ${
      metaData.packageName
    }.business.domain.${UCC(table.name)}.${UCC(table.name)}DeleteDTO;
`;
    const newController = controllers.getDeleteController(table);
    const newControllerImport = `import ${
      metaData.packageName
    }.business.domain.${UCC(table.name)}.${UCC(table.name)}DeleteDTO;
`;
    const uniqueAttr = table.attributes.find((attr) => attr.unique === true);
    // console.log(uniqueAttr);
    // console.log(uniqueAttr ? [uniqueAttr] : table.attributes);

    const newInputDTO = DTO.getDTO(
      uniqueAttr ? [uniqueAttr] : table.attributes,
      table,
      UCC(table.name) + "DeleteDTO",
      "input"
    );

    // console.log(newInputDTO);
    // console.log("------------------------");
    services.addService(table, newService);
    services.addImport(table, newServiceImport);
    controllers.addController(table, newController);
    controllers.addImport(table, newControllerImport);
    DTO.addInputDTO(table, newInputDTO);
  };

  // -------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------

  const createFindByEndpoint = (attributes, table) => {
    const newService = services.getFindByService(attributes, table);

    const newRepo = repositories.getfindByRepository(attributes, table);

    const newController = controllers.getFindByController(attributes, table);
    const newControllerImport = `import ${
      metaData.packageName
    }.business.domain.${UCC(table.name)}.${attributes
      .map((attr) => UCC(attr.name))
      .join("And")}IDTO;
    `;

    const newIDTOname =
      attributes.map((attr) => UCC(attr.name)).join("And") + "IDTO";

    const newIDTO = DTO.getDTO(attributes, table, newIDTOname);
    //checks if newServices already exists

    services.addService(table, newService);
    repositories.addRepository(table, newRepo);
    controllers.addController(table, newController);
    controllers.addImport(table, newControllerImport);

    DTO.addInputDTO(table, newIDTO);
  };

  // -------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------

  const setEmptyFiles = () => {};
  // -------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------

  const createFilterEndpoint = (table) => {
    const newService = services.getFilterService(table);
    const newController = controllers.getFilterController(table);
    const newRepository = repositories.getFilterRepository(table);
    const newInputDTO = DTO.getDTO(
      table.attributes,
      table,
      UCC(table.name) + "FilterDTO"
    );
    services.addService(table, newService);
    controllers.addController(table, newController);
    repositories.addRepository(table, newRepository);
    DTO.addInputDTO(table, newInputDTO);
  };

  const createFilterExcelEndpoint = (table) => {
    const newService = services.getFilterExcelService(table);
    const newController = controllers.getFilterExcelController(table);
    // const newRepository = repositories.getFilterRepository(table);
    // const newInputDTO = DTO.getDTO(
    //   table.attributes,
    //   table,
    //   UCC(table.name) + "FilterDTO"
    // );
    services.addService(table, newService);
    controllers.addController(table, newController);
    // repositories.addRepository(table, newRepository);
    // DTO.addInputDTO(table, newInputDTO);
  };

  return {
    createListEndpoint,
    createAddEndpoint,
    createEditEndpoint,
    createDeleteEndpoint,
    createFilterEndpoint,
    createFilterExcelEndpoint,
    createFindByEndpoint,
  };
};
