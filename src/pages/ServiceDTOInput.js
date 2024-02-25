import React from "react";
import CodeEditor from "../components/CodeEditor/CodeEditor";
import { Spaced, UCC } from "../StringFunctions";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";

function ServiceDTOInput({ DTO, table, selectedService }) {
  const DTOFiles = DTO?.inputDTO[UCC(table.name)] ?? {};
  // const [value, setValue] = React.useState(0);

  // const handleChange = (event, newValue) => {
  //   setValue(newValue);
  // };
  // console.log(selectedService);
  // console.log(DTOFiles);
  return (
    <div>
      {Object.keys(DTOFiles).map(
        (IDTO, index) =>
          IDTO === selectedService.inputDTO && (
            <div
              className=" p-4 grid gap-2 m-2"
              style={{
                backgroundColor: "rgb(58 64 77)",
                maxHeight: "69vh",
                overflow: "auto",
              }}
            >
              {DTOFiles[IDTO]?.["attributes"]?.map((code, index) => (
                <CodeEditor
                  key={index}
                  codeString={code}
                  language="java"
                  header={false}
                  bgColor="rgb(40, 44, 52)"
                  padding="5px"
                  internalMenu
                  onDelete={(attr) => {
                    // setDtoList((prevDtoList) => {
                    //   const newDTOList = { ...prevDtoList };
                    //   const newAttributes = newDTOList[table?.name][
                    //     "attributes"
                    //   ].filter((attr) => attr !== code);
                    //   newDTOList[table?.name]["attributes"] = newAttributes;
                    //   return newDTOList;
                    // });
                  }}
                />
              ))}
            </div>
          )
      )}
    </div>
  );
}

export default ServiceDTOInput;
