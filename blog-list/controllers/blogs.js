const express = require('express');
const blogsRouter = express.Router();
const Blog = require('../model/Blog');
const { errorHandler } = require('../utils/middleware');

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