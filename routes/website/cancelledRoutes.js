var router = require("express").Router();

// URL: "/cancelled"
module.exports = function () {

    // "cancelled.ejs" page
    router.get("/", (req, res) => res.render("website/cancelled.ejs"));

    return router;
};