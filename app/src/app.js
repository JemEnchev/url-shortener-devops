const express = require("express");
const { query } = require("./db");
const { generateCode } = require("./code");

const app = express();
app.use(express.json());

app.get("/", (req, res) => res.status(200).send("URL Shortener API"));
app.get("/health", (req, res) => res.status(200).json({ status: "ok" }));
app.get("/ready", (req, res) => res.status(200).json({ status: "ready" }));

function isValidHttpUrl(value) {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

// Stats (ВАЖНО: преди /:code)
app.get("/stats/:code", async (req, res) => {
  const { code } = req.params;

  const result = await query(
    "SELECT code, original_url, clicks, created_at, expires_at FROM links WHERE code = $1",
    [code]
  );

  if (result.rowCount === 0) return res.status(404).json({ error: "Not found" });

  return res.status(200).json(result.rows[0]);
});

// Create short URL
app.post("/shorten", async (req, res) => {
  const { url } = req.body || {};
  if (!url || typeof url !== "string" || !isValidHttpUrl(url)) {
    return res.status(400).json({ error: "Invalid url" });
  }

  for (let i = 0; i < 5; i++) {
    const code = generateCode(7);
    try {
      await query("INSERT INTO links(code, original_url) VALUES($1, $2)", [code, url]);

      const baseUrl =
        process.env.BASE_URL || `http://localhost:${process.env.PORT || 8080}`;

      return res.status(201).json({ code, shortUrl: `${baseUrl}/${code}` });
    } catch (err) {
      if (err && err.code === "23505") continue;
      console.error(err);
      return res.status(500).json({ error: "Internal error" });
    }
  }

  return res.status(503).json({ error: "Could not generate unique code" });
});

// Redirect (след stats!)
app.get("/:code", async (req, res) => {
  const { code } = req.params;

  const result = await query("SELECT original_url FROM links WHERE code = $1", [code]);
  if (result.rowCount === 0) return res.status(404).json({ error: "Not found" });

  query("UPDATE links SET clicks = clicks + 1 WHERE code = $1", [code]).catch(() => {});
  return res.redirect(302, result.rows[0].original_url);
});

module.exports = app;
