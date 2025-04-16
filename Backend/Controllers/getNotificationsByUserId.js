import Notification from "../models/Notification.js";
import User from "../models/User.js";

export const getNotificationsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ success: false, msg: "Missing userId" });
    }

    const notifications = await Notification.find({
      userIds: userId,
    })
      .sort({ createdAt: -1 })
      .populate("userIds", "email"); // populate user emails

    res.status(200).json({ success: true, notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res
      .status(500)
      .json({ success: false, msg: "Server error fetching notifications" });
  }
};
