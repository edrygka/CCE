const express = require('express')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const con_to_db = require('../db/mysqldb')
const bcrypt = require('bcryptjs')
const router = express.Router()


class User{
    constructor(username, password, email, name){
        this.username = username
        this.password = password
        this.email = email
        this.name = name
    }
    createUser(newUser, callback){
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash
            con_to_db.query(`INSERT INTO users (username, password, email, name) VALUES ('${newUser.username}','${newUser.password}','${newUser.email}','${newUser.name}')`, (err, result) => {
                if(err) throw err
            })
        })
    })
}
}
//Register
router.get('/register', function(req, res){
    res.render('register')
});

//Login
router.get('/login', function(req, res){
    res.render('login')
});

//Register User
router.post('/register', function(req, res){
    let name = req.body.name
    let email = req.body.email
    let username = req.body.username
    let password = req.body.password
    let password2 = req.body.password2
    
    //Validation
    req.checkBody('name', 'Name is required').notEmpty()
    req.checkBody('email', 'Email is required').notEmpty()
    req.checkBody('email', 'Email is not valid').isEmail()
    req.checkBody('username', 'Username is required').notEmpty()
    req.checkBody('password', 'Password is required').notEmpty()
    req.checkBody('password2', 'Password do not match').equals(req.body.password)
    
    let errors = req.validationErrors()
    
    if(errors){//Если есть ошибка, выводим на экран
        res.render('register', {
            errors: errors
        });
    } else{//Если ошибок нет, регистрируем пользователя
        let newUser = new User(username, password, email, name)
        User.createUser(newUser, function(err, user){
            if(err) throw err
            console.log(User)
        });
        
        req.flash('success_msg', 'You are registered and can now login')
        res.redirect('/users/login')
    }
});

passport.use(new LocalStrategy(
    function(username, password, done) {
        con_to_db.query(`SELECT * FROM users WHERE username = '${username}'`, (err, result) => {
            if(err)
            {
                return done(err)           
            }
            if(!user)
            {
                return done(null,false,{message: 'Incorrect user name'})         
            }
            let candidatePassword = result[0].password;
            (candidatePassword, hash, callback) => {
                bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
                    if(err) throw err
                    callback(null, isMatch)
                })
            }
            return done(null,user)
        })
        
    // User.getUserByUsername(username, function(err, user){
    //     if(err)throw err
    //     console.log(user.password)
    //     if(!user){
    //         return done(null, false, {message: 'Unknown User'})
    //     }
    //     User.comparePassword(password, user.password, function(err, isMatch){
    //         if(err) throw err
    //         if(isMatch){
    //             return done(null, user)
    //         } else{
    //             return done(null, false, {message:'Invalid Password'})
    //         }
    //     })
    })
)

passport.serializeUser((user, done) => {
    console.log(`Blyat ${user.id}`)
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    con_to_db.query(`SELECT * FROM users WHERE id = '${id}'`, (err, result) => {
        done(err, result[0])
    })
    // User.getUserById(id, function(err, user) {
    //   done(err, user)
    // })
})

router.post('/login',
  passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/login', failureFlash: true}),
  function(req, res) {
    res.redirect('/')
  })

router.get('/logout', function(req, res){
    req.logout()

    req.flash('success_msg', 'You are logged out')
    
    res.redirect('/users/login')
})

module.exports = router