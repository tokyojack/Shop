var router = require("express").Router();

var flashUtils = require("../../utils/flashUtils");

var redirectLocation = "/";

var emailUtil = require("../../utils/emailUtil");
var HashMap = require("hashmap");

// URL: "/success"
module.exports = function (pool, paypal, transcation) {

    // "success.ejs" page
    router.get("/", function (req, res) {
        var payerId = req.query.PayerID;
        var paymentId = req.query.paymentId;

        var transaction = transcation.get(paymentId);

        var execute_payment_json = {
            payer_id: payerId,
            transactions: [{
                amount: {
                    currency: "USD",
                    total: transaction.transactions[0].amount.total
                }
            }]
        };

        paypal.payment.execute(paymentId, execute_payment_json, function (
            error,
            payment
        ) {
            if (error) {
                console.log(error.response);
                throw error;
            }

            var itemList = transaction.transactions[0].item_list.items;
    
            pool.getConnection(function (err, connection) {
                if (flashUtils.isDatabaseError(req, res, redirectLocation, err)) return;

                var selectItemByTitle = require("./queries/selectItemByTitle.sql");

                connection.query(selectItemByTitle, [itemList[0].name], function (err, row) {
                    connection.release();

                    if (flashUtils.isDatabaseError(req, res, redirectLocation, err))
                        return;

                        var htmlContent = '<a href="' +row[0].download_url +'">Download</a>'
                    

                    emailUtil.sendEmail(
                        "Your items have arrivied!",
                        htmlContent,
                        payment.transactions[0].custom
                    );
                });
            });

            transcation.delete(paymentId);

            res.render("website/success.ejs", {
                email: payment.transactions[0].custom
            });
        });
    });

    return router;
};