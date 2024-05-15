import React from "react";
import { useTheme, createTheme, ThemeProvider } from "@mui/material/styles";
import { Button, IconButton, Modal, Typography } from "@mui/material";
// import { MUITheme } from "../../syles/MUITheme";
// import CodeEditor from "../../components/CodeEditor/CodeEditor";
import { MUITheme } from "../../../../../syles/MUITheme";
import CodeEditor from "../../../../../components/CodeEditor/CodeEditor";

function DependenciesConfiguration({ handleChangeInputMenu }) {
  let theme = useTheme();
  theme = createTheme(theme, MUITheme);
  const dependenciesCode = `
<dependencies>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.0.2</version>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <scope>runtime</scope>
    <optional>true</optional>
</dependency>
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>
<dependency>
    <groupId>org.json</groupId>
    <artifactId>json</artifactId>
    <version>20210307</version>
</dependency>

<dependency>
    <groupId>org.modelmapper</groupId>
    <artifactId>modelmapper</artifactId>
    <version>3.2.0</version>
</dependency>

</dependencies>
`;
  return (
    <ThemeProvider theme={theme}>
      <label className="text-white text-center font-semibold text-lg">
        DEPENDENCIES
      </label>
      <div>
        <label className="text-white">
          * Don't forget to copy these dependencies on your pom.XML file
        </label>
        <div className="overflow-auto" style={{ height: "400px" }}>
          <CodeEditor
            codeString={dependenciesCode}
            language="xml"
            // header={false}
            //   bgColor="rgba(0, 0, 0,0)"
            padding="5px"
            title="pom.xml"
            // internalMenu
          />
        </div>
      </div>
      <div className="flex gap-4 justify-between">
        <Button
          variant="contained"
          size="large"
          onClick={() => {
            //   setTableStructure(getEstructure(code));
            handleChangeInputMenu("0");
          }}
        >
          Back
        </Button>
        <Button
          variant="contained"
          size="large"
          onClick={() => {
            //   setTableStructure(getEstructure(code));
            handleChangeInputMenu("2");
          }}
        >
          Continue
        </Button>
      </div>
    </ThemeProvider>
  );
}

export default DependenciesConfiguration;
