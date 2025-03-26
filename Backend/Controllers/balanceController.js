import Balance from "../Models/Balance.js";

export const getBalance = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user.id;
    const balance = await Balance.findOne({ groupId, userId });
    res.json(balance);
  } catch (error) {
    console.error("Error fetching balance:", error);
    res.status(500).json({ msg: "Server error fetching balance." });
  }
};
