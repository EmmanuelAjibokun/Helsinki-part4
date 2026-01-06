const { test, after, beforeEach, describe } = require('node:test');
const assert = require('node:assert');
const app = require('../index');
const User = require('../model/User');
const listHelper = require('../utils/list_helper');
const supertest = require('supertest');
const bcrypt = require('bcrypt');

const api = supertest(app);

describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({});

        console.log("Creating initial user");
        const passwordHash = await bcrypt.hash('sekret', 10);
        console.log("Password hashed");
        const user = new User({ username: 'root', name: 'Superuser', passwordHash });
        console.log("Saving initial user to DB");
        await user.save();
    })

    test('creation succeeds with a fresh username', async() => {
        const initialUsers = await listHelper.usersInDb();
        // console.log("Initial users:", initialUsers);

        const newUser = {
            username: 'manny',
            name: 'Big Manny',
            password: 'avengerrs',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const finalUsers = await listHelper.usersInDb();
        // console.log("Final users:", finalUsers);
        // console.log(finalUsers.length, initialUsers.length + 1)
        assert.strictEqual(finalUsers.length, initialUsers.length + 1)
        // assert.strictEqual(2, 1 + 1)
        // assert.strictEqual(2, 2)
        const usernames = finalUsers.map(u => u.username);
        // console.log("Usernames in DB:", usernames);
        assert(usernames.includes(newUser.username));
    })

    test('creation error with invalid user', async() => {
        const initialUsers = await listHelper.usersInDb();

        const newUser = {
            username: 'ma',
            name: 'Big Manny',
            password: 'av',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
        console.log(result.body);
    })
})