const { test, after, beforeEach, describe } = require('node:test');
const { assert } = require('node:assert');
const app = require('../index');
const User = require('../model/User');
const listHelper = require('../utils/list_helper');
const supertest = require('supertest');

const api = supertest(app);

describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({});

        const passwordHash = await bcrypt.hash('sekret', 10);
        const user = new User({ username: 'root', name: 'Superuser', passwordHash });

        await user.save();
    })

    test('creation succeeds with a fresh username', async() => {
        const initialUsers = await listHelper.usersInDb();

        const newUser = {
            username: 'manny',
            name: 'Big Manny',
            password: 'avengerrs',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /Application\/json/)

        const finalUsers = await listHelper.usersInDb()
        assert.strictEqual(finalUsers.length, initialUsers.length + 1)

        const usernames = usersAtEnd.map(u => u.username);
        assert(usernames.includes(newUser.username))
    })
})