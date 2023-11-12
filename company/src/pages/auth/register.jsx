import React, { useState } from "react";
import { useFormik } from "formik";
import { Button } from "antd";
import { useRouter } from "next/router";
import { registerValidationSchema } from "../../utils/validations";
import USER_SERVICE from "../../services/user";
import Input from "@/components/library/Input";

function Register() {
  const [isSubmit, setIsSubmit] = useState(false);

  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      passwordConfirmation: "",
    },
    validationSchema: registerValidationSchema,
    onSubmit: async (values) => {
      const response = await USER_SERVICE.create(values);
      if (response) {
        router.push("/auth/onboarding");
      }
    },
  });
  const submitBtnClickHandler = () => {
    setIsSubmit(true);
  };

  return (
    <div>
      <div className="container">
        <div className="form">
          <form onSubmit={(e) => formik.handleSubmit(e)}>
            <Input
              label="E-mail"
              placeholder="example@gmail.com"
              onChange={formik.handleChange}
              value={formik.values.email}
              name="email"
            />
            {isSubmit && <div className="error">{formik.errors.email}</div>}
            <Input
              label="Şifre"
              placeholder="*****"
              onChange={formik.handleChange}
              value={formik.values.password}
              name="password"
            />
            {isSubmit && <div className="error">{formik.errors.password}</div>}
            <Input
              placeholder="******"
              label="Şifreyi tekrar giriniz"
              onChange={formik.handleChange}
              value={formik.values.passwordConfirmation}
              name="passwordConfirmation"
            />
            {isSubmit && (
              <div className="error">{formik.errors.passwordConfirmation}</div>
            )}

            <Button htmlType="submit" onClick={submitBtnClickHandler}>
              Kaydol
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
