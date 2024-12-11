const User = require('../Models/usersModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// **GET**: Retrieve all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving users: ' + error.message });
  }
};

// **GET**: Retrieve a single user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving user: ' + error.message });
  }
};

// **POST**: Create a new user
const createUser = async (req, res) => {
  try {
    const { username, email, phoneNumber, password, confirmPassword, role } = req.body;

    // Validate required fields
    if (!username || !email || !phoneNumber || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Generate token
    const token = jwt.sign({ email, role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Create a new user (password will be hashed by pre('save') middleware)
    const newUser = new User({
      username,
      email,
      phoneNumber,
      password, // Plain password
      role,
      token, // Store the token in the document
    });

    // Save the user to the database
    await newUser.save();

    // Respond with success
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        phoneNumber: newUser.phoneNumber,
        role: newUser.role,
        token: newUser.token, // Return the token
      },
    });
  } catch (err) {
    // Handle validation and other errors
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};


// **PUT**: Update a user by ID
const updateUser = async (req, res) => {
  try {
    const { username, email, phoneNumber, password, role } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { username, email, phoneNumber, password, role },
      { new: true, runValidators: true } // Return the updated document
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(500).json({ error: 'Error updating user: ' + error.message });
  }
};

// **DELETE**: Delete a user by ID
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting user: ' + error.message });
  }
};


const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user and include the password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User found:', user);
    console.log(password,user.password);
    
    // Validate password
    const validPassword = await bcrypt.compare(password, user.password);
    console.log('Password match:', validPassword);

    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    console.log('Generated token:', token);

    // Respond with user data and token
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Login Error:', err.message);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

// module.exports = loginUser;



module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  loginUser,
  updateUser,
  deleteUser,
};
