import express from 'express'
import {  CreateComment, allPosts, createPost, deletePost, likePost, singlePost, singleUserPosts, updatePost } from '../Controller/post.js';

const route = express.Router();

route.get('/allposts', allPosts);
route.get("/:userId",singleUserPosts)
route.post("/",createPost)
route.put("/:id",updatePost)
route.delete("/:id",deletePost)
route.put("/:id/like",likePost)
route.get("/singlepost/:id",singlePost)
route.post("/comment",CreateComment)




export default route;