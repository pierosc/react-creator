import React, { useContext, useState } from "react";
import AddDatabase from "./AddDatabase";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import DatabaseContext from "../../context/DatabaseProvider";

function Databases() {
  const { database } = useContext(DatabaseContext);
  const [url, setUrl] = useState("asd");

  const handleChange = (event) => {
    console.log(database.dataBases);
    console.log(event.target.value);
    console.log(database.dataBases.find((t) => t.name === event.target.value));
    setUrl(database.dataBases.find((t) => t.name === event.target.value).url);
    database.setSelected(
      database.dataBases.find((t) => t.name === event.target.value)
    );
  };

  console.log(database.selected);

  return (
    <div className="grid gap-6 ">
      <div className="flex gap-2">
        <AddDatabase />
        <FormControl fullWidth>
          <InputLabel>DB</InputLabel>
          <Select
            value={database?.selected?.name ?? ""}
            label="PROJECT"
            onChange={handleChange}
          >
            {database.dataBases.map((db) => (
              <MenuItem value={db.name}>{db.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <label className="text-white">{url} </label>
      <iframe src={url} width="100%" height="800"></iframe>
    </div>
  );
}

export default Databases;
