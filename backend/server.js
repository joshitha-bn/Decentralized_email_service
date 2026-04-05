const express = require("express")
const cors = require("cors")
const http = require("http")
const Gun = require("gun")

const app = express()

/* CORS for Next.js frontend */

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  })
)

/* Gun static files */

app.use(Gun.serve)

/* Status page */

app.get("/", (req, res) => {
  res.send(`
    <html>
      <body style="background:#0a0a0a; color:#d4a017; font-family:monospace; padding:40px;">
        <h1>🔫 SecureMail GunDB Relay</h1>
        <p style="color:#f5f0e8">Status: <span style="color:#4caf6e">● Running</span></p>
        <p style="color:#f5f0e8">Peer URL: <code style="color:#f9e07a">http://localhost:8765/gun</code></p>
      </body>
    </html>
  `)
})

/* Create HTTP server */

const server = http.createServer(app)

/* Initialize Gun */

const gun = Gun({
  web: server,
  file: "data",      // local persistence
  radisk: true,
})

/* Optional logging */

gun.on("hi", peer => {
  console.log("🌐 Peer connected:", peer.url || "unknown")
})

gun.on("bye", peer => {
  console.log("❌ Peer disconnected:", peer.url || "unknown")
})

/* Start server */

const PORT = 8765

server.listen(PORT, () => {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
  console.log("🔫  SecureMail GunDB Relay Server")
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
  console.log(`✅  Running at http://localhost:${PORT}`)
  console.log(`🔗  Gun peer: http://localhost:${PORT}/gun`)
  console.log(`💾  Data persisted to ./data/`)
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
})