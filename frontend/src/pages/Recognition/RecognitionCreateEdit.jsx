// react import
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

// mui import
import { styled, alpha } from "@mui/material/styles";
import {
  Box,
  Stepper,
  StepLabel,
  Step,
  MobileStepper,
  Button,
  Typography,
  Stack,
  IconButton,
  useMediaQuery,
  useTheme,
  CircularProgress,
} from "@mui/material";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import CloseIcon from "@mui/icons-material/Close";

// redux import
import { useSelector } from "react-redux";

// utils import
import { makeRequest } from "../../api/apiRequest";

// components import
import RecognitionForm from "../../components/formComponents/RecognitionForm";
import moment from "moment";

// Styled components
const StyledContainer = styled(Box)(({ theme }) => ({
  height: "100%",
  width: "85%",
  margin: "0 auto",
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(3),
  transform: "translateX(-3%)",
  [theme.breakpoints.down("lg")]: {
    width: "100%",
    transform: "translateX(0)",
    "@media (min-width: 768px)": {
      padding: theme.spacing(4),
      gap: theme.spacing(6),
    },
    "@media (max-width: 600px), (max-width: 768px) and (orientation: landscape)":
      {
        gap: theme.spacing(1),
        position: "absolute",
        top: 0,
        zIndex: theme.zIndex.drawer + 1,
        backgroundColor: theme.palette.background.default,
        backgroundImage:
          theme.palette.mode === "light"
            ? "linear-gradient(180deg, #CEE5FD, #FFF)"
            : `linear-gradient(#02294F, ${alpha("#090E10", 0.0)})`,
        backgroundRepeat: "no-repeat",
      },

    "@media (min-width: 600px)": {
      padding: theme.spacing(1, 0, 0),
    },
  },
}));

const FormContainer = styled(Box)(({ theme }) => ({
  width: "85%",
  margin: "0 auto",
  display: "flex",
  flexDirection: "column",
  borderRadius: theme.shape.borderRadius * 4,
  border: `1px solid ${alpha(theme.palette.primary.main, 0.5)}`,
  padding: theme.spacing(2, 4),
  gap: theme.spacing(2),
  maxHeight: 470,
  [theme.breakpoints.down("lg")]: {
    maxHeight: "100%",
    width: "90%",
    "&::-webkit-scrollbar": {
      display: "none",
    },
    "@media (max-width: 767px)": {
      flexGrow: 1,
      overflowY: "auto",
      width: "100%",
      gap: 0,
      padding: 0,
    },
    "@media (max-width: 767px),(max-width: 768px) and (orientation: landscape)":
      {
        border: "none",
        borderRadius: 0,
      },
  },
}));

const MobileHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));

// Stepper
const steps = [
  { label: "STEP 1", description: "Recognition details" },
  { label: "STEP 2", description: "Select recognition date" },
  { label: "STEP 3", description: "File upload and submit" },
];

// Loader
export const RecognitionCreateEditLoader = async ({ params }) => {
  try {
    const response = await makeRequest.get("/users");
    if (params.recognitionId) {
      const recognitionResponse = await makeRequest.get(
        `/recognitions/${params.recognitionId}`
      );
      return { allUsers: response.data, recognition: recognitionResponse.data };
    }
    return { allUsers: response.data, recognition: null };
  } catch (error) {
    toast.error(error.response?.data?.message || "Error fetching data");
    throw error;
  }
};

const RecognitionCreateEdit = ({ mode }) => {
  const { allUsers, recognition } = useLoaderData(); // recognition will be null in 'create' mode
  const currentUser = useSelector((state) => state.auth.currentUser);
  const navigate = useNavigate();
  const { recognitionId } = useParams(); // available in 'edit' mode

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [activeStep, setActiveStep] = useState(0);
  const [isReadyToSubmit, setIsReadyToSubmit] = useState(false);
  const maxSteps = steps.length;

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
    trigger,
    reset,
  } = useForm({
    defaultValues: {
      receiver: null,
      category: null,
      reason: "",
      date: new Date().toISOString(),
      pointsAwarded: 0,
      isAnonymous: false,
      attachments: [],
    },
  });

  useEffect(() => {
    if (mode === "edit" && recognition) {
      reset({
        receiver: recognition.receiver._id,
        category: recognition.category,
        reason: recognition.reason,
        date: moment.utc(recognition.date).local().startOf("day"), // Ensuring local time
        pointsAwarded: recognition.pointsAwarded,
        isAnonymous: recognition.isAnonymous,
        attachments: recognition.attachments,
      });
    } else {
      reset({
        receiver: null,
        category: null,
        reason: "",
        date: new Date().toISOString(),
        pointsAwarded: 0,
        isAnonymous: false,
        attachments: [],
      });
    }
    setIsReadyToSubmit(false);
    setActiveStep(0);
  }, [mode, recognition, reset]);

  const filteredUsers = useMemo(() => {
    if (allUsers && currentUser && currentUser._id) {
      if (mode !== "edit") {
        return allUsers.filter((user) => user._id !== currentUser._id);
      } else {
        return allUsers;
      }
    }
    return [];
  }, [allUsers, currentUser, mode]);

  const onSubmit = async (data) => {
    try {
      const { attachments, ...rest } = data;
      const formData = new FormData();

      Object.keys(rest).forEach((key) => {
        formData.append(key, rest[key]);
      });

      formData.append("sender", currentUser._id);

      if (attachments.length > 0) {
        attachments.forEach((attachment) => {
          formData.append("attachments", attachment.file);
        });
      }

      if (mode === "edit" && recognitionId) {
        // Edit recognition (PUT request)
        await makeRequest.put(`/recognitions/${recognitionId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Recognition updated successfully!");
      } else {
        // Create new recognition (POST request)
        await makeRequest.post("/recognitions", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Recognition created successfully!");
      }

      reset();
      setActiveStep(0);
      setIsReadyToSubmit(false);
      navigate("/recognitions");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error submitting the form");
    }
  };

  const handleNext = async () => {
    if (activeStep < maxSteps - 1) {
      const isStepValid = await trigger();
      if (isStepValid) {
        setActiveStep((prevStep) => prevStep + 1);
      }
    } else if (activeStep === maxSteps - 1) {
      setIsReadyToSubmit(true);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prevStep) => prevStep - 1);
    }
  };

  return (
    <StyledContainer>
      {isMobile ? (
        <MobileHeader>
          <Typography variant="body1" fontWeight="bold">
            {`${steps[activeStep].label} - ${steps[activeStep].description}`}
          </Typography>
          <IconButton onClick={() => navigate(-1)}>
            <CloseIcon />
          </IconButton>
        </MobileHeader>
      ) : (
        <Stepper nonLinear activeStep={activeStep} alternativeLabel>
          {steps.map((step) => (
            <Step key={step.label}>
              <StepLabel>{step.description}</StepLabel>
            </Step>
          ))}
        </Stepper>
      )}
      {/* Form */}
      <FormContainer
        component="form"
        autoComplete="off"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
        <RecognitionForm
          name="attachments"
          control={control}
          trigger={trigger}
          activeStep={activeStep}
          users={filteredUsers}
        />
        {isMobile ? (
          <MobileStepper
            variant="dots"
            steps={maxSteps}
            position="static"
            activeStep={activeStep}
            nextButton={
              <Button
                color="primary"
                size="small"
                type={isReadyToSubmit ? "submit" : "button"}
                onClick={isReadyToSubmit ? null : handleNext}
                disabled={isSubmitting}
              >
                {activeStep === maxSteps - 1 ? "SUBMIT" : "NEXT"}
                {theme.direction === "rtl" ? (
                  <KeyboardArrowLeft />
                ) : (
                  <KeyboardArrowRight />
                )}
              </Button>
            }
            backButton={
              <Button
                size="small"
                onClick={handleBack}
                disabled={activeStep === 0}
              >
                {theme.direction === "rtl" ? (
                  <KeyboardArrowRight />
                ) : (
                  <KeyboardArrowLeft />
                )}
                BACK
              </Button>
            }
          />
        ) : (
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ py: { xs: 0, sm: 1 }, width: "80%", margin: "0 auto" }}
          >
            <Button
              variant="outlined"
              size="small"
              disabled={activeStep === 0}
              onClick={handleBack}
              startIcon={<KeyboardArrowLeft />}
            >
              Back
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="small"
              type={isReadyToSubmit ? "submit" : "button"}
              onClick={isReadyToSubmit ? null : handleNext}
              disabled={isSubmitting}
              endIcon={<KeyboardArrowRight />}
            >
              {activeStep === maxSteps - 1 ? "Submit" : "Next"}
            </Button>
          </Stack>
        )}
        {isSubmitting && (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              zIndex: 999,
              backgroundColor: "transparent",
              position: "absolute",
              top: 0,
              left: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress size={50} color="secondary" />
          </Box>
        )}
      </FormContainer>
    </StyledContainer>
  );
};

RecognitionCreateEdit.propTypes = {
  mode: PropTypes.oneOf(["create", "edit"]).isRequired,
};

export default RecognitionCreateEdit;
