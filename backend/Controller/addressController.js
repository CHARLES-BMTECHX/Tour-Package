const Address = require("../Models/addressModel");

// Get all addresses
const getAllAddresses = async (req, res) => {
  try {
    const addresses = await Address.find();
    res.status(200).json(addresses);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch addresses", error });
  }
};
// Get address by filters (country, state, city)
const getAddressByFilters = async (req, res) => {
  const { country, state, city } = req.query;

  try {
    const query = {};
    if (country) query.country = country;
    if (state) query.state = state;
    if (city) query.city = city;

    const addresses = await Address.find(query);
    res.status(200).json(addresses);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch addresses", error });
  }
};
// Create a new address
const createAddress = async (req, res) => {
  const { country, state, city, description, type } = req.body;

  if (!country || !state || !city || !description || !type) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newAddress = new Address({ country, state, city, description, type });
    await newAddress.save();
    res.status(201).json({ message: "Address created successfully", address: newAddress });
  } catch (error) {
    res.status(500).json({ message: "Failed to create address", error });
  }
};
// Update an existing address by ID
const updateAddress = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedAddress = await Address.findByIdAndUpdate(id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Run schema validations
    });

    if (!updatedAddress) {
      return res.status(404).json({ message: "Address not found" });
    }

    res.status(200).json({ message: "Address updated successfully", address: updatedAddress });
  } catch (error) {
    res.status(500).json({ message: "Failed to update address", error });
  }
};
// Delete an address by ID
const deleteAddress = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedAddress = await Address.findByIdAndDelete(id);

    if (!deletedAddress) {
      return res.status(404).json({ message: "Address not found" });
    }

    res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete address", error });
  }
};
module.exports = {
  getAllAddresses,
  getAddressByFilters,
  createAddress,
  updateAddress,
  deleteAddress,
};
