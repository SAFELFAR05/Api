export default async function handler(req, res) {
  // ===== CORS (FULL OPEN) =====
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Content-Type", "application/json");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const q = req.query.q;
  if (!q) {
    return res.status(400).json({
      success: false,
      author: "ELFAR API",
      message: "missing q parameter"
    });
  }

  // ===== API KEY (AMAN DI SERVER) =====
  const FERDEV_KEY = "key-elfs";

  // ===== SEMUA PLATFORM SEARCH =====
  const platforms = {
    tiktok: "tiktok",
    youtube: "youtube",
    spotify: "spotify",
    soundcloud: "soundcloud",

    bstation: "bstation",
    tokopedia: "tokopedia",
    lirik: "lirik",
    livewallpaper: "livewallpaper",
    pinterest: "pinterest",
    playstore: "playstore"
  };

  const results = {};

  await Promise.all(
    Object.entries(platforms).map(async ([name, endpoint]) => {
      try {
        const url =
          `https://api.ferdev.my.id/search/${endpoint}` +
          `?query=${encodeURIComponent(q)}&apikey=${FERDEV_KEY}`;

        const r = await fetch(url);
        const j = await r.json();

        results[name] = {
          success: true,
          total: Array.isArray(j.result) ? j.result.length : 0,
          results: j.result || []
        };
      } catch (err) {
        results[name] = {
          success: false,
          error: err.message
        };
      }
    })
  );

  return res.status(200).json({
    success: true,
    author: "ELFAR API",
    query: q,
    total_platforms: Object.keys(platforms).length,
    results
  });
}
