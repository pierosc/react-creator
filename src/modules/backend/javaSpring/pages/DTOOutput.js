import React from "react";
import CodeEditor from "../../../../components/CodeEditor/CodeEditor";
import { Spaced, UCC } from "../../../../StringFunctions";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";

function DTOOutput({ DTO, table }) {
  const DTOFiles = DTO.outputDTO[UCC(table.name)];
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div style={{ maxHeight: "69vh", overflow: "auto" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange}>
            {Object.keys(DTOFiles).map((DTOName, index) => (
              <Tab label={Spaced(DTOName)} value={index} textTransform="none" />
            ))}
          </TabList>
        </Box>
        {Object.keys(DTOFiles).map((IDTO, index) => (
          <TabPanel value={index} sx={{ padding: "0" }}>
            <div
              className=" p-4 grid gap-2 m-2"
              style={{
                backgroundColor: "rgb(58 64 77)",
                maxHeight: "69vh",
                overflow: "auto",
              }}
            >
              <CodeEditor
                codeString={table?.name ? DTOFiles[IDTO]?.["imports"] : ""}
                language="java"
                header={false}
                bgColor="rgba(0, 0, 0,0)"
                padding="5px"
                title="imports..."
                internalMenu
              />
              <CodeEditor
                codeString={table?.name ? DTOFiles[IDTO]?.["className"] : ""}
                language="java"
                header={false}
                bgColor="rgba(0, 0, 0,0)"
                padding="5px"
                title="class name..."
                internalMenu
              />
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
              <CodeEditor
                codeString={table?.name ? DTOFiles[IDTO]["bottom"] : ""}
                language="java"
                header={false}
                bgColor="rgba(0, 0, 0,0)"
                padding="5px"
              />
            </div>
          </TabPanel>
        ))}
      </TabContext>
    </div>
  );
}

export default DTOOutput;
