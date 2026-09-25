const express = require("express");
const fetch = require("node-fetch");
const path = require("path");

const app = express();
const PORT = 3000;

// Serve all frontend files from /public
app.use(express.static(path.join(__dirname, "../public")));

// Proxy endpoint
app.get("/proxy", async (req, res) => {
  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.status(400).send("Missing ?url=");
  }

  try {
    const response = await fetch(targetUrl);
    if (!response.ok) {
      return res.status(response.status).send("Failed to fetch: " + response.statusText);
    }
    const text = await response.text();
    res.send(text);
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).send("Proxy failed: " + err.message);
  }
});

// ✅ Default fallback (Express v5 safe)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../public/search.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
