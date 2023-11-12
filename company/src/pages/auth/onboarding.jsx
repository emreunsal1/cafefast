import React, { useState, useEffect } from "react";
import {
  Form, Input, Button, Select,
} from "antd";
import { useRouter } from "next/router";
import z, { ZodError } from "zod";
import USER_SERVICE from "../../services/user";
import LOCATION_SERVICE from "../../services/location";

function Onboarding() {
  const router = useRouter();
  const [companyForm, setCompanyForm] = useState({
    name: "",
    address: {
      city: "",
      district: "",
      mailingAddress: "",
      postalCode: "",
    },
  });
  const [userForm, setUserForm] = useState({
    name: "",
    surname: "",
    phoneNumber: "",
  });
  const [step, setStep] = useState("step1");
  const [city, setCity] = useState([]);
  const [district, setDistrict] = useState([]);
  const [formError, setFormError] = useState(false);

  const stepOneVerifier = z.object({
    name: z.string().min(2),
    surname: z.string().min(2),
    phoneNumber: z.number().max(9999999999).min(1000000000),
  });
  const stepTwoVerifier = z.object({
    name: z.string().min(1).max(255),
    address: z.object({
      city: z.string().min(3).max(255),
      district: z.string().min(3).max(255),
      mailingAddress: z.string().min(3).max(255),
      postalCode: z.number().min(10000).max(99999),
    }),
  });

  const getCity = async () => {
    const { data } = await LOCATION_SERVICE.getCities();
    const mutateCity = data.map((item) => ({ label: item.name, value: item.id }));
    setCity(mutateCity);
  };

  const getDistrict = async (cityID) => {
    const { data } = await LOCATION_SERVICE.getDistrict(cityID);
    const mutateDistrict = data.map((item) => ({ label: item.name, value: item.name }));
    setDistrict(mutateDistrict);
  };

  const userFormHandler = (data) => {
    const initialUserForm = userForm;
    initialUserForm[data.name] = data.value;
    setUserForm(initialUserForm);
  };

  const companyFormHandler = (data) => {
    const initialComanyForm = companyForm;

    if (data.name === "name") {
      initialComanyForm[data.name] = data.value;
      setCompanyForm(initialComanyForm);
      return;
    }
    if (data.name === "city") {
      getDistrict(data.value);
      initialComanyForm.address.city = city.find((item) => item.value === data.value).label;
      setCompanyForm(initialComanyForm);
      return;
    }
    if (data.name === "postalCode") {
      initialComanyForm.address[data.name] = Number(data.value);
    } else {
      initialComanyForm.address[data.name] = data.value;
    }

    setCompanyForm(initialComanyForm);
  };

  useEffect(() => {
    getCity();
  }, []);

  useEffect(() => {
    if (city.length > 0) {
      companyFormHandler({ name: "city", value: 1 });
    }
  }, [city]);

  const handleSubmit = async () => {
    const response = await USER_SERVICE.compeleteOnboarding({ user: userForm, company: companyForm });
    if (response) {
      router.push("/");
    }
  };

  const formSubmitHandler = (formStep) => {
    try {
      if (formStep === "step1") {
        stepOneVerifier.parse(userForm);
        setStep("step2");
        setFormError(false);
        return;
      }
      if (formStep === "step2") {
        stepTwoVerifier.parse(companyForm);
        setFormError(false);
        handleSubmit();
        return;
      }
    } catch (error) {
      if (error instanceof ZodError) {
        const formErrorResult = error.flatten();
        const errors = Object.keys(formErrorResult.fieldErrors).map((item) => formErrorResult.fieldErrors[item][0]);
        setFormError(errors);
      }
    }
  };

  const renderStep1 = () => (
    <Form>
      <Form.Item label="Name" name="name">
        <Input
          name="name"
          value={userForm.name}
          onChange={(e) => userFormHandler({ name: "name", value: e.target.value })}
        />
      </Form.Item>
      <Form.Item label="Surname" name="surname">
        <Input
          name="surname"
          value={userForm.surname}
          onChange={(e) => userFormHandler({ name: "surname", value: e.target.value })}
        />
      </Form.Item>
      <Form.Item label="Phone Number" name="Phone Number">
        <Input
          name="Phone Number"
          value={userForm.phoneNumber}
          type="number"
          onChange={(e) => userFormHandler({ name: "phoneNumber", value: Number(e.target.value) })}
        />
      </Form.Item>
      {formError && formError.map((item) => <div>{item}</div>)}
      <Button type="primary" onClick={() => formSubmitHandler("step1")}>
        Next
      </Button>
    </Form>
  );

  const renderStep2 = () => (
    <Form
      initialValues={{
        city: city[0]?.label,
      }}
    >
      <Form.Item label="City" name="city">
        <Select
          style={{ width: 120 }}
          onChange={(e) => companyFormHandler({ name: "city", value: e })}
          options={city}
          name="city"
          value={companyForm.address.city}
        />

      </Form.Item>
      <Form.Item label="district" name="district">
        <Select
          disabled={district.length === 0}
          style={{ width: 120 }}
          onChange={(e) => companyFormHandler({ name: "district", value: e })}
          options={district}
          name="district"
          value={companyForm.address.city}
        />
      </Form.Item>
      <Form.Item label="Address" name="mailingAddress">
        <Input
          name="mailingAddress"
          value={companyForm.address.mailingAddress}
          onChange={(e) => companyFormHandler({ name: "mailingAddress", value: e.target.value })}
        />
      </Form.Item>
      <Form.Item label="Postal Code" name="postalCode">
        <Input
          type="number"
          name="postalCode"
          value={companyForm.address.postalCode}
          onChange={(e) => companyFormHandler({ name: "postalCode", value: e.target.value })}
        />
      </Form.Item>
      <Form.Item label="Comapny Name" name="companyName">
        <Input
          name="company"
          value={companyForm.name}
          onChange={(e) => companyFormHandler({ name: "name", value: e.target.value })}
        />

      </Form.Item>
      {formError && formError.map((item) => <div>{item}</div>)}
      <Button type="primary" onClick={() => formSubmitHandler("step2")}>
        Submit
      </Button>
    </Form>
  );

  return (
    <div>
      {step === "step1" && renderStep1()}
      {step === "step2" && renderStep2()}
    </div>
  );
}

export default Onboarding;
