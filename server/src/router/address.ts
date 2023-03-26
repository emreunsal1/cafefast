import { Router } from "express";
import AddressData from "../data/AddressData.json";

const cityData = AddressData.map((city) => ({
  id: city.id,
  name: city.name,
  districts: city.districts,
}));

const route = Router();

route.get("/", (req, res) => {
  res.send(cityData);
});

route.get("/:id/districts", (req, res) => {
  const { id } = req.params;
  const districts = cityData.find((city) => city.id === Number(id));

  res.send(districts);
});

export default route;
