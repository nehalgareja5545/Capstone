import Expense from "../models/Expense.js";
import Payment from "../models/Payment.js";
import Group from "../models/Group.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";

export const createGroup = async (req, res) => {
  try {
    const creatorId = req.body.userId;
    const { name, participants } = req.body;

    const newGroup = new Group({ name, creatorId, participants });
    const savedGroup = await newGroup.save();

    const user = await User.findById(creatorId);
    if (user) {
      const creatorMessage = `You created a new group: "${name}"`;
      await new Notification({
        message: creatorMessage,
        userIds: [user._id],
      }).save();
    }

    const otherParticipants = participants.filter(
      (id) => id !== creatorId && id !== String(creatorId)
    );

    if (otherParticipants.length > 0) {
      const participantMessage = `You've been added to a group: "${name}"`;

      await new Notification({
        message: participantMessage,
        userIds: otherParticipants,
      }).save();
    }

    res.status(201).json(savedGroup);
  } catch (error) {
    console.error("Error creating group:", error);
    res.status(500).json({ msg: "Server error creating group." });
  }
};

export const getGroupById = async (req, res) => {
  try {
    const { groupId } = req.params;
    const group = await Group.findById(groupId);
    res.json(group);
  } catch (error) {
    res.status(500).json({ msg: "Server error fetching groups." });
  }
};

export const getUserGroups = async (req, res) => {
  try {
    const { userId } = req.params;
    const groups = await Group.find({ creatorId: userId });
    res.json(groups);
  } catch (error) {
    res.status(500).json({ msg: "Server error fetching groups." });
  }
};

export const addMembersToGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { newMembers } = req.body;
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ msg: "Group not found." });
    group.participants = [...new Set([...group.participants, ...newMembers])];
    const updatedGroup = await group.save();
    res.status(200).json(updatedGroup);
  } catch (error) {
    res.status(500).json({ msg: "Server error adding members to group." });
  }
};

export const settleGroupBalance = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userId } = req.body;
    console.log("Settle balance called for group:", groupId, "user:", userId);
    const relevantExpenses = await Expense.find({
      groupId,
      settled: false,
      $or: [
        { payerName: userId },
        { splitBetween: userId },
        { payerName: "You" },
        { splitBetween: "You" },
      ],
    });
    console.log("Relevant expenses before fix:", relevantExpenses);
    relevantExpenses.forEach((expense) => {
      if (expense.payerName === "You") expense.payerName = userId;
      expense.splitBetween = expense.splitBetween.map((id) =>
        id === "You" ? userId : id
      );
    });
    console.log("Relevant expenses after fix:", relevantExpenses);
    if (!relevantExpenses || relevantExpenses.length === 0) {
      console.log("No relevant expenses found.");
      return res.status(404).json({
        msg: "No unsettled expenses found for this user in this group.",
      });
    }
    let netBalance = 0;
    relevantExpenses.forEach((expense) => {
      const share = expense.amount / expense.splitBetween.length;
      if (expense.payerName === userId) {
        netBalance += expense.amount;
        console.log(`Adding expense ${expense._id} amount: ${expense.amount}`);
      }
      if (expense.splitBetween.includes(userId)) {
        netBalance -= share;
        console.log(`Subtracting share ${share} for expense ${expense._id}`);
      }
    });
    console.log("Calculated net balance:", netBalance);
    if (netBalance === 0)
      return res.json({
        msg: "No outstanding balance to settle.",
        netBalance: 0,
      });
    let counterpartyCandidates = [];
    relevantExpenses.forEach((expense) => {
      expense.splitBetween.forEach((id) => {
        if (id !== userId && !counterpartyCandidates.includes(id)) {
          counterpartyCandidates.push(id);
        }
      });
    });
    console.log("Counterparty candidates:", counterpartyCandidates);
    const otherUser = counterpartyCandidates[0];
    console.log("Other user determined as:", otherUser);
    if (!otherUser)
      return res.status(400).json({ msg: "Counterparty not found." });
    let settlementPayment;
    if (netBalance > 0) {
      settlementPayment = new Payment({
        groupId: groupId,
        fromUserId: otherUser,
        toUserId: userId,
        amount: Math.abs(netBalance),
        method: "settlement",
      });
      console.log("Creating payment: Other user pays current user");
    } else {
      settlementPayment = new Payment({
        groupId: groupId,
        fromUserId: userId,
        toUserId: otherUser,
        amount: Math.abs(netBalance),
        method: "settlement",
      });
      console.log("Creating payment: Current user pays other user");
    }
    await settlementPayment.save();
    console.log("Settlement payment saved:", settlementPayment);
    const updateResult = await Expense.updateMany(
      { _id: { $in: relevantExpenses.map((e) => e._id) } },
      { $set: { settled: true } }
    );
    console.log("Expense update result:", updateResult);
    res.json({
      msg: "Balance settled successfully.",
      netBalance: netBalance,
      payment: settlementPayment,
    });
  } catch (error) {
    console.error("Error in settleGroupBalance:", error);
    res.status(500).json({ msg: "Server error settling balance." });
  }
};
