const Invoice = require("../model/Invoice");
const Shops = require("../model/Shop");
const Routes = require("../model/Route");
const Validator = require("fastest-validator");
exports.getInvoiceCount = async (req, res, next) => {

    try {
        const [invoices, _] = await Invoice.invoices();
        const [routes, r] = await Routes.routesCount();
        const [shops, s] = await Shops.shopCount();

        res.status(200).json({
            invoices:invoices[0].invoices,
            routes:routes[0].routes,
            shops:shops[0].shops,

        });
        // res.status(200).json({ message: "Something went wrong"});

    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error: error
        });
    }
}