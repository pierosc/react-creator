// ____ ____ ___  ____ ____ _ ___ ____ ____ _ ____ ____
// |__/ |___ |__] |  | [__  |  |  |  | |__/ | |___ [__
// |  \ |___ |    |__| ___] |  |  |__| |  \ | |___ ___]

import { CC, UCC } from "./StringFunctions";

export const getRepositoriesList = (tableStructue, artifactId) => {
  let repos = {};
  tableStructue.forEach((table) => {
    const content = addFilterRepository(table);
    // repos.push(getRepo(table, artifactId));

    repos[table.name] = {};
    repos[table.name]["top"] = getUpperRepository(table, artifactId);
    repos[table.name]["content"] = content;
    repos[table.name]["bottom"] = "}";
  });
  return repos;
};

export const getRepoFiles = (repositoriesList) => {
  let repoFiles = [];
  Object.keys(repositoriesList).forEach((repoName) => {
    const repo = repositoriesList[repoName];
    const top = repo.top;
    const bottom = repo.bottom;
    const content = repo.content.join(`
        `);
    const file =
      top +
      `
    ` +
      content +
      `
    ` +
      bottom;
    repoFiles.push({
      type: "file",
      name: `${UCC(repoName)}Repository.java`,
      content: file,
    });
  });
  return repoFiles;
};

const getUpperRepository = (table, artifactId) => {
  const pk = table.attributes.find((attr) => attr.pk);
  const repo = `package com.${artifactId}.repositories.dB.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import java.util.List;
import org.springframework.data.jpa.domain.Specification;
import com.${artifactId}.repositories.dB.entities.${UCC(table.name)}Entity;

public interface ${UCC(table.name)}Repository extends JpaRepository<${UCC(
    table.name
  )}Entity, ${sqlVarToJavaVar(pk.type)}> {`;
  return repo;
};

//NEW REPOSITORIES
export const findByRepository = (selectedAttributes, table) => {
  const inputs = selectedAttributes
    .map((attr) => `${sqlVarToJavaVar(attr.type)} ${CC(attr.name)}`)
    .join(", ");

  const attrsList = selectedAttributes
    .map((attr) => UCC(attr.name))
    .join("And");

  const repo = `List<${UCC(table?.name)}Entity> findBy${attrsList}(${inputs});`;

  return repo;
};

const addFilterRepository = (table) => {
  return [
    `   List<${UCC(table.name)}Entity> findAll(Specification<${UCC(
      table.name
    )}Entity> specification);`,
  ];
};

// ____ ___ ____ _ _  _ ____    ____ _  _ _  _ ____ ___ _ ____ _  _ ____
// [__   |  |__/ | |\ | | __    |___ |  | |\ | |     |  | |  | |\ | [__
// ___]  |  |  \ | | \| |__]    |    |__| | \| |___  |  | |__| | \| ___]

function sqlVarToJavaVar(sqlVar) {
  // console.log(sqlVar);
  if (
    sqlVar.toUpperCase().includes("VAR") ||
    sqlVar.toUpperCase().includes("DATE") ||
    sqlVar.toUpperCase().includes("TIMESTAMP") ||
    sqlVar.toUpperCase().includes("JSON")
  ) {
    return "String";
  } else if (sqlVar.toUpperCase().includes("UUID")) {
    return "UUID";
  } else if (
    sqlVar.toUpperCase().includes("INT") ||
    sqlVar.toUpperCase().includes("SERIAL")
  ) {
    return "Integer";
  } else if (sqlVar.toUpperCase().includes("FLOAT")) {
    return "float";
  } else {
    return sqlVar;
  }
}

function getGenerationType(pkType) {
  if (pkType.trim().toUpperCase().includes("UUID")) {
    return "UUID";
  } else {
    return "IDENTITY";
  }
}
