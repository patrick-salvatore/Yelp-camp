const express = require('express'),
    router = express.Router(),
    Campground = require('../models/campground'),
    middleware = require('../middleware');



// INDEX ROUTE
router.get('/campgrounds', (req, res) => {
    // Retrieve campgrounds from DB
    Campground.find({}, (err, camps) => {
        if (err) {
            res.redirect('/campgrounds');
        } else {
            // Render page
            res.render('campgrounds/index', {
                campgrounds: camps
            })
        }
    });
});

// NEW ROUTE
router.get('/campgrounds/new', middleware.isLoggedIn, (req, res) => {
    res.render('campgrounds/new')
});

// CREATE ROUTE
router.post('/campgrounds',  middleware.isLoggedIn, (req, res) => {
    let name = req.body.name;
    let img = req.body.image;
    let desc = req.body.description
    let author = {
        id: req.user.id,
        username: req.user.username
    }
    let price = req.body.price
    let newCamp = {
        name: name,
        image: img,
        description: desc,
        author: author,
        price: price
    };
    Campground.create(newCamp, (err, camp) => {
        if (err) {
            console.log(err);
        } else {
            // redirect page to show camps from DB
            res.redirect('/campgrounds');
        }
    });
});

// SHOW
router.get('/campgrounds/:id', (req, res) => {
    Campground.findById(req.params.id).populate('comments').exec((err, found) => {
        if (err || !found) {
            req.flash('error', 'Sorry, that campground does not exist!');
            return res.redirect('/campgrounds');
        }
        res.render("campgrounds/show", {campgrounds: found});
    });
});

// Edit
router.get('/campgrounds/:id/edit', middleware.campgroundOwner, middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        res.render("campgrounds/edit", {campground: campground});
    });
}); 

// Update 
router.put("/campgrounds/:id", middleware.campgroundOwner, (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect(`/campgrounds/${req.params.id}`);
        }
    });
});


// DESTROY
router.delete('/campgrounds/:id', middleware.campgroundOwner,(req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err, campRemoved) => {
        if (err) {
            res.redirect('/campgrounds')
        }
        Comment.deleteMany({
            _id: {
                $in: campgroundRemoved.comments
            }
        }, (err) => {
            if (err) {
                console.log(err);
            }
            res.redirect("/campgrounds");
        });
    });
});


module.exports = router;