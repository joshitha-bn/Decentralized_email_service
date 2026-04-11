import express from "express"
import http from "http"
import Gun from "gun"
import os from "os"

const app = express()
const server = http.createServer(app)
const PORT = 8765

// ── CORS — allow all origins for local network access ──
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization")
  if (req.method === "OPTIONS") return res.sendStatus(200)
  next()
})

app.use(express.json())

// ── Health check — confirm server is running ──
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "SecureMail GunDB Relay",
    port: PORT,
    time: new Date().toISOString(),
  })
})

app.get("/health", (req, res) => {
  res.json({ status: "ok", gun: "running", port: PORT })
})

// ── Mount Gun on the HTTP server ──
const gun = Gun({
  web: server,       // attach to existing HTTP server
  file: "data",       // persist data to ./data folder
  radisk: true,
  multicast: false,        // disable multicast — use explicit peers
})

// ── Gun debug logging ──
gun.on("out", { "#": { "*": "" } })

// ── Log all local network IPs so you know which IP to use ──
const getLocalIPs = () => {
  const interfaces = os.networkInterfaces()
  const ips = []
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        ips.push(iface.address)
      }
    }
  }
  return ips
}

server.listen(PORT, "0.0.0.0", () => {
  const ips = getLocalIPs()
  console.log("\n🚀 SecureMail GunDB Relay Server")
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
  console.log(`✅ Listening on port ${PORT}`)
  console.log(`✅ Local:   http://localhost:${PORT}/gun`)
  ips.forEach((ip) => {
    console.log(`✅ Network: http://${ip}:${PORT}/gun`)
  })
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
  console.log("📌 Use the Network URL for cross-device access\n")
})