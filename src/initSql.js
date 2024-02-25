const RegistersQty = 3;

export function getInitSql(tableStructure) {
  //   console.log(tableStructure);
  let createTable = ``;
  let insert = ``;
  tableStructure.forEach((table, i) => {
    createTable += create(table);
    insert += getInsert(table);
  });
  //   console.log(createTable);
  //   console.log(insert);

  return createTable + insert;
}

function create(table) {
  const createTable = `CREATE TABLE ${table.name} (
        ${createAttr(table.attributes)}
    );

    `;
  return createTable;
}

function createAttr(attrs) {
  let attibutes = "";
  const pk = "PRIMARY KEY";
  const notNull = "NOT NULL";
  attrs.forEach((attr) => {
    const attribute = `${attr.name} ${attr.type} ${attr.pk ? pk : ""} ${
      attr.nullable ? "" : notNull
    }
    `;
    attibutes += attribute;
  });
  return attibutes;
}

function getInsert(table) {
  const insert = `
  INSERT INTO
        ${table.name} (${getAttrNames(table.attributes)})
    VALUES

    ${getValues(table.attributes)}

    `;
  return insert;
}

function getAttrNames(attrs) {
  let attrNames = [];
  attrs.forEach((attr) => {
    attrNames.push(attr.name);
  });
  attrNames.join(", ");
  return attrNames;
}

function getValues(attrs, qty = RegistersQty) {
  let values = "";
  for (let index = 0; index < qty; index++) {
    let value = `(
${getValue(attrs, index)}
)`;
    // console.log(value);
    value += getFinalChar(
      index,
      qty - 1,
      `,
    `,
      `;
    `
    );
    values += value;
  }
  return values;
}

function getValue(attrs, index) {
  //   console.log(attrs);
  let values = ``;
  attrs.forEach((attr, i) => {
    values += `'${attr.name + index}'${getFinalChar(
      i,
      attrs.length - 1,
      ",",
      ""
    )}
    `;
    // console.log(values);
  });
  return values;
}

function getFinalChar(index, qty, char, fChar) {
  return index === qty ? fChar : char;
}
// -- INSERT INTO
// --     Users (username, password1, password2, auth0)
// -- VALUES
// --     (
// --         'john',
// --         'john123',
// --         'password123',
// --         'john@example.com'
// --     ),
// --     (
// --         'jane',
// --         'jane123',
// --         'password456',
// --         'jane@example.com'
// --     ),
// --     (
// --         'bob',
// --         'bob123',
// --         'password789',
// --         'bob@example.com'
// --     );
