const { test, after, beforeEach } = require('node:test');
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

test.only('Make new blog post', async () => {
    const newBlog = {
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogs = await api.get('/api/blogs');

    const {title, author, url, likes} = blogs.body[blogs.body.length - 1]
    const newlyAddedBlog = {
        title,
        author,
        url,
        likes,
        __v: 0
    }

    assert.strictEqual(blogs.body.length, listHelper.blogs.length + 1);
    assert.deepStrictEqual(newBlog, newlyAddedBlog)
})

after(async() => {
    await mongoose.connection.close()
})