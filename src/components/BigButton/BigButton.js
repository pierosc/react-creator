import { Button } from "@mui/material";
import React from "react";

function BigButton({ label, onClick, ...params }) {
  return (
    <Button
      sx={{ width: "200px", height: "150px" }}
      onClick={onClick}
      {...params}
    >
      <h2>{label} </h2>
    </Button>
  );
}

export default BigButton;
