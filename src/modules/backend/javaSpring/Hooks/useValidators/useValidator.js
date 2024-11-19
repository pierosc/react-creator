import { CC, JoinNewLine, TC, UCC } from "../../../../../StringFunctions";

function useValidator(springProject) {
  const addValidator = (projectName, table, newInterface) => {
    const attrFromProject = "validator";
    const attrFromTable = "validations";
    springProject.addElementToTable(
      projectName,
      attrFromProject,
      table,
      attrFromTable,
      newInterface
    );
  };

  const getEmptyStructure = (dataBaseStructure, metaData) => {
    let interfaces = {};
    dataBaseStructure.forEach((table) => {
      interfaces[table.name] = {};
      interfaces[table.name]["imports"] = getValidatorImports(table, metaData);
      interfaces[table.name]["classStart"] = getValidatorClass(table);
      interfaces[table.name]["validations"] = [];
      interfaces[table.name]["classEnd"] = "}";
    });
    return interfaces;
  };

  const getValidatorImports = (table, metaData) => {
    return [
      `package ${metaData.group}.validators;
`,
      `import ${metaData.group}.dtos.requests.${UCC(table.name)}.*;`,
      `import ${metaData.group}.exceptions.EntityAlreadyExistsException;`,
      `import ${metaData.group}.exceptions.EntityNotFoundException;`,
      `import ${metaData.group}.repositories.${UCC(table.name)}Repository;`,
      `import com.users.entities.${UCC(table.name)}Entity;`,
      `import org.springframework.beans.factory.annotation.Autowired;`,
      `import com.users.utils.Filter;`,
      `import java.util.List;`,
      `import org.springframework.stereotype.Component;`,
    ];
  };

  const getValidatorClass = (table) => {
    return `
@Component
public class ${UCC(table.name)}Validator {

    private final ${UCC(table.name)}Repository ${CC(table.name)}Repository;

    @Autowired
    public ${UCC(table.name)}Validator(${UCC(table.name)}Repository ${CC(table.name)}Repository) {
        this.${CC(table.name)}Repository = ${CC(table.name)}Repository;
    }
`;
  };

  const getAddValidator = (table) => {
    const uniqueAttr =
      table.attributes.find((attr) => attr.unique === true) ?? {};

    const existenceValidationByUniqueAttr = `
    public void validateAdd(${UCC(table.name)}AddDTO dto) {
        if (${CC(table.name)}Repository.existsBy${UCC(uniqueAttr?.name)}(dto.get${UCC(uniqueAttr?.name)}())) {
            throw new EntityAlreadyExistsException("${TC(table.name)} already exists");
        }
        // Other validations...
    }
`;

    const existenceValidationByCoincidence = `
    public void validateAdd(${UCC(table.name)}AddDTO dto) {
        List<${UCC(table.name)}Entity> filteredList = ${CC(table.name)}Repository
        .findAll(Filter.buildSpecification(dto));

        if (!filteredList.isEmpty()) {
            throw new EntityAlreadyExistsException("${TC(table.name)} already exists");
        }
    // Other validations...
    }
`;

    return `${
      uniqueAttr?.name !== undefined
        ? existenceValidationByUniqueAttr
        : existenceValidationByCoincidence
    }
`;
  };

  const getEditValidator = (table) => {
    const uniqueAttr =
      table.attributes.find((attr) => attr.unique === true) ?? {};

    const existenceValidationByUniqueAttr = `
    public void validateEdit(${UCC(table.name)}EditDTO dto) {
        if (!${CC(table.name)}Repository.existsBy${UCC(uniqueAttr?.name)}(dto.get${UCC(uniqueAttr?.name)}())) {
            throw new EntityNotFoundException("${TC(table.name)} does not exists");
        }
        // Other validations...
    }
`;

    const existenceValidationByCoincidence = `
    public void validateEdit(${UCC(table.name)}EditDTO dto) {
        List<${UCC(table.name)}Entity> filteredList = ${CC(table.name)}Repository
        .findAll(Filter.buildSpecification(dto));

        if (filteredList.isEmpty()) {
            throw new EntityNotFoundException("${TC(table.name)} does not exists");
        }
    // Other validations...
    }
`;

    return `${
      uniqueAttr?.name !== undefined
        ? existenceValidationByUniqueAttr
        : existenceValidationByCoincidence
    }
`;
  };

  const files = () => {
    const validatorsList2 = springProject.selected.validator;

    let validatorFiles = [];
    Object.keys(validatorsList2).forEach((serviceName) => {
      const validator1 = validatorsList2[serviceName];
      const imports = JoinNewLine(validator1.imports);
      const classStart = validator1.classStart;
      const classEnd = validator1.classEnd;
      const validations = JoinNewLine(validator1.validations);

      const file = JoinNewLine([imports, classStart, validations, classEnd]);

      validatorFiles.push({
        type: "file",
        name: `${UCC(serviceName)}Validator.java`,
        content: file,
      });
    });
    return validatorFiles;
  };

  return {
    addValidator,
    getEmptyStructure,
    getAddValidator,
    getEditValidator,
    files,
  };
}

export default useValidator;
