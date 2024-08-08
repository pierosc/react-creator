import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";

function CDialog({
  open,
  fullScreen,
  title,
  actions,
  hideCloseIcon,
  onClickClose,
  PaperProps,
  sx,
  children,
  size = "xs",
}) {
  const handleClose = () => {
    onClickClose && onClickClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={size}
      // PaperProps={{ ...PaperProps, id: title.replaceAll(" ", "-") }}
      fullWidth={true}
      fullScreen={fullScreen}
      sx={sx}
      onClick={(e) => e.stopPropagation()}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <DialogTitle>{title}</DialogTitle>
        {!hideCloseIcon && (
          <IconButton onClick={handleClose} aria-label="close">
            <CloseIcon sx={{ width: "20px", height: "20px" }} />
          </IconButton>
        )}
      </Box>
      <DialogContent>{children}</DialogContent>
      <DialogActions>{actions && actions}</DialogActions>
    </Dialog>
  );
}

export default CDialog;
