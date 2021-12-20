const Users = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const userCtrl = {
    register: async (req,res)=>{
        try {
            const {name, email, password} = req.body
            const user = await Users.findOne({email})
            if(user) return res.status(400).json({msg: 'The email already exists'})
            if(password.length < 6) return res.status(400).json({msg: 'Password is at least 6 characters long'})
            
            const passwordHash = await bcrypt.hash(password, 10) //hashpassword
            const newUser = new Users({name, email, password:passwordHash})
            await newUser.save()//save mongoose
            const accessToken = createAccessToken({id: newUser._id})//create accessToken
            const refreshToken = createRefreshToken({id: newUser._id})//create refreshToken
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                path: '/user/refresh_token'
            })
            res.json({msg: 'Register Success!', newUser, accessToken})
            
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    },
    
    login: async (req,res)=>{
        try {
            const {email, password} = req.body
            const user = await Users.findOne({email})
            if(!user) return res.status(400).json({msg: 'User do not exist'})
            const isMatch = await bcrypt.compare(password, user.password)
            if(!isMatch) return res.status(400).json({msg: 'Incorrect password'})

            //if login success, create access token and refresh token
            const accessToken = createAccessToken({id: user._id})//create accessToken
            const refreshToken = createRefreshToken({id: user._id})//create refreshToken
            res.cookie('refreshToken', refreshToken, {
                httpOnly: false,
                path: '/user/refresh_token'
            })
            res.json({msg: 'Login Success!', user, accessToken})

           
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    },
    refreshToken: (req,res)=>{
        try {
            const rf_token = req.cookies.refreshToken
            console.log(rf_token)
            if(!rf_token) return res.status(400).json({msg: 'Please Login or Register'})
            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err,user)=>{
                if(err) return res.status(400).json({msg: 'Please Login or Register 2'})
                const accessToken = createAccessToken({id: user.id})
                res.json({user, accessToken})
            })

        } catch (error) {
            return res.status(500).json({msg: error.message})
            
        }
    },
    logout: async (req,res) => {
        try {
            res.clearCookie('refreshToken', {path: '/user/refresh_token'})
            return res.json({msg: 'Logout Success!',})
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    },
    getUser: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id).select('-password')
            if(!user) return res.status(400).json({msg: 'User does not exist'})
            res.json(user)
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    },
    addCart: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id)
            if(!user) return res.status(400).json({msg: 'User does not exist'})

            await Users.findOneAndUpdate({_id: req.user.id}, {cart: req.body.cart})
            return res.json({msg: "Added to cart"})
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    }
}

const createAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1d'})
}
const createRefreshToken = (user) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'})
}
module.exports =  userCtrl