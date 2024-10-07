// react imports
import React from "react";
import { Controller } from "react-hook-form";
import PropTypes from "prop-types";

// mui imports
import { TextField } from "@mui/material";
import { styled } from "@mui/material/styles";

// styled component
const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-root": {
    color: theme.palette.text.secondary,
  },
  "& .MuiOutlinedInput-root": {
    border: "none",
    "& fieldset": {
      boxShadow: "none",
      backgroundColor: "inherit",
    },
    "&.Mui-focused": {
      outline: "none",
    },
  },
  textarea: {
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },
}));

const CommentField = ({ name, control, ...otherProps }) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={{
        maxLength: {
          value: 100,
          message: "Comment cannot exceed 100 characters",
        },
      }}
      render={({ field, fieldState: { error } }) => (
        <StyledTextField
          {...field}
          {...otherProps}
          id={name}
          name={name}
          fullWidth
          multiline
          minRows={1}
          maxRows={4}
          size="small"
          placeholder="Write a comment..."
          error={!!error}
          helperText={error?.message}
        />
      )}
    />
  );
};

CommentField.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.object.isRequired,
  selectedEmoji: PropTypes.string,
};

export default React.memo(CommentField);
