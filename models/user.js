


module.exports = User

module.exports.

module.exports.getUserByUsername = async(username, callback) => {
    let res
    con_to_db.query(`SELECT * FROM users WHERE username = '${username}'`, (err, result) => {
        if(err) throw err
        res = {password: result[0].password, id: result[0].id}
        console.log(`1 ${res}`)
    })
    console.log(`2 ${res}`)
    console.log(`3 ${res}`)
}

module.exports.getUserById = async(id, callback) => {
    let res
    con_to_db.query(`SELECT id FROM users WHERE id = '${id}'`, (err, result) => {
        if(err) throw err
        if(!err){
            res = result[0].id
        }
    })
    await console.log(`id = ${res}`)
    //User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        if(err) throw err;
        callback(null, isMatch);
    });
}

