import { Box, Button, Modal } from "@mui/material";
import React, { useContext, useState } from "react";
import CardP from "../../../../components/Card/CardP";
import SpringContext from "../Context/SpringProvider";
import SpringProjectManager from "../SpringProjectManager";
import CreateProject from "./CreateProject/CreateProject";

function ProjectView() {
  const { springProject } = useContext(SpringContext);
  return (
    <>
      {Object.keys(springProject.selected).length !== 0 ? (
        <SpringProjectManager />
      ) : (
        <div className="flex gap-4">
          {springProject.springProjects.map((pj) => (
            <CardP
              properties={{
                name: pj.name,
                db: pj.db,
                // framework: "spring",
                // authorization: "keyCloack",
              }}
              //   onClick={() => {
              //     setSelectedReactProject({ prop: "asd" });
              //     console.log("clicked");
              //   }}
            />
          ))}

          <CreateProject />
        </div>
      )}
      {/* <Modal open={openInitialConfModal} onClose={CloseInitialConfModal}>
        <Box sx={boxStyle}>
          <FormsConfiguration />
        </Box>
      </Modal> */}
    </>
  );
}

export default ProjectView;
