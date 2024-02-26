import { useState } from "react";
import { CC, UCC, removeString, sqlVarToJavaVar } from "../StringFunctions";

export const useRepositories = (tableStructue, artifactId) => {
  const [repositoriesList, setRepositoriesList] = useState([]); //TODOS LOS SERVICIOS
  //   const [repositoryImports, setServiceImports] = useState("");

  const addRepository = (table, newRepository) => {
    setRepositoriesList((prevRepositoriesList) => {
      const newRepositoriesList = { ...prevRepositoriesList };
      const newRepositories = [
        newRepository,
        ...newRepositoriesList[table?.name]["repositories"],
      ];
      newRepositoriesList[table?.name]["repositories"] = newRepositories;
      return newRepositoriesList;
    });
  };

  const addRepositoryToAllTables = (newRepository) => {
    setRepositoriesList((prevRepositoriesList) => {
      const newRepositoriesList = { ...prevRepositoriesList };
      tableStructue.forEach((table) => {
        const newRepositories = [
          newRepository,
          ...newRepositoriesList[table?.name]["repositories"],
        ];
        newRepositoriesList[table?.name]["repositories"] = newRepositories;
      });
      return newRepositoriesList;
    });
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
      //         newServiceImports[table?.name]["imports"] +
      // `
      //   ${repositoryImport}`;

      newServiceImports[table?.name]["imports"] = newImports;
      return newServiceImports;
    });
  };

  const setEmptyStructure = () => {
    let repositories = {};
    tableStructue.forEach((table) => {
      //   const imports = getServiceImports(table);
      const uniqueAttr = table.attributes.find((attr) => attr.unique);
      console.log(table.attributes);

      repositories[table.name] = {};
      repositories[table.name]["imports"] = getRepositoryImports(
        table,
        artifactId
      );
      repositories[table.name]["classStart"] = getRepositoryClassStart(table);
      repositories[table.name]["repositories"] = uniqueAttr
        ? [getfindByRepository([uniqueAttr], table)]
        : [];
      repositories[table.name]["classEnd"] = "}";
    });
    setRepositoriesList(repositories);
  };

  const setFilterRepositories = () => {
    tableStructue.forEach((table) => {
      const filter = getFilterRepository(table);

      setRepositoriesList((prevRepositoriesList) => {
        const newRepositoriesList = { ...prevRepositoriesList };
        const newRepositories = [
          filter,
          ...newRepositoriesList[table?.name]["repositories"],
        ];
        newRepositoriesList[table?.name]["repositories"] = newRepositories;
        return newRepositoriesList;
      });
    });
  };

  const getRepositoryImports = (table, artifactId) => {
    const repo = `package com.${artifactId}.repositories.dB.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import java.util.List;
import org.springframework.data.jpa.domain.Specification;
import com.${artifactId}.repositories.dB.entities.${UCC(table.name)}Entity;`;
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
    let repositoriesFiles = [];
    Object.keys(repositoriesList).forEach((repositoryName) => {
      const repository = repositoriesList[repositoryName];
      const imports = repository.imports;
      const classStart = repository.classStart;
      const classEnd = repository.classEnd;
      const repositories = repository.repositories.join(`
  `);
      const file =
        imports +
        `
  ` +
        classStart +
        `
  ` +
        repositories +
        `
  ` +
        classEnd;

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

  const getfindByRepository = (selectedAttributes, table) => {
    console.log(selectedAttributes);
    const inputs = selectedAttributes
      .map((attr) => `${sqlVarToJavaVar(attr.type)} ${CC(attr.name)}`)
      .join(", ");

    const attrsList = selectedAttributes
      .map((attr) => UCC(attr.name))
      .join("And");

    const repo = `List<${UCC(
      table?.name
    )}Entity> findBy${attrsList}(${inputs});`;

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
    addRepositoryToAllTables,
    setFilterRepositories,
    addRepository,
    deleteRepository,
    addImport,
    deleteImport,
    setEmptyStructure,
    files,
    repositoriesList,
    //REPOSITORIES
    getfindByRepository,
    getFilterRepository,
  };
};
