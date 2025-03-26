import User from "../models/User.js";
import SocialUser from "../models/SocialLogin.js";

export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    let user = await User.findById(userId);

    if (!user) {
      user = await SocialUser.findById(userId);
    }

    if (!user) {
      return res.status(404).json({ msg: "User not found." });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ msg: "Server error fetching user by ID." });
  }
};
export const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    console.log(email, "Fetching user by email");
    const user = await SocialUser.findOne({ email });
    console.log(user);
    if (!user) {
      return res.status(404).json({ msg: "User not found." });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user by email:", error);
    res.status(500).json({ msg: "Server error fetching user by email." });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;

    const userSearch = User.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    }).select("_id name email");

    const socialUserSearch = SocialUser.find({
      $or: [
        { username: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    }).select("_id username email");

    // Execute both queries in parallel
    const [users, socialUsers] = await Promise.all([
      userSearch,
      socialUserSearch,
    ]);

    // Combine results
    const combinedResults = [
      ...users.map((user) => ({
        _id: user._id,
        name: user.name,
        email: user.email,
      })),
      ...socialUsers.map((user) => ({
        _id: user._id,
        name: user.username,
        email: user.email,
      })),
    ];

    res.json(combinedResults);
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ msg: "Server error searching users." });
  }
};
