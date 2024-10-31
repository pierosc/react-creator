import { Divider } from "@mui/material";
import React from "react";

function CDivider({ label, rest }) {
  return (
    <Divider variant="middle" sx={{ paddingBottom: "14px" }} {...rest}>
      {label}
    </Divider>
  );
}

export default CDivider;
