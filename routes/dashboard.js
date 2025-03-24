var express = require("express");
var router = express.Router();
const { checkAuth } = require("../middleware/auth");

/* GET home page. */
router.get("/", checkAuth("VIEW_DASHBOARD"), (req, res) => {
  var userName = req.session.userId;
  var locals = {
    title: "Exp - Tec",
    userName: userName,
  };
  res.render("dashboard", locals);
});

module.exports = router;
