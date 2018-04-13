var router = require("express").Router();
var middleMan = require("../../utils/middleMan");
var flashUtils = require('../../utils/flashUtils');

var redirectLocation = "/home";

// URL: "/home"
module.exports = function(pool) {

    // "home.ejs" page
    router.get("/", middleMan.isLoggedIn, function(req, res) {
        pool.getConnection(function(err, connection) {
            if (flashUtils.isDatabaseError(req, res, redirectLocation, err))
                return;

            var selectShopItems = require('./queries/selectShopItems.sql');

            connection.query(selectShopItems, function(err, items) {
                connection.release();

                if (flashUtils.isDatabaseError(req, res, redirectLocation, err))
                    return;
              
                res.render("adminPanel/home.ejs", { items: items });
            });

        });
    });

    return router;
};
