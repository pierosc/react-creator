import { useTheme, createTheme, ThemeProvider } from "@mui/material/styles";
import React from "react";
import { MUITheme } from "./syles/MUITheme";
import Kafka from "./modules/kafka/Kafka";
import kafkaLogo from "./assets/kafka.svg";
import flutterLogo from "./assets/flutter-logo.svg";
import Databases from "./modules/database/Databases";
import { DatabaseProvider } from "./context/DatabaseProvider";
import ReactModule from "./modules/frontend/react/ReactModule";
import JavaModule from "./modules/backend/javaSpring/JavaModule";
import { SpringProvider } from "./modules/backend/javaSpring/Context/SpringProvider";
import TabMenu from "./components/TabMenu/TabMenu";
import Docker from "./modules/docker/Docker";

function APP() {
  let theme = useTheme();
  theme = createTheme(theme, MUITheme);

  return (
    <ThemeProvider theme={theme}>
      <DatabaseProvider>
        <SpringProvider>
          <TabMenu
            menu={[
              {
                label: "Databases",
                content: <Databases />,
              },
              {
                label: "Java",
                content: <JavaModule />,
              },
              {
                label: "React",
                content: <ReactModule />,
              },
              {
                // img: { kafkaLogo },
                label: "Kafka",
                content: <Kafka />,
              },
              {
                // img: { kafkaLogo },
                label: "Docker",
                content: <Docker />,
              },
            ]}
          />
        </SpringProvider>
      </DatabaseProvider>
    </ThemeProvider>
  );
}

export default APP;
