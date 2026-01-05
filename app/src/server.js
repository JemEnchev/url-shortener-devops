const express = require("express");

const app = express();
app.use(express.json());

app.get("/health", (req, res) => res.status(200).json({ status: "ok" }));
app.get("/ready", (req, res) => res.status(200).json({ status: "ready" }));

app.get("/", (req, res) => res.status(200).send("URL Shortener API"));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

module.exports = app;
