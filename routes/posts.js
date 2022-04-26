
const Post = require("../modules/Post");
const User = require("../modules/User");


const router=require("express").Router();

//Create a post
router.post("/",async(req,res)=>{
 const newPost= new Post(req.body);
 try{
    const savePost=await newPost.save();
    res.status(200).json(newPost);
 }
 catch(err)
 {
     res.status(500).json(err);
 }
})
//Update a post

router.put("/:id",async(req,res)=>{
    try {
        const post =await Post.findById(req.params.id);
        if(post.userId===req.body.userId)
        {
            await post.updateOne({$set:req.body});
            res.status(200).json("Post is updated");
        }
        else
        {
            res.status(403).json("You can update only your postsz");
        }
    } catch (error) {
        res.status(500).json(error);
    }
   
});
//Delete a post 

router.delete("/:id",async(req,res)=>{
    try{
        const post =await Post.findById(req.params.id);
        if(post.userId===req.body.userId)
        {
            await post.deleteOne();
            res.status(200).json("Post is Deleted");
        }
        else
        {
            res.status(403).json("You can Delete only your postsz");
        }
    }
    catch(err)
    {
        res.status(500).json(err);
    }
});
//Like a post
router.put("/:id/like",async(req,res)=>{
    try {
        const post =await Post.findById(req.params.id);
        if(!post.likes.includes(req.body.userId))
        {
            await post.updateOne({$push:{likes:req.body.userId}});
            res.status(200).json("Post is liked")
        }
        else
        {
            await post.updateOne({$pull:{likes:req.body.userId}});
            res.status(200).json("Disliked");
        }
    } catch (err) {
        res.status(500).json(err);
    }
   

})
//get a post
router.get("/:id",async(req,res)=>{
    try{
        const post=await Post.findById(req.params.id);
        const {createdAt,updatedA,...other}=post._doc;
        res.status(200).json(other);

    }catch(err)
    {
        res.status(500).json(err);
    }
});
//get timeline posts

router.get("/timeline/all", async (req, res) => {
    try {
      const currentUser = await User.findById(req.body.userId);
      const userPosts = await Post.find({ userId: currentUser._id });
    
     
      const friendPosts = await Promise.all(
        currentUser.following.map((friendId) => {
          return Post.find({ userId: friendId });
        })
      );
      res.json(userPosts.concat(...friendPosts))
    res.status(200).json();
    } catch (err) {
      res.status(500).json(err);
    }
  });



module.exports=router;