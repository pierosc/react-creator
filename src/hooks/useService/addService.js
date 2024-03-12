import { CC, UCC, UniqueArray, JoinNewLine } from "../../StringFunctions";

export const getAddService = (table, inputAttributes) => {
  const repositoryInstance = `${CC(table.name)}Repository`;
  //TODO: revisar si lo tienen como lista de otra cosa para poner addXtoY
  const serviceName = `add${UCC(table.name)}`;
  const input = `${UCC(table.name)}AddDTO ${CC(table.name)}AddDTO`;
  const inputInstance = `${CC(table.name)}AddDTO`;
  // const inputClass = `${UCC(table.name)}AddDTO`;
  const inputEntityClass = `${UCC(table.name)}Entity`;
  const inputEntityInstance = `${CC(table.name)}Entity`;
  const isTransactional = Object.keys(table).includes("transactional");

  const errorMoreThanOne = `"${UCC(table.name)} already exists"`;
  const successMsg = `"${inputInstance} added successfully"`;
  const errorMsg = `"Error adding ${UCC(table.name)}: " + e.getMessage()`;

  // *************************************************************************
  // SETEAR ATRIBUTOS OBJECT
  // Descripción: Para atributos de tipo Object que hacen referencia a una
  // entidad se busca la entidad segun el DTO y se asigna la entidad completa
  // *************************************************************************
  console.log(table.name);
  console.log(inputAttributes);
  const getAttrName = (rel, attr) =>
    rel.relation === "OneToOneO"
      ? `${UCC(rel.destinyTable)}`
      : `${UCC(attr.name)}`;

  const attributesEntitiesSetter = JoinNewLine(
    UniqueArray(
      table.attributes.map((attr) =>
        !attr.pk
          ? attr.relations.map((rel) => {
              const relRepository = `${CC(rel.destinyTable)}Repository`;
              const attrName = getAttrName(rel, attr);

              return `      if (${inputInstance}.get${attrName}() != null) {
        ${inputInstance}.set${attrName}(${relRepository}
            .findAll(Filter.buildSpecification(${inputInstance}.get${attrName}())).get(0));
      }`;
            })
          : []
      )
    )
  );

  // *************************************************************************
  // VALIDAR SI LA ENTIDAD A AGREGAR YA EXISTE
  // Descripción: Se busca todas las coincidencias según el DTO de entrada
  // *************************************************************************

  const entityExistenceValidation = `
List<${inputEntityClass}> filteredList = ${repositoryInstance}
.findAll(Filter.buildSpecification(${inputInstance}));

if (!filteredList.isEmpty()) {
  throw new IllegalStateException(${errorMoreThanOne});  
}
`;

  // *************************************************************************
  // MAPEAR ENTIDAD CON DTO
  // Descripción: Se crea una nueva entidad con los datos recolectados para
  // poder agregarla
  // *************************************************************************

  const DTOtoEntityMapper = `
${inputEntityClass} ${inputEntityInstance} = modelMapper.map(${inputInstance}, ${inputEntityClass}.class);
`;

  // *************************************************************************
  // SETEAR ID USANDO DE TABLA DESTINO USANDO ATRIBUTO UNIQUE
  // Descripción: Si es una tabla transaccional, se busca el id de la tabla
  // destino mediante su atributo 'unique'
  // *************************************************************************
  const uniqueTransAttr = table?.transactional?.attributes.find(
    (attr) => attr.unique
  );
  const idAttr = table?.transactional?.attributes.find((attr) => attr.pk);

  const SetDestinyEntityID = `
  ${inputEntityInstance}.set${UCC(table?.transactional?.linkAttr)}(${CC(
    table?.transactional?.name
  )}Repository.findBy${UCC(uniqueTransAttr?.name)}(${inputInstance}.get${UCC(
    uniqueTransAttr?.name
  )}()).get${UCC(idAttr?.name)});
  `;

  // *************************************************************************
  // GUARDAR ENTIDAD MAPEADA
  // *************************************************************************
  const saveMappedEntity = `
${repositoryInstance}.save(${inputEntityInstance});
`;

  // -------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------

  const add = `  public JSONObject ${serviceName}(${input}) {
    try {
      ${attributesEntitiesSetter}
      ${entityExistenceValidation}
      ${DTOtoEntityMapper}
      ${isTransactional ? SetDestinyEntityID : ""}
      ${saveMappedEntity}
      
      return Response.JSONObject(${successMsg});
    
    } catch (Exception e) {
      return Response.JSONObject(${errorMsg});
    }
  }`;
  return add;
};
