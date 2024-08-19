import React, { useState } from "react";
import MetaDataConfiguration from "./MetaDataConfiguration";
import DependenciesConfiguration from "./DependenciesConfiguration";
import FolderStructureConfiguration from "./FolderStructureConfiguration";

function InitialConfiguration({
  DTO,
  entities,
  services,
  controllers,
  repositories,
  CloseInitialConfModal,
  setMetaData,
  metaData,
}) {
  const [inputMenu, setInputMenu] = React.useState("0");
  const handleChangeInputMenu = (newValue) => {
    setInputMenu(newValue);
  };

  const [spring, setSpring] = useState({
    name: "",
    entity: [],
    repository: [],
    service: [],
    controller: [],
    inputDTO: [],
    outputDTO: [],
    db: "",
    metaData: {},
  });

  return (
    <div className="grid gap-4 p-4">
      {inputMenu === "0" ? (
        <MetaDataConfiguration
          setMetaData={setMetaData}
          metaData={metaData}
          handleChangeInputMenu={handleChangeInputMenu}
          spring={spring}
          setSpring={setSpring}
        />
      ) : inputMenu === "1" ? (
        <DependenciesConfiguration
          handleChangeInputMenu={handleChangeInputMenu}
        />
      ) : (
        <FolderStructureConfiguration
          DTO={DTO}
          entities={entities}
          services={services}
          controllers={controllers}
          repositories={repositories}
          CloseInitialConfModal={CloseInitialConfModal}
          handleChangeInputMenu={handleChangeInputMenu}
          spring={spring}
        />
      )}
    </div>
  );
}

export default InitialConfiguration;

// How to start app
// recommendations:
// 	delete the test folder
// copy application.properties
// docker file
// go to
// http://localhost:8080/doc/swagger-ui/index.html

// advanced configurations
