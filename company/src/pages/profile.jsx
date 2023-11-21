import React, { useEffect, useRef, useState } from "react";

import USER_SERVICE from "../services/user";
import ADRESS_SERVICE from "../services/location";
import COMPANY_SERVICE from "../services/company";
import { CDN_SERVICE } from "../services/cdn";
import Button from "@/components/library/Button";
import Input from "@/components/library/Input";

export default function Profile() {
  const [isEdit, setIsEdit] = useState(false);
  const [user, setUser] = useState({
    name: "",
    surname: "",
    email: "",
    phoneNumber: "",
  });
  const [companyData, setCompanyData] = useState({
    name: "",
    logo: "",
  });
  const [companyAddress, setCompanyAddress] = useState({
    city: "",
    district: "",
    postalCode: "",
    mailingAddress: "",
  });
  const [city, setCity] = useState([]);
  const [district, setDistrict] = useState([]);
  const selectedImage = useRef(null);

  const getUserData = async () => {
    const repsonse = await USER_SERVICE.me();

    const {
      name, email, phoneNumber, surname, company,
    } = repsonse.data.data;
    setUser({
      name, email, phoneNumber, surname,
    });

    setCompanyData({ name: company.name, logo: company.logo });
    setCompanyAddress(company.address);
  };

  const userUpdateHandler = (data) => {
    setUser({ ...user, [data.name]: data.value });
  };
  const companyUpdateHandler = (data) => {
    setCompanyData({ ...companyData, [data.name]: data.value });
  };

  const getDistrict = async (cityID) => {
    const { data } = await ADRESS_SERVICE.getDistrict(cityID);
    const mutateDistrict = data.map((item) => ({ label: item.name, value: item.name }));
    setDistrict(mutateDistrict);
  };

  const addressUpdateHandler = (data) => {
    if (data.name === "city") {
      getDistrict(data.value);
    }
    if (data.name === "postalCode") {
      return setCompanyAddress({ ...companyAddress, [data.name]: Number(data.value) });
    }
    setCompanyAddress({ ...companyAddress, [data.name]: data.value });
  };

  const saveButtonClickHandler = async () => {
    const response = await USER_SERVICE.update(user);
    const companyUpdateBody = { name: companyData.name, address: companyAddress };
    if (selectedImage.current) {
      const { data } = await CDN_SERVICE.uploadImage(selectedImage.current);
      companyUpdateBody.logo = data.fileName;
      selectedImage.current = null;
    }
    const companyResponse = await COMPANY_SERVICE.update(companyUpdateBody);

    if (response !== false && companyResponse !== false) {
      setIsEdit(false);
      getUserData();
    }
  };

  const getCity = async () => {
    const { data } = await ADRESS_SERVICE.getCities();
    const mutateCity = data.map((item) => ({ label: item.name, value: item.id }));
    setCity(mutateCity);
  };

  const fileInputChangeHandler = (e) => {
    const image = e.target.files[0];
    setCompanyData({ ...companyData, logo: URL.createObjectURL(image) });
    e.target.value = null;
    selectedImage.current = image;
  };

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    if (isEdit === true) {
      getCity();
    }
  }, [isEdit]);

  const companyImageClickHandler = () => {
    document.querySelector("#company-image-input").click();
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
              <i className="icon icon-sidemenu" />
            </div>
          </div>
          <Input className="profile-section-body-input" label="Şirket İsmi" value={companyData.name} />
        </div>
      </div>
      <div className="profile-section">
        <div className="profile-section-header">
          <h3>Kullanıcı Bilgileri</h3>
        </div>
        <div className="divider" />
        <div className="profile-section-body">
          <Input className="profile-section-body-input" label="İsim" value={user.name} />
          <Input className="profile-section-body-input" label="Soyisim" value={user.surname} />
          <Input className="profile-section-body-input" label="E-mail" disabled value={user.email} />
          <Input className="profile-section-body-input" label="Telefon Numarası" disabled value={user.phoneNumber} />
        </div>
      </div>
      <input type="file" id="company-image-input" hidden onChange={fileInputChangeHandler} />
      <Button variant="small" onClick={saveButtonClickHandler}>Kaydet</Button>
    </div>
  );
}
