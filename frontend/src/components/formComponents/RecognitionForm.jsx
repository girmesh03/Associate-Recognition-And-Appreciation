// react imports
import React from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

// mui imports
import {
  Avatar,
  CardHeader,
  Grid,
  Slide,
  Stack,
  Typography,
} from "@mui/material";

// redux imports
import { useSelector } from "react-redux";

// components
import SelectAutocompleteField from "./SelectAutocompleteField";
import FormTextField from "./FormTextField";
import MuiDatePicker from "./MuiDatePicker";
import MuiSwitchField from "./MuiSwitchField";
import FileUploader from "./FileUploader";
import MuiSliderField from "./MuiSliderField";

// category options
import { categoryList } from "./selectOptions";

const RecognitionForm = ({ name, control, trigger, activeStep, users }) => {
  const currentUser = useSelector((state) => state.auth.currentUser);
  const navigate = useNavigate();

  const getStepContent = (step) => {
    const show = activeStep === step;

    switch (step) {
      case 0:
        return (
          <Slide direction="left" in={show} timeout={500} key={step}>
            <Grid item container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ padding: "0.75rem 0.5rem" }}
                >
                  <CardHeader
                    sx={{ p: 0 }}
                    avatar={
                      <Avatar
                        src={currentUser?.profilePicture}
                        alt={currentUser?.firstName}
                        sx={{ cursor: "pointer" }}
                        onClick={() => navigate(`/profile/${currentUser?._id}`)}
                      />
                    }
                    title={
                      <Typography
                        variant="body2"
                        component="span"
                        onClick={() => navigate(`/profile/${currentUser?._id}`)}
                        sx={{
                          cursor: "pointer",
                          fontWeight: "bold",
                          ":hover": {
                            color: "secondary.main",
                          },
                        }}
                      >
                        {`${currentUser?.firstName} ${currentUser?.lastName}`}
                      </Typography>
                    }
                    subheader={currentUser?.position}
                  />
                  <MuiSwitchField
                    name="isAnonymous"
                    control={control}
                    postType="recognition"
                  />
                </Stack>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography
                  variant="body1"
                  gutterBottom
                  sx={{ ml: 1, color: "text.secondary" }}
                >
                  Receiver Name
                </Typography>
                <SelectAutocompleteField
                  name="receiver"
                  placeholder="Type the receiver name"
                  options={users}
                  control={control}
                  trigger={trigger}
                  rules={{
                    required: {
                      value: true,
                      message: "Receiver is required",
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography
                  variant="body1"
                  gutterBottom
                  sx={{ ml: 1, color: "text.secondary" }}
                >
                  Award Points
                </Typography>
                <MuiSliderField
                  name="pointsAwarded"
                  control={control}
                  trigger={trigger}
                  defaultValue={1}
                  min={0}
                  max={100}
                  rules={{
                    required: {
                      value: true,
                      message: "Recognition point is required",
                    },
                    min: {
                      value: 1,
                      message: "Recognition point must be at least 1",
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography
                  variant="body1"
                  gutterBottom
                  sx={{ ml: 1, color: "text.secondary" }}
                >
                  Recognition Category
                </Typography>
                <SelectAutocompleteField
                  name="category"
                  placeholder="Select or type your own category"
                  control={control}
                  options={categoryList}
                  trigger={trigger}
                  rules={{
                    required: {
                      value: true,
                      message: "Please select a category",
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography
                  variant="body1"
                  gutterBottom
                  sx={{ ml: 1, color: "text.secondary" }}
                >
                  Recognition Message
                </Typography>
                <FormTextField
                  name="reason"
                  placeholder="A huge thank you to Sarah for consistently bringing your best to the team. Your reliability and hard work are greatly appreciated!"
                  multiline
                  rows={4}
                  control={control}
                  trigger={trigger}
                  rules={{
                    required: {
                      value: true,
                      message: "Please add a recognition message",
                    },
                    maxLength: {
                      value: 500,
                      message: "Reason must be less than 500 characters",
                    },
                    validate: {
                      noSpaces: (value) => {
                        return (
                          value.trim().length > 0 ||
                          "Please add a valid message"
                        );
                      },
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Slide>
        );
      case 1:
        return (
          <Slide direction="left" in={show} timeout={500} key={step}>
            <Grid item xs={12}>
              <MuiDatePicker name="date" control={control} type="date" />
            </Grid>
          </Slide>
        );
      case 2:
        return (
          <Slide direction="left" in={show} timeout={500} key={step}>
            <Grid
              item
              xs={12}
              md={10}
              sx={{ margin: "0 auto", position: "relative" }}
            >
              <FileUploader name={name} control={control} />
            </Grid>
          </Slide>
        );
      default:
        return null;
    }
  };

  return (
    <Grid
      container
      sx={{
        flexGrow: 1,
        alignItems: "center",
        overflowY: "auto",
        p: { xs: "1rem 0.25rem", sm: 2, md: 0 },
        "&::-webkit-scrollbar": {
          display: "none",
        },
        "@media (min-width: 768px) and (max-width: 1200px)": {
          flexGrow: 0,
          overflow: "hidden",
        },
        "@media (min-width: 768px)": {
          minHeight: "336px",
        },
      }}
    >
      {getStepContent(activeStep)}
    </Grid>
  );
};

RecognitionForm.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.object.isRequired,
  trigger: PropTypes.func,
  activeStep: PropTypes.number.isRequired,
  users: PropTypes.array.isRequired,
};

export default React.memo(RecognitionForm);
