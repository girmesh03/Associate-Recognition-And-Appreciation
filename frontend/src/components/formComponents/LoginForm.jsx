// react import
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

// mui import
import { styled } from "@mui/material/styles";
import { CircularProgress, Grid, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";

// redux import
import { useSelector, useDispatch } from "react-redux";
import { login } from "../../redux/features/auth/authActions";

// components
import FormTextField from "./FormTextField";

// Styled components
const FieldLabel = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  paddingLeft: theme.spacing(0.5),
}));

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
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
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await dispatch(login(data)).unwrap();
      toast.success("Login successful");
      reset();
      navigate("/recognitions");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <Grid
      container
      spacing={2}
      component="form"
      autoComplete="off"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
    >
      <Grid item xs={12}>
        <FieldLabel variant="body1" gutterBottom>
          Email
        </FieldLabel>
        <FormTextField
          name="email"
          placeholder="Email"
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

      <Grid item xs={12}>
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
          }}
        />
      </Grid>

      <Grid item xs={12}>
        <LoadingButton
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          loading={loading}
          loadingIndicator={<CircularProgress size={24} />}
          sx={{ mt: 2 }}
        >
          Login
        </LoadingButton>
      </Grid>
    </Grid>
  );
};

export default LoginForm;
