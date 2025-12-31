export default async function handler(req, res) {
  const q = req.query.q
  if (!q) {
    return res
      .status(400)
      .send(JSON.stringify({ success: false }, null, 2))
  }

  const FERDEV_KEY = "key-elfs"

  const api =
    "https://api.ferdev.my.id/search/tiktok" +
    "?query=" + encodeURIComponent(q) +
    "&apikey=" + FERDEV_KEY

  const r = await fetch(api)
  const raw = await r.json()

  const results = Array.isArray(raw.result) ? raw.result : []

  const response = {
    success: true,
    author: "ELFAR API",
    platform: "tiktok",
    query: q,
    total: results.length,
    results
  }

  res
    .status(200)
    .setHeader("Content-Type", "application/json")
    .send(JSON.stringify(response, null, 2))
}
