const db = require('mysql')

let pool = db.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "Users"
})

pool.connect((err) => {
      if (err) throw err
})

module.exports = pool