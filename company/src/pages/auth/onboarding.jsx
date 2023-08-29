import React, { useState, useEffect } from "react";
import {
  Form, Input, Button, Select,
} from "antd";
import { useRouter } from "next/router";
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

  const renderStep1 = () => (
    <Form onFinish={() => setStep("step2")}>
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
          onChange={(e) => userFormHandler({ name: "phoneNumber", value: e.target.value })}
        />
      </Form.Item>

      <Form.Item label="Comapny Name" name="companyName">
        <Input
          name="company"
          value={companyForm.name}
          onChange={(e) => companyFormHandler({ name: "name", value: e.target.value })}
        />

      </Form.Item>
      <Button type="primary" htmlType="submit">
        Next
      </Button>
    </Form>
  );

  const renderStep2 = () => (
    <Form
      onFinish={handleSubmit}
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
      <Button type="primary" htmlType="submit">
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
