import { useState, useContext } from "react";
import {
  CC,
  JoinNewLine,
  UCC,
  sqlVarToJavaVar,
} from "../../../../StringFunctions";
import SpringContext from "../../../../context/SpringProvider";

function useEntity(tableStructure, metaData) {
  const [entitiesList, setEntitiesList] = useState([]); //TODAS LAS ENITDADES
  const { springProject } = useContext(SpringContext);

  const addEntity = (projectName, table, newEntity) => {
    const attrFromProject = "entity";
    const attrFromTable = "content";

    springProject.addElementToTable(
      projectName,
      attrFromProject,
      table,
      attrFromTable,
      newEntity
    );
  };

  // const getEntity = (table) => {
  //   let entities = {};
  //   const content = getColumns(table.attributes, table.name) ?? "";
  //   // console.log(content);
  //   entities[table.name] = {};
  //   entities[table.name]["imports"] = getEntityImports();
  //   entities[table.name]["classStart"] = getEntityClass();
  //   entities[table.name]["content"] = content;
  //   // entities[table.name]["top"] = getUpperEntitie(table, artifactId);
  //   entities[table.name]["bottom"] = "}";

  // };

  const getEntityImports = () => {
    return [
      `package ${metaData.packageName}.repositories.dB.entities;`,
      `import jakarta.persistence.Id;`,
      `import jakarta.persistence.Table;`,
      `import jakarta.persistence.Temporal;`,
      `import jakarta.persistence.TemporalType;`,
      `import lombok.AllArgsConstructor;`,
      `import java.util.UUID;`,
      `import java.util.List;`,
      `import lombok.Data;`,
      `import java.sql.Timestamp;`,
      `import lombok.NoArgsConstructor;`,
      `import jakarta.persistence.Column;`,
      `import jakarta.persistence.Entity;`,
      `import jakarta.persistence.JoinColumn;`,
      `import jakarta.persistence.ManyToOne;`,
      `import jakarta.persistence.OneToMany;`,
      `import jakarta.persistence.OneToOne;`,
      `import jakarta.persistence.FetchType;`,
      `import jakarta.persistence.CascadeType;`,
      `import jakarta.persistence.GeneratedValue;`,
      `import jakarta.persistence.GenerationType;`,
    ];
  };

  const getEntityClass = (table) => {
    return `  @Entity
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Table(name = "${table.name}")
    public class ${UCC(table?.name)}Entity {`;
  };

  const files = () => {
    let servicesFiles = [];
    Object.keys(entitiesList).forEach((serviceName) => {
      const service = entitiesList[serviceName];
      const imports = service.imports;
      const classStart = service.classStart;
      const classEnd = service.classEnd;
      const services = JoinNewLine(service.content);

      const file = JoinNewLine([imports, classStart, services, classEnd]);

      servicesFiles.push({
        type: "file",
        name: `${UCC(serviceName)}Entity.java`,
        content: file,
      });
    });
    return servicesFiles;
  };

  const setEmptyStructure = () => {
    let entities = {};
    tableStructure.forEach((table) => {
      entities[table.name] = {};
      entities[table.name]["imports"] = getEntityImports(table, metaData);
      entities[table.name]["classStart"] = getEntityClass(table);
      entities[table.name]["content"] = [];
      entities[table.name]["classEnd"] = "}";
    });
    setEntitiesList(entities);
  };

  const getEmptyStructure = (tableStructure, metaData) => {
    let entities = {};
    tableStructure.forEach((table) => {
      entities[table.name] = {};
      entities[table.name]["imports"] = getEntityImports(table, metaData);
      entities[table.name]["classStart"] = getEntityClass(table);
      entities[table.name]["content"] = [];
      entities[table.name]["classEnd"] = "}";
    });
    // setEntitiesList(entities);
    return entities;
  };

  function getEntity(table) {
    const tableName = table.name;
    const atrs = table.attributes;
    let columns = [];
    atrs.forEach((attr) => {
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
          attr.relations.filter((rel) => rel.relation === "OneToOneO")
            .length !== 0 ||
          attr.relations.filter((rel) => rel.relation === "OneToOneD")
            .length !== 0) &&
        !attr.pk
          ? ""
          : `   ${attr.type.toUpperCase().includes("TIMESTAMP") ? temporal : ""}
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
      const referencedColumnName = `referencedColumnName ="${rel.destinyAttr}"`;
      const name = `name = "${attr.name}"`;
      const nullable = `nullable = ${attr.nullable}`;

      const MTORef = `
      @ManyToOne(cascade = CascadeType.MERGE, fetch = FetchType.EAGER)
      @JoinColumn(${referencedColumnName}, ${name}, ${nullable})
      private ${UCC(rel.destinyTable)}Entity ${CC(attr.name)};
  `;

      //EN LAS RELACIONES OneToOne debe haber un emisor y un receptor

      const OTORef = `
      @OneToOne(cascade = CascadeType.ALL)
      @JoinColumn(${referencedColumnName}, ${name}, ${nullable})
      private ${UCC(rel.destinyTable)}Entity ${CC(rel.destinyTable)};`;

      const OTODRef = `
      @OneToOne(mappedBy = "${CC(tableName)}")
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

  function getGenerationType(pkType) {
    if (pkType.trim().toUpperCase().includes("UUID")) {
      return "UUID";
    } else {
      return "IDENTITY";
    }
  }

  return {
    //  getEntitiesFiles,
    addEntity,
    getEntity,
    setEmptyStructure,
    getEmptyStructure,
    entitiesList,
    files,
  };
}

export default useEntity;
