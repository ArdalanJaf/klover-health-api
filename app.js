const dotenv = require("dotenv").config(); // only to use local .env file.
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const contact = require("./routes/contact.js");
const admin = require("./routes/admin.js");
const stripe = require("./routes/stripe.js");

app.use(cors());
app.use(express.static("public"));

app.get("/", (req, res) => {
  console.log("server speaking");
});

// app.use("/", router);
app.use("/contact", bodyParser.json(), contact);
app.use("/admin", bodyParser.json(), admin);
app.use("/stripe", stripe);

const port = process.env.PORT || 6088;

app.listen(port, () => {
  console.log(`server is running on port: ${port}`);
});
