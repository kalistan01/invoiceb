const db = require("../config/db");


class Cash {
    constructor(invoice_no, amount) {
        this.invoice_no = invoice_no;
        this.amount = amount;
    }

    create() {
        let sql = `INSERT INTO credit(
            invoice_no, amount
)
                VALUES(
                '${this.invoice_no}',
                '${this.amount}'
                )`;
        return db.execute(sql);
    }
    static findInvoice(invoiceNo) {
        let sql = `SELECT * FROM credit 
                    WHERE invoice_no = ${invoiceNo}`;
        return db.execute(sql);
    }
}
module.exports = Cash