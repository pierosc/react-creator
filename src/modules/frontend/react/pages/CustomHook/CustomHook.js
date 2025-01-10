import React, { useContext } from "react";
import ReactContext from "../../Context/ReactProvider";
import DatabaseContext from "../../../../../context/DatabaseProvider";
import TabMenu from "../../../../../components/TabMenu/TabMenu";
import CSelect from "../../../../../components/CSelect/CSelect";
import { Button, MenuItem } from "@mui/material";
import CustomHookVisualizer from "./CustomHookVisualizer";
import useFile from "../../../../../hooks/useFile/useFile";
import { CC, UCC } from "../../../../../StringFunctions";
import { usequery } from "./CustomHookTemplate";

function CustomHook() {
  const { db } = useContext(DatabaseContext);
  const { reactPJ } = useContext(ReactContext);
  const file = useFile();
  const selectedDB = db.dataBases.find(
    (db) => db.name === reactPJ.selected?.db
  );
  const [table, setTable] = React.useState(selectedDB?.json[0]);
  //   const isTableSelected = Object.keys(table).length !== 0;

  const handleChangeTable = (event) => {
    setTable(selectedDB?.json.find((t) => t.name === event.target.value));
  };

  console.log(selectedDB.json);
  return (
    <div>
      <Button
        onClick={() => {
          let hooks = [];
          selectedDB?.json.forEach((table) => {
            hooks = [
              ...hooks,
              {
                type: "file",
                name: `use${UCC(table.name)}.js`,
                content: usequery(table),
              },
            ];
          });
          file.createRarFile(
            [{ type: "folder", name: "hooks", content: hooks }],
            "hooks"
          );
        }}
      >
        DOWNLOAD HOOKS
      </Button>
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
