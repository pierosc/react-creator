import { Divider, IconButton, TextField } from "@mui/material";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import React from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import MultipleSelectChip from "../../components/MultipleSelectChip/MultipleSelectChip";

function Users({ users, setUsers, roles }) {
  return (
    <div className="grid gap-2 items-end justify-around">
      <Divider>
        <div className="flex gap-2">
          <div className="flex">
            <label className="text-white">USERS</label>
          </div>
          <IconButton
            onClick={() => {
              const id = users[users.length - 1]?.id + 1;
              setUsers([
                ...users,
                {
                  id: id,
                  username: `user-${id}`,
                  email: `user-${id}@gmail.com`,
                  password: "1234",
                  roles: [],
                },
              ]);
            }}
          >
            <AddCircleIcon sx={{ color: "white" }} />
          </IconButton>
        </div>
      </Divider>
      {users.map((user) => {
        const otherUsersBefore = users.filter((u) => u.id < user.id);
        const otherUsersAfter = users.filter((u) => u.id > user.id);
        const thisUser = users.find((u) => u.id === user.id);

        return (
          <div
            key={user.id}
            className="flex flex-col gap-4 bg-zinc-700 p-4 rounded-lg w-full"
          >
            <>
              <div className="flex gap-2 justify-between">
                <TextField
                  label="KEYCLOAK USER"
                  size="small"
                  value={thisUser?.username}
                  onChange={(e) => {
                    setUsers([
                      ...otherUsersBefore,
                      { ...thisUser, username: e.target.value },
                      ...otherUsersAfter,
                    ]);
                  }}
                />
                <IconButton
                  onClick={() => {
                    setUsers([...otherUsersBefore, ...otherUsersAfter]);
                  }}
                >
                  <RemoveCircleIcon sx={{ color: "white" }} />
                </IconButton>
              </div>
              <TextField
                label="KEYCLOAK PASSWORD"
                size="small"
                value={thisUser?.password}
                onChange={(e) => {
                  setUsers([
                    ...otherUsersBefore,
                    { ...thisUser, password: e.target.value },
                    ...otherUsersAfter,
                  ]);
                }}
              />
              <TextField
                label="KEYCLOAK EMAIL"
                size="small"
                value={thisUser?.email}
                onChange={(e) => {
                  setUsers([
                    ...otherUsersBefore,
                    { ...thisUser, email: e.target.value },
                    ...otherUsersAfter,
                  ]);
                }}
              />
              <MultipleSelectChip />
            </>
          </div>
        );
      })}
    </div>
  );
}

export default Users;
