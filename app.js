const dotenv = require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
// const router = require("./routes/contact.js");
const contact = require("./routes/contact.js");
const admin = require("./routes/admin.js");
const stripe = require("./routes/stripe.js");
const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(express.static("public"));

app.get("/", (req, res) => {
  console.log("server speaking");
});

// app.use("/", router);
app.use("/contact", contact);
app.use("/admin", admin);
app.use("/stripe", stripe);

// const port = process.env.PORT || 6001;
const port = 6088;

app.listen(port, () => {
  console.log(`server is running on port: ${port}`);
});
