const express = require("express");
const bodyParser = require('body-parser');
require("dotenv").config();

const app = express();
app.listen(process.env.PORT);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("view engine", "ejs");

app.use('/assets', express.static('assets'));
app.use(require("./routes/routes"));
