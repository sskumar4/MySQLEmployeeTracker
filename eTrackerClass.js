const mysql = require("mysql");
class Database {
    constructor(config) {
            this.connection = mysql.createConnection(config);
        }
        // new Promise((_, reject) => reject(new Error('woops'))).
        //     // Prints "caught woops"
        // catch(error => { console.log('caught', error.message); });
    query(sql, args) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, args, (err, rows) => {
                if (err) {
                    console.log(err.sql);
                    console.log("");
                    return reject(err);
                }
                resolve(rows);
            });
        }).catch(error => {
            console.log('Query exception occured');
        });
    };
    close() {
        return new Promise((resolve, reject) => {
            this.connection.end(err => {
                if (err)
                    return reject(err);
                resolve();
            });
        });
    }
}

module.exports = Database;