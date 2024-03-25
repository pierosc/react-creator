// ____ _  _ ___ _ ___ _ ____ ____
// |___ |\ |  |  |  |  | |___ [__
// |___ | \|  |  |  |  | |___ ___]

import { CC, UCC } from "./StringFunctions";

export const getEntitiesList = (tableStructue, artifactId) => {
  let entities = {};
  tableStructue.forEach((table) => {
    const content = getColumns(table.attributes, table.name) ?? "";
    // console.log(content);
    entities[table.name] = {};
    entities[table.name]["content"] = content;
    entities[table.name]["top"] = getUpperEntitie(table, artifactId);
    entities[table.name]["bottom"] = "}";
  });
  //   console.log(entities);
  return entities;
};

export const getEntitiesFiles = (entitiesList) => {
  let entitiesFiles = [];
  Object.keys(entitiesList).forEach((entitieName) => {
    const entitie = entitiesList[entitieName];
    const top = entitie.top;
    const bottom = entitie.bottom;
    const content = entitie.content.join(`
    `);
    const file =
      top +
      `
` +
      content +
      `
` +
      bottom;
    entitiesFiles.push({
      type: "file",
      name: `${UCC(entitieName)}Entity.java`,
      content: file,
    });
  });
  return entitiesFiles;
};

function getColumns(atrs, tableName) {
  let columns = [];
  atrs.forEach((attr) => {
    // console.log(attr);
    const name = `name = "${attr.name}"`;
    const nullable = `, nullable = ${attr.nullable}`;

    const length =
      attr.type.toUpperCase().includes("VAR") &&
      attr.type.includes("(") &&
      attr.type.includes(")")
        ? `, length = ${attr.type.split("(")[1].split(")")[0]}`
        : "";
    const singlePrivate = `private ${sqlVarToJavaVar(attr.type)} ${CC(
      attr.name
    )};`;

    const temporal = `@Temporal(TemporalType.TIMESTAMP)`;

    const column =
      (attr.relations.filter((rel) => rel.relation === "ManyToOne").length !==
        0 ||
        attr.relations.filter((rel) => rel.relation === "OneToOneO").length !==
          0 ||
        attr.relations.filter((rel) => rel.relation === "OneToOneD").length !==
          0) &&
      !attr.pk
        ? ""
        : `  ${attr.type.toUpperCase().includes("TIMESTAMP") ? temporal : ""}
    @Column(${name}${nullable}${length})
    ${singlePrivate}`;

    //ARMANDO LAS PROPIEDADES
    //--------------------

    const pkLine = `    @Id
    @GeneratedValue(strategy = GenerationType.${getGenerationType(attr.type)})
`;

    //ARMANDO LA ENTIDAD
    //--------------------

    const hasPk = attr.pk ? pkLine : "";

    // const entity = `${attr.pk ? pkLine : ""}
    //   ${column}

    //   ${getRelations(attr.relations, attr)}`;
    // console.log(entity);

    columns = [
      ...columns,
      hasPk + column + getRelations(attr.relations, attr, tableName),
    ];
  });
  console.groupEnd();
  return columns;
}

function getRelations(relations, attr, tableName) {
  let rels = "";
  //   console.log(relations);
  relations.forEach((rel) => {
    // if (rel.relation === "OneToOneO" || rel.relation === "OneToOneD") {
    //   console.log(rel);
    // }

    const MTORef = `    @ManyToOne(cascade = CascadeType.MERGE, fetch = FetchType.EAGER)
    @JoinColumn(referencedColumnName ="${rel.destinyAttr}", name = "${
      attr.name
    }")
    private ${UCC(rel.destinyTable)}Entity ${CC(attr.name)};
`;

    //EN LAS RELACIONES OneToOne debe haber un emisor y un receptor

    const OTORef = `
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(referencedColumnName ="${rel.destinyAttr}", name="${attr.name}")
    private ${UCC(rel.destinyTable)}Entity ${CC(rel.destinyTable)};`;

    const OTODRef = `      @OneToOne(mappedBy = "${CC(tableName)}")
    private ${UCC(rel.destinyTable)}Entity ${CC(rel.destinyTable)};
`;

    const OTMRef = `
    @OneToMany(mappedBy = "${CC(
      rel.destinyAttr
    )}", cascade = CascadeType.MERGE, fetch = FetchType.EAGER)
    private List<${UCC(rel.destinyTable)}Entity> ${
      CC(rel.destinyTable) + UCC(rel.destinyAttr)
    };
`;

    if (rel.relation === "ManyToOne" && !attr.pk) {
      rels += MTORef;
    }
    if (rel.relation === "OneToMany") {
      rels += OTMRef;
    }
    if (rel.relation === "OneToOneO") {
      rels += OTORef;
    }
    if (rel.relation === "OneToOneD") {
      rels += OTODRef;
    }
  });
  return rels;
}

export const getUpperEntitie = (table, artifactId) => {
  return `package com.${artifactId}.repositories.dB.entities;

import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.AllArgsConstructor;
import java.util.UUID;
import java.util.List;
import lombok.Data;
import java.sql.Timestamp;
import lombok.NoArgsConstructor;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.FetchType;
import jakarta.persistence.CascadeType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "${table.name}")
public class ${UCC(table?.name)}Entity {`;
};

// ____ ___ ____ _ _  _ ____    ____ _  _ _  _ ____ ___ _ ____ _  _ ____
// [__   |  |__/ | |\ | | __    |___ |  | |\ | |     |  | |  | |\ | [__
// ___]  |  |  \ | | \| |__]    |    |__| | \| |___  |  | |__| | \| ___]

function sqlVarToJavaVar(sqlVar) {
  // console.log(sqlVar);
  if (
    sqlVar.toUpperCase().includes("VAR") ||
    sqlVar.toUpperCase().includes("DATE") ||
    // sqlVar.toUpperCase().includes("TIMESTAMP") ||
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
  } else if (sqlVar.toUpperCase().includes("TIMESTAMP")) {
    return "Timestamp";
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
