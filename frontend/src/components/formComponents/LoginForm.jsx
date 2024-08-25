import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { CircularProgress, Stack } from "@mui/material";
import { LoadingButton } from "@mui/lab";

import { useDispatch, useSelector } from "react-redux";
import { login } from "../../redux/features/auth/authActions";

import FormTextField from "./FormTextField";

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
    <Stack
      flexDirection="column"
      spacing={2}
      component="form"
      autoComplete="off"
      onSubmit={handleSubmit(onSubmit)}
    >
      <FormTextField
        name="email"
        label="Email"
        type="text"
        autoComplete="given-name"
        control={control}
        errors={errors}
      />

      <FormTextField
        name="password"
        label="Password"
        type={showPassword ? "text" : "password"}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        control={control}
        errors={errors}
      />

      <LoadingButton
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        loading={loading}
        loadingIndicator={<CircularProgress size={24} />}
      >
        Login
      </LoadingButton>
    </Stack>
  );
};

export default LoginForm;
