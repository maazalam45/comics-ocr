import React from "react";
import Chip from "@mui/material/Chip";
import { statusColors } from "@/others/constants";

interface ComicChipProps {
  comic_status: string;
}

const ComicChip: React.FC<ComicChipProps> = ({ comic_status }) => {
  return (
    <Chip
      label={comic_status.replace(/_/g, " ")} // Format status
      color={statusColors[comic_status] || "default"}
      sx={{ fontWeight: "bold", textTransform: "capitalize" }}
    />
  );
};

export default ComicChip;
