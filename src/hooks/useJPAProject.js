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

  const createListEndpoint = (project, table) => {
    console.log(project);
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

    services.addService(project, table, newService);
    services.addImport(project, table, newServiceImport);
    // controllers.addController(table, newController);
    // controllers.addImport(table, newControllerImport);
    // DTO.addOutputDTO(table, newOutputDTO);
  };

  // -------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------

  const createAddEndpoint = (project, table) => {
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
      if (uniqueAttr !== undefined) {
        inputAttributes = [
          ...inputAttributes.filter(
            (attr) => attr.name !== table.transactional.linkAttr
          ),
          uniqueAttr,
        ];
      } else {
        console.warn("No unique attribute on transactional table");
        inputAttributes = inputAttributes.filter(
          (attr) => attr.name !== table.transactional.linkAttr
        );
      }
    }

    // console.log("|||||||||||||||||||||||||||||||||||||||");
    // console.log(isTransactional);
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

    services.addService(project, table, newService);
    services.addImport(project, table, newInputDTOImport);
    // controllers.addController(table, newController);
    // controllers.addImport(table, newInputDTOImport);
    // DTO.addInputDTO(table, newInputDTO);
  };

  // -------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------

  const createEditEndpoint = (project, table) => {
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

    services.addService(project, table, newService);
    services.addImport(project, table, newInputDTOImport);
    // controllers.addController(table, newController);
    // controllers.addImport(table, newInputDTOImport);
    // DTO.addInputDTO(table, newInputDTO);
  };

  // -------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------

  const createDeleteEndpoint = (project, table) => {
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
    services.addService(project, table, newService);
    services.addImport(project, table, newServiceImport);
    // controllers.addController(table, newController);
    // controllers.addImport(table, newControllerImport);
    // DTO.addInputDTO(table, newInputDTO);
  };

  // -------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------

  const createFindByEndpoint = (project, attributes, table) => {
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

    services.addService(project, table, newService);
    // repositories.addRepository(table, newRepo);
    // controllers.addController(table, newController);
    // controllers.addImport(table, newControllerImport);

    // DTO.addInputDTO(table, newIDTO);
  };

  // -------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------

  const setEmptyFiles = () => {};
  // -------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------

  const createFilterEndpoint = (project, table) => {
    const newService = services.getFilterService(table);
    const newController = controllers.getFilterController(table);
    const newRepository = repositories.getFilterRepository(table);
    const newInputDTO = DTO.getDTO(
      table.attributes,
      table,
      UCC(table.name) + "FilterDTO"
    );
    services.addService(project, table, newService);
    // controllers.addController(table, newController);
    // repositories.addRepository(table, newRepository);
    // DTO.addInputDTO(table, newInputDTO);
  };

  const createFilterExcelEndpoint = (project, table) => {
    const newService = services.getFilterExcelService(table);
    const newController = controllers.getFilterExcelController(table);
    // const newRepository = repositories.getFilterRepository(table);
    // const newInputDTO = DTO.getDTO(
    //   table.attributes,
    //   table,
    //   UCC(table.name) + "FilterDTO"
    // );
    services.addService(project, table, newService);
    // controllers.addController(table, newController);
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
