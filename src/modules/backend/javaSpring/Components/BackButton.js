import React, { useContext } from "react";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { IconButton } from "@mui/material";
import SpringContext from "../Context/SpringProvider";
function BackButton() {
  const { springProject } = useContext(SpringContext);
  return (
    <div className="flex items-center">
      <IconButton
        color="primary"
        onClick={() => {
          springProject.setSelected({});
        }}
      >
        <ArrowBackIosNewIcon color="white" />
      </IconButton>
      <label className="text-white">
        {springProject.selected.name.toUpperCase()}
      </label>
    </div>
  );
}

export default BackButton;
