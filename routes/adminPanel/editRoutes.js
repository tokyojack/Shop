var router = require("express").Router();
var middleMan = require("../../utils/middleMan");
var flashUtils = require('../../utils/flashUtils');

var redirectLocation = "/home";

// URL: "/edit"
module.exports = function(pool) {

    // "edit.ejs" page
    router.get("/:id", middleMan.isLoggedIn, function(req, res) {
        pool.getConnection(function(err, connection) {
            if (flashUtils.isDatabaseError(req, res, redirectLocation, err))
                return;

            var selectShopItemFromId = require('./queries/selectShopItemFromId.sql');

            connection.query(selectShopItemFromId, [req.params.id], function(err, item) {
                connection.release();

                if (flashUtils.isDatabaseError(req, res, redirectLocation, err))
                    return;

                res.render("adminPanel/edit.ejs", { item: item[0] });
            });
        });
    });

    // Changes it in the DB
    router.post("/:id", middleMan.isLoggedIn, function(req, res) {
        pool.getConnection(function(err, connection) {
            if (flashUtils.isDatabaseError(req, res, redirectLocation, err))
                return;

            var insertItem = require('./queries/updateItem.sql');

            var body = req.body;
            connection.query(insertItem, [body.title, body.description, parseInt(body.price), body.pictureURL, body.downloadURL, parseInt(req.params.id)], function(err, row) {
                connection.release();

                if (flashUtils.isDatabaseError(req, res, redirectLocation, err))
                    return;

                flashUtils.successMessage(req, res, '/home', body.title);
            });
        });
    });

    return router;
};
