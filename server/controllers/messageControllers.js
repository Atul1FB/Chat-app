import Message from "../models/message.js";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../lib/cloudinary.js";
import{io,userSocketMap} from  '../server.js';



// get all user except the logged in user
export const getUserForSidebar = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    const filteredUser = await User
      .find({ _id: { $ne: userId } })
      .select("-password");

    const unseenMessages = {};

    const promises = filteredUser.map(async (user) => {
        
      const count = await Message.countDocuments({
        senderId: user._id,
        receiverId: userId,
        seen: false,
      });

      if (count > 0) {
        unseenMessages[user._id] = count;
      }
    });

    await Promise.all(promises);

    res.json({
      success: true,
      users: filteredUser,
      unseenMessages,
    });

  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
});

 // get all message  for selected user 

export const  getMessages = asyncHandler(async(req,res) => {
    try {
        const {id: selectedUserId} = req.params;
        const   myId = req.user._id;
        
        const messages = await Message.find({
            $or:[
              { senderId:myId, receiverId: selectedUserId },
              {  senderId:selectedUserId, receiverId:myId}   
            ]
        })

        await Message.updateMany(
          {senderId: selectedUserId, receiverId:myId}, 
         { $addToset:  {seenBy:myId }})

            res.json({success:true, messages})
        
    } catch (error) {
        console.log(error.message)
        res.json({success:false, message:error.message})
    }
}) 
// api to mark message as seen using message id

export const markMessageAsSeen =  asyncHandler(async(req,res) => {
    try {
        const {id} = req.params;
        await Message.findByIdAndUpdate(id,{seenBy:true})
        res.json({success:true})

    } catch (error) {
        console.log(error.message)
        res.json({success:false, message:error.message})
    }
})

 // Send message to selected user 

export const sendMessage = asyncHandler(async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadResponse = await uploadOnCloudinary(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image: imageUrl
    });

    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", {
        _id: newMessage._id,
        text: newMessage.text,
        image: newMessage.image,
        senderId: newMessage.senderId,
        receiverId: newMessage.receiverId,
        createdAt: newMessage.createdAt
      });
    }

    res.status(200).json({ success: true, newMessage });

  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});
