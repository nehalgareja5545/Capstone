import React, { useState } from "react";
import axios from "axios";
import "./LoginRegistrationPage.css";
import Footer from "../../shared/Footer";

function LoginRegistrationPage() {
  // State for the login form
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginErrors, setLoginErrors] = useState({});

  // State for the registration form
  const [regData, setRegData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState("");
  const [regErrors, setRegErrors] = useState({});

  // Handle input changes for login form
  const handleLoginInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  // Handle input changes for registration form
  const handleRegInputChange = (e) => {
    const { name, value } = e.target;
    setRegData({ ...regData, [name]: value });
  };

  // Handle login form submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    setLoginErrors({});

    try {
      const response = await axios.post(
        "http://localhost:5000/auth/login",
        loginData
      );
      const data = response.data;
      localStorage.setItem("token", data.token);
      window.location.href = "/dashboard";
    } catch (error) {
      setLoginLoading(false);
      if (error.response && error.response.data) {
        const { data } = error.response;
        if (data.errors && Array.isArray(data.errors)) {
          const fieldErrors = {};
          data.errors.forEach((errorItem) => {
            const field = errorItem.path;
            if (fieldErrors[field]) {
              fieldErrors[field] += `, ${errorItem.msg}`;
            } else {
              fieldErrors[field] = errorItem.msg;
            }
          });
          setLoginErrors(fieldErrors);
        } else {
          setLoginError(data.message || "Login failed. Please try again.");
        }
      } else {
        setLoginError("An unexpected error occurred.");
        console.error("Login Error:", error);
      }
    }
  };

  // Handle registration form submission
  const handleRegSubmit = async (e) => {
    e.preventDefault();
    setRegLoading(true);
    setRegError("");
    setRegErrors({});

    // Check if passwords match
    if (regData.password !== regData.confirmPassword) {
      setRegLoading(false);
      setRegErrors({ confirmPassword: "Passwords do not match" });
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/signup", {
        email: regData.email,
        password: regData.password,
      });

      const data = response.data;
      localStorage.setItem("token", data.token);
      window.location.href = "/dashboard";
    } catch (error) {
      setRegLoading(false);
      if (error.response && error.response.data) {
        const { data } = error.response;
        if (data.errors && Array.isArray(data.errors)) {
          const fieldErrors = {};
          data.errors.forEach((errorItem) => {
            const field = errorItem.path;
            if (fieldErrors[field]) {
              fieldErrors[field] += `, ${errorItem.msg}`;
            } else {
              fieldErrors[field] = errorItem.msg;
            }
          });
          setRegErrors(fieldErrors);
        } else {
          setRegError(data.message || "Registration failed. Please try again.");
        }
      } else {
        setRegError("An unexpected error occurred.");
        console.error("Registration Error:", error);
      }
    }
  };

  // Social login URLs
  const googleLoginUrl = "http://localhost:5000/auth/google/signin";
  const facebookLoginUrl = "http://localhost:5000/auth/facebook/signin";

  return (
    <div className="bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* Logo Section */}
          <div className="flex items-center space-x-2">
            <img
              src="Images/mobile-logo.png"
              alt="Logo"
              className="h-10 w-10"
            />
            <span className="text-2xl font-bold text-white">SplitShare</span>
          </div>
          {/* Navigation Menu */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="/" className="text-white hover:text-gray-200">
              Home
            </a>
            <a href="/" className="text-white hover:text-gray-200">
              About
            </a>
            <a href="/" className="text-white hover:text-gray-200">
              Contact
            </a>
            <input
              type="text"
              placeholder="Search in site"
              className="border border-gray-300 rounded px-2 py-1 text-black"
            />
          </nav>
          {/* Mobile Menu Button */}
          <button className="text-white md:hidden">
            {/* Menu Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* Banner */}
      <div className="bg-blue-700 text-white text-center py-16">
        <h1 className="text-4xl font-bold">Welcome to SplitShare</h1>
        <p className="mt-4 text-lg">
          Securely access your account or create a new one
        </p>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 space-y-12">
        {/* Login Section */}
        <div className="bg-white shadow-lg rounded-lg md:p-8 p-4 flex md:flex-row flex-col form-container">
          <div className="md:w-1/3 w-full md:pr-8 md:border-r border-gray-200 flex flex-col items-center justify-center left-side">
            <h2 className="text-3xl font-bold text-blue-600 mb-4">Login</h2>
            <p className="text-gray-600">Enter your credentials</p>
          </div>
          <div className="md:w-2/3 w-full md:pl-8 right-side">
            <form
              className="space-y-6 flex flex-col items-center"
              onSubmit={handleLoginSubmit}
            >
              <div className="w-full max-w-md">
                <div className="form-field">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder=" "
                    className="form-input"
                    value={loginData.email}
                    onChange={handleLoginInputChange}
                    required
                  />
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <div className="underline-animation"></div>
                </div>
                {loginErrors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {loginErrors.email}
                  </p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  We'll never share your email with anyone else.
                </p>
              </div>
              <div className="w-full max-w-md">
                <div className="form-field">
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder=" "
                    className="form-input"
                    value={loginData.password}
                    onChange={handleLoginInputChange}
                    required
                  />
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <div className="underline-animation"></div>
                </div>
                {loginErrors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {loginErrors.password}
                  </p>
                )}
              </div>
              {loginError && (
                <p className="text-red-500 text-center">{loginError}</p>
              )}
              <div className="w-full max-w-md">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                  disabled={loginLoading}
                >
                  {loginLoading ? "Logging in..." : "Login"}
                </button>
              </div>
              <p className="text-center mt-4">
                Don't have an account?{" "}
                <a href="#registration" className="text-blue-600">
                  Sign Up
                </a>
              </p>
            </form>
          </div>
        </div>

        {/* Social Login Section */}
        <div className="bg-white shadow-lg rounded-lg md:p-8 p-4 flex md:flex-row flex-col form-container">
          <div className="md:w-1/3 w-full md:pr-8 md:border-r border-gray-200 flex flex-col items-center justify-center left-side">
            <h2 className="text-3xl font-bold text-gray-700 mb-4">
              Social Login
            </h2>
          </div>
          <div className="md:w-2/3 w-full md:pl-8 right-side flex flex-col items-center space-y-4">
            <div className="w-full max-w-sm">
              <a
                href={googleLoginUrl}
                className="flex items-center justify-center border border-red-500 text-red-500 px-4 py-2 rounded hover:bg-red-500 hover:text-white w-full"
              >
                <span className="mr-2">
                  {/* Google Icon */}
                  <img
                    src="https://www.vectorlogo.zone/logos/google/google-icon.svg"
                    alt="Google"
                    className="h-6 w-6"
                  />
                </span>
                Login with Google
              </a>
            </div>
            <div className="w-full max-w-sm">
              <a
                href={facebookLoginUrl}
                className="flex items-center justify-center border border-blue-700 text-blue-700 px-4 py-2 rounded hover:bg-blue-700 hover:text-white w-full"
              >
                <span className="mr-2">
                  {/* Facebook Icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M22.676 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24h11.495v-9.294H9.695v-3.622h3.125V8.412c0-3.100 1.893-4.788 4.659-4.788 1.325 0 2.463.098 2.794.142v3.24l-1.918.001c-1.504 0-1.794.715-1.794 1.763v2.313h3.588l-.467 3.622h-3.121V24h6.117C23.407 24 24 23.407 24 22.676V1.325C24 .593 23.407 0 22.676 0z" />
                  </svg>
                </span>
                Login with Facebook
              </a>
            </div>
          </div>
        </div>

        {/* Registration Section */}
        <div
          id="registration"
          className="bg-white shadow-lg rounded-lg md:p-8 p-4 flex md:flex-row flex-col form-container"
        >
          <div className="md:w-1/3 w-full md:pr-8 md:border-r border-gray-200 flex flex-col items-center justify-center left-side">
            <h2 className="text-3xl font-bold text-green-600 mb-4">
              Registration
            </h2>
            <p className="text-gray-600">Create a new account</p>
          </div>
          <div className="md:w-2/3 w-full md:pl-8 right-side">
            <form
              className="space-y-6 flex flex-col items-center registration-form"
              onSubmit={handleRegSubmit}
            >
              <div className="w-full max-w-md">
                <div className="form-field">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder=" "
                    className="form-input"
                    value={regData.email}
                    onChange={handleRegInputChange}
                    required
                  />
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <div className="underline-animation"></div>
                </div>
                {regErrors.email && (
                  <p className="text-red-500 text-sm mt-1">{regErrors.email}</p>
                )}
              </div>
              <div className="w-full max-w-md">
                <div className="form-field">
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder=" "
                    className="form-input"
                    value={regData.password}
                    onChange={handleRegInputChange}
                    required
                  />
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <div className="underline-animation"></div>
                </div>
                {regErrors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {regErrors.password}
                  </p>
                )}
              </div>
              <div className="w-full max-w-md">
                <div className="form-field">
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder=" "
                    className="form-input"
                    value={regData.confirmPassword}
                    onChange={handleRegInputChange}
                    required
                  />
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm Password
                  </label>
                  <div className="underline-animation"></div>
                </div>
                {regErrors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {regErrors.confirmPassword}
                  </p>
                )}
              </div>
              {regError && (
                <p className="text-red-500 text-center">{regError}</p>
              )}
              <div className="w-full max-w-md">
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                  disabled={regLoading}
                >
                  {regLoading ? "Signing Up..." : "Sign Up"}
                </button>
              </div>
              <p className="text-center mt-4">
                Already have an account?{" "}
                <a href="#login" className="text-blue-600">
                  Log In
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default LoginRegistrationPage;
