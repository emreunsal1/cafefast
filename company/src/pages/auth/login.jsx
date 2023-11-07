import React, { useEffect, useState } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import { useRouter } from "next/router";
import z, { ZodError } from "zod";
import AUTH_SERVICE from "../../services/auth";
import USER_SERVICE from "../../services/user";

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
        <Form.Item
          name="username"
          rules={[{ required: true, message: "Please input your Username!" }]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Username"
            onChange={(event) => setAuthform({ ...authform, email: event.target.value })}
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your Password!" }]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
            onChange={(event) => setAuthform({ ...authform, password: event.target.value })}
          />
        </Form.Item>
        {formError && formError.map((item) => <div>{item}</div>)}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
            onClick={loginClickHandler}
          >
            Log in
          </Button>
          Or
          <a href="/auth/register">register now!</a>
        </Form.Item>
      </Form>
    </div>
  );
}
