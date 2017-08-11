const con_to_db = require('../db/mysqldb')
const bcrypt = require('bcryptjs')

module.exports = class User{
    constructor(username, password, email, name){
        this.username = username
        this.password = password
        this.email = email
        this.name = name
    }
}

const dbQueryAsync = (query) =>
  new Promise((resolve, reject) => {
    con_to_db.query(query, (err, result) => {
      if (err) {
        return reject(err)
      }
      resolve(result)
    })
  })

module.exports.createUser = (newUser, callback) => {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash
            con_to_db.query(`INSERT INTO users (username, password, email, name) VALUES ('${newUser.username}','${newUser.password}','${newUser.email}','${newUser.name}')`, (err, result) => {
                if(err) throw err
            })
        })
    })
}

module.exports.getUserByUsername = async (username, callback) => {
  try {
    const users = await dbQueryAsync(`SELECT * FROM users WHERE username = '${username}'`)
    const { id, password } = users[0]
    console.log(`id: ${id}`, `password: ${password}`)
    return users[0]
  } catch (err) {
    console.error(err)//TODO Обработать return в passport.use
  }
}

module.exports.getUserById = async (id, callback) => {
    try {
        const users = await dbQueryAsync(`SELECT id FROM users WHERE id = '${id}'`)
        const { id, password } = users[0]
        console.log(`id: ${id}`, `password: ${password}`)
    } catch (err) {
        console.error(err)
    }
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        if(err) throw err;
        callback(null, isMatch);
    });
}

