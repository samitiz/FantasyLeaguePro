import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { createTeam } from "../services/teamService.js";
import { validationResult } from "express-validator";
import HttpError from "../middleware/http-error.js";

export const registerOrLogin = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid inputs passed, please check your data", 422));
  }

  const { email, password, name, teamName } = req.body;

  try {
    let user = await User.findOne({ email });

    // Login if user exists
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return next(new HttpError("Invalid Credentials.", 400));
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
      return res.json({ token });
    }

    // Register new user
    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ email, password: hashedPassword, name });

    await user.save();
    await createTeam(user._id, teamName);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    return next(new HttpError(`Server Error: ${err.message}`, 500));
  }
});
