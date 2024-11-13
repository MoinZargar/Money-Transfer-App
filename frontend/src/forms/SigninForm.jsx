import React , {useState} from "react";
import { useForm, Controller } from "react-hook-form";
import { signinSchema } from "../validation/auth/signinSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button ,InputBox } from "../index.js";
import getAuthService from "../services/authService.js";
import { useNavigate } from "react-router-dom";

function SigninForm() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const onSubmit = async(data) => {
     try {
        const response = await getAuthService.signin(data);
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
        <Button label={"Sign in"} type={"submit"} />
      </div>
    </form>
  );
}

export default SigninForm;
