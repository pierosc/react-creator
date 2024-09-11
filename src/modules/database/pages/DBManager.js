import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React, { useContext, useState } from "react";
import AddDatabase from "../AddDatabase";
import DatabaseContext from "../../../context/DatabaseProvider";

function DBManager() {
  const { db } = useContext(DatabaseContext);
  const [url, setUrl] = useState("");

  const handleChange = (event) => {
    // console.log(db.dataBases);
    // console.log(event.target.value);
    // console.log(db.dataBases.find((t) => t.name === event.target.value));
    setUrl(db.dataBases.find((t) => t.name === event.target.value).url);
    db.setSelected(db.dataBases.find((t) => t.name === event.target.value));
  };

  return (
    <>
      <div className="flex gap-2 mt-4 justify-start">
        <AddDatabase />
        <FormControl fullWidth>
          <InputLabel>DB</InputLabel>
          <Select
            value={db?.selected?.name ?? ""}
            label="PROJECT"
            onChange={handleChange}
          >
            {db.dataBases.map((db, index) => (
              <MenuItem key={index} value={db.name}>
                {db.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      {/* <label className="text-white">{url} </label> */}
      {url !== "" && (
        <iframe title="DBDiagram" src={url} width="100%" height="800"></iframe>
      )}
    </>
  );
}

export default DBManager;
