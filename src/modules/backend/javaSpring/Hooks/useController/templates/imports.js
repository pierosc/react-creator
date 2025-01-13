import { UCC } from "../../../../../../StringFunctions";

export const getControllerImports = (metaData, table) => {
  const controller = [
    `package ${metaData.packageName}.controllers;`,

    `import jakarta.validation.Valid;`,
    `import java.util.List;`,
    `import java.io.ByteArrayOutputStream;`,
    `import org.springframework.beans.factory.annotation.Autowired;`,
    `import org.springframework.http.HttpStatus;`,
    `import org.springframework.core.io.Resource;`,
    `import org.springframework.http.ResponseEntity;`,
    `import org.springframework.security.access.prepost.PreAuthorize;`,
    `import org.springframework.web.bind.annotation.*;`,
    // `import org.springframework.web.server.ResponseStatusException;`,
    // `import ${metaData.packageName}.utils.Response;`,
    `import ${metaData.packageName}.utils.ExcelUtils;`,
    // `import ${metaData.packageName}.utils.ServiceUtils;`,
    `import ${metaData.packageName}.dtos.requests.${UCC(table.name)}.${UCC(
      table.name
    )}FilterDTO;`,
    `import ${metaData.packageName}.dtos.responses.ApiResponse;`,
    `import ${metaData.packageName}.services.interfaces.I${UCC(table.name)}Service;`,
    // `import ${metaData.packageName}.entities.${UCC(table.name)}Entity;`,
  ];
  return controller;
};
