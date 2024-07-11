import { Box, Button, Divider, Modal } from "@mui/material";
import React, { useState, useContext } from "react";
import { boxStyle } from "../../syles/BoxStyle";
import TextField from "@mui/material/TextField";
import DatabaseContext from "../../context/DatabaseProvider";

function AddDatabase() {
  const { database } = useContext(DatabaseContext);

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
  const [environment, setEnvironment] = useState("desarrollo");
  const [url, setUrl] = useState("");
  //--on Hold
  const [engine, setEngine] = useState("PostgreSQL");
  const [syntax, setSyntax] = useState("DbDiagram");
  //--DOCKER
  const [imageName, setImageName] = useState("postgres_User_Img");
  const [containerName, setContainerName] = useState("User_db");
  const [port, setPort] = useState("5432");

  return (
    <>
      <div className="grid items-start">
        <Button
          size="large"
          onClick={() => {
            setOpen(true);
          }}
        >
          Add Database
        </Button>
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
              <Divider variant="middle" sx={{ paddingBottom: "14px" }}>
                DATABASE
              </Divider>
              <div className="flex gap-2">
                <TextField
                  label="name"
                  size="small"
                  defaultValue={name}
                  onChange={(e) => {
                    setName(e?.target?.value);
                  }}
                  sx={{
                    backgroundColor: "rgb(40, 44, 52)",
                    color: "white",
                    border: "none",
                  }}
                />
                <TextField
                  label="username"
                  size="small"
                  defaultValue={username}
                  onChange={(e) => {
                    setUsername(e?.target?.value);
                  }}
                  sx={{
                    backgroundColor: "rgb(40, 44, 52)",
                    color: "white",
                    border: "none",
                  }}
                />
                <TextField
                  label="password"
                  size="small"
                  defaultValue={password}
                  onChange={(e) => {
                    setPassword(e?.target?.value);
                  }}
                  sx={{
                    backgroundColor: "rgb(40, 44, 52)",
                    color: "white",
                    border: "none",
                  }}
                />
                <TextField
                  label="location"
                  size="small"
                  defaultValue={address}
                  onChange={(e) => {
                    setAddress(e?.target?.value);
                  }}
                  sx={{
                    backgroundColor: "rgb(40, 44, 52)",
                    color: "white",
                    border: "none",
                  }}
                />
              </div>
              <Divider variant="middle" sx={{ paddingBottom: "14px" }}>
                DOCKER
              </Divider>
              <div className="flex gap-2">
                <TextField
                  label="imageName	"
                  size="small"
                  defaultValue={imageName}
                  onChange={(e) => {
                    setImageName(e?.target?.value);
                  }}
                  sx={{
                    backgroundColor: "rgb(40, 44, 52)",
                    color: "white",
                    border: "none",
                  }}
                />
                <TextField
                  label="containerName"
                  size="small"
                  defaultValue={containerName}
                  onChange={(e) => {
                    setContainerName(e?.target?.value);
                  }}
                  sx={{
                    backgroundColor: "rgb(40, 44, 52)",
                    color: "white",
                    border: "none",
                  }}
                />
                <TextField
                  label="port "
                  size="small"
                  defaultValue={port}
                  onChange={(e) => {
                    setPort(e?.target?.value);
                  }}
                  sx={{
                    backgroundColor: "rgb(40, 44, 52)",
                    color: "white",
                    border: "none",
                  }}
                />
              </div>
              <Divider variant="middle">DATA MODEL</Divider>
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
                  database.add({
                    name: name,
                    engine: engine,
                    syntax: syntax,
                    json: database.getDBDiagramStructure(code),
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
