import Expense from "../models/Expense.js";
import Group from "../models/Group.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";

export const createExpense = async (req, res) => {
  try {
    const {
      groupId,
      userId,
      amount,
      description,
      payerName,
      splitBetween,
      date,
      category = "Other",
    } = req.body;

    const newExpenseData = {
      payerName,
      amount,
      description,
      category,
      splitBetween,
      createdAt: date || Date.now(),
    };

    if (groupId) {
      newExpenseData.groupId = groupId;
    } else if (userId) {
      newExpenseData.userId = userId;
    }

    const newExpense = new Expense(newExpenseData);
    await newExpense.save();

    const user = await User.findById(userId);
    if (user) {
      const message = `You added an expense: "${description}"`;

      await new Notification({
        message,
        userIds: [user._id],
      }).save();
    }

    if (Array.isArray(splitBetween) && splitBetween.length > 0) {
      const otherParticipants = splitBetween.filter(
        (id) => id !== userId && id !== String(userId) && id !== "You"
      );

      if (otherParticipants.length > 0) {
        const message = `You've been added to an expense: "${description}"`;

        await new Notification({
          message,
          userIds: otherParticipants,
        }).save();
      }
    }

    res.status(201).json({ msg: "Expense Saved!" });
  } catch (error) {
    console.error("Error creating expense:", error);
    res.status(500).json({ msg: "Server error creating expense." });
  }
};

export const getExpensesByGroupId = async (req, res) => {
  try {
    const { groupId } = req.params;
    const expenses = await Expense.find({ groupId });
    res.json(expenses);
  } catch (error) {
    console.error("Error fetching expenses by group ID:", error);
    res
      .status(500)
      .json({ msg: "Server error fetching expenses by group ID." });
  }
};

export const getExpensesByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const expenses = await Expense.find({ userId });
    res.json(expenses);
  } catch (error) {
    console.error("Error fetching expenses by user ID:", error);
    res.status(500).json({ msg: "Server error fetching expenses by user ID." });
  }
};

export const getFilteredExpenses = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find groups where the user is the creator
    const userGroups = await Group.find({ creatorId: userId });

    // Get the groupIds of groups the user created
    const userGroupIds = userGroups.map((group) => group._id);

    // Find expenses involving "You" and belonging to the user's created group(s)
    const expenses = await Expense.find({
      $or: [
        {
          // User's own expenses (payer or splitBetween includes "You")
          userId: userId,
          $or: [
            { payerName: "You" }, // If the user is the payer
            { splitBetween: "You" }, // If the user is part of the split
          ],
        },
        {
          // Expenses involving the user in a group that they created
          groupId: { $in: userGroupIds }, // Ensure the group belongs to the user
          splitBetween: "You", // User is part of the group split
        },
      ],
    })
      .sort({ createdAt: -1 }) // Sort by `createdAt` in descending order to get the latest
      .limit(3); // Limit the results to the 3 latest expenses

    res.json(expenses);
  } catch (error) {
    console.error("Error fetching filtered expenses:", error);
    res.status(500).json({ msg: "Server error fetching filtered expenses." });
  }
};
