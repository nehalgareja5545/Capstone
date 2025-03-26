import Budget from "../models/Budget.js";

export const createBudget = async (req, res) => {
  try {
    const { userId, category, amount } = req.body;
    const newBudget = new Budget({ userId, category, amount });
    await newBudget.save();
    res.status(201).json({ msg: "Budget Created!", budget: newBudget });
  } catch (error) {
    console.error("Error creating budget:", error);
    res.status(500).json({ msg: "Server error creating budget." });
  }
};

export const getBudgetsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId || !userId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ msg: "Invalid or missing user ID." });
    }

    const budgets = await Budget.find({ userId: userId });

    if (!budgets || budgets.length === 0) {
      return res.status(404).json({ msg: "No budgets found for this user." });
    }

    res.json(budgets);
  } catch (error) {
    console.error("Error fetching budgets:", error);
    res.status(500).json({ msg: "Server error fetching budgets." });
  }
};
