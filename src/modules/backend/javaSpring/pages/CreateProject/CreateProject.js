import React, { useState, useContext } from "react";
import MetaDataConfiguration from "./MetaDataConfiguration";
import FolderStructureConfiguration from "./FolderStructureConfiguration";
import { Box, Button, Modal } from "@mui/material";
import { boxStyle } from "../../../../../syles/BoxStyle";
import SpringContext from "../../Context/SpringProvider";

function CreateProject({ setMetaData, metaData }) {
  const { springProject } = useContext(SpringContext);

  const [openInitialConfModal, setOpenInitialConfModal] = useState(false);
  const CloseInitialConfModal = () => setOpenInitialConfModal(false);

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
    <>
      <Button
        sx={{ width: "200px", height: "150px" }}
        onClick={() => {
          setOpenInitialConfModal(true);
        }}
      >
        <h2>CREATE BACKEND</h2>
      </Button>
      <Modal open={openInitialConfModal} onClose={CloseInitialConfModal}>
        <Box sx={boxStyle}>
          <div className="grid gap-4 p-4">
            {inputMenu === "0" ? (
              <MetaDataConfiguration
                setMetaData={setMetaData}
                metaData={metaData}
                handleChangeInputMenu={handleChangeInputMenu}
                spring={spring}
                setSpring={setSpring}
              />
            ) : (
              <FolderStructureConfiguration
                CloseInitialConfModal={CloseInitialConfModal}
                handleChangeInputMenu={handleChangeInputMenu}
                spring={spring}
              />
            )}
          </div>
        </Box>
      </Modal>
    </>
  );
}

export default CreateProject;

// How to start app
// recommendations:
// 	delete the test folder
// copy application.properties
// docker file
// go to
// http://localhost:8080/doc/swagger-ui/index.html

// advanced configurations
