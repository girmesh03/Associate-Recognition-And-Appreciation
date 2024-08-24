import { styled } from "@mui/material/styles";

const StyledListbox = styled("ul")(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  "& li": {
    padding: theme.spacing(1),
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  },
  maxHeight: "300px",
  "&::-webkit-scrollbar": {
    width: "8px",
  },
  "&::-webkit-scrollbar-thumb": {
    background:
      theme.palette.mode === "light" ? "#eaeaea" : "rgba(255, 255, 255, 0.2)",
    borderRadius: "10px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    background:
      theme.palette.mode === "light" ? "#d8d8d8" : "rgba(255, 255, 255, 0.3)",
  },
}));

export default StyledListbox;
