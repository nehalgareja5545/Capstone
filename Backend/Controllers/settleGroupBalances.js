import Expense from "../models/Expense.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";

export const settleGroupBalances = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userId } = req.body;

    console.log(groupId, userId);

    // Get the current user object
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(400).json({ msg: "Invalid user ID" });
    }

    // Get all unsettled expenses in the group
    const unsettledExpenses = await Expense.find({
      groupId,
      settled: false,
    });

    if (unsettledExpenses.length === 0) {
      return res
        .status(404)
        .json({ msg: "No unsettled expenses in this group." });
    }

    for (const expense of unsettledExpenses) {
      const { amount, payerName, splitBetween, description } = expense;

      // 🔍 Resolve payer
      let payerUserId;
      if (payerName === "You") {
        payerUserId = userId;
      } else {
        payerUserId = payerName; // assume it's already a userId
      }
      console.log("ppppppppp", payerUserId);

      const payerUser = await User.findById(payerUserId);
      if (!payerUser) continue;

      // 👥 Participants = everyone except the payer
      const participants = splitBetween.filter((id) => {
        if (id === "You" && payerName === "You") {
          return id !== "You"; // exclude current user if they are "You"
        } else {
          return id !== payerUserId && id !== String(payerUserId); // exclude payer user
        }
      });

      const splitAmount = Number((amount / splitBetween.length).toFixed(2));

      for (const participantId of participants) {
        let participant;
        if (participantId === "You") {
          participant = currentUser; // use the current user object
        } else {
          participant = await User.findById(participantId);
        }
        if (!participant) continue;

        // Notification to participant: You paid $X to [payer]
        const participantMsg = `You paid $${splitAmount} to ${payerUser.email} for "${description}"`;
        await new Notification({
          message: participantMsg,
          userIds: [participant._id],
        }).save();

        // Notification to payer: [participant] paid you $X
        const payerMsg = `${participant.email} paid you $${splitAmount} for "${description}"`;
        await new Notification({
          message: payerMsg,
          userIds: [payerUser._id],
        }).save();
      }

      expense.settled = true;
      await expense.save();
    }

    res.status(200).json({ msg: "Balances settled and notifications sent." });
  } catch (error) {
    console.error("Error settling balances:", error);
    res.status(500).json({ msg: "Server error settling balances." });
  }
};
