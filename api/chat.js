// ============================================================================
// PANTS ON FIRE 🔥 — Vercel Serverless API (Optimized for Speed)
// ============================================================================

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { message, database } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required' });

  const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;
  const API_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
  const MODELS = [
    "meta/llama-3.3-70b-instruct",
    "nvidia/llama-3.3-nemotron-super-49b-v1",
  ];

  // ── Step 1: Fetch live news (parallel, strict 3s timeout) ────────────────
  let liveContext = "";
  try {
    liveContext = await fetchLiveData(message);
  } catch (err) {
    console.error("Live search error:", err.message);
  }

  // ── Step 2: Build COMPACT system prompt ──────────────────────────────────
  const dayOfWeek = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const systemPrompt = buildCompactPrompt(database, liveContext, today, dayOfWeek);

  // ── Step 3: Call LLM with fast fallback ──────────────────────────────────
  for (const model of MODELS) {
    try {
      const ctrl = new AbortController();
      const timeout = setTimeout(() => ctrl.abort(), 25000); // 25s max per model

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${NVIDIA_API_KEY}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message }
          ],
          temperature: 0.3,
          max_tokens: 1200,
          top_p: 0.9,
        }),
        signal: ctrl.signal,
      });
      clearTimeout(timeout);

      if (!response.ok) {
        console.error(`${model}: ${response.status}`);
        continue;
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      if (content) return res.status(200).json({ response: content, model });
    } catch (err) {
      console.error(`${model}: ${err.message}`);
      continue;
    }
  }

  return res.status(500).json({ error: 'All models failed. Please try again.' });
}

// ============================================================================
// LIVE DATA — Single parallel batch, 3s timeout, max 8 results
// ============================================================================

async function fetchLiveData(query) {
  const terms = extractSearchTerms(query);
  
  const results = await Promise.allSettled([
    fetchRSS(terms.primary),
    fetchRSS("Trump Iran war latest"),
  ]);

  const all = [];
  const seen = new Set();
  for (const r of results) {
    if (r.status === "fulfilled" && r.value) all.push(...r.value);
  }

  const unique = all.filter(item => {
    const k = item.title.toLowerCase().slice(0, 40);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  }).slice(0, 8);

  if (unique.length === 0) return "";

  let ctx = "\n\n## LIVE NEWS (just fetched)\n";
  unique.forEach((item, i) => {
    ctx += `${i + 1}. "${item.title}" — ${item.source || 'News'}, ${item.date || 'Recent'}\n`;
  });
  return ctx;
}

function extractSearchTerms(query) {
  const l = query.toLowerCase();
  let pol = "Trump";
  if (l.includes("rubio")) pol = "Rubio";
  if (l.includes("hegseth")) pol = "Hegseth";
  if (l.includes("graham")) pol = "Graham";
  let topic = "Iran war";
  if (/soon|end|stop|quick|over/.test(l)) topic = "Iran end war";
  if (/cost|money|oil|price/.test(l)) topic = "Iran war cost";
  if (/casualt|troops|killed/.test(l)) topic = "Iran casualties";
  return { primary: `${pol} ${topic} 2026` };
}

async function fetchRSS(query) {
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`;
  const response = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible)' },
    signal: AbortSignal.timeout(3000), // 3 second hard limit
  });
  if (!response.ok) return [];
  const xml = await response.text();
  return parseRSS(xml);
}

function parseRSS(xml) {
  const items = [];
  const re = /<item>([\s\S]*?)<\/item>/gi;
  let m;
  while ((m = re.exec(xml)) !== null && items.length < 5) {
    const x = m[1];
    const title = tag(x, 'title');
    const source = tag(x, 'source');
    const pubDate = tag(x, 'pubDate');
    if (title) {
      items.push({
        title: dec(title),
        source: source ? dec(source) : '',
        date: pubDate ? fmtDate(pubDate) : '',
      });
    }
  }
  return items;
}

function tag(xml, t) {
  const cd = xml.match(new RegExp(`<${t}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${t}>`, 'i'));
  if (cd) return cd[1].trim();
  const m = xml.match(new RegExp(`<${t}[^>]*>([\\s\\S]*?)</${t}>`, 'i'));
  return m ? m[1].trim() : '';
}

function dec(s) {
  return s.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'");
}

function fmtDate(s) {
  try { return new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); } catch { return s; }
}

// ============================================================================
// COMPACT SYSTEM PROMPT — ~60% smaller than before
// ============================================================================

function buildCompactPrompt(database, liveContext, today, dayOfWeek) {
  const { currentQuotes, historicalQuotes, timingAnalysis } = database || {};
  
  // Only send the 8 most relevant current quotes and 8 historical
  const curQuotes = (currentQuotes || []).slice(0, 12);
  const histQuotes = (historicalQuotes || []).slice(0, 10);

  let db = "";
  if (curQuotes.length > 0) {
    db += "\n## CURRENT QUOTES (2026 Iran Conflict)\n";
    curQuotes.forEach((q, i) => {
      db += `${i+1}. "${q.quote}" — ${q.politician}, ${q.date} (${q.dayOfWeek}) [${q.topic}]\n`;
    });
  }
  if (histQuotes.length > 0) {
    db += "\n## HISTORICAL QUOTES (Iraq War 2002-2011)\n";
    histQuotes.forEach((q, i) => {
      db += `${i+1}. "${q.quote}" — ${q.politician}, ${q.date} [${q.topic}] Reality: ${q.reality}\n`;
    });
  }
  if (timingAnalysis) {
    db += `\nTIMING: ${timingAnalysis.mondayOptimismRate}% of Monday quotes are optimistic. ${timingAnalysis.weekendSoberRate}% of weekend quotes are sobering. Trump gives good news Mon pre-market, bad news Fri-Sun.\n`;
  }
  if (liveContext) db += liveContext;

  return `You are "Pants on Fire" — a specialized AI analyzing war rhetoric. Today: ${today} (${dayOfWeek}).

RULES:
- Compare current Iran conflict claims to Iraq War history
- Confidence for "quick war" claims: 5-35% (historically ~95% wrong)
- Today is ${dayOfWeek} — note the Monday-optimism/weekend-truth timing pattern
- Use ONLY database quotes. Never fabricate.
- Keep response concise but complete.

FORMAT (MANDATORY, in this exact order):
1. **[1-3 word answer]** (e.g. **Probably not.**)
2. **Confidence Level: [X]%**
3. > ⚠️ Timing Alert: [Monday/Weekend pattern note for today]
4. Recent quotes from database (use > blockquotes, add 📈 for Monday, 📉 for weekend)
5. Historical comparison table:
| Current Claim (2026) | Iraq War Echo | Reality |
| --- | --- | --- |
| quote | quote | what happened |

If off-topic: "Outside my scope. I only analyze Iran conflict and Iraq War rhetoric."
${db}`;
}
