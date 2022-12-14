const mysql = require("mysql");

// const connection = mysql.createConnection({
//   database: process.env.DBDATABASE,
//   user: process.env.DBUSERNAME,
//   password: process.env.DBPASSWORD,
//   host: process.env.DBHOST,
//   port: process.env.DBPORT,
// });
// connection.connect();

// RUSSEL!!!! I just noticed I had to comment out this to make pool work. Could this be an issue, since you were talking about too many mysql connections..

// pool version (to fix ECONNRESET error located in node_modules/mysql/lib/Connection)
const connection = mysql.createPool({
  connectionLimit: 10,
  database: process.env.DBDATABASE,
  user: process.env.DBUSERNAME,
  password: process.env.DBPASSWORD,
  host: process.env.DBHOST,
  port: process.env.DBPORT,
});

function pConnection(query) {
  return new Promise((resolve, reject) => {
    connection.query(query, (err, results) => {
      if (err) {
        console.log("SQL rejected request: " + err);
        reject();
      }
      resolve(results);
    });
  });
}
module.exports = pConnection;
