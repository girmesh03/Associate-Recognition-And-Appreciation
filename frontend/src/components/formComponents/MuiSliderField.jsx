// react imports
import React from "react";
import { useController } from "react-hook-form";
import PropTypes from "prop-types";

// mui imports
import { Slider, Stack, FormHelperText, Typography } from "@mui/material";
import MonetizationIcon from "@mui/icons-material/MonetizationOnOutlined";
import AccountBalanceIcon from "@mui/icons-material/AccountBalanceWalletOutlined";

const MuiSliderField = ({ name, control, rules, trigger, ...otherProps }) => {
  // useController
  const {
    field: { onChange, value, ...field },
    formState: { errors },
  } = useController({
    name,
    control,
    rules,
  });

  return (
    <Stack direction="column">
      <Stack
        direction="row"
        alignItems="center"
        sx={{
          height: "44px",
          minWidth: "100%",
          padding: "9px",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: "10px",
        }}
      >
        <MonetizationIcon color="primary" />
        <Slider
          {...field}
          {...otherProps}
          value={value}
          onChange={(event, newValue) => {
            onChange(newValue);
            if (
              trigger &&
              (!!errors[name] || newValue < otherProps.defaultValue)
            ) {
              trigger(name);
            }
          }}
          // they are passed as props
          // defaultValue={0}
          // min={0}
          // max={100}
          aria-labelledby="input-slider"
          sx={{
            paddingBottom: 0,
            width: "100%",
            maxHeight: "100%",
            mx: 2,
          }}
        />
        <Typography variant="body1" color="text.secondary">
          {value}
        </Typography>
        <AccountBalanceIcon color="success" />
      </Stack>

      {/* Show validation error message */}
      {errors[name] && (
        <FormHelperText error sx={{ ml: "14px" }}>
          {errors[name]?.message}
        </FormHelperText>
      )}
    </Stack>
  );
};

MuiSliderField.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.object.isRequired,
  rules: PropTypes.object.isRequired,
  trigger: PropTypes.func,
};

export default React.memo(MuiSliderField);
