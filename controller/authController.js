const User = require('../model/User');
const bcrypt = require('bcrypt');

const jwt =require('jsonwebtoken');

const handleLogin = async (req,res)=>{
    const {email,password} = req.body;
    if (!email || !password) return res.status(400).json({'error': 'Email and password are required'})
    const foundUser = await User.findOne({email:email});
    if (!foundUser) return res.sendStatus(401);

    const match = await bcrypt.compare(password, foundUser.password);
    if(match){
        const accessToken = jwt.sign(
            { 'email':foundUser.email},
            process.env.ACCESS_TOKEN,
            {expiresIn: '300s'}
        );
        const refreshToken = jwt.sign(
            {'email': foundUser.email},
            process.env.REFRESH_TOKEN,
            {expiresIn: '1d'}
        )
        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();
        console.log(result);
        res.cookie('jwt', refreshToken, {httpOnly: true, maxAge: 24*60*60*1000})

        res.json({accessToken});
    } else {
        res.sendStatus(401);
    }
}

module.exports = {handleLogin}