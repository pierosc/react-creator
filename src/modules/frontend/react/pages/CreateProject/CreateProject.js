import { Box, Button, Modal } from "@mui/material";
import React, { useState } from "react";
import ProjectConfiguration from "./ProjectConfiguration";
import { boxStyle } from "../../../../../syles/BoxStyle";

function CreateProject() {
  const [openInitialConfModal, setOpenInitialConfModal] = useState(false);
  const CloseInitialConfModal = () => setOpenInitialConfModal(false);

  const [react, setReact] = useState({
    name: "",
    forms: [],
    requests: [],
    backend: [],
    db: "",
  });

  return (
    <div>
      <Button
        sx={{ width: "200px", height: "150px" }}
        onClick={() => {
          setOpenInitialConfModal(true);
        }}
      >
        <h2>ADD PROJECT</h2>
      </Button>
      <Modal open={openInitialConfModal} onClose={CloseInitialConfModal}>
        <Box sx={boxStyle}>
          <div className="grid gap-4 p-4">
            <ProjectConfiguration
              react={react}
              setReact={setReact}
              CloseInitialConfModal={CloseInitialConfModal}
            />
          </div>
        </Box>
      </Modal>
    </div>
  );
}

export default CreateProject;
