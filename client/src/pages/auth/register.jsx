import React, { useState, useEffect } from "react";
import { useFormik, Formik } from "formik";
import { Button, Input, Form } from "antd";
import { registerValidationSchema } from "../../utils/validations";

export default function Register() {
  const [register, setRegister] = useState();
  const [isSubmit, setIsSubmit] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      passwordConfirmation: "",
      company: "",
      phone: "",
      name: "",
      surname: "",
    },
    validationSchema: registerValidationSchema,
    onSubmit: (values) => {
      console.log("abc submit values ", values);
    },
  });
  const submitBtnClickHandler = () => setIsSubmit(true);
  return (
    <div>
      <div className="container">
        <div className="form">
          <form onSubmit={(e) => formik.handleSubmit(e)}>
            <Input
              placeholder="Email"
              onChange={formik.handleChange}
              value={formik.values.email}
              name="email"
            />
            {isSubmit && <div className="error">{formik.errors.email}</div>}
            <Input
              placeholder="phone"
              onChange={formik.handleChange}
              value={formik.values.phone}
              name="phone"
            />
            {isSubmit && <div className="error">{formik.errors.phone}</div>}

            <Input
              placeholder="Password"
              onChange={formik.handleChange}
              value={formik.values.password}
              name="password"
            />
            {isSubmit && <div className="error">{formik.errors.password}</div>}
            <Input
              placeholder="Again Password"
              onChange={formik.handleChange}
              value={formik.values.passwordConfirmation}
              name="passwordConfirmation"
            />
            {isSubmit && (
              <div className="error">{formik.errors.passwordConfirmation}</div>
            )}

            <Button htmlType="submit" onClick={submitBtnClickHandler}>
              ! Register
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
