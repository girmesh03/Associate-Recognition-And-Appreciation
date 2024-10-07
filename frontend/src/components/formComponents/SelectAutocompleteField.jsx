// react imports
import React from "react";
import PropTypes from "prop-types";
import { useController } from "react-hook-form";

// mui imports
import { Autocomplete, TextField } from "@mui/material";

// utils imports
import renderOptionItem from "./renderOptionItem";

const SelectAutocompleteField = ({
  name,
  control,
  rules,
  options,
  trigger,
  ...otherProps
}) => {
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
    <Autocomplete
      {...field}
      options={options}
      onChange={(event, newValue) => {
        onChange(
          newValue
            ? name === "receiver"
              ? newValue._id
              : newValue.label
            : null
        );
        if (trigger && !!errors[name]) {
          trigger(name);
        }
      }}
      value={
        value
          ? options.find((option) => {
              return name === "receiver"
                ? option._id === value
                : option.label === value;
            }) ?? null
          : null
      }
      getOptionLabel={(option) =>
        option.label || `${option.firstName} ${option.lastName}` || ""
      }
      isOptionEqualToValue={(option, selected) => {
        return selected ? option._id === selected._id : false;
      }}
      renderOption={renderOptionItem(name)}
      renderInput={(params) => (
        <TextField
          {...params}
          {...otherProps}
          id={name}
          name={name}
          error={!!errors[name]}
          helperText={errors[name]?.message}
        />
      )}
    />
  );
};

SelectAutocompleteField.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.object.isRequired,
  rules: PropTypes.object.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    })
  ).isRequired,
  trigger: PropTypes.func,
};

export default React.memo(SelectAutocompleteField);
