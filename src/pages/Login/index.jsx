import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";
import { fetchAuth, selectIsAuth} from "../../redux/slices/auth";
import styles from "./Login.module.scss";
import { Navigate, Link } from "react-router-dom";



export const Login = () => {
const  isAuth = useSelector(selectIsAuth);

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
    },
    mode: "onChange",
  });

  const onSubmit =  async (values) => {
    const data = await dispatch(fetchAuth(values));

    if(!data.payload){
      return alert("Error in log in")
    }

    if( 'token' in data.payload) {
      window.localStorage.setItem("token", data.payload.token);
    }
  };

  if(isAuth) {
    return <Navigate to="/" />
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Вход в аккаунт
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          className={styles.field}
          label="E-Mail"
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          {...register("email", { required: "Please set email" })}
          fullWidth
        />
        <TextField
          className={styles.field}
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          label="Password"
          fullWidth
          {...register("password", { required: "Please set password" })}
        />
        <Button type="submit" size="large" variant="contained" fullWidth>
          Sign In
        </Button>
        <Link to={'/registration'} >
        <Typography classes={{ root: styles.register }} variant="h6">
        Register
      </Typography>
      </Link>
      </form>
    </Paper>
  );
};
