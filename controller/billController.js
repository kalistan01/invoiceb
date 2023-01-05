const Cheque = require("../model/cheque");
const Cash = require("../model/Credit");
const Invoice = require("../model/Invoice");
const Validator = require("fastest-validator");

exports.addCash = async (req, res, next) => {
    try {
        let {
            invoice_no,
            credit_amount
        } = req.body;

        const schema = {
            invoice_no: {type: "number", optional: false},
            credit_amount: {type: "number", optional: false}
        }
        const v = new Validator();
        const validationResponse = v.validate(req.body, schema);
        if (validationResponse !== true) {
            return res.status(400).json({
                message: "Validation failed",
                error: validationResponse
            });
        } else {
            let cash = new Cash(invoice_no, credit_amount)
            cash = await cash.create()

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
exports.addToBill = async (req, res, next) => {
    try {
        let {
            invoice_no,
            payment_method,
            paid_amount,
            cheque_amount,
            deposit_date,
            expire_date,
            cheque_no,
            status
        } = req.body;

        const schema = {
            invoice_no: {type: "number", optional: false},
            payment_method: {type: "number", optional: false}
        }
        const v = new Validator();
        const validationResponse = v.validate(req.body, schema);
        if (validationResponse !== true) {
            return res.status(400).json({
                message: "Validation failed",
                error: validationResponse
            });
        } else {
            if (payment_method === 1) {
                if (status === 0) {
                    const [invoice, _] = await Invoice.closeInvoice(invoice_no);
                    let cash = new Cash(invoice_no, paid_amount)
                    cash = await cash.create()
                    res.status(201).json({message: "credit created", status: 1, cash, invoice});
                } else {
                    let cash = new Cash(invoice_no, paid_amount)
                    cash = await cash.create()
                    res.status(201).json({message: "credit created", status: 1, cash});
                }

            } else {
                if (status === 0) {
                    const [invoice, _] = await Invoice.closeInvoice(invoice_no);
                    let cheque = new Cheque(invoice_no, cheque_amount, deposit_date, expire_date, cheque_no)
                    cheque = await cheque.create()
                    res.status(201).json({message: "credit created", status: 1, cheque});
                } else {
                    let cheque = new Cheque(invoice_no, cheque_amount, deposit_date, expire_date, cheque_no)
                    cheque = await cheque.create()
                    res.status(201).json({message: "credit created", status: 1, cheque});
                }
            }
        }
    } catch (error) {
        // next(error);
        res.status(500).json({
            message: "Something went wrong",
            error: error
        });
    }
};
exports.getByInvoiceNo = async (req, res, next) => {
    try {
        let invoiceNo = req.params.id;
        const [invoice, _k] = await Invoice.findInvoice(invoiceNo);
        const [credit, _] = await Invoice.findcredits(invoiceNo);
        res.status(200).json({
            credit: credit,
            invoice: invoice
        });
        // res.status(200).json({invoice: invoice});
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error: error
        });
    }
}