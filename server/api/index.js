// THey put this top part in something app for grace shopper

//as this get's bigger you can seperate things out more
const express = require("express");
const { static } = express;
const path = require("path");

const {
	models: { User },
} = require("../db");

const app = express();
module.exports = app;

app.use(express.json());

app.use("/dist", static(path.join(__dirname, "..", "..", "dist")));
// static file-serving middleware
app.use(express.static(path.join(__dirname, "..", "..", "public")));

// is this supposed to be here??
app.get("/", (req, res, next) =>
	res.sendFile(path.join(__dirname, "..", "..", "public/index.html"))
);

app.use("/api", require("./routes"));

//final error catcher
app.use((err, req, res, next) => {
	res.status(500).send({ error: err });
});
