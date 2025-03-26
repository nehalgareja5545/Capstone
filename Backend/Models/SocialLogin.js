import mongoose from "mongoose";

const socialUserSchema = new mongoose.Schema({
  email: {
    type: String,
    lowercase: true,
    trim: true,
    match: [/.+\@.+\..+/, "Please enter a valid email address"],
    sparse: true,
  },
  username: {
    type: String,
    required: [true, "Username is required"],
    trim: true,
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  facebookId: {
    type: String,
    unique: true,
    sparse: true,
  },
  profilePicture: {
    type: String,
    trim: true,
  },
  token: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const SocialUser = mongoose.model("SocialUser", socialUserSchema);
export default SocialUser;
