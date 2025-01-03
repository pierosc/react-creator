import { useContext } from "react";
import { UCC } from "../../../../StringFunctions";
import SpringContext from "../Context/SpringProvider";

export const useJPAProject = (
  entities,
  repositories,
  services,
  interfaces,
  validators,
  controllers,
  DTO,
  springProject
) => {
  // const { springProject } = useContext(SpringContext);
  const metaData = springProject?.selected?.metaData ?? {};

  // CONTROLA ASPECTOS GENERALES DEL PROYECTO QUE UTILIZAN VARIAS CAPAS COMO ENTIDADES, REPOSITORIOS, ETC

  // -------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------

  const createEntities = (project, table) => {
    console.groupCollapsed(
      `%cCreating Entities for ${table.name}`,
      "background-color: blue; color: white;"
    );
    const tableEntities = entities.getEntity(table);
    console.log(tableEntities);
    console.groupEnd();
    tableEntities.forEach((newEntity) => {
      entities.addEntity(project, table, newEntity);
    });
  };

  // -------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------

  const createListEndpoint = (project, table) => {
    console.groupCollapsed(
      `%cCreating List Endpoint for ${table.name}`,
      "background-color: blue; color: white;"
    );
    console.log("Creating List All service");
    const newService = services.getListAllService(table.name);
    console.log("Creating List All Interface");
    const newInterface = interfaces.getListAllInterface(table);
    const newServiceImport = `import ${
      metaData.packageName
    }.dtos.responses.${UCC(table.name)}.${UCC(table.name)}ListDTO;
`;
    console.log("Creating List All Controller");
    const newController = controllers.getListController(table);
    const newControllerImport = `import ${
      metaData.packageName
    }.dtos.responses.${UCC(table.name)}.${UCC(table.name)}ListDTO;
`;
    console.log("Creating List All Response DTO");
    const newOutputDTO = DTO.getDTO(
      table.attributes,
      table,
      UCC(table.name) + "ListDTO",
      "output",
      true
    );
    console.groupEnd();
    services.addService(project, table, newService);
    interfaces.addInterface(project, table, newInterface);
    services.addImport(project, table, newServiceImport);
    controllers.addController(project, table, newController);
    controllers.addImport(project, table, newControllerImport);
    DTO.addOutputDTO(project, table, newOutputDTO);
  };

  // -------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------

  const createAddEndpoint = (project, table) => {
    const newService = services.getAddService(table);
    const newInterface = interfaces.getAddInterface(table);
    const newValidator = validators.getAddValidator(table);
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
    }.dtos.requests.${UCC(table.name)}.${UCC(table.name)}AddDTO;
`;

    services.addService(project, table, newService);
    interfaces.addInterface(project, table, newInterface);
    validators.addValidator(project, table, newValidator);
    services.addImport(project, table, newInputDTOImport);
    controllers.addController(project, table, newController);
    controllers.addImport(project, table, newInputDTOImport);
    DTO.addInputDTO(project, table, newInputDTO);
  };

  // -------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------

  const createEditEndpoint = (project, table) => {
    const newService = services.getEditService(table);
    const newInterface = interfaces.getEditInterface(table);
    const newValidator = validators.getEditValidator(table);
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
    }.dtos.requests.${UCC(table.name)}.${UCC(table.name)}EditDTO;
    `;

    services.addService(project, table, newService);
    interfaces.addInterface(project, table, newInterface);
    services.addImport(project, table, newInputDTOImport);
    validators.addValidator(project, table, newValidator);
    controllers.addController(project, table, newController);
    controllers.addImport(project, table, newInputDTOImport);
    DTO.addInputDTO(project, table, newInputDTO);
  };

  // -------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------

  const createDeleteEndpoint = (project, table) => {
    const newService = services.getDeleteService(table);
    const newInterface = interfaces.getDeleteInterface(table);
    const newServiceImport = `import ${
      metaData.packageName
    }.dtos.requests.${UCC(table.name)}.${UCC(table.name)}DeleteDTO;
`;
    const newController = controllers.getDeleteController(table);
    const newControllerImport = `import ${
      metaData.packageName
    }.dtos.requests.${UCC(table.name)}.${UCC(table.name)}DeleteDTO;
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
    interfaces.addInterface(project, table, newInterface);
    services.addImport(project, table, newServiceImport);
    controllers.addController(project, table, newController);
    controllers.addImport(project, table, newControllerImport);
    DTO.addInputDTO(project, table, newInputDTO);
  };

  // -------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------

  const createFindByEndpoint = (project, attributes, table) => {
    const newService = services.getFindByService(attributes, table);

    const newRepo = repositories.getfindByRepository(attributes, table);

    const newController = controllers.getFindByController(attributes, table);
    const newControllerImport = `import ${
      metaData.packageName
    }.dtos.requests.${UCC(table.name)}.${attributes
      .map((attr) => UCC(attr.name))
      .join("And")}IDTO;
    `;

    const newIDTOname =
      attributes.map((attr) => UCC(attr.name)).join("And") + "IDTO";

    const newIDTO = DTO.getDTO(attributes, table, newIDTOname);
    //checks if newServices already exists

    services.addService(project, table, newService);
    repositories.addRepository(project, table, newRepo);
    controllers.addController(project, table, newController);
    controllers.addImport(project, table, newControllerImport);

    DTO.addInputDTO(project, table, newIDTO);
  };

  // -------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------

  // const setEmptyFiles = () => {};
  // -------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------

  const createFilterEndpoint = (project, table) => {
    const newService = services.getFilterService(table);
    const newInterface = interfaces.getFilterInterface(table);
    const newController = controllers.getFilterController(table);
    const newRepository = repositories.getFilterRepository(table);
    console.log(newRepository);
    const newInputDTO = DTO.getDTO(
      table.attributes,
      table,
      UCC(table.name) + "FilterDTO"
    );
    services.addService(project, table, newService);
    interfaces.addInterface(project, table, newInterface);
    controllers.addController(project, table, newController);
    repositories.addRepository(project, table, newRepository);
    DTO.addInputDTO(project, table, newInputDTO);
  };

  const createFilterExcelEndpoint = (project, table) => {
    const newService = services.getFilterExcelService(table);
    const newInterface = interfaces.getFilterExcelInterface(table);
    const newController = controllers.getFilterExcelController(table);
    // const newRepository = repositories.getFilterRepository(table);
    // const newInputDTO = DTO.getDTO(
    //   table.attributes,
    //   table,
    //   UCC(table.name) + "FilterDTO"
    // );
    services.addService(project, table, newService);
    interfaces.addInterface(project, table, newInterface);
    controllers.addController(project, table, newController);
  };

  return {
    createEntities,
    createListEndpoint,
    createAddEndpoint,
    createEditEndpoint,
    createDeleteEndpoint,
    createFilterEndpoint,
    createFilterExcelEndpoint,
    createFindByEndpoint,
  };
};
