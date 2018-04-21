var router = require("express").Router();
var HashMap = require("hashmap");

var flashUtils = require("../../utils/flashUtils");

var redirectLocation = "/";

// URL: "/checkout"
module.exports = function (pool, paypal, transcation) {

    //"checkout.ejs" page
    router.get("/:id", function (req, res) {
        pool.getConnection(function (err, connection) {
            if (flashUtils.isDatabaseError(req, res, redirectLocation, err)) return;

            var selectItemById = require("./queries/selectItemById.sql");

            connection.query(selectItemById, [parseInt(req.params.id)], function (
                err,
                rows
            ) {
                connection.release();

                if (flashUtils.isDatabaseError(req, res, redirectLocation, err)) return;

                res.render("website/checkout.ejs", {
                    item: rows[0]
                });
            });
        });
    });

    // Creates the PayPal invoice and redirects them to it
    router.post("/:id", function (req, res) {
        pool.getConnection(function (err, connection) {
            if (flashUtils.isDatabaseError(req, res, redirectLocation, err)) return;

            var insertEmail = require("./queries/insertEmail.sql");

            connection.query(insertEmail, [req.body.email], function (err, email) {

                var selectItemById = require("./queries/selectItemById.sql");

                connection.query(selectItemById, [parseInt(req.params.id)], function (
                    err,
                    item
                ) {
                    connection.release();

                    if (flashUtils.isDatabaseError(req, res, redirectLocation, err))
                        return;

                    var itemData = item[0];

                    // Get's the URL
                    var url = req.protocol + "://" + req.get("host");

                    // Create's cart
                    var cartItems = [{
                        name: itemData.title,
                        sku: "item",
                        price: parseInt(itemData.cost),
                        currency: "USD",
                        quantity: 1
                    }];

                    var total = itemData.cost;

                    var create_payment_json = {
                        intent: "sale",
                        payer: {
                            payment_method: "paypal"
                        },
                        redirect_urls: {
                            return_url: url + "/success",
                            cancel_url: url + "/cancelled"
                        },
                        transactions: [{
                            item_list: {
                                items: cartItems
                            },
                            amount: {
                                currency: "USD",
                                total: total
                            },
                            description: "Purchasing: " + itemData.name,
                            custom: req.body.email
                        }]
                    };

                    paypal.payment.create(create_payment_json, function (error, payment) {
                        if (error) {
                            throw error;
                        }

                        transcation.set(payment.id, create_payment_json);
                        res.redirect(payment.links[1].href);
                    });
                });
            });
        });
    });

    return router;
};