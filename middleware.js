const pConnection = require("./mysql/connection");
const queriesLogin = require("./mysql/queriesLogin");

module.exports = {
  validateToken: async (req, res, next) => {
    console.log("validation request");
    if (!req.headers.token) {
      console.log("no token");
      res.send({ status: 0, error: "No token sent." });
      return;
    }
    console.log("token");

    const results = await pConnection(
      queriesLogin.checkUserToken(req.headers.token)
    );
    if (results.length) {
      req.userId = results[0].userId;
      next();
    } else {
      res.send({ status: 0, error: "Sorry, wrong token." });
    }
  },
};
