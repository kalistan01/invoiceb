const db = require('../config/db');

class User {
    constructor(name, email, password) {
        this.name = name;
        this.email = email;
        this.password = password;
    }

    // create user
    save() {
        let sql = `
    INSERT INTO users(
        name,
        email,
        password
    )
    VALUES(
      '${this.name}',
      '${this.email}',
      '${this.password}'
    )`;
        return db.execute(sql);
    }

    //for log in
    static findPassword(email) {
        let sql = `SELECT * FROM users WHERE email = '${email}';`;
        return db.execute(sql);
    }
}

class Login {
    constructor(email) {
        this.email = email;
    }

    //for log in
    findPassword() {
        let sql = `SELECT * FROM users WHERE email = '${this.email}';`;
        return db.execute(sql);
    }
    findEmailCount() {
        let sql = `SELECT COUNT(id) as count FROM users WHERE email = '${this.email}';`;
        return db.execute(sql);
    }
}

module.exports = {
    User: User,
    Login: Login
};
