import express from "express";
import dotenv from "dotenv";
import { ExpressAuth } from "@auth/express";
import GoogleProvider from "@auth/express/providers/google";
import FacebookProvider from "@auth/express/providers/facebook";
import { loginController } from "../Controllers/LoginController.js";
import { signupController } from "../Controllers/SignUpController.js";
import { validateSignup, validateLogin } from "../middleware/validator.js";
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
        return true;
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
        return true;
      },
      redirect: async (url, baseUrl) => {
        return "http://localhost:3000/dashboard";
      },
    },
  })
);

// Signup Route
router.post("/signup", validateSignup, signupController);

// Login Route
router.post("/login", validateLogin, loginController);

export default router;
