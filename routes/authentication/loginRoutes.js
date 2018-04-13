var router = require("express").Router();

// URL: "/login"
module.exports = function(passport) {

    // "login.ejs" page
    router.get("/", function(req, res) {
        res.render("authentication/login.ejs");
    });

    // Login's parson when the form is submitted
    router.post('/', passport.authenticate('local-login', {
            successRedirect: '/home',
            failureRedirect: '/login'
        }),
        function(req, res) {
            console.log("done");
        });


    return router;
};
