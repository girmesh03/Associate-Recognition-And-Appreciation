import { useState } from "react";
import { useForm } from "react-hook-form";
import { CircularProgress, Stack } from "@mui/material";
import { LoadingButton } from "@mui/lab";

import FormTextField from "./FormTextField";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data) => {
    console.log(data);
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
        // loading={true}
        loadingIndicator={<CircularProgress size={24} />}
      >
        Login
      </LoadingButton>
    </Stack>
  );
};

export default LoginForm;
