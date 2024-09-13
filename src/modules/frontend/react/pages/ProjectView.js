import { Box, Button, Modal } from "@mui/material";
import React, { useContext, useState } from "react";
import CardP from "../../../../components/Card/CardP";
import ReactProjectManager from "./ReactProjectManager";
import FormsConfiguration from "./Configuration/FormsConfiguration";
import { boxStyle } from "../../../../syles/BoxStyle";
import ReactContext from "../Context/ReactProvider";
import CreateProject from "./CreateProject/CreateProject";

function ProjectView() {
  const { reactPJ } = useContext(ReactContext);

  console.log(reactPJ);
  const [selectedReactProject, setSelectedReactProject] = useState({});

  // MODAL CONTROLS --------------------------------
  const [openInitialConfModal, setOpenInitialConfModal] = useState(false);
  const CloseInitialConfModal = () => setOpenInitialConfModal(false);

  return (
    <>
      {Object.keys(reactPJ.selected).length !== 0 ? (
        <ReactProjectManager />
      ) : (
        <div className="flex gap-4">
          {reactPJ.reactProjects.map((pj) => (
            <CardP
              properties={{
                name: "REACT 1",
                db: "REACT 2",
                PROJECT3: "REACT 3",
                PROJECT4: "REACT 4",
              }}
              onClick={() => {
                setSelectedReactProject({ prop: "asd" });
                console.log("clicked");
              }}
            />
          ))}
          {/* <CardP
            properties={{
              PROJECT1: "REACT 1",
              PROJECT2: "REACT 2",
              PROJECT3: "REACT 3",
              PROJECT4: "REACT 4",
            }}
            onClick={() => {
              setSelectedReactProject({ prop: "asd" });
              console.log("clicked");
            }}
          />
          <CardP
            properties={{
              PROJECT1: "REACT 1",
              PROJECT2: "REACT 2",
              PROJECT3: "REACT 3",
              PROJECT4: "REACT 4",
              PROJECT5: "REACT 5",
            }}
          />
          <CardP
            properties={{
              PROJECT1: "REACT 1",
              PROJECT3: "REACT 3",
              PROJECT4: "REACT 4",
            }}
          /> */}
          {/* <Button
            sx={{ width: "200px", height: "150px" }}
            onClick={() => {
              setOpenInitialConfModal(true);
            }}
          >
            <h2>ADD PROJECT</h2>
          </Button> */}
          <CreateProject />
        </div>
      )}
      <Modal open={openInitialConfModal} onClose={CloseInitialConfModal}>
        <Box sx={boxStyle}>
          <FormsConfiguration />
        </Box>
      </Modal>
    </>
  );
}

export default ProjectView;
