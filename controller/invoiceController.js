const Invoice = require("../model/Invoice");
const Validator = require("fastest-validator");
exports.getInvoice = async (req, res, next) => {

    try {
        let shopId = req.params.id;
        const [invoices, _] = await Invoice.findInvoices(shopId);
        const [shopName, _n] = await Invoice.findshopName(shopId);

        res.status(200).json({
            invoices: invoices,
            shopName: shopName[0]
        });
        // res.status(200).json({ message: "Something went wrong"});

    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error: error
        });
    }
}
exports.createInvoice = async (req, res, next) => {
    try {
        let {
            invoice_no,
            amount,
            shop_id
        } = req.body;

        const schema = {
            invoice_no: {type: "number", optional: false},
            amount: {type: "number", optional: false},
            shop_id: {type: "number", optional: false}
        }
        const v = new Validator();
        const validationResponse = v.validate(req.body, schema);
        if (validationResponse !== true) {
            return res.status(400).json({
                message: "Validation failed",
                error: validationResponse
            });
        } else {
            let invoice = new Invoice(invoice_no, amount, shop_id, 1);
            invoice = await invoice.create();

            res.status(201).json({message: "credit created", status: 1, invoice});

        }
    } catch (error) {
        // next(error);

        if (error.code === 'ER_DUP_ENTRY') {
            res.status(201).json({
                message: "ER_DUP_ENTRY",
                status: 0});

        } else {
            res.status(500).json({
                message: "Something went wrong",
                error: error
            });
        }
    }
};