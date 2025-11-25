const User = require("../models/User");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

exports.signup = async (req, res) => {
  try {
    const { username, email, password, country } = req.body;

    const normalizedEmail = email.toLowerCase();

    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({
        toast: {
          title: "Email already exists",
          description: "The provided email is already registered."
        }
      });
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=!_?]).{5,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        toast: {
          title: "Weak Password || Signup Failed",
          description: "Password must contain at least 1 uppercase, 1 lowercase, 1 digit, 1 special character and be at least 5 characters long."
        }
      });
    }

    const user = await User.create({
      username,
      email: normalizedEmail,
      password,
      country
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        country: user.country,
        createdAt: user.createdAt
      },
      toast: {
        title: "Account created",
        description: "Your account has been created successfully."
      }
    });
  } catch (error) {
    return res.status(500).json({
      toast: { title: "Server error", description: error.message }
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });
    if (user && (await user.matchPassword(password))) {
      return res.json({
        token: generateToken(user._id),
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          country: user.country,
          createdAt: user.createdAt
        },
        toast: {
          title: "Login successful",
          description: "Welcome back!"
        }
      });
    }

    return res.status(401).json({
      toast: {
        title: "Invalid credentials",
        description: "Email or password is incorrect."
      }
    });
  } catch (error) {
    return res.status(500).json({
      toast: { title: "Server error", description: error.message }
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const userId = req.user._id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        toast: {
          title: "Missing fields",
          description: "Current and new password are required."
        }
      });
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=!_?]).{5,}$/;

    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        toast: {
          title: "Weak Password",
          description: "New password must include 1 uppercase, 1 lowercase, 1 number, 1 special character, and be at least 5 characters long."
        }
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        toast: {
          title: "User not found",
          description: "No user found for this account."
        }
      });
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        toast: {
          title: "Incorrect password",
          description: "Current password is incorrect."
        }
      });
    }

    user.password = newPassword;
    await user.save();

    return res.json({
      toast: {
        title: "Password updated",
        description: "Your password has been changed successfully."
      }
    });
  } catch (error) {
    return res.status(500).json({
      toast: { title: "Server error", description: error.message }
    });
  }
};
