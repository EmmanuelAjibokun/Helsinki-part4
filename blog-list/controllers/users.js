const router = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../model/User');
const { errorHandler } = require('../utils/middleware');

router.get('/', async (request, response) => {
    try {
        const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1, likes: 1});
        response.json(users);
    } catch (error) {
        console.log(error);
        errorHandler(error, request,response);
    }
});

router.post('/', async (request, response) => {
    try {
        const { username, name, password } = request.body;

        // check password and username length
        if (!password || password.length < 3) {
            return response.status(400).json({ message: "Password must be at least 3 characters long" });
        }

        if (!username || username.length < 3) {
            return response.status(400).json({ message: "Username must be at least 3 characters long" });
        }
    
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