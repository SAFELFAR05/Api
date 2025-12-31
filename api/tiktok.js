export default async function handler(req, res) {
  const q = req.query.q

  if (!q) {
    return res.status(400).json({
      success: false,
      message: "missing ?q="
    })
  }

  // 🔑 APIKEY DISIMPAN DI SERVER (AMAN)
  const FERDEV_KEY = "key-elfs"

  const api =
    "https://api.ferdev.my.id/search/tiktok" +
    "?query=" + encodeURIComponent(q) +
    "&apikey=" + FERDEV_KEY

  try {
    const r = await fetch(api, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Accept": "application/json"
      }
    })

    const data = await r.json()

    // 🔥 FORMAT ULANG + BRANDING
    const results = Array.isArray(data.result)
      ? data.result
      : []

    return res.status(200).json({
      success: true,
      author: "ELFAR API",
      platform: "tiktok",
      query: q,
      total: results.length,
      results
    })

  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e.message
    })
  }
}
