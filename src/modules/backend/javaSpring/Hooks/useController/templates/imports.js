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
    `import org.springframework.web.bind.annotation.DeleteMapping;`,
    `import org.springframework.web.bind.annotation.GetMapping;`,
    `import org.springframework.web.bind.annotation.PostMapping;`,
    `import org.springframework.web.bind.annotation.PutMapping;`,
    `import org.springframework.web.bind.annotation.RequestBody;`,
    `import org.springframework.web.bind.annotation.RequestMapping;`,
    `import org.springframework.web.server.ResponseStatusException;`,
    `import org.springframework.web.bind.annotation.RestController;`,
    `import org.springframework.web.bind.annotation.CrossOrigin;`,
    `import ${metaData.packageName}.utils.Response;`,
    `import ${metaData.packageName}.utils.ExcelUtils;`,
    `import ${metaData.packageName}.utils.ServiceUtils;`,
    `import ${metaData.packageName}.business.domain.${UCC(table.name)}.${UCC(
      table.name
    )}FilterDTO;`,
    `import ${metaData.packageName}.business.services.${UCC(table.name)}Service;`,
    `import ${metaData.packageName}.repositories.dB.entities.${UCC(
      table.name
    )}Entity;`,
  ];
  return controller;
};
