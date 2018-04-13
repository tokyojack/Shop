var flashUtils = require('./../utils/flashUtils');

var user = require('./config').loginAccount;

// load all the things we need
var LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport, pool) {

    passport.serializeUser(function(user, done) {
        done(null, user.username);
    });

    passport.deserializeUser(function(id, done) {
        done(null, user);
    });

    passport.use(
        'local-login',
        new LocalStrategy({
                usernameField: 'username',
                passwordField: 'password',
                passReqToCallback: true
            },
            function(req, username, password, done) {
                // TODO hash them?
                
                if (flashUtils.authenticationSuccessMessageIf(req, (username != user.username), 'Some of your details are not correct. Please try again.'))
                    return done(null, false);

                if (flashUtils.authenticationSuccessMessageIf(req, (password != user.password), 'Some of your details are not correct. Please try again.'))
                    return done(null, false);


                return done(null, user);
            })
    );

};
