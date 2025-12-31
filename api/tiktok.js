export default async function handler(req, res) {
  const platform = req.query.platform
  const q = req.query.q

  if (!q) {
    return res.status(400).send(JSON.stringify({
      success: false,
      message: "missing ?q="
    }, null, 2))
  }

  const PLATFORMS = [
    "bstation",
    "fdroid",
    "getmodsapk",
    "tokopedia",
    "lirik",
    "livewallpaper",
    "pinterest",
    "playstore",
    "resep",
    "sfile",
    "spotify",
    "soundcloud",
    "tiktok",
    "whatmusic",
    "xvideos",
    "xnxx",
    "youtube"
  ]

  const p = platform.toLowerCase()

  if (!PLATFORMS.includes(p)) {
    return res.status(404).send(JSON.stringify({
      success: false,
      message: "platform not supported"
    }, null, 2))
  }

  // 🔑 APIKEY FERDEV (AMAN)
  const FERDEV_KEY = "key-elfs"

  const api =
    `https://api.ferdev.my.id/search/${p}` +
    `?query=${encodeURIComponent(q)}` +
    `&apikey=${FERDEV_KEY}`

  try {
    const r = await fetch(api, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Accept": "application/json"
      }
    })

    const raw = await r.json()
    const results = Array.isArray(raw.result) ? raw.result : []

    const response = {
      success: true,
      author: "ELFAR API",
      platform: p,
      query: q,
      total: results.length,
      results
    }

    res
      .status(200)
      .setHeader("Content-Type", "application/json")
      .send(JSON.stringify(response, null, 2))

  } catch (e) {
    res.status(500).send(JSON.stringify({
      success: false,
      error: e.message
    }, null, 2))
  }
}
