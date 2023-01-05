const express = require("express");
const invoiceController = require("../controller/invoiceController")
const router = express.Router();
router.route("/get/:id").get( invoiceController.getInvoice);
router.route("/create").post( invoiceController.createInvoice);
module.exports = router;