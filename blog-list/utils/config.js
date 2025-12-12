require('dotenv').config();

const { NODE_ENV } = process.env;

const MONGODB_URI = NODE_ENV === 'test' ?
    process.env.MONGODB_URI_TEST :
    process.env.MONGODB_URI

const PORT = process.env.PORT || 3001

module.exports = { MONGODB_URI, PORT }