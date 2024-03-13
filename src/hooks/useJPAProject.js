import React from "react";
import { UCC } from "../StringFunctions";

export const useJPAProject = (
  repositories,
  services,
  controllers,
  DTO,
  artifactId
) => {
  // -------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------

  const createListEndpoint = (table) => {
    const newService = services.getListAllService(table.name);
    const newServiceImport = `import com.${artifactId}.controllers.responses.${UCC(
      table.name
    )}.${UCC(table.name)}ListDTO;
`;
    const newController = controllers.getListController(table);
    const newControllerImport = `import com.${artifactId}.controllers.responses.${UCC(
      table.name
    )}.${UCC(table.name)}ListDTO;
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
    // const newService = services.getAddService(table);

    const newController = controllers.getAddController(table);

    const isTransactional = Object.keys(table).includes("transactional");
    console.log(table.name);
    let inputAttributes = table.attributes;
    console.log(inputAttributes);
    inputAttributes = inputAttributes.filter((attr) => {
      console.log(attr.relations.length);
      console.log(attr.relations?.[0]?.relation);
      return !(
        attr.relations.length === 1 &&
        attr.relations?.[0]?.relation === "OneToMany"
      );
    });
    console.log(inputAttributes);
    inputAttributes = inputAttributes.map((attr) => {
      return {
        ...attr,
        // Eliminar las relaciones OneToMany y si es la única, reliminar todo el atributo
        relations: attr.relations.filter((rel) => rel.relation !== "OneToMany"),
      };
    });
    console.log(inputAttributes);

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
    const newService = services.getAddService(table, inputAttributes);

    const newInputDTO = DTO.getDTO(
      inputAttributes,
      table,
      UCC(table.name) + "AddDTO",
      "input",
      true
    );
    const newInputDTOImport = `import com.${artifactId}.business.domain.${UCC(
      table.name
    )}.${UCC(table.name)}AddDTO;
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
    const newInputDTOImport = `import com.${artifactId}.business.domain.${UCC(
      table.name
    )}.${UCC(table.name)}EditDTO;
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
    const newServiceImport = `import com.${artifactId}.business.domain.${UCC(
      table.name
    )}.${UCC(table.name)}DeleteDTO;
`;
    const newController = controllers.getDeleteController(table);
    const newControllerImport = `import com.${artifactId}.business.domain.${UCC(
      table.name
    )}.${UCC(table.name)}DeleteDTO;
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
    const newControllerImport = `import com.${artifactId}.business.domain.${UCC(
      table.name
    )}.${attributes.map((attr) => UCC(attr.name)).join("And")}IDTO;
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

  return {
    createListEndpoint,
    createAddEndpoint,
    createEditEndpoint,
    createDeleteEndpoint,
    createFilterEndpoint,
    createFindByEndpoint,
  };
};
