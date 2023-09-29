import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    min: 3,
    max: 20,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    min: 6,
  },
  profilePic: {
    type: String,
    default: "",
  },
  followers: {
    type: Array,
    default: [],
  },
  followed: {
    type: Array,
    default: [],
  },
  savedposts: [
    {
      postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
      postImage: String,
    },
  ],
  comments: {
    type: Array,
    default: [],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  relationship: {
    type: Number,
    enum: [1, 2, 3],
  }
}, { timestamps: true });

export default mongoose.model("User", userSchema);