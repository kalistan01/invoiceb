const db = require("../config/db")

class Routes {
    constructor(route_name) {
        this.route_name = route_name;
    }

    create() {
        let sql = `INSERT INTO route(route_name)
                VALUES('${this.route_name}')`;
        return db.execute(sql);
    }

    static find() {
        let sql = `SELECT 
            rt.id as id,
            rt.route_name as route_name,
            COUNT(ns.shop_id) as shops,
            COALESCE(SUM(ns.total_credit),0) as total_credit,
            (COALESCE(SUM(ns.total_paid),0)) as total_paid,
            (COALESCE(COALESCE(SUM(ns.total_credit),0) - COALESCE(SUM(ns.total_paid),0),0)) as total_payable
            FROM route as rt
            LEFT JOIN (
                SELECT 
                s.id as shop_id,
                s.shop_name as shop_name,
                s.route_id as route_id,
                COALESCE(SUM(iv.amount),0) as total_credit,
                (COALESCE(SUM(iv.cash_paid),0) +COALESCE(SUM(iv.cheque_paid),0)) as total_paid,
                (COALESCE(SUM(iv.amount),0)-(COALESCE(SUM(iv.cash_paid),0) +COALESCE(SUM(iv.cheque_paid),0))) as total_payable
                FROM shop as s
                LEFT JOIN (
                    SELECT 
                    i.invoice_no as invoice_no,
                    i.id as id,
                     i.amount as amount,
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
                        GROUP BY i.invoice_no
                           ) as iv ON
                            iv.shop_id = s.id
                            GROUP BY s.id
                            ) as ns ON
                             ns.route_id = rt.id
                             WHERE rt.status=1
                             GROUP BY rt.id`;
        return db.execute(sql);
    }

    static findById(id) {
        let sql = `SELECT * FROM route WHERE status = '1' AND id = ${id}`;
        return db.execute(sql);
    }

    static delete(id) {
        let sql = `UPDATE route SET status = '0' WHERE id = ${id}`;
        return db.execute(sql);
    }
    static activate(id) {
        let sql = `UPDATE route SET status = '1' WHERE id = ${id}`;
        return db.execute(sql);
    }

    update(id) {
        let sql =
            `UPDATE route SET route_name = '${this.route_name}' WHERE id = ${id};`;
        return db.execute(sql);
    }
//    dashboard
    static routesCount(){
        let sql = `SELECT COUNT(id) as routes FROM route WHERE status = 1`;
        return db.execute(sql);
    }
}

module.exports = Routes;