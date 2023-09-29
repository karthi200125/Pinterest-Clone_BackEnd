import express from 'express'
import {  allPosts, createPost, deletePost, likePost, singlePost, singleUserPosts, updatePost } from '../Controller/post.js';

const route = express.Router();

route.get('/allposts', allPosts);
route.get("/:userId",singleUserPosts)
route.post("/",createPost)
route.put("/:id",updatePost)
route.delete("/:id",deletePost)
route.put("/:id/like",likePost)
route.get("/:id",singlePost)



export default route;