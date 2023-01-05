const Shops = require("../model/Shop");
const Validator = require("fastest-validator");

exports.createShops = async (req, res, next) => {
    try {
        let {shop_name,route_id} = req.body;

        const schema = {
            shop_name: {type: "string", optional: false, max: "1000"},
            route_id: {type: "number", optional: false}
        }
        const v = new Validator();
        const validationResponse = v.validate(req.body, schema);
        if (validationResponse !== true) {
            return res.status(400).json({
                message: "Validation failed",
                error: validationResponse
            });
        } else {
            let shop = new Shops(shop_name,route_id);
            shop = await shop.create();
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
exports.getShops = async (req,res,next) =>{

    try{
        let routeId = req.params.id;
        const [shops, _] = await Shops.findShops(routeId);

        res.status(200).json({shops: shops});
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error: error
        });
    }
}