const User = require("../models/User");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

exports.signup = async (req, res) => {
  try {
    const { username, email, password, country } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists)
      return res
        .status(400)
        .json({ toast: { title: "Email already exists", description: "The provided email is already registered." } });

    const user = await User.create({ username, email, password, country });
    if (user) {
      const token = generateToken(user._id);
      res.status(201).json({
        token,
        user: { _id: user._id, username: user.username, email: user.email, country: user.country },
        toast: { title: "Account created", description: "Your account has been created successfully." },
      });
    } else {
      res.status(400).json({ toast: { title: "Invalid user data", description: "Failed to create user with given data." } });
    }
  } catch (error) {
    res.status(500).json({ toast: { title: "Server error", description: error.message } });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        token: generateToken(user._id),
        user: { _id: user._id, username: user.username, email: user.email, country: user.country },
        toast: { title: "Login successful", description: "Welcome back!" },
      });
    } else {
      res.status(401).json({ toast: { title: "Invalid credentials", description: "Email or password is incorrect." } });
    }
  } catch (error) {
    res.status(500).json({ toast: { title: "Server error", description: error.message } });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const userId = req.user._id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ toast: { title: "Missing fields", description: "Current and new password are required." } });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ toast: { title: "User not found", description: "No user found for this account." } });

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) return res.status(401).json({ toast: { title: "Incorrect password", description: "Current password is incorrect." } });

    user.password = newPassword;
    await user.save();

    res.json({ toast: { title: "Password updated", description: "Your password has been changed successfully." } });
  } catch (error) {
    res.status(500).json({ toast: { title: "Server error", description: error.message } });
  }
};