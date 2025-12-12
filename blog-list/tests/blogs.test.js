const { test, after, beforeEach } = require('node:test');
const mongoose = require('mongoose');
const app = require('../index');
const supertest = require('supertest');
const listHelper = require('../utils/list_helper');
const Blog = require('../model/Blog');

const api = supertest(app);

beforeEach(async() => {
    await Blog
        .deleteMany({})

    console.log("check if the before function is running")

    await Blog
        .insertMany(listHelper.blogs);
})

test.only('Get all blogs', async() => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

after(async() => {
    await mongoose.connection.close()
})