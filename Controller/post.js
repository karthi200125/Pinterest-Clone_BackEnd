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

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Check if the user deleting the post is the owner of the post
        if (post.userId !== req.body.userId) {
            return res.status(403).json("You can delete only your post");
        }

        // Delete the post
        await post.deleteOne();

        // Also, find and delete all posts that belong to the user
        await Post.deleteMany({ userId: req.body.userId });

        res.status(200).json({ message: "Post and user's posts have been deleted" });
    } catch (error) {
        res.status(500).json({ message: "Post delete failed", error });
    }
}

// LIKE , DISLIKE POST
export const likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post.p_likes.includes(req.body.userId)) {
            await post.updateOne({ $push: { p_likes: req.body.userId } })
            res.status(200).json("image has been liked");
        }
        else {
            await post.updateOne({ $pull: { p_likes: req.body.userId } })
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

// GET ALL POSTS 
export const allPosts = async (req, res) => {
    try {        
        const posts = await Post.find();
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json(error);
    }
}

// GET single user ALL POSTS
export const singleUserPosts = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json("User not found");
        }
        const posts = await Post.find({ userId: { $ne: user._id } });

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json(error);
    }
};

// CREATE POST COMMENT
export const CreateComment = async (req, res) => {
    const { userId, profilePic, comment, postId , username} = req.body;

    try {
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json("Post not found");
        }

        const newComment = {
            userId,
            profilePic,
            username,
            comment
        };

        post.comments.push(newComment);

        await post.save();

        res.status(201).json(`Comment created for post ${post._id}`);
    } catch (err) {
        console.error("Error creating comment:", err);
        res.status(500).json("Comment creation failed");
    }
}

// GET SAVED POSTS
export const getSavedPosts = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const savedPostIds = user.savedposts.map(savedPost => savedPost.postId);        
        if (savedPostIds.length > 0) {
            const savedPosts = await Post.find({ _id: { $in: savedPostIds } });
            return res.status(200).json(savedPosts);
        } else {            
            return res.status(200).json({ message: "No saved posts found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error fetching saved posts" });
    }
};


