import React, { useEffect, useState } from "react";
import { Form } from "antd";
import { useRouter } from "next/router";
import z, { ZodError } from "zod";
import AUTH_SERVICE from "../../services/auth";
import USER_SERVICE from "../../services/user";
import Input from "@/components/library/Input";
import Button from "@/components/library/Button";

export default function Login() {
  const [authform, setAuthform] = useState({ email: null, password: null });
  const [formError, setFormError] = useState(false);
  const router = useRouter();
  const userVerifier = z.object({
    email: z.string().email(),
    password: z.string().min(3).max(255),
  });
  const loginClickHandler = async () => {
    try {
      userVerifier.parse(authform);
      const response = await AUTH_SERVICE.login(
        authform.email,
        authform.password,
      );
      if (response.status === 200) {
        router.push("/");
      }
    } catch (error) {
      if (error instanceof ZodError) {
        const formErrorResult = error.flatten();
        const errors = Object.keys(formErrorResult.fieldErrors).map((item) => formErrorResult.fieldErrors[item][0]);
        setFormError(errors);
      }
    }
  };

  useEffect(() => {
    USER_SERVICE.me();
  }, []);

  return (
    <div>
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{ remember: true }}
      >
        <Input
          label="E-mail"
          placeholder="example@gmail.com"
          onChange={(event) => setAuthform({ ...authform, email: event.target.value })}
        />
        <Input
          label="Şifre"
          type="password"
          placeholder="*****"
          onChange={(event) => setAuthform({ ...authform, password: event.target.value })}
        />
        {formError && formError.map((item) => <div>{item}</div>)}
        <div className="button-wrapper" style={{ width: "300px", margin: "20px" }}>
          <Button
            variant="outlined"
            hmtlType="submit"
            onClick={loginClickHandler}
            size="small"
          >
            Giriş Yap
          </Button>
        </div>
        ya da
        <a href="/auth/register">Kaydol</a>
      </Form>
    </div>
  );
}
