import addressData from "../data/AddressData.json";

export const validateCityAndDistrict = (city, district): "city" | "district" | "valid" => {
  const foundCity = addressData.find((_city) => _city.name === city);

  if (!foundCity) {
    return "city";
  }

  const foundDistrict = foundCity.districts.find((_district) => _district.name === district);
  if (!foundDistrict) {
    return "district";
  }

  return "valid";
};
