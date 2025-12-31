export default async function handler(req, res) {
  try {
    // ambil query
    const q = req.query.q

    // ambil platform (AMAN, anti bug Vercel)
    const platform =
      req.query.platform ||
      req.url.split("?")[0].split("/").pop()

    if (!platform || !q) {
      return res.status(400).json({
        success: false,
        message: "missing platform or q"
      })
    }

    // 🔒 whitelist platform (opsional tapi disarankan)
    const ALLOWED = [
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

    if (!ALLOWED.includes(platform)) {
      return res.status(404).json({
        success: false,
        message: "platform not supported"
      })
    }

    // 🔑 API KEY FERDEV (sementara hardcode)
    const FERDEV_KEY = "key-elfs"

    const upstreamUrl =
      `https://api.ferdev.my.id/search/${platform}` +
      `?query=${encodeURIComponent(q)}` +
      `&apikey=${FERDEV_KEY}`

    const r = await fetch(upstreamUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json"
      }
    })

    const text = await r.text()

    // ❌ upstream error (403, 5xx, dll)
    if (!r.ok) {
      return res.status(502).json({
        success: false,
        status: r.status,
        author: "ELFAR API",
        platform,
        message: "Upstream API error",
        raw: text.slice(0, 200)
      })
    }

    // ❌ bukan JSON
    let data
    try {
      data = JSON.parse(text)
    } catch {
      return res.status(502).json({
        success: false,
        author: "ELFAR API",
        platform,
        message: "Invalid JSON from upstream",
        raw: text.slice(0, 200)
      })
    }

    const results = Array.isArray(data.result) ? data.result : []

    // ✅ RESPONSE FINAL (BRANDING API SENDIRI)
    return res.status(200).json({
      success: true,
      author: "ELFAR API",
      platform,
      query: q,
      total: results.length,
      results
    })

  } catch (err) {
    // ❌ crash protection
    return res.status(500).json({
      success: false,
      author: "ELFAR API",
      message: "Server error",
      error: err.message
    })
  }
}
