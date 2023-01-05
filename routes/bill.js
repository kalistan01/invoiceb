const express = require("express");
const billController = require("../controller/billController")
const router = express.Router();
router.route("/create").post( billController.addToBill);
router.route("/get/:id").get( billController.getByInvoiceNo);
module.exports = router;