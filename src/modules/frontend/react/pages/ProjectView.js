import { Button } from "@mui/material";
import React, { useState } from "react";
import CardP from "../../../../components/Card/CardP";
import ReactProjectManager from "./ReactProjectManager";

function ProjectView() {
  const [selectedReactProject, setSelectedReactProject] = useState({});

  return (
    <>
      {Object.keys(selectedReactProject).length !== 0 ? (
        <ReactProjectManager />
      ) : (
        <div className="flex gap-4">
          <CardP
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
          />
          <Button sx={{ width: "200px", height: "150px" }}>
            <h2>ADD PROJECT</h2>
          </Button>
        </div>
      )}
    </>
  );
}

export default ProjectView;
