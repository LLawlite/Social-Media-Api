
const router=require("express").Router();
const bcrypt=require("bcrypt");
const User = require("../modules/User");

//update user

router.put("/:id",async(req,res)=>{
    if(req.body.userId===req.params.id|| req.user.isAdmin)
    {
        if(req.body.password)
        {
            try{
                const salt=await bcrypt.genSalt(10);
                req.body.password=await bcrypt.hash(req.body.password,salt);
            }
            catch(err)
            {
                return res.status(500).json(err);

            }

        }    
            try{
                const user =await User.findByIdAndUpdate(req.params.id,{
                    $set:req.body,
                });
                res.status(200).json("Account Updated successfully")
            }
            catch(err)
            {
                return res.status(500).json(err);
            }
        
    }else{
        res.status(500).json("You can update only your account");
    }
});

//delete user
router.delete("/:id",async(req,res)=>{
    if(req.body.userId===req.params.id|| req.body.isAdmin)
    {
         
            try{
                const user =await User.findByIdAndDelete(req.params.id);
                res.status(200).json("Account Deleted successfully")
            }
            catch(err)
            {
                return res.status(500).json(err);
            }
        
    }
    else{
        res.status(500).json("You can delete only your account");
    }
});

//get a user

router.get("/:id",async(req,res)=>{
    try{
        const user=await User.findById(req.params.id);
        const {password,createdAt,updatedA,...other}=user._doc;
        res.status(200).json(other);

    }
    catch(err)
    {
        res.status(500).json(err);
       

    }
})

//follow user
router.put("/:id/follow",async (req,res)=>{
    if(req.body.userId!==req.params.id)
    {
        try{
            const user=await User.findById(req.params.id);
            const currUser=await User.findById(req.body.userId);
            if(!user.followers.includes(req.body.userId))
            {
                await user.updateOne({$push:{followers:req.body.userId}});
                await currUser.updateOne({$push:{following
                    :req.params.id}});
                res.status(200).json("User has been followed");
            }
            else
            {
                res.status(403).json("You already follow this user");
            }

        }
        catch{
            res.status(500).json(err);
        }
    }
    else
    {
        res.status(500).json("You cannot follow youself");
    }
});

//Unfollow

router.put("/:id/unfollow",async (req,res)=>{
    if(req.body.userId!==req.params.id)
    {
        try{
            const user=await User.findById(req.params.id);
            const currUser=await User.findById(req.body.userId);
            if(user.followers.includes(req.body.userId))
            {
                await user.updateOne({$pull:{followers:req.body.userId}});
                await currUser.updateOne({$pull:{following
                    :req.params.id}});
                res.status(200).json("User has been unfollowed");
            }
            else
            {
                res.status(403).json("You do not follow this user");
            }

        }
        catch{
            res.status(500).json(err);
        }
    }
    else
    {
        res.status(500).json("You cannot unfollow youself");
    }
});



module.exports=router;