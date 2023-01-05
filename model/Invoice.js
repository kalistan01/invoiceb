const db = require('../config/db')

class Invoice {
    constructor(invoice_no, amount, shop_id, payment_method) {
        this.invoice_no = invoice_no;
        this.amount = amount;
        this.shop_id = shop_id;
        this.payment_method = payment_method;
    }

    create() {
        let sql = `INSERT INTO invoice(
            invoice_no, amount, shop_id, payment_method
    )
                VALUES(
                '${this.invoice_no}',
                '${this.amount}',
                '${this.shop_id}',
                '${this.payment_method}'
                )`;
        return db.execute(sql);
    }

    static invoices(){
        let sql = `SELECT COUNT(id) as invoices FROM invoice WHERE status = 1`;
        return db.execute(sql);
    }
    static findInvoice(invoiceNo) {
        let sql = `SELECT s.shop_name as shop_name,
                       i.invoice_no as invoice_no,
                       i.status as status,
                      r.route_name as route_name,
                       i.add_date as add_date,
                       i.amount as credit_amount,
                       (SELECT COALESCE(SUM(cr.amount),0) FROM credit as cr WHERE cr.invoice_no = i.invoice_no ) as cash_paid,
                       (SELECT COALESCE(SUM(ch.amount),0) FROM cheque as ch WHERE ch.invoice_no = i.invoice_no ) as cheque_paid,
                       ((SELECT COALESCE(SUM(cr.amount),0) FROM credit as cr WHERE cr.invoice_no = i.invoice_no ) 
                       + (SELECT COALESCE(SUM(ch.amount),0) FROM cheque as ch WHERE ch.invoice_no = i.invoice_no )) as Total_paid,
                       (i.amount - 
                       ((SELECT COALESCE(SUM(cr.amount),0) FROM credit as cr WHERE cr.invoice_no = i.invoice_no ) 
                       + (SELECT COALESCE(SUM(ch.amount),0) FROM cheque as ch WHERE ch.invoice_no = i.invoice_no ))) as Total_pending
                       FROM invoice as i
                      INNER JOIN shop as s ON 
                      i.shop_id = s.id
                      INNER JOIN route as r ON
                      r.id = s.route_id
                       LEFT JOIN cheque as ch ON
                        ch.invoice_no = i.invoice_no
                        LEFT JOIN credit as cr ON
                        cr.invoice_no = i.invoice_no
                    WHERE i.invoice_no = ${invoiceNo}
                    GROUP BY i.invoice_no`;
        return db.execute(sql);
    }
    static findcredits(invoiceNo) {
        let sql = `SELECT cc.invoice_no as invoice_no,
                    cc.add_date as add_date,
                    cc.amount as amount,
                    cc.method as method,
                    i.status as status
 FROM (SELECT c.invoice_no as invoice_no,
                    c.add_date as add_date,
                    c.amount as amount,
                    'cash' as method
                    FROM credit as c
                    UNION ALL 
                    SELECT  ch.invoice_no as invoice_no,
                    ch.add_date as add_date,
                    ch.amount as amount,
                    'cheque' as method
                    FROM cheque as ch) as cc 
                    INNER JOIN invoice as i ON 
                    cc.invoice_no = i.invoice_no
                    WHERE cc.invoice_no = ${invoiceNo}
                    ORDER BY cc.add_date ASC`;

        return db.execute(sql);
    } static closeInvoice(invoiceNo) {
        let sql = `UPDATE invoice
                    SET status = 0
                    WHERE invoice_no = ${invoiceNo}`;

        return db.execute(sql);
    }
    static findshopName(shopId) {
        let sql = `SELECT i.shop_name FROM shop as i
                    WHERE i.id = ${shopId}`;
        return db.execute(sql);
    }
    static findInvoices(shopId) {
        let sql = `SELECT i.invoice_no as invoice_no,
                        i.id as id, i.amount as amount,
                        i.shop_id as shop_id,
                        COALESCE(SUM(ch.amount),0) as cheque_paid,
                        COALESCE(SUM(cr.amount),0) as cash_paid,
                        (i.amount - (COALESCE(SUM(ch.amount),0) + COALESCE(SUM(cr.amount),0)))as payable
                        FROM invoice as i
                        LEFT JOIN cheque as ch ON
                        ch.invoice_no = i.invoice_no
                        LEFT JOIN credit as cr ON
                        cr.invoice_no = i.invoice_no
                        WHERE i.shop_id = ${shopId} AND i.status = 1 
                        GROUP BY i.invoice_no
                        `;
        return db.execute(sql);

    }
}

module.exports = Invoice