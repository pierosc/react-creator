import { TabContext, TabList } from "@mui/lab";
import { Box, Tab } from "@mui/material";
import TabPanel from "@mui/lab/TabPanel";
import React from "react";

function TabMenu({
  menu,
  backgroundColor = "rgb(75, 75, 75)",
  position = "center",
}) {
  const [value, setValue] = React.useState("0");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <TabContext value={value}>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          backgroundColor: { backgroundColor },
        }}
      >
        <div className={`flex gap-2 justify-${position}`}>
          <TabList onChange={handleChange}>
            {menu.map((tab, i) => (
              <Tab
                key={i}
                label={
                  tab?.img !== undefined ? (
                    <img
                      src={tab?.img}
                      //   alt={tab?.img}
                      style={{ maxWidth: "50px" }}
                    />
                  ) : (
                    tab?.label
                  )
                }
                value={i.toString()}
                disabled={tab?.disabled ?? false}
              />
            ))}
          </TabList>
        </div>
      </Box>
      {menu.map((tab, i) => (
        <TabPanel key={i} value={i.toString()} sx={{ padding: "0" }}>
          {tab?.content ?? <div></div>}
        </TabPanel>
      ))}
    </TabContext>
  );
}

export default TabMenu;
