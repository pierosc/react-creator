import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { useTheme, createTheme, ThemeProvider } from "@mui/material/styles";
import React from "react";
import { MUITheme } from "./syles/MUITheme";
import JavaSpring from "./modules/backend/javaSpring/JavaSpring";
import Kafka from "./modules/kafka/Kafka";
import kafkaLogo from "./assets/kafka.svg";
import Databases from "./modules/database/Databases";
import { DatabaseProvider } from "./context/DatabaseProvider";
import { SpringProvider } from "./context/SpringProvider";
import ReactModule from "./modules/frontend/react/ReactModule";

function APP() {
  let theme = useTheme();
  theme = createTheme(theme, MUITheme);

  const [value, setValue] = React.useState("0");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <ThemeProvider theme={theme}>
      <DatabaseProvider>
        <SpringProvider>
          <TabContext value={value}>
            <Box
              sx={{
                borderBottom: 1,
                borderColor: "divider",
                backgroundColor: "rgb(75, 75, 75)",
              }}
            >
              <div className="flex gap-2 justify-center">
                <TabList onChange={handleChange}>
                  <Tab label="Databases" value="0" />
                  <Tab label="Java" value="1" />
                  <Tab label="React" value="2" />
                  <Tab
                    label={
                      <img
                        src={kafkaLogo}
                        alt="kafka_logo"
                        style={{ maxWidth: "50px" }}
                      />
                    }
                    value="3"
                  />
                </TabList>
              </div>
            </Box>
            <TabPanel value="0" sx={{ padding: "0" }}>
              <Databases />
            </TabPanel>
            <TabPanel value="1" sx={{ padding: "0" }}>
              <JavaSpring />
            </TabPanel>

            <TabPanel value="2" sx={{ padding: "0" }}>
              <ReactModule />
            </TabPanel>
            <TabPanel value="3" sx={{ padding: "0" }}>
              <Kafka />
            </TabPanel>
          </TabContext>
        </SpringProvider>
      </DatabaseProvider>
    </ThemeProvider>
  );
}

export default APP;
