import mongoose from 'mongoose'

const postSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  p_title: {
    type: String,
    required: true,
  },
  p_desc:{
    type: String,
    required: true,
  },
  p_image: {
    type: String,
    required: true,    
  },  
  username:{
    type: String,    
  },
  userimg:{
    type: String,    
  },
  p_likes:{
    type:Array,
    default:[],
  },
  comments:[
    {
      userId:String,
      profilePic:String,
      username:String,
      comment:String      
    }
  ]
  
},{timestamps:true});

export default mongoose.model('Post', postSchema);


