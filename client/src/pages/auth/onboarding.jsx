import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import { useRouter } from "next/router";
import USER_SERVICE from "../../services/user";

const initialFormValues = {
  name: "",
  surname: "",
  city: "",
  address: "",
  postalCode: "",
};

function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState("step1");
  const [formValues, setFormValues] = useState(initialFormValues);

  const handleSubmit = async () => {
    const response = await USER_SERVICE.update(formValues);
    if (response) {
      router.push("/mainpage");
    }
  };

  const handleInputChange = (event) => {
    setFormValues({
      ...formValues,
      [event.target.name]: event.target.value,
    });
  };

  const renderStep1 = () => (
    <Form onFinish={() => setStep("step2")}>
      <Form.Item label="Name" name="name">
        <Input
          name="name"
          value={formValues.name}
          onChange={handleInputChange}
        />
      </Form.Item>
      <Form.Item label="Surname" name="surname">
        <Input
          name="surname"
          value={formValues.surname}
          onChange={handleInputChange}
        />
      </Form.Item>
      <Button type="primary" htmlType="submit">
        Next
      </Button>
    </Form>
  );

  const renderStep2 = () => (
    <Form onFinish={handleSubmit}>
      <Form.Item label="City" name="city">
        <Input
          name="city"
          value={formValues.city}
          onChange={handleInputChange}
        />
      </Form.Item>
      <Form.Item label="Address" name="address">
        <Input
          name="address"
          value={formValues.address}
          onChange={handleInputChange}
        />
      </Form.Item>
      <Form.Item label="Postal Code" name="postalCode">
        <Input
          name="postalCode"
          value={formValues.postalCode}
          onChange={handleInputChange}
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
