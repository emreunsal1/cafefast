import React, { useEffect, useState } from "react";
import {
  Form, Input, Button, Select,
} from "antd";
import USER_SERVICE from "../services/user";
import ADRESS_SERVICE from "../services/address";

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
  });
  const [companyAddress, setCompanyAddress] = useState({
    city: "",
    district: "",
    postalCode: "",
    mailingAddress: "",
  });
  const [city, setCity] = useState([]);
  const [district, setDistrict] = useState([]);

  const getUserData = async () => {
    const repsonse = await USER_SERVICE.me();

    const {
      name, email, phoneNumber, surname, company,
    } = repsonse.data.data;
    setUser({
      name, email, phoneNumber, surname,
    });

    setCompanyData({ name: company.name });
    setCompanyAddress(company.address);
  };

  const userUpdateHandler = (data) => {
    console.log(data);
    const initialUser = user;
    initialUser[data.name] = data.value;
    setUser(initialUser);
  };
  const companyUpdateHandler = (data) => {
    const initialCompany = companyData;
    initialCompany[data.name] = data.value;
    setCompanyData(initialCompany);
  };

  const getDistrict = async (cityID) => {
    const { data } = await ADRESS_SERVICE.getDistrict(cityID);
    const mutateDistrict = data.map((item) => ({ label: item.name, value: item.name }));
    setDistrict(mutateDistrict);
  };

  const addressUpdateHandler = (data) => {
    if (data.name === city) {
      getDistrict(data.value);
    }
    const initialAddress = companyAddress;
    initialAddress[data.name] = data.value;
    setCompanyAddress(initialAddress);
  };

  const saveButtonClickHandler = () => {
    const response = USER_SERVICE.update({ user, companyData, companyAddress });
  };

  const getCity = async () => {
    const { data } = await ADRESS_SERVICE.getCities();
    const mutateCity = data.map((item) => ({ label: item.name, value: item.id }));
    setCity(mutateCity);
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
           <Form.Item label="Company Name" initialValue={companyData.name} name="companyName">
             <Input name="companyName" value={companyData.name} onChange={(e) => companyUpdateHandler({ name: "name", data: e.target.value })} />
           </Form.Item>
           <Form.Item label="City" name="city">
             <Select
               style={{ width: 120 }}
               onChange={(e) => addressUpdateHandler({ name: "city", value: e })}
               options={city}
               name="city"
               value={companyAddress.city}
             />
           </Form.Item>
           <Form.Item label="district" name="district">
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
               value={companyAddress.postalCode}
               onChange={(e) => addressUpdateHandler({ name: "postalCode", value: e.target.value })}
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