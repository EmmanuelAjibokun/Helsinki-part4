const { test, after, beforeEach, describe } = require('node:test');
const mongoose = require('mongoose');
const app = require('../index');
const supertest = require('supertest');
const listHelper = require('../utils/list_helper');
const Blog = require('../model/Blog');
const assert = require('node:assert');

const api = supertest(app);

beforeEach(async() => {
    await Blog
        .deleteMany({})

    console.log("check if the before function is running")
    const newBlog = {
        title: "React patterns checker",
        author: "Michael Chan",
        url: "https://checkreactpatterns.com/",
        likes: 7,
    }
    // insert one blog to test deletion
    await api
        .post('/api/blogs')
        .auth('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJvb3QiLCJpZCI6IjY5NWQzODkwMDdhZTQ0YTY1NTcxODBjYSIsImlhdCI6MTc2ODU1ODI2NH0.RYZ-5rkDbpNoCjySgtYGX4DilhGuu0vlGxC3OL3WXFE', { type: 'bearer' })
        .send(newBlog)
    await Blog
        .insertMany(listHelper.blogs);
})

test('Get all blogs', async() => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('Does id property exist?', async () => {
    const blogs = await api.get('/api/blogs');
    const IDs = blogs.body.map(r => r.id);
    assert.strictEqual(blogs.body.length, IDs.length)
})

test('Make new blog post', async () => {
    const initialBlogs = await api.get('/api/blogs');
    
    const newBlog = {
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
    }
    
    // add authorization bearer token to the request header
    await api
        .post('/api/blogs')
        .auth('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJvb3QiLCJpZCI6IjY5NWQzODkwMDdhZTQ0YTY1NTcxODBjYSIsImlhdCI6MTc2ODU1ODI2NH0.RYZ-5rkDbpNoCjySgtYGX4DilhGuu0vlGxC3OL3WXFE', { type: 'bearer' })
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogs = await api.get('/api/blogs');
    // console.log(blogs.body);

    const {title, author, url, likes} = blogs.body[blogs.body.length - 1]
    const newlyAddedBlog = {
        title,
        author,
        url,
        likes,
    }

    assert.strictEqual(blogs.body.length, initialBlogs.body.length + 1);
    assert.deepStrictEqual(newBlog, newlyAddedBlog)
})

test('Verification when likes prop is missing', async () => {
    const newBlog = {
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        __v: 0
    }

    const response = await api
        .post('/api/blogs')
        .auth('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJvb3QiLCJpZCI6IjY5NWQzODkwMDdhZTQ0YTY1NTcxODBjYSIsImlhdCI6MTc2ODU1ODI2NH0.RYZ-5rkDbpNoCjySgtYGX4DilhGuu0vlGxC3OL3WXFE', { type: 'bearer' })
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
    assert.strictEqual(response.body.likes, 0)
})

test('Return bad req status code', async () => {
    const newBlogMissingTitle = {
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        __v: 0
    }
    const newBlogMissingUrl = {
        title: "React patterns",
        author: "Michael Chan",
        __v: 0
    }

    await api
        .post('/api/blogs')
        .auth('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJvb3QiLCJpZCI6IjY5NWQzODkwMDdhZTQ0YTY1NTcxODBjYSIsImlhdCI6MTc2ODU1ODI2NH0.RYZ-5rkDbpNoCjySgtYGX4DilhGuu0vlGxC3OL3WXFE', { type: 'bearer' })
        .send(newBlogMissingTitle)
        .expect(400)
    await api
        .post('/api/blogs')
        .auth('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJvb3QiLCJpZCI6IjY5NWQzODkwMDdhZTQ0YTY1NTcxODBjYSIsImlhdCI6MTc2ODU1ODI2NH0.RYZ-5rkDbpNoCjySgtYGX4DilhGuu0vlGxC3OL3WXFE', { type: 'bearer' })
        .send(newBlogMissingUrl)
        .expect(400)
})

describe('deletion of a blog', () => {
    test.only('suceeds with status code 204 if id is valid', async () => {
        const blogs = await api.get('/api/blogs');
        const blogToDelete = blogs.body[0];
        console.log(blogToDelete);

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .auth('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJvb3QiLCJpZCI6IjY5NWQzODkwMDdhZTQ0YTY1NTcxODBjYSIsImlhdCI6MTc2ODU1ODI2NH0.RYZ-5rkDbpNoCjySgtYGX4DilhGuu0vlGxC3OL3WXFE', { type: 'bearer' })
            .expect(204);

        const currentBlogsState = await api.get('/api/blogs');
        const IDs = currentBlogsState.body.map(r => r.id);

        assert(!IDs.includes(blogToDelete.id));
        assert.strictEqual(currentBlogsState.body.length, blogs.body.length - 1)
    })
})

describe('updating a blog', () => {
    test.only('succeeds in updating a blog data', async () => {
        const blogs = await api.get('/api/blogs');
        // console.log(blogs);
        const blogToUpdate = blogs.body[0];
        const updatedBlogData = {
            title: blogToUpdate.title,
            author: blogToUpdate.author,
            url: blogToUpdate.url,
            likes: blogToUpdate.likes + 1,
        };


        const response = await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(updatedBlogData)
            .expect(200)
            .expect('Content-Type', /application\/json/);

        assert.strictEqual(response.body.likes, blogToUpdate.likes + 1);
    });
});

after(async() => {
    await mongoose.connection.close()
})