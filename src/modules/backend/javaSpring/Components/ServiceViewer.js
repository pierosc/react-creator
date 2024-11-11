import React, { useContext } from "react";
import TabMenu from "../../../../components/TabMenu/TabMenu";
import ServiceDTOInput from "../pages/ServiceShortcuts/ServiceDTOInput";
import SpringContext from "../Context/SpringProvider";

function ServiceViewer({ table, selectedService }) {
  const { DTO } = useContext(SpringContext);

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
              <></>
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
