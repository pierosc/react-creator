import React, { useContext, useState } from "react";
import Realm from "./Realm";
import Users from "./Users";
import Roles from "./Roles";
import Authorization from "./Authorization";
import DatabaseContext from "../../context/DatabaseProvider";
import {
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

function AuthModule() {
  const { db } = useContext(DatabaseContext);
  const [actualDb, setActualDb] = useState("");
  const [users, setUsers] = useState([
    {
      id: 0,
      username: "user0",
      email: "user@gmail.com",
      password: "12345",
      roles: [],
    },
  ]);

  const [roles, setRoles] = useState([
    {
      id: 0,
      name: "admin",
      description: "Rol con privilegios admin",
    },
  ]);
  console.log(db);
  const handleChange = (e) => {
    console.log(e.target.value);
    // db.setSelected(db.dataBases.find((t) => t.name === event.target.value));
    setActualDb(db.dataBases.find((t) => t.name === e.target.value));
  };

  return (
    <div
      className="grid grid-cols-4 px-8 py-4 gap-12 items-start"
      style={{ height: "90vh" }}
    >
      <div>
        <Divider variant="middle" sx={{ paddingBottom: "14px" }}>
          DATABASE
        </Divider>
        <FormControl fullWidth>
          <InputLabel>DATABASE</InputLabel>
          <Select
            value={actualDb.name ?? ""}
            size="small"
            label="PROJECT"
            onChange={handleChange}
          >
            {db.dataBases.map((db) => (
              <MenuItem value={db.name}>{db.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <Users users={users} setUsers={setUsers} roles={roles} />
      <Roles roles={roles} setRoles={setRoles} />
      <Realm />
      <Authorization actualDb={actualDb} />
    </div>
  );
}

export default AuthModule;
