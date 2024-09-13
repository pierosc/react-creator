import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import React, { useContext, useState } from "react";
import CDialog from "../../Components/Dialog/CDialog";
import CTextfield from "../../Components/Textfield/CTextfield";
import DatabaseContext from "../../../../../context/DatabaseProvider";

function CreateProject() {
  const { db } = useContext(DatabaseContext);
  const [dbSelectedForProject, setDbSelectedForProject] = useState({});
  const [open, setOpen] = useState(false);
  const onClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    // console.log(db.dataBases);
    // console.log(event.target.value);
    // console.log(db.dataBases.find((t) => t.name === event.target.value));
    // setUrl(db.dataBases.find((t) => t.name === event.target.value).url);
    setDbSelectedForProject(
      db.dataBases.find((t) => t.name === event.target.value)
    );
  };

  return (
    <div>
      {/* <Button
        onClick={() => {
          setOpen(true);
        }}
      >
        OPEN {table.name}
      </Button> */}
      <Button
        sx={{ width: "200px", height: "150px" }}
        onClick={() => {
          setOpen(true);
        }}
      >
        <h2>ADD PROJECT</h2>
      </Button>
      <CDialog
        open={open}
        title={`CREATE REACT PROJECT`}
        onClickClose={onClose}
        actions={
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            width="100%"
          >
            <Button
              fullWidth
              size="large"
              // onClick={() => handleSubmit()}
            >
              ADD
            </Button>
            {/* <Typography
              variant="body2"
              component="span"
              width="75%"
              textAlign="center"
              marginTop="12px"
            >
              Hola
            </Typography> */}
          </Box>
        }
      >
        <Typography
          variant="body2"
          textAlign="center"
          fontWeight={600}
          sx={{ marginBottom: "12px" }}
        >
          Datos del proyecto
        </Typography>
        <CTextfield
          name="Project Name"
          label="Project Name"
          //   type="email"
          //   placeholder="jorge@gmail.com"
          fullWidth
          //  value={values.email}
          //  error={touched.email && !!errors.email}
          //  helperText={touched.email && errors.email}
          //  onChange={handleChange}
        />
        <FormControl fullWidth>
          <InputLabel>DATABASE</InputLabel>
          <Select
            value={db?.selected?.name ?? ""}
            size="small"
            label="PROJECT"
            onChange={handleChange}
          >
            {db.dataBases.map((db) => (
              <MenuItem value={db.name}>{db.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>BACKEND</InputLabel>
          <Select
            value={db?.selected?.name ?? ""}
            size="small"
            label="PROJECT"
            onChange={handleChange}
          >
            {db.dataBases.map((db) => (
              <MenuItem value={db.name}>{db.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </CDialog>
    </div>
  );
}

export default CreateProject;
