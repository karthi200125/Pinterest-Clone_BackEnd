import Post from "../Model/Post.js"
import User from "../Model/User.js"

// CREATE POST
export const createPost = async (req, res) => {
    const { p_title, p_desc, p_image, p_likes } = req.body;

    try {
        const user = await User.findById(req.body.userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const newPost = new Post({
            userId: user._id,
            p_title: p_title,
            p_desc: p_desc,
            p_image: p_image,
            username: user.username,
            userimg: user.profilePic,
            p_likes: p_likes,
        });

        const savedPost = await newPost.save();

        res.status(200).json(savedPost);
    } catch (error) {
        res.status(500).json(error);
    }
}

// UPDATE POST
export const updatePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.updateOne({ $set: req.body })
            res.status(200).json("post has been updated")
        }
        else {
            res.status(403).json("you can update only your post")
        }
    } catch (error) {
        res.status(500).json("post update failed", error)
    }
}
// DELETE POST
export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.deleteOne()
            res.status(200).json("post has been deleted");
        } else {
            res.status(403).json("you can delete only your post");
        }
    } catch (error) {
        res.status(500).json({ message: "post delete failed", error });
    }
}


// LIKE POST
export const likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(!post.p_likes.includes(req.body.userId)){
            await post.updateOne({$push:{p_likes:req.body.userId}})
            res.status(200).json("image has been liked");        
        }
        else{
            await post.updateOne({$pull:{p_likes:req.body.userId}})
            res.status(200).json("image has been disliked");        
        }    
    } catch (err) {
        res.status(500).json(err)
    }
    
};

// GET SINGLE POST
export const singlePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post)
    } catch (error) {
        res.status(500).json(error)
    }
}
// GET ALL POSTS 6516a09b08a3a258a4e88ca7
export const allPosts = async (req, res) => {
    try {
        const userId = "6516a09b08a3a258a4e88ca7"; 
        const posts = await Post.find({ userId: { $ne: userId } });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json(error);
    }
}

// GET single user ALL POSTS
export const singleUserPosts = async (req, res) => {
    const { userId } = req.params; // Current user's ID
  
    try {
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json("User not found");
      }
  
      // Find all posts that do not belong to the current user
      const posts = await Post.find({ userId: { $ne: user._id } });
  
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json(error);
    }
  };
  