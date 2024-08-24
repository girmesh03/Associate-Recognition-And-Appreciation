import PropTypes from "prop-types";
import { Controller } from "react-hook-form";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import { AttachMoney, Visibility, VisibilityOff } from "@mui/icons-material";

const FormTextField = ({
  name,
  showPassword,
  setShowPassword,
  control,
  errors,
  getValues,
  ...otherProps
}) => {
  const rules = {
    required: {
      value: true,
      message: `Please enter your ${name}`,
    },
  };

  switch (name) {
    case "confirmPassword":
      rules.validate = {
        isMatch: (fieldValue) =>
          fieldValue === getValues().password || "Passwords do not match",
      };
      break;
    case "email":
      rules.validate = {
        isEmail: (fieldValue) =>
          /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(fieldValue) ||
          "Please enter a valid email address",
      };
      break;
    default:
      break;
  }

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => (
        <TextField
          {...field}
          {...otherProps}
          variant="outlined"
          fullWidth
          size="small"
          error={!!errors[name]}
          helperText={errors[name]?.message}
          InputProps={{
            endAdornment: (name === "password" ||
              name === "confirmPassword") && (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword((prev) => !prev)}
                  edge="end"
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
            startAdornment: name === "points" && (
              <InputAdornment position="start">
                <AttachMoney />
              </InputAdornment>
            ),
            inputProps: name === "points" ? { min: 1 } : {},
          }}
        />
      )}
    />
  );
};

FormTextField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  showPassword: PropTypes.bool,
  setShowPassword: PropTypes.func,
  control: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  getValues: PropTypes.func,
};

export default FormTextField;
