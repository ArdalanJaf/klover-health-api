module.exports = {
  checkUserAndPassword: function (username, password) {
    return `SELECT count(*) AS count, id AS userId FROM admin_login 
                WHERE username = "${username}" 
                  AND password = "${password}";`;
  },
  setToken: function (userId, token) {
    return `INSERT INTO token (user_id, token) VALUES ("${userId}", "${token}");`;
  },
  checkUserToken: function (token) {
    return `SELECT user_id AS userId FROM token WHERE token = "${token}";`;
  },
  deleteToken: function (token) {
    return `
      DELETE
          FROM
                tokens
          WHERE
                token = "${token}"`;
  },
};
