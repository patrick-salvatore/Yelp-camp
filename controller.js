const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    flash = require('connect-flash'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    Campground = require('./models/campground'),
    Comment = require('./models/comment'),
    seedDB = require('./seeds'),
    User = require('./models/user'),
    campRoutes = require('./routes/campgrounds'),
    commentRoutes = require('./routes/comments'),
    indexRoutes = require('./routes/index'), 
    methodOverride = require('method-override');

// Passport Config
app.use(require('express-session')({
    secret: "Self taught is not easy",
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app config
app.set('view engine', 'ejs');
mongoose.connect('mongodb://localhost:27017/yelp_camp', {
    useNewUrlParser: true
});
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(__dirname + "/public"));
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error')
    res.locals.success = req.flash('success')
    next(); 
})
app.use(methodOverride('_method'));
app.use(indexRoutes);
app.use(campRoutes);
app.use(commentRoutes);



seedDB();



app.listen('8080', () => {
    console.log('Server is now active')
});