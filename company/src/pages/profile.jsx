import React, { useEffect, useRef, useState } from "react";
import {
  Form, Input, Button, Select,
} from "antd";
import USER_SERVICE from "../services/user";
import ADRESS_SERVICE from "../services/location";
import COMPANY_SERVICE from "../services/company";
import Layout from "../components/Layout";
import { CDN_SERVICE } from "../services/cdn";

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

  const inputChangeHandler = (e) => {
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

  return (

    <div id="profile">
      {!isEdit && (
      <div className="container">
        <div className="profile-list">
          <div className="user-info">
            <h2>User Info</h2>
            <div className="row">
              name:
              {user.name}
            </div>
            <div className="row">
              surname:
              {user.surname}
            </div>
            <div className="row">
              email:
              {user.email}
            </div>
            <div className="row">
              phone:
              {user.phoneNumber}
            </div>
            <div className="row">
              email:
              {user.email}
            </div>
            <div className="company-info">
              <h2>Company Info</h2>
              <div className="company-logo">
                Company Logo:
                <img src={companyData.logo} alt="Company logo" />
              </div>
              <div className="row">
                company name :
                {companyData.name}
              </div>
              <div className="row">
                city :
                {companyAddress.city}
              </div>
              <div className="row">
                district :
                {companyAddress.district}
              </div>
              <div className="row">
                Postal Code :
                {companyAddress.postalCode}
              </div>
              <div className="row">
                mailingAddress :
                {companyAddress.mailingAddress}
              </div>

            </div>
          </div>
          <Button onClick={() => setIsEdit(true)}>Edit</Button>
        </div>
      </div>
      )}
      {isEdit
       && (
       <div className="edit-container">
         <h2>User Info</h2>
         <Form onFinish={saveButtonClickHandler}>
           <Form.Item label="name" initialValue={user.name} name="name">
             <Input name="name" value={user.name} onChange={(e) => userUpdateHandler({ name: "name", value: e.target.value })} />
           </Form.Item>
           <Form.Item label="surname" initialValue={user.surname} name="surname">
             <Input name="surname" value={user.surname} onChange={(e) => userUpdateHandler({ name: "surname", value: e.target.value })} />
           </Form.Item>
           <Form.Item label="Phone Number" initialValue={user.phoneNumber} name="phoneNumber">
             <Input name="phoneNumber" value={user.phoneNumber} onChange={(e) => userUpdateHandler({ name: "phoneNumber", value: e.target.value })} />
           </Form.Item>
           <h2>Company Info</h2>
           <div className="company-logo">
             <img src={companyData.logo} alt="Company logo" />
             <input type="file" onChange={inputChangeHandler} />
           </div>
           <Form.Item label="Company Name" initialValue={companyData.name} name="companyName">
             <Input name="companyName" value={companyData.name} onChange={(e) => companyUpdateHandler({ name: "name", value: e.target.value })} />
           </Form.Item>
           <Form.Item initialValue={companyAddress.city} label="City" name="city">
             <Select
               style={{ width: 120 }}
               onChange={(e) => addressUpdateHandler({ name: "city", value: e })}
               options={city}
               name="city"
               value={companyAddress.city}
             />
           </Form.Item>
           <Form.Item label="district" name="district" initialValue={companyAddress.district}>
             <Select
               style={{ width: 120 }}
               onChange={(e) => addressUpdateHandler({ name: "district", value: e })}
               options={district}
               name="district"
               value={companyAddress.district}
             />
           </Form.Item>
           <Form.Item label="postal code" initialValue={companyAddress.postalCode} name="postalCode">
             <Input
               name="postalCode"
               type="number"
               value={companyAddress.postalCode}
               onChange={(e) => addressUpdateHandler({ name: "postalCode", value: Number(e.target.value) })}
             />
           </Form.Item>
           <Form.Item initialValue={companyAddress.mailingAddress} label="Mailing Address" name="mailingAddress">
             <Input
               name="mailingAddress"
               value={companyAddress.mailingAddress}
               onChange={(e) => addressUpdateHandler({ name: "mailingAddress", value: e.target.value })}
             />
           </Form.Item>
           <Button type="primary" htmlType="submit">
             Save!
           </Button>
         </Form>

       </div>
       )}
    </div>
  );
}

Profile.getLayout = function getLayout(profile) {
  return (
    <Layout>
      {profile}
    </Layout>
  );
};
