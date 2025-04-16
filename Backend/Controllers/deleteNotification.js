import Notification from "../models/Notification.js";

export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Notification.findByIdAndDelete(id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, msg: "Notification not found" });
    }

    res.status(200).json({ success: true, msg: "Notification deleted" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res
      .status(500)
      .json({ success: false, msg: "Server error deleting notification" });
  }
};
