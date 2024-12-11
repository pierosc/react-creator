import React, { useContext } from "react";
import TabMenu from "../../../../components/TabMenu/TabMenu";
import ServiceDTOInput from "../pages/ServiceShortcuts/ServiceDTOInput";
import SpringContext from "../Context/SpringProvider";
import Mermaid from "../../../../components/Mermaid/Mermaid";

function ServiceViewer({ table, selectedService }) {
  const { DTO } = useContext(SpringContext);
  const flowchart = `
    graph TD
      %% Definición de componentes principales
      Controller[Controller] -->|Llama métodos de servicio| Service[Service]
      Service -->|Llama métodos del repositorio| Repository[Repository]
      Repository -->|Opera con la base de datos| Database[Database]
      Controller -->|Recibe datos del cliente| RequestDTO[Request DTO]
      Controller -->|Devuelve datos al cliente| ResponseDTO[Response DTO]
      Service -->|Transforma datos entre DTOs y Entidades| Entity[Entity]
      Repository -->|Guarda o recupera datos| Entity

  
  `;

  return (
    <div
      className="grid gap-4 p-2 rounded-md"
      style={{ backgroundColor: "rgba(0,0,0,0.7" }}
    >
      <label className="text-white">
        {`Servicio: ${selectedService?.service ?? ""}`}
      </label>

      <TabMenu
        position="start"
        backgroundColor="rgba(0, 0, 0, 0)"
        menu={[
          {
            label: "REQUEST DTO",
            content: (
              // <ServiceDTOInput
              //   DTO={DTO}
              //   table={table}
              //   selectedService={selectedService}
              // />
              <Mermaid chart={flowchart} />
            ),
          },
          {
            label: "RESPONSE DTO",
            content: <></>,
          },
          {
            label: "PERMITS",
            content: <></>,
          },
        ]}
      />
    </div>
  );
}

export default ServiceViewer;
