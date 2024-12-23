import {
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useContext, useEffect } from "react";
import DatabaseContext from "../../../../../context/DatabaseProvider";
import ReactContext from "../../Context/ReactProvider";

function ProjectConfiguration({ react, setReact, CloseInitialConfModal }) {
  const { db } = useContext(DatabaseContext);
  const { reactPJ } = useContext(ReactContext);

  const handleChange = (e) => {
    console.log(e.target.value);
    // db.setSelected(db.dataBases.find((t) => t.name === event.target.value));
    setReact((prevReact) => {
      const newReact = { ...prevReact };
      newReact.db = e.target.value;
      return newReact;
    });
  };

  return (
    <div style={{ height: "800px" }}>
      <label className="text-white text-center font-semibold text-lg">
        PROJECT CONFIGURATION
      </label>
      <div className="grid gap-4">
        <TextField
          label="Name"
          variant="outlined"
          size="small"
          defaultValue={react.name}
          onChange={(e) => {
            setReact((prevReact) => {
              const newReact = { ...prevReact };
              newReact.name = e.target.value;
              return newReact;
            });
          }}
        />
        <Divider variant="middle" sx={{ paddingBottom: "14px" }}>
          DATABASE
        </Divider>
        <FormControl fullWidth>
          <InputLabel>DATABASE</InputLabel>
          <Select
            value={react.db ?? ""}
            size="small"
            label="PROJECT"
            onChange={handleChange}
          >
            {db.dataBases.map((db) => (
              <MenuItem value={db.name}>{db.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          size="large"
          onClick={() => {
            console.log(
              "%cREACT PROJECT CREATED",
              "background-color: blue; color: white;"
            );
            reactPJ.add(react);
            // setReact({
            //   ...spring,
            //   metaData: metaData,
            //   name: metaData.name,
            //   db: db?.selected?.name,
            // });
            CloseInitialConfModal();
            // handleChangeInputMenu("3");
          }}
        >
          CREATE PROJECT
        </Button>
      </div>
    </div>
  );
}

export default ProjectConfiguration;
