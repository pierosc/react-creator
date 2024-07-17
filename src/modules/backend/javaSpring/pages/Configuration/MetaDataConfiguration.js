import React, { useContext, useState } from "react";
import { Button, Divider } from "@mui/material";
import TextField from "@mui/material/TextField";
import DatabaseContext from "../../../../../context/DatabaseProvider";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import ImageDisplay from "../../../../../components/ImageDisplay/ImageDisplay";
import springImage from "../../../../../assets/springBootInit.png";

function MetaDataConfiguration({
  setMetaData,
  metaData,
  setDbName,
  handleChangeInputMenu,
  spring,
  setSpring,
}) {
  const { db } = useContext(DatabaseContext);

  const handleChange = (event) => {
    db.setSelected(db.dataBases.find((t) => t.name === event.target.value));
  };

  return (
    <div style={{ height: "800px" }}>
      <label className="text-white text-center font-semibold text-lg">
        METADATA CONFIGURATION
      </label>
      <div className="flex gap-2 justify-evenly items-center">
        <div>
          <label className="text-white">
            * These are the tested configurations
          </label>
          <ImageDisplay
            href="https://start.spring.io/"
            imgSrc={springImage}
            imgAlt="Spring Initializr"
            text="Visit start.spring.io"
          />
        </div>

        <div className="flex flex-col justify-around  gap-8">
          <Divider variant="middle" sx={{ paddingBottom: "14px" }}>
            Project Metadata
          </Divider>
          <TextField
            label="Group"
            variant="outlined"
            size="small"
            defaultValue={metaData.group}
            onChange={(e) => {
              setDbName(e.target.value);
              setMetaData((prevMeta) => {
                const newMeta = { ...prevMeta };
                newMeta.group = e.target.value;
                return newMeta;
              });
            }}
          />
          <TextField
            label="Artifact"
            variant="outlined"
            size="small"
            defaultValue={metaData.artifact}
            onChange={(e) => {
              setMetaData((prevMeta) => {
                const newMeta = { ...prevMeta };
                newMeta.artifact = e.target.value;
                return newMeta;
              });
            }}
          />
          <TextField
            label="Name"
            variant="outlined"
            size="small"
            defaultValue={metaData.name}
            onChange={(e) => {
              setDbName(e.target.value);
              setMetaData((prevMeta) => {
                const newMeta = { ...prevMeta };
                newMeta.name = e.target.value;
                return newMeta;
              });
            }}
          />

          <TextField
            label="Package Name"
            variant="outlined"
            size="small"
            defaultValue={metaData.packageName}
            onChange={(e) => {
              setDbName(e.target.value);
              setMetaData((prevMeta) => {
                const newMeta = { ...prevMeta };
                newMeta.packageName = e.target.value;
                return newMeta;
              });
            }}
          />
          <Divider variant="middle" sx={{ paddingBottom: "14px" }}>
            DATABASE
          </Divider>
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
          {/* <FormControlLabel
            control={
                <Switch
                defaultChecked={oppositeRelations}
                onChange={(e) => {
                    setOppositeRelations(e.target.checked);
                }}
                />
            }
            label="Opposite Relations"
            labelPlacement="start"
        /> */}
        </div>
      </div>
      <div className="flex gap-4 justify-end">
        <Button
          variant="contained"
          size="large"
          onClick={() => {
            //   setTableStructure(getEstructure(code));
            setSpring({
              ...spring,
              metaData: metaData,
              name: metaData.name,
              db: db?.selected?.name,
            });
            handleChangeInputMenu("3");
          }}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}

export default MetaDataConfiguration;
