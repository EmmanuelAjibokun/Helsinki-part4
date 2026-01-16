const express = require('express');
const blogsRouter = express.Router();
const Blog = require('../model/Blog');
const { errorHandler, userExtractor } = require('../utils/middleware');



blogsRouter.get('/', (request, response) => {
  Blog.find({}).populate('user', {username: 1, name: 1}).then((blogs) => {
    response.json(blogs)
  })
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body;
  const user = request.user;
  console.log(user);

  if (!body.title || !body.url) {
    return response.status(400).json({ "message": "Title or URL missing" });
  }
  
  try {
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

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const paramsId = request.params.id;
  const user = request.user;
  if(!paramsId){
    return response.status(400).json({ message: "Invalid id" });
  }

  try {
    // unauthorized if the blog to be deleted does not belong to the user
    const blogToDelete = await Blog.findById(paramsId);
    if (!blogToDelete) {
      return response.status(404).json({ message: "Blog not found" });
    }
    if (blogToDelete.user.toString() !== user.id.toString()) {
      return response.status(401).json({ error: "Unauthorized to delete this blog" });
    }
    const deletedBlog = await Blog.findByIdAndDelete(paramsId);

    if (!deletedBlog) {
      return response.status(404).json({ message: "Blog not found" });
    }

    user.blogs = user.blogs.filter(
      (blogId) => blogId.toString() !== paramsId.toString()
    );
    await user.save();

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