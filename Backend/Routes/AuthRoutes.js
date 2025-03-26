import express from "express";
import dotenv from "dotenv";
import { ExpressAuth } from "@auth/express";
import GoogleProvider from "@auth/express/providers/google";
import FacebookProvider from "@auth/express/providers/facebook";
import jwt from "jsonwebtoken";
import SocialUser from "../models/SocialLogin.js";
import { validateLogin, validateSignup } from "../middleware/validator.js";
import { loginController } from "../Controllers/LoginController.js";
import { signupController } from "../Controllers/SignUpController.js";
dotenv.config();

const router = express.Router();

// Google Authentication Route
router.use(
  "/google/*",
  ExpressAuth({
    providers: [
      GoogleProvider({
        clientId: process.env.AUTH_GOOGLE_ID,
        clientSecret: process.env.AUTH_GOOGLE_SECRET,
      }),
    ],
    secret: process.env.AUTH_SECRET,
    callbacks: {
      signIn: async ({ user, account, profile, email, credentials }) => {
        try {
          const googleId = profile.sub;
          let existingUser = await SocialUser.findOne({ googleId });

          if (!existingUser) {
            existingUser = await SocialUser.create({
              email: profile.email,
              username: profile.name,
              googleId,
              profilePicture: profile.picture,
            });
          }

          // Generate a token
          const token = jwt.sign(
            { userId: existingUser._id },
            process.env.JWT_SECRET,
            {
              expiresIn: "24h",
            }
          );

          // Store the token in the user document
          existingUser.token = token;
          await existingUser.save();

          return true;
        } catch (error) {
          console.error("Error during Google sign-in:", error);
          return false;
        }
      },
      redirect: async (url, baseUrl) => {
        return "http://localhost:3000/dashboard";
      },
    },
  })
);

// Facebook Authentication Route
router.use(
  "/facebook/*",
  ExpressAuth({
    providers: [
      FacebookProvider({
        clientId: process.env.AUTH_FACEBOOK_ID,
        clientSecret: process.env.AUTH_FACEBOOK_SECRET,
      }),
    ],
    secret: process.env.AUTH_SECRET,
    callbacks: {
      signIn: async ({ user, account, profile, email, credentials }) => {
        try {
          const facebookId = profile.id;
          let existingUser = await SocialUser.findOne({ facebookId });

          if (!existingUser) {
            existingUser = await SocialUser.create({
              username: profile.name,
              facebookId,
              profilePicture: profile.picture.data.url,
            });
          }

          // Generate a token
          const token = jwt.sign(
            { userId: existingUser._id },
            process.env.JWT_SECRET,
            {
              expiresIn: "24h",
            }
          );

          // Store the token in the user document
          existingUser.token = token;
          await existingUser.save();

          return true;
        } catch (error) {
          console.error("Error during Facebook sign-in:", error);
          return false;
        }
      },
      redirect: async (url, baseUrl) => {
        return "http://localhost:3000/dashboard";
      },
    },
  })
);

// Login Route
router.post("/login", validateLogin, loginController);

// Signup Route
router.post("/signup", validateSignup, signupController);

export default router;
