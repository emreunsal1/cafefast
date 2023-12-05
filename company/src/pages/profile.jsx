/* eslint-disable prefer-destructuring */
/* eslint-disable no-shadow */
import React, {
  useEffect, useMemo, useRef, useState,
} from "react";
import { useImmer } from "use-immer";
import USER_SERVICE from "../services/user";
import ADRESS_SERVICE from "../services/location";
import COMPANY_SERVICE from "../services/company";
import { CDN_SERVICE } from "../services/cdn";
import Button from "@/components/library/Button";
import Input from "@/components/library/Input";
import Select from "@/components/library/Select";
import { useLoading } from "@/context/LoadingContext";
import { useMessage } from "@/context/GlobalMessage";
import Icon from "@/components/library/Icon";

const createStringifiedPageData = ({ user, company }) => JSON.stringify({ user, company });

export default function Profile() {
  const { setLoading } = useLoading();
  const message = useMessage();
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
  const [selectedImage, setSelectedImage] = useState(null);
  const initialPageData = useRef();

  const getUserData = async () => {
    setLoading(true);
    const repsonse = await USER_SERVICE.me();

    const {
      name, email, phoneNumber, surname, company,
    } = repsonse.data.data;

    const _companyData = { name: company.name, logo: company.logo, address: company.address };
    const _userData = {
      name, email, phoneNumber, surname,
    };

    setUser(_userData);
    setCompanyData(_companyData);
    initialPageData.current = createStringifiedPageData({ company: _companyData, user: _userData });
    setLoading(false);
  };

  const userUpdateHandler = ({ name, event }) => {
    setUser({ ...user, [name]: event.target.value });
  };

  const getDistricts = async (cityID) => {
    setLoading(true);
    const { data } = await ADRESS_SERVICE.getDistrict(cityID);
    const mutatedDistricts = data.map((item) => ({ label: item.name, value: item.name }));
    setDistricts(mutatedDistricts);
    if (!companyData.address.district) {
      setCompanyData((_companyData) => { _companyData.address.district = mutatedDistricts[0].label; });
    }
    setLoading(false);
  };

  const saveButtonClickHandler = async () => {
    setLoading(true);
    const response = await USER_SERVICE.update(user);
    const _companyUpdateData = JSON.parse(JSON.stringify(companyData));
    if (selectedImage) {
      const { data } = await CDN_SERVICE.uploadImage(selectedImage);
      _companyUpdateData.logo = data.fileName;
      setSelectedImage(null);
    }
    if (!selectedImage) {
      delete _companyUpdateData.logo;
    }
    const companyResponse = await COMPANY_SERVICE.update(_companyUpdateData);

    if (response !== false && companyResponse !== false) {
      getUserData();
    }
    message.success("Bilgilerin başarıyla kaydedildi.");
    setLoading(false);
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
    setSelectedImage(image);
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

  const discardChanges = () => {
    const initialData = JSON.parse(initialPageData.current);
    setCompanyData(initialData.company);
    setUser(initialData.user);
    setSelectedImage(null);
  };

  const isUpdateActive = initialPageData.current !== createStringifiedPageData({ company: companyData, user }) || !!selectedImage;

  return (
    <div className="profile-page">
      <h3>Profil Bilgileri</h3>
      <div className="profile-section">
        <div className="profile-section-header">
          <h4>Şirket Bilgileri</h4>
        </div>
        <div className="divider" />
        <div className="profile-section-body">
          <div className="profile-section-body-company-image" onClick={companyImageClickHandler}>
            <img src={companyData.logo} />
            <div className="edit-icon-wrapper">
              <Icon name="edit-outlined" />
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
          <Input
            className="profile-section-body-input"
            label="Posta Kodu"
            type="number"
            value={companyData.address.postalCode}
            onChange={(e) => setCompanyData((_companyData) => {
              _companyData.address.postalCode = Number(e.target.value);
            })}
          />
          <Input
            className="profile-section-body-input"
            label="Açık Adres"
            value={companyData.address.mailingAddress}
            onChange={(e) => setCompanyData((_companyData) => { _companyData.address.mailingAddress = e.target.value; })}
          />

        </div>
      </div>
      <div className="profile-section">
        <div className="profile-section-header">
          <h4>Kullanıcı Bilgileri</h4>
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
      <div className="profile-page-actions">
        <Button disabled={!isUpdateActive} onClick={saveButtonClickHandler}>Kaydet</Button>
        {isUpdateActive && <Button onClick={discardChanges}>Değişiklikleri İptal Et</Button>}
      </div>
    </div>
  );
}
