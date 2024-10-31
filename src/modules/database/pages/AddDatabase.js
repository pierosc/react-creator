import { Box, Button, Divider, Modal } from "@mui/material";
import React, { useState, useContext } from "react";
import { boxStyle } from "../../../syles/BoxStyle";
import TextField from "@mui/material/TextField";
import DatabaseContext from "../../../context/DatabaseProvider";
import BigButton from "../../../components/BigButton/BigButton";
import CTextField from "../../../components/CTextField/CTextField";
import CDivider from "../../../components/CDivider/CDivider";

function AddDatabase() {
  const { db } = useContext(DatabaseContext);

  const [open, setOpen] = useState(false);
  const [code, setCode] = useState(`
  Table users {
    user_id serial [primary key, not null]
    username varchar(50) [not null, note: "correo/dni/cod alumno"]
    password varchar(18) [not null]
    auth_0 varchar(255)
  }
  Table personals_data {
    personal_id serial [primary key, not null]
    personal_uuid uuid [not null]
    user_id int [not null]
    document_type_id int [not null]
    document_number varchar(15) [unique, note: 'buscar max longitud']
    document_url varchar(255)
  }`);

  const [name, setName] = useState("UserDB");
  const [username, setUsername] = useState("yachayhuasi");
  const [password, setPassword] = useState("yachayhuasi2023");
  const [address, setAddress] = useState("172.17.32.97:5432/yachayhuasi_db");
  const environment = "desarrollo";
  // const [environment, setEnvironment] = useState("desarrollo");
  const [url, setUrl] = useState("");

  //--on Hold
  const engine = "PostgreSQL";
  // const [engine, setEngine] = useState("PostgreSQL");
  const syntax = "DbDiagram";
  // const [syntax, setSyntax] = useState("DbDiagram");

  //--DOCKER
  const [imageName, setImageName] = useState("postgres_User_Img");
  const [containerName, setContainerName] = useState("User_db");
  const [port, setPort] = useState("5432");

  return (
    <>
      <div className="grid items-start">
        <BigButton
          label="Add Database"
          onClick={() => {
            setOpen(true);
          }}
        />
      </div>
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <Box sx={boxStyle}>
          <div
            className="flex flex-col gap-2 justify-between p-4 "
            style={{ height: "800px" }}
          >
            <div className="grid gap-2">
              <label className="text-white text-center font-semibold text-lg">
                ADD DATABASE
              </label>

              <CDivider label={"DATABASE"} />

              <div className="flex gap-2">
                <CTextField
                  label="name"
                  defaultValue={name}
                  onChange={(e) => {
                    setName(e?.target?.value);
                  }}
                />

                <CTextField
                  label="username"
                  defaultValue={username}
                  onChange={(e) => {
                    setUsername(e?.target?.value);
                  }}
                />

                <CTextField
                  label="password"
                  defaultValue={password}
                  onChange={(e) => {
                    setPassword(e?.target?.value);
                  }}
                />

                <CTextField
                  label="location"
                  defaultValue={address}
                  onChange={(e) => {
                    setAddress(e?.target?.value);
                  }}
                />
              </div>

              <CDivider label={"DOCKER"} />

              <div className="flex gap-2">
                <CTextField
                  label="imageName"
                  defaultValue={imageName}
                  onChange={(e) => {
                    setImageName(e?.target?.value);
                  }}
                />
                <CTextField
                  label="containerName"
                  defaultValue={containerName}
                  onChange={(e) => {
                    setContainerName(e?.target?.value);
                  }}
                />
                <CTextField
                  label="port"
                  defaultValue={port}
                  onChange={(e) => {
                    setPort(e?.target?.value);
                  }}
                />
              </div>

              <CDivider label={"DATA MODEL"} />

              <div className="flex justify-between items-start gap-4">
                <div className="grid">
                  <label className="text-white">
                    * Copy and paste your model from DB diagram
                  </label>
                  <label className="text-white">
                    * Don't forget to delete all the comments of your Data Model
                  </label>
                </div>
                <TextField
                  label="DbDiagram URL"
                  size="small"
                  defaultValue={url}
                  onChange={(e) => {
                    setUrl(e?.target?.value);
                  }}
                  sx={{
                    backgroundColor: "rgb(40, 44, 52)",
                    color: "white",
                    border: "none",
                  }}
                />
              </div>
              <div
                style={{
                  maxHeight: "69vh",
                  overflowY: "auto",
                  overflowX: "hidden",
                  height: "100%",
                }}
              >
                <TextField
                  id="outlined-multiline-static"
                  multiline
                  rows={15}
                  defaultValue={code}
                  onChange={(e) => {
                    setCode(e?.target?.value);
                  }}
                  sx={{
                    backgroundColor: "rgb(40, 44, 52)",
                    color: "white",
                    border: "none",
                    width: "100%",
                    height: "100%",
                  }}
                />
              </div>
            </div>
            <div className="flex gap-2 justify-between">
              <Button
                variant="contained"
                size="large"
                onClick={() => {
                  db.add({
                    name: name,
                    engine: engine,
                    syntax: syntax,
                    json: db.getDBDiagramStructure(code),
                    plainText: code,
                    url: url,
                    environment: [
                      {
                        name: environment,
                        address: address,
                        username: username,
                        password: password,
                      },
                    ],
                  });
                  setOpen(false);
                }}
              >
                Continue
              </Button>
            </div>
          </div>
        </Box>
      </Modal>
    </>
  );
}

export default AddDatabase;
