const express = require("express");
const path = require('path');
const router = express.Router();
const sendMail = require('./mail');
const config = require('config')
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const auth=require("../../middleware/auth");
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function(req,file,cb) {
    cb(null,path.join(__dirname,'../../uploads'));
  },
  filename : function(req,file,cb) {
    cb(null, file.originalname);
  }
});

const fileFilter = (req,file,cb)=>{
  if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png')
  {
    cb(null,true)
  }
  else{
    cb(null,false)
  }
}

const upload = multer({storage:storage,
   fileFilter:fileFilter
});
const User = require("../../models/User");

router.get("/",auth, async (req, res) => {
  try{
    const user= await User.findById(req.user.id).select('-password');
    res.json(user);
  }catch(err){
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});


router.post(
  "/",upload.single('image'),
  async (req, res) => {
    console.log(req.file);
    const { name, email, password } = req.body;
    const {path} = req.file
    try {
      // See if the user exists
      
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ errors: [{ msg: "User already exists" }] });
      }
      sendMail(req.body.email);
      user = new User({
        name,
        email,
        password,
        path
      });

      await user.save()
      // Return jsonwebtoken

      const payload= {
        user: {
          id : user.id
        }
      }

      jwt.sign(payload, config.get('jwtSecret'),{expiresIn: 36000}, (err,token)=>{
        if(err){
          console.log(err)
        }else{
          res.json({token})
        }
      })
      //res.send("User Registered");
    } catch (err) {
      console.log(err);
      res.status(500).send("Server error");
    }
  }
);
module.exports = router;
