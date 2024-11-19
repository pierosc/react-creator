import { useState, useContext } from "react";
import {
  CC,
  JoinNewLine,
  UCC,
  removeString,
  sqlVarToJavaVar,
} from "../../../../StringFunctions";
// import { useLocalStorage } from "./../../../../hooks/useStorage";
// import SpringContext from "../Context/SpringProvider";

export const useRepositories = (springProject) => {
  // const { springProject } = useContext(SpringContext);
  const [repositoriesList, setRepositoriesList] = useState([]); // REPOSITORIES FROM THE SELECTED SPRING PROJECT

  const addRepository = (projectName, table, newRepository) => {
    const attrFromProject = "repository";
    const attrFromTable = "repositories";

    springProject.addElementToTable(
      projectName,
      attrFromProject,
      table,
      attrFromTable,
      ...newRepository
    );
  };

  const deleteRepository = (table, repository) => {
    setRepositoriesList((prevRepositoriesList) => {
      const newRepositoriesList = { ...prevRepositoriesList };
      const newRepositories = [
        ...newRepositoriesList[table?.name]["repositories"].filter(
          (serv) => serv !== repository
        ),
      ];
      newRepositoriesList[table?.name]["repositories"] = newRepositories;
      return newRepositoriesList;
    });
  };

  const addImport = (table, repositoryImport) => {
    setRepositoriesList((prevServiceImports) => {
      const newServiceImports = { ...prevServiceImports };
      const newImports =
        newServiceImports[table?.name]["imports"] +
        `
    ${repositoryImport}`;

      newServiceImports[table?.name]["imports"] = newImports;
      return newServiceImports;
    });
  };

  const deleteImport = (table, repositoryImport) => {
    setRepositoriesList((prevServiceImports) => {
      const newServiceImports = { ...prevServiceImports };
      const newImports = removeString(
        newServiceImports[table?.name]["imports"],
        repositoryImport
      );

      newServiceImports[table?.name]["imports"] = newImports;
      return newServiceImports;
    });
  };

  const getEmptyStructure = (tableStructure, metaData) => {
    let repositories = {};
    tableStructure.forEach((table) => {
      //   const imports = getServiceImports(table);
      const uniqueAttr = table.attributes.find((attr) => attr.unique);
      // console.log(table.attributes);

      repositories[table.name] = {};
      repositories[table.name]["imports"] = getRepositoryImports(
        table,
        metaData
      );
      repositories[table.name]["classStart"] = getRepositoryClassStart(table);
      repositories[table.name]["repositories"] = uniqueAttr
        ? [
            getfindByRepository([uniqueAttr], table, true),
            getExistsByUniqueAttr(table),
          ]
        : [];
      repositories[table.name]["classEnd"] = "}";
    });
    // setRepositoriesList(repositories);
    return repositories;
  };

  const getRepositoryImports = (table, metaData) => {
    const repo = `package ${metaData.packageName}.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import java.util.List;
import org.springframework.data.jpa.domain.Specification;
import ${metaData.packageName}.entities.${UCC(table.name)}Entity;`;
    return repo;
  };

  const getRepositoryClassStart = (table) => {
    const pk = table.attributes.find((attr) => attr.pk);
    const repo = `public interface ${UCC(
      table.name
    )}Repository extends JpaRepository<${UCC(
      table.name
    )}Entity, ${sqlVarToJavaVar(pk.type)}> {`;
    return repo;
  };

  const files = () => {
    const repositoriesList2 = springProject.selected.repository;

    let repositoriesFiles = [];
    Object.keys(repositoriesList2).forEach((repositoryName) => {
      const repository = repositoriesList2[repositoryName];
      const imports = repository.imports;
      const classStart = repository.classStart;
      const classEnd = repository.classEnd;
      const repositories = repository.repositories.join(`
  `);
      const file = JoinNewLine([imports, classStart, repositories, classEnd]);

      repositoriesFiles.push({
        type: "file",
        name: `${UCC(repositoryName)}Repository.java`,
        content: file,
      });
    });
    return repositoriesFiles;
  };

  // ____ ____ ___  ____ ____ _ ___ ____ ____ _ ____ ____
  // |__/ |___ |__] |  | [__  |  |  |  | |__/ | |___ [__
  // |  \ |___ |    |__| ___] |  |  |__| |  \ | |___ ___]

  const getfindByRepository = (selectedAttributes, table, isUnique = false) => {
    // console.log(selectedAttributes);
    const inputs = selectedAttributes
      .map((attr) => `${sqlVarToJavaVar(attr.type)} ${CC(attr.name)}`)
      .join(", ");

    const attrsList = selectedAttributes
      .map((attr) => UCC(attr.name))
      .join("And");
    const entityClass = `${UCC(table?.name)}Entity`;
    const returnedDataType = isUnique
      ? `${entityClass}`
      : `List<${entityClass}>`;

    const repo = `   ${returnedDataType} findBy${attrsList}(${inputs});`;

    return repo;
  };

  const getExistsByUniqueAttr = (table) => {
    const uniqueAttr =
      table.attributes.find((attr) => attr.unique === true) ?? {};

    const repo = `   boolean existsBy${UCC(uniqueAttr?.name)}(String ${CC(uniqueAttr?.name)});`;

    return repo;
  };

  const getFilterRepository = (table) => {
    return [
      `   List<${UCC(table.name)}Entity> findAll(Specification<${UCC(
        table.name
      )}Entity> specification);`,
    ];
  };

  return {
    // addRepositoryToAllTables,
    // setFilterRepositories,
    addRepository,
    deleteRepository,
    addImport,
    deleteImport,
    // setEmptyStructure,
    getEmptyStructure,
    files,
    repositoriesList,
    //REPOSITORIES
    getfindByRepository,
    getFilterRepository,
  };
};
