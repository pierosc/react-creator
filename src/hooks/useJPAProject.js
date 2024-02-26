import React from "react";
import { UCC } from "../StringFunctions";

export const useJPAProject = (
  repositories,
  services,
  controllers,
  DTO,
  artifactId
) => {
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
      "output"
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
    // const newService = services.getListAllService(table.name);
    // const newServiceImport = `import com.${artifactId}.controllers.responses.${UCC(
    //   table.name
    // )}.${UCC(table.name)}ListDTO`;
    // const newController = controllers.getListController(table);
    // const newOutputDTO = DTO.getDTO(
    //   table.attributes,
    //   table,
    //   UCC(table.name) + "ListDTO"
    // );
    // services.addService(table, newService);
    // services.addImport(table, newServiceImport);
    // controllers.addController(table, newController);
    // DTO.addOutputDTO(table, newOutputDTO);
  };

  const createEditEndpoint = () => {};

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
    const newInputDTO = DTO.getDTO(
      table.attributes,
      table,
      UCC(table.name) + "DeleteDTO",
      "input"
    );
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

  return { createListEndpoint, createDeleteEndpoint, createFindByEndpoint };
};
