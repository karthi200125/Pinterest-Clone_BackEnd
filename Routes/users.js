import express from 'express'
import { DeletUser, followedUser, getUser, savepost, unfollowedUser, unsavepost, updateUser } from '../Controller/user.js';

const route = express.Router()

route.put("/:id",updateUser)
route.delete("/:id",DeletUser)
route.get("/:id",getUser)
route.put("/:id/follow",followedUser)
route.put("/:id/unfollow",unfollowedUser)
route.post("/savepost",savepost)
route.post("/unsavepost",unsavepost)
    
export default route;