import { Router } from "express";
import AddressData from "../data/AddressData.json";

const cityData = AddressData.map((city) => ({
  id: city.id,
  name: city.name,
}));

const route = Router();

route.get("/", (req, res) => {
  res.send(cityData);
});

route.get("/:id/districts", (req, res) => {
  const { id } = req.params;
  const findedCity = AddressData.find((city) => city.id === Number(id));

  if (!findedCity) {
    return res.status(404).send({
      message: "city not found",
    });
  }
  res.send(findedCity.districts);
});

export default route;
