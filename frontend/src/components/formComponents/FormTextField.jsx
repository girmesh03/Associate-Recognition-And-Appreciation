// react imports
import React from "react";
import { useController } from "react-hook-form";
import PropTypes from "prop-types";

// mui imports
import { TextField, InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const FormTextField = ({
  name,
  showPassword,
  setShowPassword,
  control,
  rules,
  trigger,
  ...otherProps
}) => {
  //  useController
  const {
    field: { onChange, value, ...field },
    formState: { errors },
  } = useController({ name, control, rules });

  return (
    <TextField
      {...field}
      {...otherProps}
      id={name}
      name={name}
      variant="outlined"
      fullWidth
      size="small"
      value={value}
      onChange={(event) => {
        onChange(event.target.value);
        if (trigger && !!errors[name]) {
          trigger(name);
        }
      }}
      error={!!errors[name]}
      helperText={errors[name]?.message}
      InputProps={{
        endAdornment: (name === "password" || name === "confirmPassword") && (
          <InputAdornment position="end">
            <IconButton
              onClick={() => setShowPassword((prev) => !prev)}
              edge="end"
            >
              {showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

FormTextField.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.object.isRequired,
  rules: PropTypes.object.isRequired,
  trigger: PropTypes.func,
  showPassword: PropTypes.bool,
  setShowPassword: PropTypes.func,
};

export default React.memo(FormTextField);
