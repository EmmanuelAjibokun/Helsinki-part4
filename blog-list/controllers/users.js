const router = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../model/User');
const { errorHandler } = require('../utils/middleware');

router.get('/', async (request, response) => {
    try {
        const users = await User.find({});
        response.json(users);
    } catch (error) {
        console.log(error);
        errorHandler(error, request,response);
    }
});

router.post('/', async (request, response) => {
    try {
        const { username, name, password } = request.body;
    
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);
    
        const newUser = new User({
            username,
            name,
            passwordHash
        })
    
        const savedData = await newUser.save()
        response.status(201).json(savedData)
    } catch (error) {
        console.log(error);
        errorHandler(error, request,response);
    }
})

module.exports = router;