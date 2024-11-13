import React , {useState} from "react";
import { useForm, Controller } from "react-hook-form";
import { signupSchema } from "../validation/auth/signupSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button , InputBox } from "../index.js";
import getAuthService from "../services/authService.js";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../features/auth/authSlice.js";

function SignupForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      firstName: "",
      lastName: "",
      password: "",
    },
  });
  const onSubmit = async(data) => {
     try {
        const response = await getAuthService.signup(data);
        dispatch(login({userData:response}));
        navigate("/dashboard");
     } catch (error) {
        console.log(error.response?.data?.message);
        setError(error.response?.data?.message);
     }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
        {error && <span className="text-red-500">{error}</span>}
      <Controller
        name="username"
        control={control}
        render={({ field }) => (
          <InputBox
            placeholder="johnDoe"
            label={"Username"}
            type={"text"}
            onChange={field.onChange}
            value={field.value}
          />
        )}
      />
      {errors.username && (
        <span className="text-red-500">{errors.username.message}</span>
      )}

      <Controller
        name="firstName"
        control={control}
        render={({ field }) => (
          <InputBox
            placeholder="John"
            label={"First Name"}
            type={"text"}
            onChange={field.onChange}
            value={field.value}
          />
        )}
      />
      {errors.firstName && (
        <span className="text-red-500">{errors.firstName.message}</span>
      )}

      <Controller
        name="lastName"
        control={control}
        render={({ field }) => (
          <InputBox
            placeholder="Doe"
            label={"Last Name"}
            type={"text"}
            onChange={field.onChange}
            value={field.value}
          />
        )}
      />
      {errors.lastName && (
        <span className="text-red-500">{errors.lastName.message}</span>
      )}

      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <InputBox
            placeholder=""
            label={"Password"}
            type={"password"}
            onChange={field.onChange}
            value={field.value}
          />
        )}
      />
      {errors.password && (
        <span className="text-red-500">{errors.password.message}</span>
      )}
      <div className="pt-4">
        <Button className={"w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"} label={"Sign up"} type={"submit"} />
      </div>
    </form>
  );
}

export default SignupForm;
