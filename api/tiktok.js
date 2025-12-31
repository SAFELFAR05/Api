export default async function handler(req, res) {
  try {
    const platform = req.query.platform
    const q = req.query.q

    if (!platform || !q) {
      return res.status(400).json({
        success: false,
        message: "missing platform or q"
      })
    }

    const ALLOWED = [
      "bstation","fdroid","getmodsapk","tokopedia","lirik","livewallpaper",
      "pinterest","playstore","resep","sfile","spotify","soundcloud",
      "tiktok","whatmusic","xvideos","xnxx","youtube"
    ]

    const p = platform.toLowerCase()
    if (!ALLOWED.includes(p)) {
      return res.status(404).json({
        success: false,
        message: "platform not supported"
      })
    }

    const FERDEV_KEY = "key-elfs"
    const url = `https://api.ferdev.my.id/search/${p}?query=${encodeURIComponent(q)}&apikey=${FERDEV_KEY}`

    const r = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0", "Accept": "application/json" } })
    const text = await r.text()
    if (!r.ok) return res.status(502).json({ success: false, message: "Upstream API error", status: r.status, raw: text.slice(0,200) })

    let data
    try { data = JSON.parse(text) } catch { return res.status(502).json({ success: false, message: "Invalid JSON from upstream", raw: text.slice(0,200) }) }

    const results = Array.isArray(data.result) ? data.result : []
    return res.status(200).json({ success: true, author: "ELFAR API", platform: p, query: q, total: results.length, results })

  } catch (err) {
    return res.status(500).json({ success: false, author: "ELFAR API", message: "Server error", error: err.message })
  }
}
