const express = require('express')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')

const router = express.Router()

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
        User.getUserByUsername(username, function(err, user){
            if(err)throw err
            console.log(user.password)
            if(!user){
                return done(null, false, {message: 'Unknown User'})
            }
            User.comparePassword(password, user.password, function(err, isMatch){
                if(err) throw err
                if(isMatch){
                    return done(null, user)
                } else{
                    return done(null, false, {message:'Invalid Password'})
                }
            })
        })
    }
))

passport.serializeUser((user, done) => {
    console.log(`Blyat ${user.id}`)
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    User.getUserById(id, (err, user) => {
        done(err, user)
    })
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