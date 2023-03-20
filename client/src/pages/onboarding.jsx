/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from "react";

const initialFormValues = {
  name: "",
  surname: "",
  city: "",
  address: "",
  postalCode: "",
};

function Onboarding() {
  const [step, setStep] = useState("step1");
  const [formValues, setFormValues] = useState(initialFormValues);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formValues);
  };

  const handleInputChange = (event) => {
    setFormValues({
      ...formValues,
      [event.target.name]: event.target.value,
    });
  };

  const renderStep1 = () => (
    <form onSubmit={() => setStep("step2")}>
      <label>
        Name:
        <input
          type="text"
          name="name"
          value={formValues.name}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Surname:
        <input
          type="text"
          name="surname"
          value={formValues.surname}
          onChange={handleInputChange}
        />
      </label>
      <button type="submit">Next</button>
    </form>
  );

  const renderStep2 = () => (
    <form onSubmit={() => setStep("step3")}>
      <label>
        City:
        <input
          type="text"
          name="city"
          value={formValues.city}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Address:
        <input
          type="text"
          name="address"
          value={formValues.address}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Postal Code:
        <input
          type="text"
          name="postalCode"
          value={formValues.postalCode}
          onChange={handleInputChange}
        />
      </label>
      <button onClick={handleSubmit} type="submit">
        Submit
      </button>
    </form>
  );

  return (
    <div>
      {step === "step1" && renderStep1()}
      {step === "step2" && renderStep2()}
    </div>
  );
}

export default Onboarding;
