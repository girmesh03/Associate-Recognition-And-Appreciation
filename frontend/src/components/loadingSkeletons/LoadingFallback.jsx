import PropTypes from "prop-types";
import { Box, CircularProgress } from "@mui/material";

const LoadingFallback = ({
  height = "100vh",
  width = "100%",
  sx = {},
  ...props
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height,
        width,
        margin: "0 auto",
        ...sx,
      }}
      {...props} // Pass other props if any
    >
      <CircularProgress />
    </Box>
  );
};

LoadingFallback.propTypes = {
  height: PropTypes.string,
  width: PropTypes.string,
  sx: PropTypes.object,
};

export default LoadingFallback;
