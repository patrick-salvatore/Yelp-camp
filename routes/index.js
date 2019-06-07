const express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    User = require('../models/user'), 
    middleware = require('../middleware');

router.get('/', (req, res) => {
    res.render('landing');
});

// register routes and logic
router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', (req, res) => {
    let newUser = new User({
        username: req.body.username
    })
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate('local')(req, res, function () {
            req.flash('success', 'Welcome to YelpCamp!')
            res.redirect('/campgrounds');
        });
    });
});

//show login form
router.get("/login", (req, res) => {
    res.render("login");
});


router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
    failureFlash: true,
    successFlash: 'Welcome Back!'
}), (req, res) => {});

// logout route
router.get("/logout", (req, res) => {
    req.logout();
    req.flash('success', "Logged Out");
    res.redirect("/campgrounds");
});


module.exports = router;