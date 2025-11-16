const express = require('express');
const blogsRouter = express.Router();
const Blog = require('../model/Blog');

blogsRouter.get('/', (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs)
  })
})

blogsRouter.post('/', (request, response) => {
  const blog = new Blog(request.body)

  blog.save().then((result) => {
    response.status(201).json(result)
  }).catch(err => {
    console.error(err)
    response.status(400).json({"message": "Failed to add post"})
  })
})

module.exports = blogsRouter