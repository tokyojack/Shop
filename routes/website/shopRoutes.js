var router = require("express").Router();

var flashUtils = require("../../utils/flashUtils");

var redirectLocation = "/";

// URL: "/shop"
module.exports = function (pool) {
    
    //"shop.ejs" page
    router.get("/", function (req, res) {
        pool.getConnection(function (err, connection) {
            if (flashUtils.isDatabaseError(req, res, redirectLocation, err)) return;

            var selectItems = require("./queries/selectItems.sql");

            connection.query(selectItems, function (err, row) {
                connection.release();

                if (flashUtils.isDatabaseError(req, res, redirectLocation, err)) return;

                res.render("website/shop.ejs", {
                    items: row
                });
            });
        });
    });

    return router;
};