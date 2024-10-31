import { FormControl, InputLabel, Select } from "@mui/material";
import React from "react";

function CSelect({ label, children, ...rest }) {
  return (
    <FormControl>
      <InputLabel>{label} </InputLabel>
      <Select label={label} {...rest}>
        {children}
      </Select>
    </FormControl>
  );
}

export default CSelect;
