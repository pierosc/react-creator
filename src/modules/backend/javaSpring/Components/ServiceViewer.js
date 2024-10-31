import React, { useContext } from "react";
import TabMenu from "../../../../components/TabMenu/TabMenu";
import ServiceDTOInput from "../pages/ServiceShortcuts/ServiceDTOInput";
import SpringContext from "../Context/SpringProvider";

function ServiceViewer({ table, selectedService }) {
  const { DTO } = useContext(SpringContext);

  return (
    <div className="grid gap-4 ">
      <label className="text-white">
        {`Servicio: ${selectedService?.service ?? ""}`}
      </label>

      <TabMenu
        position="start"
        backgroundColor="rgba(0, 0, 0, 0)"
        menu={[
          {
            label: "INPUT DTO's",
            content: (
              <ServiceDTOInput
                DTO={DTO}
                table={table}
                selectedService={selectedService}
              />
            ),
          },
          {
            label: "OUTPUT DTO's",
            content: <></>,
          },
          {
            label: "CONTROLLER",
            content: <></>,
          },
        ]}
      />
    </div>
  );
}

export default ServiceViewer;
