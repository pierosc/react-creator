import React, { useState, useEffect, useContext } from "react";
import CodeEditor from "../../../../components/CodeEditor/CodeEditor";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import { Button } from "@mui/material";
import SpringContext from "../../../../context/SpringProvider";

function Services({ JPA, table, setSelectedService }) {
  const { springProject } = useContext(SpringContext);
  const servicesList = springProject?.selected?.service ?? {};

  console.group("Services view inputs");
  console.log(JPA);
  console.log(table);
  console.log(setSelectedService);
  console.groupEnd();

  const [attributes, setAttributes] = useState([]);
  const [selectedCodeEditor, setSelectedCodeEditor] = useState(null);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setAttributes(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  useEffect(() => {
    setAttributes([]);
  }, [table]);

  return (
    <div className="flex flex-col  gap-1">
      <div className="flex gap-1 items-center justify-around">
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Service Type</InputLabel>
          <Select multiple size="small" value={attributes}>
            <MenuItem value={"findBy"}>Find By</MenuItem>
          </Select>
        </FormControl>
        <div>
          <FormControl sx={{ width: 200 }}>
            <InputLabel>Find By</InputLabel>
            <Select
              multiple
              size="small"
              value={attributes}
              onChange={handleChange}
              input={<OutlinedInput label="Tag" />}
              renderValue={(selected) => {
                console.log(selected);
                // console.log(selected.map((value) => value.name).join(", "));
                return selected.map((value) => value.name).join(", ");
              }}
            >
              {table.attributes
                .filter((attr) => !attr.pk)
                .map((attr) => (
                  <MenuItem key={attr.name} value={attr}>
                    <Checkbox checked={attributes.indexOf(attr) > -1} />
                    <ListItemText primary={attr.name} />
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </div>
        <Button
          variant="outlined"
          size="large"
          onClick={() => {
            JPA.createFindByEndpoint(attributes, table);
          }}
        >
          Add Service
        </Button>
      </div>
      <div
        className=" p-4 grid gap-2"
        style={{
          backgroundColor: "rgb(58 64 77)",
          maxHeight: "65vh",
          overflow: "auto",
        }}
      >
        <CodeEditor
          codeString={table?.name ? servicesList?.[table?.name]["imports"] : ""}
          language="java"
          header={false}
          bgColor="rgba(0, 0, 0,0)"
          padding="5px"
          title="imports..."
          internalMenu
        />
        <CodeEditor
          codeString={
            table?.name ? servicesList?.[table?.name]["classStart"] : ""
          }
          language="java"
          header={false}
          bgColor="rgba(0, 0, 0,0)"
          padding="5px"
          title="imports..."
          internalMenu
        />
        {servicesList?.[table?.name]?.["services"]?.map((code, index) => (
          <CodeEditor
            key={index}
            codeString={code}
            language="java"
            header={false}
            bgColor="rgb(40, 44, 52)"
            padding="5px"
            internalMenu
            otherCodeEditorSelected={selectedCodeEditor != index}
            onClick={(code, isSelected) => {
              setSelectedCodeEditor(index);
              // console.log(code);
              const service = isSelected
                ? {
                    service: code.trim().split(" ")[2].split("(")[0],
                    inputDTO:
                      code.trim().split(" ")[2].split("(")[1] !== ")"
                        ? code.trim().split(" ")[2].split("(")[1]
                        : "",
                    outputDTO: code.trim().split(" ")[1].includes("DTO")
                      ? code.trim().split(" ")[1]
                      : "",
                  }
                : {};
              // console.log(service);
              setSelectedService(service);
            }}
          />
        ))}
        <CodeEditor
          codeString={table?.name ? servicesList[table?.name]["classEnd"] : ""}
          language="java"
          header={false}
          bgColor="rgba(0, 0, 0,0)"
          padding="5px"
        />
      </div>
    </div>
  );
}

export default Services;
