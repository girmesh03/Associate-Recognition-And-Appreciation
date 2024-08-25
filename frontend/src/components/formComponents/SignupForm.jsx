import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Box, CircularProgress, Stack } from "@mui/material";
import { LoadingButton } from "@mui/lab";

import { useDispatch, useSelector } from "react-redux";
import { signup } from "../../redux/features/auth/authActions";

import FormTextField from "./FormTextField";
import SelectAutocompleteField from "./SelectAutocompleteField";
import { departments, positions } from "../../utils/constants";

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
    getValues,
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

  const onSubmit = async (data) => {
    try {
      await dispatch(signup(data)).unwrap();
      toast.success("Account created successfully, please login");
      reset();
      navigate("/login");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <Box
      component="form"
      autoComplete="off"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        px: { xs: 1, sm: 3 },
      }}
    >
      <Stack
        rowGap={3}
        columnGap={2}
        sx={{ flexDirection: { xs: "column", sm: "row" } }}
      >
        <FormTextField
          name="firstName"
          label="First Name"
          type="text"
          control={control}
          errors={errors}
        />
        <FormTextField
          name="lastName"
          label="Last Name"
          type="text"
          control={control}
          errors={errors}
        />
      </Stack>

      <Stack
        rowGap={3}
        columnGap={2}
        sx={{ flexDirection: { xs: "column", sm: "row" } }}
      >
        <SelectAutocompleteField
          name="department"
          label="Department"
          control={control}
          errors={errors}
          options={departments}
        />
        <SelectAutocompleteField
          name="position"
          label="Position"
          control={control}
          errors={errors}
          options={positions}
        />
      </Stack>

      <FormTextField
        name="email"
        label="Email"
        fullWidth
        type="text"
        control={control}
        errors={errors}
      />

      <Stack
        rowGap={3}
        columnGap={2}
        sx={{ flexDirection: { xs: "column", sm: "row" } }}
      >
        <FormTextField
          name="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          control={control}
          errors={errors}
        />
        <FormTextField
          name="confirmPassword"
          label="Confirm Password"
          type={showConfirmPassword ? "text" : "password"}
          showPassword={showConfirmPassword}
          setShowPassword={setShowConfirmPassword}
          errors={errors}
          control={control}
          getValues={getValues}
        />
      </Stack>

      <Stack direction="row" sx={{ mt: 1 }}>
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
    </Box>
  );
};

export default SignupForm;
