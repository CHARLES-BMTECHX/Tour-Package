const express = require("express");
const {
  getAllAddresses,
  getAddressByFilters,
  createAddress,
  updateAddress,
  deleteAddress,
} = require("../Controller/addressController");

const router = express.Router();
router.get("/", getAllAddresses);
router.get("/filter", getAddressByFilters);
router.post("/", createAddress);
router.patch("/:id", updateAddress);
router.delete("/:id", deleteAddress);

module.exports = router;
