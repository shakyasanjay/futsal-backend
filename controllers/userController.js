const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const {
      name,
      username,
      email,
      password,
      phoneNumber,
      role = "User",
    } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      username,
      email,
      password: hashedPassword,
      phoneNumber,
      role,
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      "secret-key",
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMyProfile = async(req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId, "-password");

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const updateMyProfile = async(req, res) => {
  try {
    const userId = req.user.userId;

    const {name, password, phoneNumber} = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let hashedPassword = user.password;
    if(password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    user.name = name;
    user.password = hashedPassword;
    user.phoneNumber = phoneNumber;

    user.save()
    
    return res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { registerUser, loginUser, getMyProfile, updateMyProfile };
