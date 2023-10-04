import User from "../Model/User.js";
import bcrypt from 'bcryptjs'

// UPDATE USER
export const updateUser = async (req, res) => {
  try {
    const { userId } = req.body;
    const updateFields = { ...req.body };
    
    if (userId === req.params.id || isAdmin) {
      if (updateFields.password) {
        const salt = await bcrypt.genSalt(10);
        const newpassword = await bcrypt.hash(updateFields.password, salt);
        updateFields.password = newpassword;
      }

      const user = await User.findByIdAndUpdate(req.params.id, { $set: updateFields });
      if (!user) return res.status(404).json("User not found");

      return res.status(200).json("Account has been updated");
    } else {
      return res.status(403).json("You can update only your account");
    }
  } catch (err) {
    res.status(500).json({ error: "User update failed", message: err.message });
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

// GET SINGLE USER
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, updatedAt, ...others } = user._doc;
    res.status(200).json(others)
  } catch (error) {
    res.status(500).json("cant get that User", error)
  }
}

// FOLLOW , UNFOLLOW 
export const followedUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const currentUser = await User.findById(req.body.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.followers.includes(req.body.userId)) {      
      await user.updateOne({ $push: { followers: req.body.userId } }) && await currentUser.updateOne({ $push: { followed: req.params.id } });
      res.status(200).json('Followed that user');
      
    } else {      
      await user.updateOne({ $pull: { followers: req.body.userId } }) && await currentUser.updateOne({ $pull: { followed: req.params.id } });;
      res.status(201).json('Unfollowed that user');
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
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
    const isAlreadySaved = user.savedposts.some((savedPost) => savedPost.postId.equals(postId));
    if (isAlreadySaved) {
      return res.status(400).json("Post is already saved by the user");
    }  
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
    const postIndex = user.savedposts.findIndex((savedPost) => savedPost.postId.equals(postId));
    if (postIndex === -1) {
      return res.status(400).json("Post is not saved by the user");
    }    
    user.savedposts.splice(postIndex, 1);
    const updatedUser = await user.save();
    return res.status(200).json({ message: `Post unsaved in user ${userId}`, user: updatedUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json("Post unsave failed");
  }
};
