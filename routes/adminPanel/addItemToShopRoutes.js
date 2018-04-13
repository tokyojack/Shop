var router = require("express").Router();

var flashUtils = require("../../utils/flashUtils");
var middleMan = require("../../utils/middleMan");

var redirectLocation = "/home";

// URL: "/additem"
module.exports = function (pool) {

    // Inserts conversation from "addItemToShop.ejs" form submit
    router.post("/", middleMan.isLoggedIn, function (req, res) {
        pool.getConnection(function (err, connection) {
            if (flashUtils.isDatabaseError(req, res, redirectLocation, err)) return;

            var insertItem = require("./queries/insertItem.sql");

            var body = req.body;

            connection.query(
                insertItem, [
                    body.title,
                    body.description,
                    parseInt(body.price),
                    body.pictureURL,
                    body.downloadURL
                ],
                function (err, row) {
                    connection.release();

                    if (flashUtils.isDatabaseError(req, res, redirectLocation, err))
                        return;

                    flashUtils.successMessage(req, res, "/home", body.title);
                }
            );
        });
    });

    return router;
};