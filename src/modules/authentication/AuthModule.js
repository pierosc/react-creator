import React, { useState } from "react";
import Realm from "./Realm";
import Users from "./Users";
import Roles from "./Roles";

function AuthModule() {
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

  return (
    <div
      className="grid grid-cols-5 px-8 py-4 gap-4 items-start"
      style={{ height: "90vh" }}
    >
      <Users users={users} setUsers={setUsers} roles={roles} />
      <Roles roles={roles} setRoles={setRoles} />
      <Realm />
    </div>
  );
}

export default AuthModule;
