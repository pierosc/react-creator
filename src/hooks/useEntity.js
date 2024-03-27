function useEntity(metaData) {
  const [entitiesList, setEntitiesList] = useState([]); //TODAS LAS ENITDADES

  const addEntity = (table, newEntity) => {
    setEntitiesList((prevEntityList) => {
      const newEntitiesList = { ...prevEntityList };
      const newEntities = [
        newEntity,
        ...newEntitiesList[table?.name]["entities"],
      ];
      newEntitiesList[table?.name]["entities"] = newEntities;
      return newEntitiesList;
    });
  };

  const getEntitiesFiles = (entitiesList) => {
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

  const getEntityImports = () => {
    return `package ${metaData.packageName}.repositories.dB.entities;
  
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
import jakarta.persistence.GenerationType;`;
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
    Object.keys(servicesList).forEach((serviceName) => {
      const service = entitiesList[serviceName];
      const imports = service.imports;
      const classStart = service.classStart;
      const classEnd = service.classEnd;
      const services = JoinNewLine(service.services);

      const file = JoinNewLine([imports, classStart, services, classEnd]);

      servicesFiles.push({
        type: "file",
        name: `${UCC(serviceName)}Service.java`,
        content: file,
      });
    });
    return servicesFiles;
  };

  return { getEntitiesFiles };
}

export default useEntity;
