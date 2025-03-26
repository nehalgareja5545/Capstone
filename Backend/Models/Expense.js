import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ExpenseSchema = new Schema({
  groupId: {
    type: Schema.Types.ObjectId,
    ref: "Group",
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  payerName: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
  category: {
    type: String,
    default: "Other",
  },
  splitBetween: [
    {
      type: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Expense = mongoose.model("Expense", ExpenseSchema);
export default Expense;
