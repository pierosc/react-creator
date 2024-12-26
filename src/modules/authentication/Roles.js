import { Divider, IconButton, TextField } from "@mui/material";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import React from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";

function Roles({ roles, setRoles }) {
  return (
    <div className="grid gap-2 items-end justify-around">
      <Divider>
        <div className="flex gap-2">
          <div className="flex">
            <label className="text-white">Roles</label>
          </div>
          <IconButton
            onClick={() => {
              const id = roles[roles.length - 1]?.id + 1;
              setRoles([
                ...roles,
                {
                  id: id,
                  name: `ROLE-${id}`,
                  description: `role-${id} description`,
                },
              ]);
            }}
          >
            <AddCircleIcon sx={{ color: "white" }} />
          </IconButton>
        </div>
      </Divider>
      {roles.map((user) => {
        const otherRolesBefore = roles.filter((u) => u.id < user.id);
        const otherRolesAfter = roles.filter((u) => u.id > user.id);
        const thisUser = roles.find((u) => u.id === user.id);

        return (
          <div
            key={user.id}
            className="flex flex-col gap-4 bg-zinc-700 p-4 rounded-lg w-full"
          >
            <>
              <div className="flex gap-2 justify-between">
                <TextField
                  label="NAME"
                  size="small"
                  value={thisUser?.name}
                  onChange={(e) => {
                    setRoles([
                      ...otherRolesBefore,
                      { ...thisUser, name: e.target.value },
                      ...otherRolesAfter,
                    ]);
                  }}
                />
                <IconButton
                  onClick={() => {
                    setRoles([...otherRolesBefore, ...otherRolesAfter]);
                  }}
                >
                  <RemoveCircleIcon sx={{ color: "white" }} />
                </IconButton>
              </div>

              <TextField
                label="DESCRIPTION"
                size="small"
                value={thisUser?.description}
                onChange={(e) => {
                  setRoles([
                    ...otherRolesBefore,
                    { ...thisUser, description: e.target.value },
                    ...otherRolesAfter,
                  ]);
                }}
              />
            </>
          </div>
        );
      })}
    </div>
  );
}

export default Roles;
