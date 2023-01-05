const express = require("express")
const dashboardController = require('../controller/dashboardController')

const router = express.Router()

router.route("/get-counts").get(dashboardController.getInvoiceCount)
module.exports = router;