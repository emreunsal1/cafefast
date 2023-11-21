/* eslint-disable prefer-destructuring */
/* eslint-disable no-shadow */
import React, { useEffect, useRef, useState } from "react";
import { useImmer } from "use-immer";
import USER_SERVICE from "../services/user";
import ADRESS_SERVICE from "../services/location";
import COMPANY_SERVICE from "../services/company";
import { CDN_SERVICE } from "../services/cdn";
import Button from "@/components/library/Button";
import Input from "@/components/library/Input";
import Select from "@/components/library/Select";

// TODO: açık adres ve posta kodu için input ekle
export default function Profile() {
  const [user, setUser] = useState({
    name: "",
    surname: "",
    email: "",
    phoneNumber: "",
  });
  const [companyData, setCompanyData] = useImmer({
    name: "",
    logo: "",
    address: {
      city: "",
      district: "",
      postalCode: "",
      mailingAddress: "",
    },
  });
  const [cities, setCities] = useState(null);
  const [districts, setDistricts] = useState(null);
  const selectedImage = useRef(null);

  const getUserData = async () => {
    const repsonse = await USER_SERVICE.me();

    const {
      name, email, phoneNumber, surname, company,
    } = repsonse.data.data;
    setUser({
      name, email, phoneNumber, surname,
    });

    setCompanyData(({ name: company.name, logo: company.logo, address: company.address }));
  };

  const userUpdateHandler = ({ name, event }) => {
    setUser({ ...user, [name]: event.target.value });
  };

  const getDistricts = async (cityID) => {
    const { data } = await ADRESS_SERVICE.getDistrict(cityID);
    const mutatedDistricts = data.map((item) => ({ label: item.name, value: item.name }));
    setDistricts(mutatedDistricts);
    if (!companyData.address.district) {
      setCompanyData((_companyData) => { _companyData.address.district = mutatedDistricts[0].label; });
    }
  };

  const saveButtonClickHandler = async () => {
    const response = await USER_SERVICE.update(user);
    const _companyUpdateData = JSON.parse(JSON.stringify(companyData));
    if (selectedImage.current) {
      const { data } = await CDN_SERVICE.uploadImage(selectedImage.current);
      _companyUpdateData.logo = data.fileName;
      selectedImage.current = null;
    }
    if (!selectedImage.current) {
      delete _companyUpdateData.logo;
    }
    const companyResponse = await COMPANY_SERVICE.update(_companyUpdateData);

    if (response !== false && companyResponse !== false) {
      getUserData();
    }
  };

  const getCities = async () => {
    const { data } = await ADRESS_SERVICE.getCities();
    const mutateCity = data.map((item) => ({ label: item.name, value: item.id }));
    setCities(mutateCity);
  };

  const fileInputChangeHandler = (e) => {
    const image = e.target.files[0];
    setCompanyData((_companyData) => { _companyData.logo = URL.createObjectURL(image); });
    e.target.value = null;
    selectedImage.current = image;
  };

  const selectedCity = cities?.find((city) => city.label === companyData.address.city);
  const selectedDistrict = districts?.find((district) => district.label === companyData.address.district);

  useEffect(() => {
    getUserData();
    getCities();
  }, []);

  useEffect(() => {
    if (companyData.address.city) {
      getDistricts(selectedCity.value);
    }
  }, [companyData.address.city]);

  const companyImageClickHandler = () => {
    document.querySelector("#company-image-input").click();
  };

  const selectOnChangeHandler = (field, data) => {
    if (field === "city") {
      setCompanyData((companyData) => { companyData.address.district = ""; });
    }
    setCompanyData((companyData) => { companyData.address[field] = data.label; });
  };

  return (
    <div className="profile-page">
      <h2>Profil Bilgileri</h2>
      <div className="profile-section">
        <div className="profile-section-header">
          <h3>Şirket Bilgileri</h3>
        </div>
        <div className="divider" />
        <div className="profile-section-body">
          <div className="profile-section-body-company-image" onClick={companyImageClickHandler}>
            <img src={companyData.logo} />
            <div className="edit-icon-wrapper">
              <i className="icon icon-edit-outlined" />
            </div>
          </div>
          <Input
            className="profile-section-body-input"
            label="Şirket İsmi"
            value={companyData.name}
            onChange={(e) => setCompanyData((_companyData) => { _companyData.name = e.target.value; })}
          />
          <div className="profile-section-body-city-district-input">
            <Select
              label="Şehir"
              value={selectedCity}
              options={cities}
              onChange={(data) => selectOnChangeHandler("city", data)}
            />
            <Select
              label="İlçe"
              value={selectedDistrict}
              options={districts}
              onChange={(data) => selectOnChangeHandler("district", data)}
            />
          </div>
        </div>
      </div>
      <div className="profile-section">
        <div className="profile-section-header">
          <h3>Kullanıcı Bilgileri</h3>
        </div>
        <div className="divider" />
        <div className="profile-section-body">
          <Input
            className="profile-section-body-input"
            label="İsim"
            value={user.name}
            onChange={(event) => userUpdateHandler({ name: "name", event })}
          />
          <Input
            className="profile-section-body-input"
            label="Soyisim"
            value={user.surname}
            onChange={(event) => userUpdateHandler({ name: "surname", event })}
          />
          <Input
            className="profile-section-body-input"
            label="E-mail"
            readOnly
            value={user.email}
            onChange={(event) => userUpdateHandler({ name: "email", event })}
          />
          <Input
            className="profile-section-body-input"
            label="Telefon Numarası"
            readOnly
            value={user.phoneNumber}
            onChange={(event) => userUpdateHandler({ name: "phoneNumber", event })}
          />
        </div>
      </div>
      <input type="file" id="company-image-input" hidden onChange={fileInputChangeHandler} />
      <Button variant="small" onClick={saveButtonClickHandler}>Kaydet</Button>
    </div>
  );
}
