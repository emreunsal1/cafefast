import React, { useState } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import { useRouter } from "next/router";
import AUTH_SERVICE from "../../services/auth";

export default function Login() {
  const [authform, setAuthform] = useState({ email: null, password: null });
  const router = useRouter();
  const loginClickHandler = async () => {
    const response = await AUTH_SERVICE.login(
      authform.email,
      authform.password,
    );
    if (response.status === 200) {
      router.push("/");
    }
  };

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
          <a href="/register">register now!</a>
        </Form.Item>
      </Form>
    </div>
  );
}
