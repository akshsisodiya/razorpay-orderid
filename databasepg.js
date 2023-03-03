const {Client} = require('pg')
require('dotenv').config()

const client = new Client({
    host: "db.fvqsfvaqamttbvmxzugt.supabase.co",
    name: "postgres",
    user: "postgres",
    port: "5432",
    // password: process.env.DB_PASS,
})

module.exports = client