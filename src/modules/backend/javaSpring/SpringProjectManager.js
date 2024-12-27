import MenuItem from "@mui/material/MenuItem";
import React, { useState, useContext } from "react";
import Entities from "./pages/Layers/Entities";
import Repositories from "./pages/Layers/Repositories";
import Services from "./pages/Layers/Services";
import Controllers from "./pages/Layers/Controllers";
import DTOInput from "./pages/Layers/DTOInput";
import DTOOutput from "./pages/Layers/DTOOutput";
// import { useLocalStorage } from "../../../hooks/useStorage";
import DatabaseContext from "../../../context/DatabaseProvider";
import BackButton from "./Components/BackButton";
import TabMenu from "../../../components/TabMenu/TabMenu";
import ServiceViewer from "./Components/ServiceViewer";
import AddCRUDButton from "./Components/AddCRUDButton";
import CSelect from "../../../components/CSelect/CSelect";
import DownloadButton from "./Components/DownloadButton";
import SpringContext from "./Context/SpringProvider";

function SpringProjectManager() {
  const { db } = useContext(DatabaseContext);
  const { reactPJ } = useContext(SpringContext);
  const selectedDB = db.dataBases.find(
    (db) => db.name === reactPJ.selected?.db
  );
  // SELECTION CONTROLS --------------------------------
  const [table, setTable] = React.useState({});
  const isTableSelected = Object.keys(table).length !== 0;

  const handleChangeTable = (event) => {
    setTable(db?.selected?.json.find((t) => t.name === event.target.value));
  };

  //----------------------------------------------------------------

  const [selectedService, setSelectedService] = useState({});

  return (
    <div
      className="grid grid-cols-3 gap-4 items-start"
      style={{ backgroundColor: "rgba(6,8,25)" }}
    >
      <div className="col-span-3">
        <BackButton />
      </div>

      <ServiceViewer table={table} selectedService={selectedService} />

      <div className="col-span-2 grid gap-2">
        <div className="flex gap-2 justify-between">
          <div className="flex gap-2">
            <CSelect
              label="Tables"
              defaultValue=""
              value={table.name}
              onChange={handleChangeTable}
            >
              {db?.selected?.json?.map((table, i) => (
                <MenuItem value={table.name} key={i}>
                  {table.name}
                </MenuItem>
              ))}
            </CSelect>

            <AddCRUDButton />

            <DownloadButton />
          </div>
        </div>

        <TabMenu
          position="start"
          backgroundColor="rgba(0, 0, 0, 0)"
          menu={[
            {
              label: "Entities",
              disabled: !isTableSelected,
              content: <Entities table={table} />,
            },
            {
              label: "Repositories",
              disabled: !isTableSelected,
              content: <Repositories table={table} />,
            },
            {
              label: "Services",
              disabled: !isTableSelected,
              content: (
                <Services
                  setSelectedService={setSelectedService}
                  table={table}
                />
              ),
            },
            {
              label: "Controllers",
              disabled: !isTableSelected,
              content: <Controllers table={table} />,
            },
            {
              label: "REQUEST DTO",
              disabled: !isTableSelected,
              content: <DTOInput table={table} />,
            },
            {
              label: "RESPONSE DTO",
              disabled: !isTableSelected,
              content: <DTOOutput table={table} />,
            },
          ]}
        />
      </div>
    </div>
  );
}

export default SpringProjectManager;
