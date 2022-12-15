const dotenv = require("dotenv").config(); // only to use local .env file.
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
// routers
const contact = require("./routes/contact.js");
const admin = require("./routes/admin.js");
const stripe = require("./routes/stripe.js");

const app = express();
app.use(cors());
app.use(express.static("public"));

app.get("/", bodyParser.json(), (_, res) => {
  console.log("server speaking");
  res.send("it works!");
});

app.use("/contact", bodyParser.json(), contact);
app.use("/admin", bodyParser.json(), admin);
app.use("/stripe", stripe);

const PORT = process.env.PORT || 6088;

app.listen(PORT, () => {
  console.log(`server is running on port: ${PORT}`);
});
