var router = require("express").Router();

var flashUtils = require('../../utils/flashUtils');
var middleMan = require("../../utils/middleMan");

var redirectLocation = "/home";

// URL: "/removeitem"
module.exports = function(pool) {

    // Inserts the shop item from "addItemToShop.ejs" form submit
    router.get("/:id", middleMan.isLoggedIn, function(req, res) {
        pool.getConnection(function(err, connection) {
            if (flashUtils.isDatabaseError(req, res, redirectLocation, err))
                return;

            var removeItem = require('./queries/removeItem.sql');

            connection.query(removeItem, [req.params.id], function(err, row) {
                connection.release();

                if (flashUtils.isDatabaseError(req, res, redirectLocation, err))
                    return;

                res.redirect('/home')
            });
        });
    });


    return router;
};
