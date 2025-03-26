import Payment from "../Models/Payment.js";

export const createPayment = async (req, res) => {
  try {
    const { fromUserId, toUserId, amount, method } = req.body;
    const newPayment = new Payment({
      fromUserId,
      toUserId,
      amount,
      method,
    });
    const savedPayment = await newPayment.save();
    res.status(201).json(savedPayment);
  } catch (error) {
    console.error("Error creating payment:", error);
    res.status(500).json({ msg: "Server error creating payment." });
  }
};
