import React from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import { fetchAuth, fetchRegister, selectIsAuth } from "../../redux/slices/auth";
import styles from "./Login.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { Navigate, Link } from "react-router-dom";

export const Registration = () => {
  const isAuth = useSelector(selectIsAuth);

  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (values) => {
    const data = await dispatch(fetchRegister(values));

    if (!data.payload) {
      return alert("Error in log in");
    }

    if ("token" in data.payload) {
      window.localStorage.setItem("token", data.payload.token);
    }
  };

  if (isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Paper classes={{ root: styles.root }}>
     
      <Typography classes={{ root: styles.title }} variant="h5">
        Create Account
      </Typography>
      <div className={styles.avatar}>
        <Avatar sx={{ width: 100, height: 100 }} />
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>

     <TextField
        error={Boolean(errors.fullName?.message)}
        helperText={errors.fullName?.message}
        {...register("fullName", { required: "Write Name" })}
        className={styles.field}
        label="Name"
        fullWidth
      />
      <TextField
        error={Boolean(errors.email?.message)}
        helperText={errors.email?.message}
        {...register("email", { required: "Write Email" })}
        className={styles.field}
        label="E-Mail"
        fullWidth
      />
      <TextField
        error={Boolean(errors.password?.message)}
        helperText={errors.password?.message}
        {...register("password", { required: "Write Password" })}
        className={styles.field}
        label="Password"
        fullWidth
      />
      <Button  type="submit" size="large" variant="contained" fullWidth>
        Register
      </Button>
     
     </form>
    </Paper>
  );
};
