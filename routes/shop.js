const express = require("express");
const shopController = require("../controller/shopController")
const router = express.Router();
router.route("/create").post( shopController.createShops);
router.route("/get/:id").get( shopController.getShops);
module.exports = router;
