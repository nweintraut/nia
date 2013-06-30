var photos = [];
photos.push ({
    name: 'Node.js Logo',
    path: 'http://nodejs.org/images/logos/nodejs-green.png'
});

photos.push ({
    name: 'Ryan Speaking',
    path: 'http://nodejs.org/images/ryan-speaker.jpg'
});

exports.list = function(req, res) {
    res.render('photos/index', {
        title: 'Photos',
        photos: photos
    });
};
exports.form = function(req, res) {
    res.render('photos/upload', {title: 'Photo upload'});
};var Photo = require('../models/photo');
var path = require('path');
// var fs = require('fs');
var join = path.join;
var mv = require('../node-mv');

exports.submit = function (dir) {
    return function(req, res, next) {
        var img = req.files.photo.image;
        var name = req.body.photo.name || img.name;
        var path = join(dir, img.name);
        console.log(path);
        mv(img.path, path, function(err){
//        fs.rename(img.path, path, function(err){
            if (err) {
                return next(err);
            } else {
                Photo.create({
                    name: name,
                    path: img.name
                }, function(err) {
                    if (err) {return next(err);}
                    else { res.redirect('/');}
                });
            }
        });
        
    };
};