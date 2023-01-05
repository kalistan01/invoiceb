const db = require("../config/db");

class Cheque {
    constructor(invoice_no, amount, deposit_date, expire_date, cheque_no) {
        this.invoice_no = invoice_no;
        this.amount = amount;
        this.deposit_date = deposit_date;
        this.expire_date = expire_date;
        this.cheque_no = cheque_no;
    }

    create() {
        let sql = `INSERT INTO cheque(
            invoice_no, amount, deposit_date, expire_date,cheque_no
)
                VALUES(
                '${this.invoice_no}',
                '${this.amount}',
                '${this.deposit_date}',
                '${this.expire_date}',
                '${this.cheque_no}'
                )`;
        return db.execute(sql);
    }
    static findInvoice(invoiceNo) {
        let sql = `SELECT * FROM cheque as ch 
                    WHERE ch.invoice_no = ${invoiceNo}`;
        return db.execute(sql);
    }
}
module.exports = Cheque