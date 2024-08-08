import { FormControl, TextField, Typography } from "@mui/material";
import React from "react";

function CTextfield({ label, fullWidth, ...rest }) {
  return (
    <FormControl fullWidth={fullWidth} sx={{ marginBottom: "12px" }}>
      {label && (
        <Typography
          variant="body2"
          component="label"
          fontSize="12px"
          fontWeight={600}
        >
          {label}
        </Typography>
      )}
      <TextField
        variant="outlined"
        size="small"
        fullWidth={fullWidth}
        {...rest}
      />
    </FormControl>
  );
}

export default CTextfield;
