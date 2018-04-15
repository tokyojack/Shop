//============================= Packages =============================

var express = require("express");
var app = express();

var bodyParser = require("body-parser");
var flash = require('express-flash');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var HashMap = require('hashmap');

var colors = require('colors');

var config = require('./config/config');

//============================= PayPal =============================

var paypal = require('paypal-rest-sdk');

paypal.configure(config.PayPal);

//============================= Pool =============================

var mysql = require("mysql");
var pool = mysql.createPool(config.db);

require('require-sql');

//============================= Passport =============================

var passport = require('passport');
require('./config/passport')(passport, pool);

//============================= Letting express use them =============================

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(session({
    secret: 'RANDOM',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use(function(req, res, next) {
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");

    res.locals.user = req.user;

    next();
});

var transcation = new HashMap();

//============================= Routes =============================

//Index

var indexRoutes = require("./routes/website/indexRoutes")();
app.use("/", indexRoutes);

//shop
var shopRoutes = require("./routes/website/shopRoutes")(pool);
app.use("/shop", shopRoutes);

var checkoutRoutes = require("./routes/website/checkoutRoutes")(pool, paypal, transcation);
app.use("/checkout", checkoutRoutes);

var successRoutes = require("./routes/website/successRoutes")(pool, paypal, transcation);
app.use("/success", successRoutes);

var cancelledRoutes = require("./routes/website/cancelledRoutes")();
app.use("/cancelled", cancelledRoutes);


// Admin panel

var homeRoutes = require("./routes/adminPanel/homeRoutes")(pool);
app.use("/home", homeRoutes);

var editRoutes = require("./routes/adminPanel/editRoutes")(pool);
app.use("/edit", editRoutes);


var addItemToShopRoutes = require("./routes/adminPanel/addItemToShopRoutes")(pool);
app.use("/additem", addItemToShopRoutes);

var removeItemFromShopRoutes = require("./routes/adminPanel/removeItemFromShopRoutes")(pool);
app.use("/removeitem", removeItemFromShopRoutes);


// Authentication

var loginRoutes = require("./routes/authentication/loginRoutes")(passport);
app.use("/login", loginRoutes);

var logoutRoutes = require("./routes/authentication/logoutRoutes")();
app.use("/logout", logoutRoutes);

// Misc

var miscRoutes = require("./routes/misc/miscRoutes")();
app.use("*", miscRoutes);

exports.pool = pool;

//============================= Starting Server =============================

app.listen(8080, function() {
    console.log("Server running".rainbow);
});

//============================= Ending Server =============================


require('./utils/nodeEnding').nodeEndingCode(nodeEndInstance);

function nodeEndInstance() {
    console.log("The pool has been closed.".bgBlack.blue);
    pool.end();
}
