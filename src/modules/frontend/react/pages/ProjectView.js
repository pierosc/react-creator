import { Box, Modal } from "@mui/material";
import React, { useContext, useState } from "react";
import CardP from "../../../../components/Card/CardP";
import ReactProjectManager from "./ReactProjectManager";
import FormsConfiguration from "./Configuration/FormsConfiguration";
import { boxStyle } from "../../../../syles/BoxStyle";
import ReactContext from "../Context/ReactProvider";
import CreateProject from "./CreateProject/CreateProject";

function ProjectView() {
  const { reactPJ } = useContext(ReactContext);

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
                name: pj.name,
                db: pj.db,
              }}
              onClick={() => {
                reactPJ.setSelected(pj);
              }}
            />
          ))}

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
