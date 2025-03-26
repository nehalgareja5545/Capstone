import mongoose from "mongoose";
const Schema = mongoose.Schema;

const PaymentSchema = new Schema({
  fromUserId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  toUserId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  method: {
    type: String,
    default: "cash",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Group = mongoose.model("Payment", PaymentSchema);
export default Group;
