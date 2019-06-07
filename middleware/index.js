const middlewareObj = {},
    Campground = require("../models/campground"),
    Comment = require("../models/comment");


middlewareObj.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Please Login");
    res.redirect('/login');
}

middlewareObj.commentOwner = (req, res, next) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if (err || !foundComment) {
            console.log(err);
            req.flash('error', 'Sorry, that comment does not exist!');
            res.redirect('/campgrounds');
        } else if (foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
            req.comment = foundComment;
            next();
        } else {
            req.flash('error', "Unauthorized Request");
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
}

middlewareObj.campgroundOwner = (req, res, next) => {
    Campground.findById(req.params.id, (err, foundCampground) =>  {
        if (err || !foundCampground) {
            console.log(err);
            req.flash('error', 'Sorry, that campground does not exist!');
            res.redirect('/campgrounds');
        } else if (foundCampground.author.id.equals(req.user._id) || req.user.isAdmin) {
            req.campground = foundCampground;
            next();
        } else {
            req.flash('error', "Unauthorized Request");
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
}


module.exports = middlewareObj;