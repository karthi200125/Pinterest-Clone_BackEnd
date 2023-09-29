import User from "../Model/User.js";
import bcrypt from 'bcryptjs'

// UPDATE USER
export const updateUser = async (req, res) => {
  try {
    const { password, isAdmin, userId } = req.body;

    if (userId === req.params.id || isAdmin) {
      if (password) {
        const salt = await bcrypt.genSalt(10);
        const newpassword = await bcrypt.hash(password, salt);
        req.body.password = newpassword;
      }

      const user = await User.findByIdAndUpdate(req.params.id, { $set: req.body });
      if (!user) return res.status(404).json("User not found");

      return res.status(200).json("Account has been updated");
    } else {
      return res.status(403).json("You can update only your account");
    }
  } catch (err) {
    return res.status(500).json("User update failed");
  }
};


// DELETE USER
export const DeletUser = async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      return res.status(200).json("Account has been Deleted");
    } catch (error) {
      console.log(error)
    }
  } else {
    return res.status(403).json("You can delete only your account");
  }
}


// GET USER
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, updatedAt, ...others } = user._doc;
    res.status(200).json(others)
  } catch (error) {
    res.status(500).json("cant get that User", err)
  }
}
// Helper function to follow or unfollow a user
const toggleFollow = async (userId, id, follow) => {
  try {
    const user = await User.findById(id);
    const currentUser = await User.findById(userId);

    if (follow && !user.followers.includes(userId)) {
      await user.updateOne({ $push: { followers: userId } });
      await currentUser.updateOne({ $push: { followed: id } });
      return { success: true, message: "User has been followed" };
    } else if (!follow && user.followers.includes(userId)) {
      await user.updateOne({ $pull: { followers: userId } });
      await currentUser.updateOne({ $pull: { followed: id } });
      return { success: true, message: "User has been unfollowed" };
    } else {
      return { success: false, message: follow ? "You already follow this user" : "You already unfollow this user" };
    }
  } catch (error) {
    return { success: false, message: "An error occurred while processing the request" };
  }
};

// FOLLOWED USERS
export const followedUser = async (req, res) => {
  const { userId } = req.body;
  const { id } = req.params;

  if (userId !== req.params.id) {
    const result = await toggleFollow(userId, id, true);
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(401).json(result);
    }
  } else {
    res.status(403).json({ success: false, message: "You can't follow yourself" });
  }
};

// UNFOLLOWED USERS
export const unfollowedUser = async (req, res) => {
  const { userId } = req.body;
  const { id } = req.params;

  if (userId !== req.params.id) {
    const result = await toggleFollow(userId, id, false);
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(401).json(result);
    }
  } else {
    res.status(403).json({ success: false, message: "You can't unfollow yourself" });
  }
};



// SAVE POST
export const savepost = async (req, res) => {
  const { userId, postId, postImage } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json("User not found");
    }

    // Check if the post is already saved
    const isAlreadySaved = user.savedposts.some((savedPost) => savedPost.postId.equals(postId));

    if (isAlreadySaved) {
      return res.status(400).json("Post is already saved by the user");
    }

    // Add the postId and postImage to the savedposts array
    user.savedposts.push({ postId, postImage });

    const updatedUser = await user.save();

    return res.status(200).json({ message: `Post saved in user ${userId}`, user: updatedUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json("Post save failed");
  }
};

// UNSAVE POST
export const unsavepost = async (req, res) => {
  const { userId, postId } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json("User not found");
    }

    // Find the index of the post to unsave
    const postIndex = user.savedposts.findIndex((savedPost) => savedPost.postId.equals(postId));

    if (postIndex === -1) {
      return res.status(400).json("Post is not saved by the user");
    }

    // Remove the post from the savedposts array
    user.savedposts.splice(postIndex, 1);

    const updatedUser = await user.save();

    return res.status(200).json({ message: `Post unsaved in user ${userId}`, user: updatedUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json("Post unsave failed");
  }
};
