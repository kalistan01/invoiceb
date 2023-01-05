const Routes = require("../model/Route");
const Validator = require("fastest-validator");

exports.createRoute = async (req, res, next) => {
    try {
        let {route_name} = req.body;
        const schema = {
            route_name: {type: "string", optional: false, max: "1000"}
        }
        const v = new Validator();
        const validationResponse = v.validate(req.body, schema);
        if (validationResponse !== true) {
            return res.status(400).json({
                message: "Validation failed",
                error: validationResponse
            });
        } else {
            let routes = new Routes(route_name);
            routes = await routes.create();
            res.status(201).json({message: "credit created", status: 1});
        }
    } catch (error) {
        // next(error);
        res.status(500).json({
            message: "Something went wrong",
            error: error
        });
    }
};
exports.updateRoute = async (req, res, next) => {
    try {
        let {route_name} = req.body;
        let id = req.params.id;

        const schema = {
            route_name: {type: "string", optional: false, max: "1000"}
        }
        const v = new Validator();
        const validationResponse = v.validate(req.body, schema);
        if (validationResponse !== true) {
            return res.status(400).json({
                message: "Validation failed",
                error: validationResponse
            });
        } else {
            let routes = new Routes(route_name);
            routes = await routes.update(id);
            res.status(201).json({message: "updated successfully", status: 1});
        }
    } catch (error) {
        // next(error);
        res.status(500).json({
            message: "update fail",
            error: error
        });
    }
};
exports.getAllRoutes = async (req, res, next) => {
    try {
        const [route, _] = await Routes.find();
        res.status(200).json({
            route: route
        });
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error: error
        });
    }
};


exports.deleteRoute = async (req, res) => {
    try {
        let id = req.params.id;
        const [route, _] = await Routes.delete(id)
        res.status(200).json({
            message: "deleted successfully",
            route
        });

    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error: error
        });
    }
}
exports.activateRoute = async (req, res) => {
    try {
        let id = req.params.id;
        const [route, _] = await Routes.activate(id)
        res.status(200).json({
            message: "activate successfully",
            route
        });

    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error: error
        });
    }
}