import React, { useState } from "react";
import { useFormik } from "formik";
import { Button, Input, Form } from "antd";
import { registerValidationSchema } from "../utils/validations";

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
      console.log("formik value", values);
      setIsSubmit(() => true);
    },
  });

  return (
    <div>
      <div className="container">
        <div className="form">
          <form onSubmit={(e) => formik.handleSubmit(e)}>
            <Input placeholder="Name" onChange={formik.handleChange} value={formik.values.name} name="name" />

            <div className="error">
              {formik.errors.name}
            </div>

            <Input placeholder="Surname" onChange={formik.handleChange} value={formik.values.surname} name="surname" />
            {isSubmit && (
            <div className="error">
              {formik.errors.surname}
            </div>
            )}
            <Input placeholder="Email" onChange={formik.handleChange} value={formik.values.email} name="email" />
            {isSubmit && (
            <div className="error">
              {formik.errors.email}
            </div>
            )}
            <Input placeholder="Password" onChange={formik.handleChange} value={formik.values.password} name="password" />
            {isSubmit && (
            <div className="error">
              {formik.errors.password}
            </div>
            )}
            <Input
              placeholder="Again Password"
              onChange={formik.handleChange}
              value={formik.values.passwordConfirmation}
              name="passwordConfirmation"
            />
            {isSubmit && (
            <div className="error">
              {formik.errors.passwordConfirmation}
            </div>
            )}
            <Input placeholder="Company" onChange={formik.handleChange} value={formik.values.company} name="company" />
            {isSubmit && (
            <div className="error">
              {formik.errors.company}
            </div>
            )}
            <Input placeholder="Phone" onChange={formik.handleChange} value={formik.values.phone} name="phone" />
            {isSubmit && (
            <div className="error">
              {formik.errors.phone}
            </div>
            )}

            <Button htmlType="submit">! Register</Button>
          </form>
        </div>

      </div>
    </div>
  );
}
