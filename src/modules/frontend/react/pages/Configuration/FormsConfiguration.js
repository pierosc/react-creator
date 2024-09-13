import React, { useContext, useState } from "react";
import CTextfield from "../../Components/Textfield/CTextfield";
import CDialog from "../../Components/Dialog/CDialog";
import { Box, Button, Typography } from "@mui/material";
import useDatabase from "../../../../database/CustomHooks/useDatabase";
import DatabaseContext from "../../../../../context/DatabaseProvider";
import FormsIndex from "../Forms/FormsIndex";

function FormsConfiguration() {
  const { db } = useContext(DatabaseContext);
  //   const [open, setOpen] = useState(false);
  //   const onClose = () => {
  //     setOpen(false);
  //   };
  console.log(db);
  console.log(db.selected.json);
  return (
    <div style={{ height: "800px" }} className="overflow-auto p-6">
      <label className="text-white text-center font-semibold text-lg">
        FORMS CONFIGURATION
      </label>
      <div className="grid gap-2">
        {db.selected.json.map((table) => (
          <div className="border-2 border-slate-600 p-2">
            <FormsIndex table={table} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default FormsConfiguration;
