const db = require("../config/db")

class Shop {
    constructor(shop_name, route_id) {
        this.shop_name = shop_name;
        this.route_id = route_id;
    }

    create() {
        let sql = `INSERT INTO shop(shop_name,route_id)
                VALUES('${this.shop_name}','${this.route_id}')`;
        return db.execute(sql);
    }
    static shopCount(){
        let sql = `SELECT COUNT(id) as shops FROM shop WHERE status = 1`;
        return db.execute(sql);
    }
    static findShops(routeID) {

        let sql = `SELECT s.id as shop_id,
                        s.shop_name as shop_name,
                        s.route_id as route_id,
                        COALESCE(SUM(iv.amount),0) as total_credit,
                        (COALESCE(SUM(iv.cash_paid),0) +COALESCE(SUM(iv.cheque_paid),0)) as total_paid,
                        (COALESCE(SUM(iv.amount),0)-(COALESCE(SUM(iv.cash_paid),0) +COALESCE(SUM(iv.cheque_paid),0))) as total_payable
                        FROM shop as s
                        LEFT JOIN 
                        (SELECT i.invoice_no as invoice_no,
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
                        WHERE i.status = 1
                        GROUP BY i.invoice_no) as iv ON
                        iv.shop_id = s.id
                        WHERE s.route_id = ${routeID} 
                        GROUP BY s.id
                        `;
        return db.execute(sql);

    }


}

module.exports = Shop;