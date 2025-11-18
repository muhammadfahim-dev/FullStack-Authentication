import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

const generateTokens = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User Not Found" });
  }

  const refreshToken = user.generateRefreshToken();
  const accessToken = user.generateAccessToken();

  user.refreshToken = refreshToken;
  user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if ([name, email, password].some((field) => field === "")) {
      return res.status(400).json({ message: "Invalid Field Data" });
    }

    const existedUser = await User.findOne({ name, email });
    if (existedUser) {
      return res.status(400).json({ message: "User Already Exists" });
    }

    const user = await User.create({
      name,
      password,
      email,
    });

    if (!user) {
      return res
        .status(500)
        .json({ message: "something went while registering user" });
    }

    return res.status(201).json({ message: "User Registered", user });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "something went wrong while registering user" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Missing Field" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    const isMatch = user.isPasswordCorrect(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    const { accessToken, refreshToken } = await generateTokens(user._id);

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      maxAge: 24 * 60 * 60 * 1000,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({ message: "User Loged In", user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const logoutUser = async (req, res) => {
  console.log(req.user);
  try {
    return res
      .status(200)
      .clearCookie("accessToken")
      .clearCookie("refreshToken")
      .json({ message: "User loged out" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "something went wrong whiel logout user" });
  }
};

const refreshAccessToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    // if (!token) {
    //   return res.status(401).json({ message: "Not Authenticated" });
    // }

    const decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decodedToken._id);

    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    const { accessToken, refreshToken: newRefreshToken } = await generateTokens(
      user._id
    );

    user.refreshToken = newRefreshToken;
    user.save({ validateBeforeSave: false });

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, {
        ...options,
        maxAge: 24 * 60 * 60 * 1000,
      })
      .cookie("refreshToken", newRefreshToken, options)
      .json({ message: "Refreshed Successfully" });
  } catch (error) {}
};

export { registerUser, logoutUser, loginUser, refreshAccessToken };
