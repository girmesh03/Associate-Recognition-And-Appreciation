import PropTypes from "prop-types";
import { Controller } from "react-hook-form";
import { Autocomplete, TextField } from "@mui/material";

import renderOptionItem from "./renderOptionItem";
import StyledListbox from "./StyledListbox";

const SelectAutocompleteField = ({
  name,
  options,
  control,
  errors,
  ...otherProps
}) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={null}
      rules={{
        required: {
          value: true,
          message: `Please select ${name}`,
        },
      }}
      render={({ field: { onChange } }) => (
        <Autocomplete
          fullWidth
          options={options}
          onChange={(_, newValue) => {
            onChange(newValue?.value || newValue?._id || "");
          }}
          getOptionLabel={(option) =>
            option.value || `${option.firstName} ${option.lastName}` || ""
          }
          isOptionEqualToValue={(option, selectedValue) =>
            option._id === selectedValue._id
          }
          renderOption={renderOptionItem(name)}
          ListboxComponent={StyledListbox}
          renderInput={(params) => (
            <TextField
              {...params}
              {...otherProps}
              variant="outlined"
              size="small"
              fullWidth
              error={!!errors[name]}
              helperText={errors[name]?.message}
            />
          )}
        />
      )}
    />
  );
};

SelectAutocompleteField.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.object.isRequired,
  options: PropTypes.array.isRequired,
  errors: PropTypes.object.isRequired,
};

export default SelectAutocompleteField;
