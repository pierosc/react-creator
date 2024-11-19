import {
  CC,
  UCC,
  UniqueArray,
  JoinNewLine,
} from "../../../../../../StringFunctions";
import { createVarsToExclude } from "../../../constants/varsToExclude";

export const getAddService = (table) => {
  const repositoryInstance = `${CC(table.name)}Repository`;
  //TODO: revisar si lo tienen como lista de otra cosa para poner addXtoY
  const serviceName = `add${UCC(table.name)}`;
  const input = `${UCC(table.name)}AddDTO dto`;
  const inputInstance = `dto`;
  const inputClass = `${UCC(table.name)}AddDTO`;
  const inputEntityClass = `${UCC(table.name)}Entity`;
  const inputEntityInstance = `${CC(table.name)}Entity`;
  const isTransactional = Object.keys(table).includes("transactional");

  const errorMoreThanOne = `"${UCC(table.name)} already exists"`;
  const successMsg = `"${inputInstance} added successfully"`;
  const errorMsg = `"Error adding ${UCC(table.name)}: " + e.getMessage()`;

  const uniqueAttr =
    table.attributes.find((attr) => attr.unique === true) ?? {};

  const getAttrName = (rel, attr) =>
    rel.relation === "OneToOneO"
      ? `${UCC(rel.destinyTable)}`
      : `${UCC(attr.name)}`;

  // *************************************************************************
  // RECOPILAR ATRIBUTOS OBJECT
  // Descripción: Para atributos de tipo Object que hacen referencia a una
  // entidad se busca la entidad segun el DTO y se asigna la entidad completa
  // *************************************************************************
  // console.log(table.name);
  // console.log(inputAttributes);
  const getAttrDTO = (rel, attrName) =>
    `${UCC(rel.destinyTable)}ListDTO ${CC(
      attrName
    )} = ${inputInstance}.get${attrName}();
    ${inputInstance}.set${attrName}(null);`;

  const attributesDTOSetter = JoinNewLine(
    UniqueArray(
      table.attributes.map((attr) =>
        !attr.pk
          ? attr.relations.map((rel) => {
              const attrName = getAttrName(rel, attr);
              return rel.relation !== "OneToMany"
                ? getAttrDTO(rel, attrName)
                : ``;
            })
          : []
      )
    )
  );

  // *************************************************************************
  // SETEAR ATRIBUTOS OBJECT
  // Descripción: Para atributos de tipo Object que hacen referencia a una
  // entidad se busca la entidad segun el DTO y se asigna la entidad completa
  // *************************************************************************
  // console.log(table.name);
  // console.log(inputAttributes);

  const attributesEntitiesSetter = JoinNewLine(
    UniqueArray(
      table.attributes.map((attr) =>
        !attr.pk
          ? attr.relations.map((rel) => {
              const relRepository = `${CC(rel.destinyTable)}Repository`;
              const attrName = getAttrName(rel, attr);
              return rel.relation !== "OneToMany"
                ? `      if (${CC(attrName)} != null) {
    ${inputEntityInstance}.set${attrName}(${relRepository}
        .findAll(Filter.buildSpecification(${CC(attrName)})).get(0));
      }`
                : ``;
            })
          : []
      )
    )
  );

  // *************************************************************************
  // VALIDAR SI LA ENTIDAD A AGREGAR YA EXISTE
  // Descripción: Se busca todas las coincidencias según el DTO de entrada
  // *************************************************************************

  //TODO: QUITAR LOS ID DEL FILTEREDLIST

  const existenceValidationByCoincidence = `
  List<${inputEntityClass}> filteredList = ${repositoryInstance}
  .findAll(Filter.buildSpecification(${inputInstance}));

  if (!filteredList.isEmpty()) {
    throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
      Response.Error(${errorMoreThanOne}, filteredList));
  }
`;

  const existenceValidationByUniqueAttr = `
  ${inputEntityClass} entityToAdd = ${repositoryInstance}.findBy${UCC(
    uniqueAttr?.name
  )}(${inputInstance}.get${UCC(uniqueAttr?.name)}());

  if (entityToAdd != null) {
    throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
      Response.Error(${errorMoreThanOne}, modelMapper.map(entityToAdd, ${inputClass}.class)));
  }
`;

  const existenceValidation = `
  void ExistenceEntityValidation(${input}) {
        ${
          uniqueAttr?.name !== undefined
            ? existenceValidationByUniqueAttr
            : existenceValidationByCoincidence
        }
  }`;

  const existenceValidationCall = `ExistenceEntityValidation(${inputInstance});`;

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
  ${inputEntityInstance}.set${UCC(table?.transactional?.linkAttr)}(
      ${CC(table?.transactional?.name)}Repository.findBy${UCC(
        uniqueTransAttr?.name
      )}(${inputInstance}.get${UCC(uniqueTransAttr?.name)}()).get${UCC(
        idAttr?.name
      )}());
  `;

  // *************************************************************************
  // ASIGNAR LA VARIABLE DE TIMESTAMP
  // *************************************************************************
  const temporalAttribute = table.attributes.find((attr) =>
    createVarsToExclude.includes(attr.name.toUpperCase())
  );

  const setCreateTime = `
  ${inputEntityInstance}.set${UCC(
    temporalAttribute?.name
  )}(new Timestamp(System.currentTimeMillis()));
`;

  // *************************************************************************
  // GUARDAR ENTIDAD MAPEADA
  // *************************************************************************

  const saveMappedEntity = `
  ${repositoryInstance}.save(${inputEntityInstance});
`;

  // -------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------

  const add = `
  @Override
  @Auditable(action = "Add")
  @Transactional
  public void ${serviceName}(${input}) {
    ${CC(table.name)}Validator.validateAdd(dto);
    // ${inputEntityClass} entity = modelMapper.map(dto, ${inputEntityClass}.class);
    // academicDegreesRepository.save(entity);

      ${attributesDTOSetter}
      ${DTOtoEntityMapper}
      ${attributesEntitiesSetter}
      ${isTransactional && uniqueTransAttr ? SetDestinyEntityID : ""}
      ${temporalAttribute ? setCreateTime : ""}
      ${saveMappedEntity}

  }
`;
  return add;
};

// const addv0 = `
// @Override
// @Transactional
// public void ${serviceName}(${input}) {
//   try {
//     ${existenceValidationCall}
//     ${attributesDTOSetter}
//     ${DTOtoEntityMapper}
//     ${attributesEntitiesSetter}
//     ${isTransactional && uniqueTransAttr ? SetDestinyEntityID : ""}
//     ${temporalAttribute ? setCreateTime : ""}
//     ${saveMappedEntity}

//     // return Response.JSONObject(${successMsg});

//   } catch (Exception e) {
//     throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ${errorMsg});
//   }
// }
// ${existenceValidation}
// `;
