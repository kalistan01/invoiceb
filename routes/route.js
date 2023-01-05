const express = require("express");
const routeController = require("../controller/routeController")
const router = express.Router();
router.route("/get").get( routeController.getAllRoutes);
router.route("/create").post( routeController.createRoute);
router.route("/update/:id").put( routeController.updateRoute);
router.route("/delete/:id").delete( routeController.deleteRoute);
router.route("/activate/:id").put( routeController.activateRoute);
module.exports = router;