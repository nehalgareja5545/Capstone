import { jwtDecode } from "jwt-decode";

const getUser = async () => {
  try {
    // First try to get Auth.js session (for Google/Facebook)
    const authSessionResponse = await fetch(
      "http://localhost:5000/auth/google/session",
      {
        method: "GET",
        credentials: "include", // Important for Auth.js cookies
      }
    );

    // If successful response from social auth
    if (authSessionResponse.ok) {
      const session = await authSessionResponse.json();
      if (session?.user) {
        // console.log(session.user.email);
        return session.user;
      }
    }

    // If no social auth session, try JWT token auth
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return null;
    }

    // Regular JWT authentication flow
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId;
    console.log("JWT userId:", userId);

    if (userId) {
      const response = await fetch(`http://localhost:5000/user/${userId}`, {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const userData = await response.json();
      return userData;
    }

    // If no valid authentication method found
    window.location.href = "/login";
    return null;
  } catch (error) {
    console.error("Error in getUser:", error);
    if (error.message.includes("Failed to fetch")) {
      console.error("Network error occurred");
    } else {
      window.location.href = "/login";
    }
    return null;
  }
};

export default getUser;
