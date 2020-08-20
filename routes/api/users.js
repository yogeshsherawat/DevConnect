const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');// using this to validate email, passwrd and name for current app
const gravatar = require('gravatar');// we use this dependency to attain avatar of email
const bcrypt = require('bcryptjs'); // we use this to encrypt password
const User  = require('../../models/User');
const jwt = require('jsonwebtoken');
const config = require('config');

//@route     Post api/users
//@desc      Register User 
//@acess     Public
router.post('/',[
    check('name','Name is Required').not().isEmpty(), // This is the way of validating name through express validator
    check('email','Please Enter a valid Email Address').isEmail(),
    check('password','Enter a Password with 6 or more characters').isLength({min:6})  
],
async (req,res)=>{
    console.log("Register Route Called");
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()}); // errors are sent as array
    }
    const {name,email,password} = req.body;
    try{
        let user = await User.findOne({email});
        if(user){
            return res.status(400).json({errors:{msg:"User Already Exists"}}); // we are trying to pass the same error arrays a we pass above
            // Always have to include return for this kind of code if it isn't the last one of its own type
                }
        const avatar = gravatar.url(email,{
            s:'200',
            r:'pg',
            d:'mm'
        });
        user = new User({
            name,
            email,
            avatar,
            password
        });
        //  hashing tha password with bcrypt
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password,salt);
        await user.save();
        // generating jwt and sending it to front end
        const payload = {
            user:{
                id:user.id
            }
        };
        jwt.sign(
            payload,// data we want to send through token
            config.get('jwtSecret'),// secret token code
            {expiresIn:360000},//expiration of token---make sure to set it right before deployment
            (err,token)=>{
                if(err)throw err;
                res.json({token});
            }
         )
    

    }
    catch(err){
        console.log(err.message);
        res.status(400).send('Sever Error');
    }

    
});

module.exports = router;