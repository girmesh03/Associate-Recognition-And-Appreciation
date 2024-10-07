// react import
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "react-toastify";

// mui import
import { styled } from "@mui/material/styles";
import { CircularProgress, Grid, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";

// redux import
import { useDispatch, useSelector } from "react-redux";
import { signup } from "../../redux/features/auth/authActions";

// components
import FormTextField from "./FormTextField";
import SelectAutocompleteField from "./SelectAutocompleteField";

// utils
import { departments, positions } from "./selectOptions";

// Styled components
const FieldLabel = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  paddingLeft: theme.spacing(0.5),
}));

const SignupForm = () => {

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const loading = useSelector((state) => state.auth.loading);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      department: "",
      position: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = useWatch({
    control,
    name: "password",
  });

  const onSubmit = async (data) => {
    try {
      await dispatch(signup(data)).unwrap();
      reset();
      navigate("/recognitions");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <Grid
      container
      rowSpacing={2}
      columnSpacing={{ sm: 2 }}
      component="form"
      autoComplete="off"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
    >
      <Grid item xs={12} sm={6}>
        <FieldLabel variant="body1" gutterBottom>
          First Name
        </FieldLabel>
        <FormTextField
          name="firstName"
          placeholder="First Name"
          type="text"
          control={control}
          errors={errors}
          rules={{
            required: {
              value: true,
              message: "First Name is required",
            },
            minLength: {
              value: 2,
              message: "First Name must be at least 2 characters",
            },
            maxLength: {
              value: 15,
              message: "First Name cannot exceed 15 characters",
            },
          }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <FieldLabel variant="body1" gutterBottom>
          Last Name
        </FieldLabel>
        <FormTextField
          name="lastName"
          placeholder="Last Name"
          type="text"
          control={control}
          errors={errors}
          rules={{
            required: {
              value: true,
              message: "Last Name is required",
            },
            minLength: {
              value: 2,
              message: "Last Name must be at least 2 characters",
            },
            maxLength: {
              value: 15,
              message: "Last Name cannot exceed 15 characters",
            },
          }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <FieldLabel variant="body1" gutterBottom>
          Department
        </FieldLabel>
        <SelectAutocompleteField
          name="department"
          placeholder="Department"
          control={control}
          errors={errors}
          options={departments}
          rules={{
            required: {
              value: true,
              message: "Please select your department",
            },
          }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <FieldLabel variant="body1" gutterBottom>
          Position
        </FieldLabel>
        <SelectAutocompleteField
          name="position"
          placeholder="Position"
          control={control}
          errors={errors}
          options={positions}
          rules={{
            required: {
              value: true,
              message: "Please select your position",
            },
          }}
        />
      </Grid>

      <Grid item xs={12}>
        <FieldLabel variant="body1" gutterBottom>
          Email
        </FieldLabel>
        <FormTextField
          name="email"
          placeholder="Email"
          fullWidth
          type="text"
          control={control}
          errors={errors}
          rules={{
            required: {
              value: true,
              message: "Please enter your email",
            },
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Please enter a valid email",
            },
            maxLength: {
              value: 50,
              message: "Email cannot exceed 50 characters",
            },
          }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <FieldLabel variant="body1" gutterBottom>
          Password
        </FieldLabel>
        <FormTextField
          name="password"
          placeholder="Password"
          type={showPassword ? "text" : "password"}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          control={control}
          errors={errors}
          rules={{
            required: {
              value: true,
              message: "Please enter your password",
            },
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
            maxLength: {
              value: 50,
              message: "Password cannot exceed 20 characters",
            },
          }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <FieldLabel variant="body1" gutterBottom>
          Confirm Password
        </FieldLabel>
        <FormTextField
          name="confirmPassword"
          placeholder="Confirm Password"
          type={showConfirmPassword ? "text" : "password"}
          showPassword={showConfirmPassword}
          setShowPassword={setShowConfirmPassword}
          errors={errors}
          control={control}
          rules={{
            required: {
              value: true,
              message: "Please confirm your password",
            },
            validate: (fieldValue) => {
              return fieldValue === passwordValue || "Passwords do not match";
            },
          }}
        />
      </Grid>

      <Grid item xs={12} sx={{ mt: 2 }}>
        <LoadingButton
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          loading={loading}
          loadingIndicator={<CircularProgress size={24} />}
          sx={{ mt: 2 }}
        >
          Sign Up
        </LoadingButton>
      </Grid>
    </Grid>
  );
};

export default SignupForm;
