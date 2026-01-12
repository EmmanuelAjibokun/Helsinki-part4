const express = require('express');
const jwt = require('jsonwebtoken');
const blogsRouter = express.Router();
const Blog = require('../model/Blog');
const { errorHandler } = require('../utils/middleware');
const User = require('../model/User');

const getTokenFrom = request => {
  const authorization = request.get('authorization');
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '');
  }
  return null;
}

blogsRouter.get('/', (request, response) => {
  Blog.find({}).populate('user', {username: 1, name: 1}).then((blogs) => {
    response.json(blogs)
  })
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body;

  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'invalid token' })
  }
  
  try {
    const user = await User.findById(decodedToken.id);
    if (!user) {
      return response.status(400).json({ error: 'userId missing or not valid' })
    }
    // check if blog has been created by the same user before
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user._id
    });
    
    const newBlog = await blog.save()
    user.blogs = user.blogs.concat(newBlog._id);
    user.save()

    response.status(201).json(newBlog)
    
  } catch (error) {
    console.error(error)
    response.status(400).json({"message": "Failed to add post"})
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  const paramsId = request.params.id;
  console.log("Deleting blog with id:", paramsId);
  if(!paramsId){
    return response.status(400).json({ message: "Invalid id" });
  }

  try {
    const deletedBlog = await Blog.findByIdAndDelete(paramsId);

    if (!deletedBlog) {
      return response.status(404).json({ message: "Blog not found" });
    }

    return response.status(204).end();
  } catch (error) {
    errorHandler(error, request, response);
  }
})

// update blog post
blogsRouter.put('/:id', (request, response) => {
  const paramsId = request.params.id;
  const updatedBlog = request.body;

  Blog.findByIdAndUpdate(paramsId, updatedBlog, { new: true })
    .then((result) => {
      response.json(result);
    })
    .catch(err => {
      console.error(err);
      response.status(400).json({ message: "Failed to update blog" });
    });
});

module.exports = blogsRouter