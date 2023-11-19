import React, { useState, useEffect } from "react";
import {
  Form, Button, Select,
} from "antd";
import { useRouter } from "next/router";
import z, { ZodError } from "zod";
import { useImmer } from "use-immer";
import Input from "@/components/library/Input";
import USER_SERVICE from "../../services/user";
import LOCATION_SERVICE from "../../services/location";

function Onboarding() {
  const router = useRouter();

  const [onboardingData, setOnboardingData] = useImmer({
    user: {
      name: "",
      surname: "",
      phoneNumber: "",
    },
    company: {
      name: "",
      address: {
        city: "Eskişehir",
        district: "",
        mailingAddress: "",
        postalCode: "",
      },
    },
  });
  const [step, setStep] = useState("step1");
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
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
    const mutateCity = data.map((item) => ({ label: item.name, value: item.name }));
    setCities(mutateCity);
  };

  const getDistricts = async (cityName) => {
    const cityIndex = cities.findIndex((city) => city.value === cityName);
    const { data } = await LOCATION_SERVICE.getDistrict(cityIndex);
    const mutateDistrict = data.map((item) => ({ label: item.name, value: item.name }));
    setDistricts(mutateDistrict);
  };

  useEffect(() => {
    if (cities.length && onboardingData.company.address.city) {
      getDistricts(onboardingData.company.address.city);
    }
  }, [onboardingData.company.address.city, cities]);

  const userFormHandler = (data) => {
    setOnboardingData((_onboardingData) => { _onboardingData.user[data.name] = data.value; });
  };

  useEffect(() => {
    getCity();
  }, []);

  const handleSubmit = async () => {
    const response = await USER_SERVICE.compeleteOnboarding(onboardingData);
    if (response) {
      router.push("/");
    }
  };

  const formSubmitHandler = (formStep) => {
    try {
      if (formStep === "step1") {
        stepOneVerifier.parse(onboardingData.user);
        setStep("step2");
        setFormError(false);
        return;
      }
      if (formStep === "step2") {
        stepTwoVerifier.parse(onboardingData.company);
        setFormError(false);
        handleSubmit();
      }
    } catch (error) {
      if (error instanceof ZodError) {
        console.log("error :>> ", error);
        const formErrorResult = error.flatten();
        const errors = Object.keys(formErrorResult.fieldErrors).map((item) => formErrorResult.fieldErrors[item][0]);
        setFormError(errors);
      }
    }
  };

  const renderStep1 = () => (
    <Form>
      <Input
        label="İsim"
        value={onboardingData.user.name}
        onChange={(e) => userFormHandler({ name: "name", value: e.target.value })}
      />
      <Input
        label="Soyisim"
        value={onboardingData.user.surname}
        onChange={(e) => userFormHandler({ name: "surname", value: e.target.value })}
      />
      <Input
        label="Telefon Numarası"
        value={onboardingData.user.phoneNumber}
        type="number"
        onChange={(e) => userFormHandler({ name: "phoneNumber", value: Number(e.target.value) })}
      />
      {formError && formError.map((item) => <div>{item}</div>)}
      <Button type="primary" onClick={() => formSubmitHandler("step1")}>
        İleri
      </Button>
    </Form>
  );

  const renderStep2 = () => (
    <Form
      initialValues={{
        city: cities[0]?.label,
      }}
    >
      <Input
        label="Şirket Adı"
        description="Şirketinizin adını giriniz"
        value={onboardingData.company.name}
        onChange={(e) => setOnboardingData((_onboardingData) => { _onboardingData.company.name = e.target.value; })}
      />
      <Select
        style={{ width: 120 }}
        onChange={(cityName) => setOnboardingData((_onboardingData) => {
          _onboardingData.company.address.city = cityName;
        })}
        options={cities}
        value={onboardingData.company.address.city}
      />
      <Select
        disabled={districts.length === 0}
        style={{ width: 120 }}
        onChange={(cityName) => setOnboardingData((_onboardingData) => { _onboardingData.company.address.district = cityName; })}
        options={districts}
        value={onboardingData.company.address.district}
      />
      <Input
        label="Açık Adres"
        description="Şirketinizin açık adresini giriniz"
        value={onboardingData.company.address.mailingAddress}
        onChange={(e) => setOnboardingData((_onboardingData) => { _onboardingData.company.address.mailingAddress = e.target.value; })}
      />
      <Input
        label="Posta Kodu"
        description="Şirketinizin posta kodunu giriniz"
        type="number"
        value={onboardingData.company.address.postalCode}
        onChange={(e) => setOnboardingData((_onboardingData) => { _onboardingData.company.address.postalCode = Number(e.target.value); })}
      />
      {formError && formError.map((item) => <div>{item}</div>)}
      <Button type="primary" onClick={() => formSubmitHandler("step2")}>
        Kaydet
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
