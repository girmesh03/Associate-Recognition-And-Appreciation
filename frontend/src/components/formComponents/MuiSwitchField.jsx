// react imports
import React from "react";
import PropTypes from "prop-types";
import { Switch, FormControlLabel, Tooltip } from "@mui/material";

// mui imports
import { useController } from "react-hook-form";

const MuiSwitchField = ({ name, control, postType, ...otherProps }) => {
  // useController
  const {
    field: { onChange, value, ref },
  } = useController({
    name,
    control,
  });

  return (
    <FormControlLabel
      control={
        <Tooltip
          title={
            value
              ? `This ${postType} is private`
              : `This ${postType} is public, visible to all users`
          }
          placement="top"
          arrow
        >
          <Switch
            id={name}
            name={name}
            checked={!!value} // Ensure value is a boolean
            onChange={(e) => onChange(e.target.checked)}
            inputRef={ref}
            {...otherProps}
          />
        </Tooltip>
      }
      label={value ? "Private" : "Public"}
      sx={{ gap: 1, margin: 0 }}
    />
  );
};

MuiSwitchField.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.object.isRequired,
  postType: PropTypes.string.isRequired,
};

export default React.memo(MuiSwitchField);
