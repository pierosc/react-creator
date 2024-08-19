import React, { useContext } from "react";
import CodeEditor from "../../../../../components/CodeEditor/CodeEditor";
import { Spaced, UCC } from "../../../../../StringFunctions";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import SpringContext from "../../../../../context/SpringProvider";

function DTOOutput({ table }) {
  const { springProject } = useContext(SpringContext);
  const dtoList = springProject?.selected?.outputDTO[table.name] ?? {};
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div style={{ maxHeight: "69vh", overflow: "auto" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange}>
            {Object.keys(dtoList).map((DTOName, index) => (
              <Tab label={Spaced(DTOName)} value={index} textTransform="none" />
            ))}
          </TabList>
        </Box>
        {Object.keys(dtoList).map((IDTO, index) => (
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
                codeString={table?.name ? dtoList[IDTO]?.["imports"] : ""}
                language="java"
                header={false}
                bgColor="rgba(0, 0, 0,0)"
                padding="5px"
                title="imports..."
                internalMenu
              />
              <CodeEditor
                codeString={table?.name ? dtoList[IDTO]?.["className"] : ""}
                language="java"
                header={false}
                bgColor="rgba(0, 0, 0,0)"
                padding="5px"
                title="class name..."
                internalMenu
              />
              {dtoList[IDTO]?.["attributes"]?.map((code, index) => (
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
                codeString={table?.name ? dtoList[IDTO]["bottom"] : ""}
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
