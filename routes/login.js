const express = require("express");
const loginController = require("../controller/loginController")
const router = express.Router();
router.route("/create").post( loginController.createNewUser);
router.route("/login").post(loginController.getByPasswordEmail);
module.exports = router;