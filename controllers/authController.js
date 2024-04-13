const User = require('../models/userModel');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const registerUser = async(req,res)=>{
    try{
        const errors =  validationResult(req);
        if(!errors.isEmpty()){
            return res.status(200).json({
                sucess:false,
                msg:'Error',
                errors: errors.array()
            })
        }
        const {name,email,password} = req.body;

        const isExistUser = await User.findOne({ email });
        if(isExistUser){
            return res.status(200).json({
                sucess:false,
                msg:'Email already exists!'
            }) 
        }
        const hashedPassword = await bcrypt.hash(password,10)
        const user = new User({
            name,email,password:hashedPassword
        })
        const userData = await user.save();
        return res.status(200).json({
            sucess:true,
            msg:'Registered Successfully!',
            data:userData
        })

    }
    catch(error)
    {
        return res.status(400).json({
            sucess:false,
            msg:error.message
        })
    }
}
// generate secret token
const generateAccessToken = async(user) =>{
    const token =  jwt.sign(user,process.env.ACCESS_SECRET_TOKEN,{ expiresIn:"2h" });
    return token;
}
const loginUser = async(req,res)=>{
        try{
            const errors =  validationResult(req);
            if(!errors.isEmpty()){
                return res.status(200).json({
                    sucess:false,
                    msg:'Error',
                    errors: errors.array()
                })
            }
            const {email,password} = req.body;
            const userData = await User.findOne({ email })
            if(!userData){
                return res.status(400).json({
                    sucess:false,
                    msg:'Email & Password is incorrect!'
                }) 
            }
            const isPasswordMatch = await bcrypt.compare(password,userData.password);
            if(!isPasswordMatch){
                return res.status(400).json({
                    sucess:false,
                    msg:'Email & Password is incorrect!'
                })  
            }

            const accessToken = await generateAccessToken({ user:userData })
            return res.status(200).json({
                sucess:true,
                msg:'Login Successfully!',
                accessToken :accessToken,
                tokenType : "Bearer",
                data:userData
            })

        }
        catch(error){
            return res.status(400).json({
                sucess:false,
                msg:error.message
            })
        }
}
module.exports = {
    registerUser,loginUser
}