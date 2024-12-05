import React, { useContext } from "react";
import ReactContext from "../../Context/ReactProvider";
import DatabaseContext from "../../../../../context/DatabaseProvider";
import TabMenu from "../../../../../components/TabMenu/TabMenu";
import CSelect from "../../../../../components/CSelect/CSelect";
import { MenuItem } from "@mui/material";
import CustomHookVisualizer from "./CustomHookVisualizer";

function CustomHook() {
  const [table, setTable] = React.useState({});
  const isTableSelected = Object.keys(table).length !== 0;

  const handleChangeTable = (event) => {
    setTable(selectedDB?.json.find((t) => t.name === event.target.value));
  };
  const { db } = useContext(DatabaseContext);
  const { reactPJ } = useContext(ReactContext);
  const selectedDB = db.dataBases.find(
    (db) => db.name === reactPJ.selected?.db
  );
  console.log(selectedDB.json);
  return (
    <div>
      <div className="flex gap-2">
        <CSelect
          label="Tables"
          defaultValue=""
          value={table.name}
          onChange={handleChangeTable}
        >
          {selectedDB?.json?.map((table, i) => (
            <MenuItem value={table.name} key={i}>
              {table.name}
            </MenuItem>
          ))}
        </CSelect>
        {/* <AddCRUDButton /> */}

        {/* <DownloadButton /> */}
      </div>
      <CustomHookVisualizer table={table} />
    </div>
  );
}

export default CustomHook;
