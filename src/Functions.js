import { CC, UCC } from "./StringFunctions";

// ____ _  _ ___ _ ___ _ ____ ____
// |___ |\ |  |  |  |  | |___ [__
// |___ | \|  |  |  |  | |___ ___]

export const getEntities = (tableStructue, artifactId) => {
  let entities = [];
  tableStructue.forEach((table) => {
    entities.push(getEntity(table, artifactId));
  });

  return entities;
};

export const getEntity = (table, artifactId) => {
  console.groupCollapsed(table.name);
  let entity = `
  package com.${artifactId}.repositories.dB.entities;

  import jakarta.persistence.Id;
  import jakarta.persistence.Table;
  import lombok.AllArgsConstructor;
  import java.util.UUID;
  import java.util.List;
  import lombok.Data;
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
  public class ${UCC(table.name)}Entity {
  
${getColumns(table.attributes, table.name)}

  }
  `;

  return {
    type: "file",
    name: `${UCC(table.name)}Entity.java`,
    content: entity,
  };
};

function getColumns(atrs, tableName) {
  let columns = "";
  atrs.forEach((attr) => {
    console.log(attr);
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

    const column =
      (attr.relations.filter((rel) => rel.relation === "ManyToOne").length !==
        0 ||
        attr.relations.filter((rel) => rel.relation === "OneToOneO").length !==
          0 ||
        attr.relations.filter((rel) => rel.relation === "OneToOneD").length !==
          0) &&
      !attr.pk
        ? ""
        : `@Column(${name}${nullable}${length})
    ${singlePrivate}`;

    //ARMANDO LAS PROPIEDADES
    //--------------------

    const pkLine = `
    @Id
    @GeneratedValue(strategy = GenerationType.${getGenerationType(attr.type)})`;
    // const temporal = `@Temporal(TemporalType.TIMESTAMP)`;

    //ARMANDO LA ENTIDAD
    //--------------------
    const entity = `${attr.pk ? pkLine : ""}
    ${column}
    
    ${getRelations(attr.relations, attr, tableName)}`;
    console.log(entity);
    columns = columns + entity;
  });
  console.groupEnd();
  return columns;
}

function getRelations(relations, attr, tableName) {
  let rels = "";
  //   console.log(relations);
  relations.forEach((rel) => {
    if (rel.relation === "OneToOneO" || rel.relation === "OneToOneD") {
      console.log(rel);
    }

    const MTORef = `      @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
      @JoinColumn(referencedColumnName ="${rel.destinyAttr}", name = "${
      attr.name
    }", insertable = false, updatable = false)
      private ${UCC(rel.destinyTable)}Entity ${CC(attr.name)};
`;

    //EN LAS RELACIONES OneToOne debe haber un emisor y un receptor

    const OTORef = `
      @OneToOne(cascade = CascadeType.ALL)
      @JoinColumn(referencedColumnName ="${rel.destinyAttr}", name="${
      attr.name
    }")
      private ${UCC(rel.destinyTable)}Entity ${CC(rel.destinyTable)};`;

    const OTODRef = `      @OneToOne(mappedBy = "${CC(tableName)}")
      private ${UCC(rel.destinyTable)}Entity ${CC(rel.destinyTable)};
`;

    const OTMRef = `
      @OneToMany(mappedBy = "${CC(rel.destinyAttr)}", cascade = CascadeType.ALL)
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

// ____ ____ ___  ____ ____ _ ___ ____ ____ _ ____ ____
// |__/ |___ |__] |  | [__  |  |  |  | |__/ | |___ [__
// |  \ |___ |    |__| ___] |  |  |__| |  \ | |___ ___]

export const getRepos = (tableStructue, artifactId) => {
  let repos = [];
  tableStructue.forEach((table) => {
    repos.push(getRepo(table, artifactId));
  });
  return repos;
};

const getRepo = (table, artifactId) => {
  const pk = table.attributes.find((attr) => attr.pk);
  const repo = `
  package com.${artifactId}.repositories.dB.repo;

  import org.springframework.data.jpa.repository.JpaRepository;
  import java.util.UUID;
  import com.${artifactId}.repositories.dB.entities.${UCC(table.name)}Entity;

  public interface ${UCC(table.name)}Repository extends JpaRepository<${UCC(
    table.name
  )}Entity, ${sqlVarToJavaVar(pk.type)}> {
  }
  `;

  return {
    type: "file",
    name: `${UCC(table.name)}Repository.java`,
    content: repo,
  };
};

// ____ ____ ____ _  _ _ ____ ____ ____
// [__  |___ |__/ |  | | |    |___ [__
// ___] |___ |  \  \/  | |___ |___ ___]

export const getServices = (tableStructue, artifactId) => {
  let services = [];
  tableStructue.forEach((table) => {
    services.push(getService(table, artifactId));
  });
  return services;
};

const getService = (table, artifactId) => {
  const pkName = UCC(table.attributes.find((attr) => attr.pk).name);
  const listService = getList(table.name);
  const addService = getAdd(table.name);
  const editService = getEdit(table.name, pkName);
  const deleteService = getDelete(table.name, pkName);

  const service = `
package com.${artifactId}.business.services;

import java.util.List;
import java.util.Optional;

import org.json.JSONObject;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.${artifactId}.repositories.dB.entities.${UCC(table.name)}Entity;
import com.${artifactId}.repositories.dB.repo.${UCC(table.name)}Repository;

@Service
public class ${UCC(table.name)}Service {
    @Autowired
    private ${UCC(table.name)}Repository ${CC(table.name)}Repository;

${listService}

${addService}

${editService}

${deleteService}

}
`;
  return {
    type: "file",
    name: `${UCC(table.name)}Service.java`,
    content: service,
  };
};

const getList = (tableName) => {
  const list = `    
  public List<${UCC(tableName)}Entity> ${UCC(tableName)}() {
  return ${CC(tableName)}Repository.findAll();
}`;
  return list;
};

const getAdd = (tableName) => {
  const add = `
  public JSONObject add${UCC(tableName)}(${UCC(tableName)}Entity ${CC(
    tableName
  )}) {
    try {
      ${CC(tableName)}Repository.save(${CC(tableName)});
        JSONObject jsonResponse = new JSONObject();
        jsonResponse.put("mensaje", "${UCC(tableName)} insertado con éxito");
        System.out.println(jsonResponse);
        return jsonResponse;
    } catch (Exception e) {
        String mensajeError = "Error al insertar el ${UCC(
          tableName
        )}: " + e.getMessage();
        JSONObject jsonError = new JSONObject();
        jsonError.put("error", mensajeError);
        return jsonError;
    }
}
  `;
  return add;
};

const getEdit = (tableName, pk) => {
  const edit = `
  public JSONObject edit${UCC(tableName)}(${UCC(tableName)}Entity ${CC(
    tableName
  )}) {
    try {
        JSONObject jsonResponse = new JSONObject();

        Optional<${UCC(tableName)}Entity> existent${UCC(tableName)} = ${CC(
    tableName
  )}Repository.findById(${CC(tableName)}.get${pk}());
        System.out.println(existent${UCC(tableName)});

        if (existent${UCC(tableName)}.isPresent()) {
            ${UCC(tableName)}Entity ${CC(tableName)}ToEdit = existent${UCC(
    tableName
  )}.get();

            ModelMapper modelMapper = new ModelMapper();
            modelMapper.getConfiguration().setSkipNullEnabled(true);
            modelMapper.map(${CC(tableName)}, ${CC(tableName)}ToEdit);
            ${CC(tableName)}Repository.save(${CC(tableName)}ToEdit);

            jsonResponse.put("mensaje", "${UCC(
              tableName
            )} editado con exito del id= " + ${CC(tableName)}.get${pk}());
            return jsonResponse;

        } else {

            jsonResponse.put("mensaje", "No se edito el ${UCC(
              tableName
            )} con id = " + ${CC(tableName)}.get${pk}());
            return jsonResponse;

        }
    } catch (Exception e) {
        JSONObject jsonError = new JSONObject();
        String mensajeError = "Error al editar el ${UCC(
          tableName
        )}: " + e.getMessage();
        e.printStackTrace();
        jsonError.put("error", mensajeError);
        return jsonError;
    }
}
  `;
  return edit;
};

const getDelete = (tableName, pk) => {
  const del = `
  public JSONObject delete${UCC(tableName)}(${UCC(tableName)}Entity ${CC(
    tableName
  )}) {
    try {
        JSONObject jsonResponse = new JSONObject();
        Optional<${UCC(tableName)}Entity> existent${UCC(tableName)} = ${CC(
    tableName
  )}Repository.findById(${CC(tableName)}.get${pk}());

        if (existent${UCC(tableName)}.isPresent()) {
            ${CC(tableName)}Repository.deleteById(${CC(tableName)}.get${pk}());

            jsonResponse.put("mensaje", "${UCC(
              tableName
            )} eliminado con exito del id= " + ${CC(tableName)}.get${pk}());
            return jsonResponse;
        } else {
            jsonResponse.put("mensaje", "No se elimino el ${UCC(
              tableName
            )} con id = " + ${CC(tableName)}.get${pk}());
            return jsonResponse;
        }

    } catch (Exception e) {
        JSONObject jsonError = new JSONObject();
        String mensajeError = "Error al eliminar el ${UCC(
          tableName
        )}: " + e.getMessage();
        e.printStackTrace();
        jsonError.put("error", mensajeError);
        return jsonError;
    }
}
  `;
  return del;
};

// ____ ____ _  _ ___ ____ ____ _    _    ____ ____ ____
// |    |  | |\ |  |  |__/ |  | |    |    |___ |__/ [__
// |___ |__| | \|  |  |  \ |__| |___ |___ |___ |  \ ___]

export const getControllers = (tableStructue, artifactId) => {
  let controllers = [];
  tableStructue.forEach((table) => {
    controllers.push(getController(table, artifactId));
  });
  return controllers;
};

const getController = (table, artifactId) => {
  const controller = `
package com.${artifactId}.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.${artifactId}.business.services.${UCC(table.name)}Service;
import com.${artifactId}.repositories.dB.entities.${UCC(table.name)}Entity;

@RestController
@RequestMapping("/${CC(table.name)}")
public class ${UCC(table.name)}Controller {
    @Autowired
    private ${UCC(table.name)}Service ${CC(table.name)}Service;

    @GetMapping("/getAll${UCC(table.name)}")
    public List<${UCC(table.name)}Entity> getAll${UCC(table.name)}() {
        return ${CC(table.name)}Service.${UCC(table.name)}();
    }

    @PostMapping("/add${UCC(table.name)}")
    public String create${UCC(table.name)}(@RequestBody ${UCC(
    table.name
  )}Entity ${CC(table.name)}) {
        return ${CC(table.name)}Service.add${UCC(table.name)}(${CC(
    table.name
  )}).toString();
    }

    @PutMapping("/edit${UCC(table.name)}")
    public String edit${UCC(table.name)}(@RequestBody ${UCC(
    table.name
  )}Entity ${CC(table.name)}) {
        return ${CC(table.name)}Service.edit${UCC(table.name)}(${CC(
    table.name
  )}).toString();
    }

    @DeleteMapping("/delete${UCC(table.name)}")
    public String delete${UCC(table.name)}(@RequestBody ${UCC(
    table.name
  )}Entity ${CC(table.name)}) {
        return ${CC(table.name)}Service.delete${UCC(table.name)}(${CC(
    table.name
  )}).toString();
    }

}
`;
  return {
    type: "file",
    name: `${UCC(table.name)}Controller.java`,
    content: controller,
  };
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
