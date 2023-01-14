const router = require('express').Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// register validation
const Joi = require('@hapi/joi');
const schema = Joi.object({
    name : Joi.string().min(6).required(),
    email : Joi.string().min(6).required().email(),
    password : Joi.string().min(6).required()
});

//register
router.post('/register', async (req, res) => {
    //validate data before inserted
    const {error} = schema.validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    //check if the user already exists
    const emailExists = await User.findOne({email : req.body.email});
    if(emailExists) return res.status(400).send('E-Mail already exists.')
    

    //hash the password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    

    //create new user
    const user = new User({
        name : req.body.name,
        email : req.body.email,
        password : hashPassword
    });
    try{
        const savedUser = await user.save();
        res.send({user: user._id }); 

    }
    catch(err){
        res.status(400).send(err);
        console.log(err);
    }
   

});


//login

router.post('/login',  async (req,res) => {

const schema = Joi.object({

        email : Joi.string().min(6).required().email(),
        password : Joi.string().min(6).required()
});

const {error} = schema.validate(req.body);
if(error) return res.status(400).send(error.details[0].message);
    const user = await User.findOne({email : req.body.email});
    if(!user) return res.status(400).send('E-Mail does not exist.')
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send("Invalid password!");

    //create and assign a token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);




});


module.exports = router;

