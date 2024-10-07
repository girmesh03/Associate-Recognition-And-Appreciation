// react imports
import React from "react";
import { useController } from "react-hook-form";
import PropTypes from "prop-types";
import moment from "moment";

// mui imports
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { StaticDatePicker } from "@mui/x-date-pickers";

const MuiDatePicker = ({ name, control, ...otherProps }) => {
  const {
    field: { onChange, value, ...field },
  } = useController({
    name,
    control,
  });

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <StaticDatePicker
        value={moment.utc(value).startOf("day")}
        onChange={(event, newValue) => {
          onChange(moment(newValue).startOf("day").toISOString());
        }}
        {...otherProps}
        {...field}
        slotProps={{
          layout: {
            sx: {
              backgroundColor: "transparent",
              maxHeight: 295,
            },
          },
        }}
        sx={{
          "& .MuiDialogActions-root": {
            display: "none",
          },
          "& .MuiPickersToolbar-root": {
            display: "none",
          },
        }}
      />
    </LocalizationProvider>
  );
};

MuiDatePicker.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.object.isRequired,
};

export default React.memo(MuiDatePicker);
