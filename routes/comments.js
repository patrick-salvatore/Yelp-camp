const express = require('express'),
    router = express.Router(),
    Campground = require('../models/campground'),
    Comment = require('../models/comment'), 
    middleware = require('../middleware');



// Add Comment and post
router.get('/campgrounds/:id/comments/new', middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, found) => {
        if (err) {
            console.log(err);
        } else {
            res.render('comments/new', {
                campground: found
            });
        }

    })
});

router.post("/campgrounds/:id/comments", middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            res.redirect('/campgrounds/:id');
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    console.log(err);
                } else {
                    // add username and id 
                    comment.author.id = req.user._id
                    comment.author.username = req.user.username
                    comment.save();
                    // save
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect(`/campgrounds/${campground._id}`);
                }
            });
        }
    });
});

// Edit and Update and Delete comments 
router.get('/campgrounds/:id/comments/:comment_id/edit', middleware.commentOwner, middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, found) =>{
        if(err || !found) {
            req.flash('error', 'Campground does not exist')
            return res.redirect('back');
        }
        Comment.findById(req.params.comment_id, (err, edit) => {
            if (err) {
                res.redirect('back');
            } else {
                res.render('comments/edit', {campground_id: req.params.id, comment: edit})
            }
        });
    });
});

router.put('/campgrounds/:id/comments/:comment_id', middleware.commentOwner, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect(`/campgrounds/${req.params.id}`);
        }
    });
});

router.delete('/campgrounds/:id/comments/:comment_id', middleware.commentOwner, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err, commentRemoved) => {
        if (err) {
            res.redirect('/campgrounds/:id')
        } else {
            res.redirect(`/campgrounds/${req.params.id}`)
        }
    });    
});



module.exports = router;