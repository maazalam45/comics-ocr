import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function DeleteDialog({
  openDelete,
  handleDelete,
  toggleDeleteModal,
}: any) {
  return (
    <Dialog
      open={openDelete}
      onClose={toggleDeleteModal}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      sx={{
        "& .MuiPaper-root": {
          background: "#1e1e1e",
          color: "white",
        },
      }}
    >
      <DialogTitle id="alert-dialog-title">
        {"Are you sure want to delete the comic?"}
      </DialogTitle>
      <DialogActions>
        <Button onClick={toggleDeleteModal}>No</Button>
        <Button onClick={handleDelete} autoFocus>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
