const user = require('../model/User');
const bcrypt = require('bcrypt');

const handleNewUser = async (req,res)=>{
    const {firstname,lastname,email,password} = req.body;
    if (!firstname || !lastname || !email || !password) {
        return res.status(400).json({'error':'All fields are required'});
    }
    const duplicate = await user.findOne({email:email});
    if (duplicate) return res.sendStatus(409);
    try{
        const hashPwd = await bcrypt.hash(password,10);
        const result = await user.create({
            "firstname": firstname,
            "lastname": lastname,
            "email": email,
            "password": hashPwd
        });

        res.status(201).json({"message":`New User ${firstname} is created`});
    } catch (err){
        console.error(err);
        if (err.code===11000) {
            return res.status(409).json({'error':'Email exists already'})
        } else {
            return res.status(500).json({'error': 'Internal server error'})
        }
        
    }
}

module.exports = {handleNewUser}