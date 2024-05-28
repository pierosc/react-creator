// import { scopeBetween } from "./StringFunctions";

export function getRelations(code) {
  const relations = code.split("Ref");
}

export function getDBDiagramStructure(code) {
  const relations = code.split("Ref:");
  const tables = relations
    .shift()
    .trim()
    .split("Table")
    .filter((line) => line !== "");

  let tableStructure = [];
  const referencesByOrigin = groupBy(
    getReferences(relations, "origin"),
    "originTable"
  );
  const referencesByDestiny = groupBy(
    getReferences(relations, "destiny"),
    "destinyTable"
  );
  tables.forEach((table) => {
    const tableObj = {};
    const tableAtr = table
      .trim()
      .split("\n")
      .filter((line) => !line.includes("}"))
      .filter((line) => line.toUpperCase().trim().split(" ")[0] !== "NOTE:")
      .filter((line) => !/^\s*$/.test(line));
    const tableName = tableAtr.shift().split(" ")[0];
    tableObj.name = tableName;
    //
    // console.groupCollapsed(tableName);
    // console.log("Referencias de origen");
    // console.log(referencesByOrigin);
    // console.log("Referencias de destino");
    // console.log(referencesByDestiny);

    const reference = referencesByOrigin[tableName];
    const referenceDest = referencesByDestiny[tableName];
    const attributes = getAttributes(tableAtr, reference, referenceDest);
    tableObj.attributes = attributes;
    // console.log(tableObj);
    tableStructure.push(tableObj);
  });

  // console.log(tableStructure);
  // console.log("-------------------------");
  tableStructure = addTransactional(tableStructure);
  // console.log("-------------------------");
  console.log(tableStructure);

  return tableStructure;
}

function addTransactional(tableStructure) {
  const newTableStructure = tableStructure.map((workingTable) => {
    let newTable = { ...workingTable };
    // console.groupCollapsed(newTable.name);
    tableStructure.forEach((table) => {
      // console.group(table.name);
      table.attributes.forEach((attr) => {
        // console.group(attr.name);
        attr.relations.forEach((rel) => {
          // console.log(rel);
          if (
            rel.destinyTable === workingTable.name &&
            rel.relation === "OneToMany"
          ) {
            // console.log("FOUND ONE!!");
            newTable.transactional = { ...table, linkAttr: rel.destinyAttr };
            // newTable.isTransactional = true;
            // console.log(newTable);
          }
        });
        // console.groupEnd();
      });
      // console.groupEnd();
    });
    // console.groupEnd();
    // console.log(newTable);
    return newTable;
  });
  return newTableStructure;
  //revisar si la atributo es el many de otra tabla
}

function getAttributes(tableAtr, reference, referenceDest) {
  //   console.log("Referencias de origen");
  //   console.log(reference);
  //   console.log("Referencias de destino");
  //   console.log(referenceDest);

  const attributes = [];
  tableAtr.forEach((atr) => {
    const attribute = {};
    attribute.name = atr.trim().split(" ")[0];
    attribute.type = atr.trim().split(" ")[1];
    attribute.pk = atr.toUpperCase().includes("PRIMARY KEY");
    attribute.unique = atr.toUpperCase().includes("UNIQUE");
    attribute.nullable = !atr.toUpperCase().includes("NOT NULL");
    attribute.relations = [];
    // const extra = scopeBetween(atr, "[", "]");
    //   console.log(attribute);
    // let relations = [];

    //AGREGAR REFERENCIAS
    // console.log("REFERENCIAS");
    // console.log("origen");
    if (reference !== undefined) {
      reference.forEach((ref) => {
        if (ref.originAttr === attribute.name) {
          const rel = {
            destinyTable: ref.destinyTable,
            destinyAttr: ref.destinyAttr,
            relation: ref.relation,
          };
          //   console.log(rel);
          attribute.relations = [...attribute.relations, rel];
        }
      });
    }
    // console.log("destino");

    // //reverse relations
    // if (referenceDest !== undefined) {
    //   referenceDest.forEach((ref) => {
    //     if (ref.destinyAttr === attribute.name) {
    //       const rel = {
    //         destinyTable: ref.originTable,
    //         destinyAttr: ref.originAttr,
    //         relation:
    //           ref.relation === "ManyToOne"
    //             ? "OneToMany"
    //             : ref.relation === "OneToMany"
    //             ? "ManyToOne"
    //             : ref.relation,
    //       };
    //       //   console.log(ref.relation);
    //       //   console.log(rel.relation);

    //       attribute.relations = [...attribute.relations, rel];
    //     }
    //   });
    // }

    attributes.push(attribute);
  });
  //   console.groupEnd("----------");
  return attributes;
}

function getReferences(relations, isFrom) {
  //   console.log(relations);
  const reference = [];
  relations.forEach((ref) => {
    const rel = ref.includes(">")
      ? "ManyToOne"
      : ref.includes("<")
      ? "OneToMany"
      : ref.includes("-") && isFrom === "origin"
      ? "OneToOneO"
      : ref.includes("-") && isFrom === "destiny"
      ? "OneToOneD"
      : "None";
    const tables = ref.split(
      ref.includes(" > ") ? " > " : ref.includes(" < ") ? " < " : " - "
    );
    const originTable = tables[0].split(".")[0].trim().replace(/"/g, "");
    const originAttr = tables[0].split(".")[1].trim().replace(/"/g, "");
    const destinyTable = tables[1].split(".")[0].trim().replace(/"/g, "");
    const destinyAttr = tables[1].split(".")[1].trim().replace(/"/g, "");
    // console.log(ref);
    // console.log(rel);
    // console.log(tables);
    // console.log(originTable);
    // console.log(originAttr);
    // console.log(destinyTable);
    // console.log(destinyAttr);
    reference.push({
      originTable: originTable,
      originAttr: originAttr,
      relation: rel,
      destinyTable: destinyTable,
      destinyAttr: destinyAttr,
    });
  });
  return reference;
}

export function groupBy(arr, clave) {
  return arr.reduce((grupo, elemento) => {
    const valorClave = elemento[clave];
    if (!grupo[valorClave]) {
      grupo[valorClave] = [];
    }
    grupo[valorClave].push(elemento);
    return grupo;
  }, {});
}
