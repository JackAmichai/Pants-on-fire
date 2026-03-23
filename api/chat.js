// ============================================================================
// PANTS ON FIRE 🔥 — Vercel Serverless API
// Calls NVIDIA Nemotron via OpenAI-compatible endpoint
// Fetches live internet data for real-time context
// ============================================================================

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, database } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;
  const API_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
  
  // Fallback chain — try models in order until one works
  const MODELS = [
    "nvidia/llama-3.3-nemotron-super-49b-v1",
    "meta/llama-3.3-70b-instruct",
    "nvidia/nemotron-mini-4b-instruct",
    "meta/llama-3.1-70b-instruct",
  ];

  // ── Step 1: Fetch live internet data ─────────────────────────────────────
  let liveContext = "";
  try {
    const searchResults = await fetchLiveData(message);
    if (searchResults) {
      liveContext = searchResults;
    }
  } catch (err) {
    console.error("Live search error (non-fatal):", err.message);
    liveContext = "[Live search unavailable — relying on database only]";
  }

  // ── Step 2: Build system prompt with database + live data ────────────────
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
  const dayOfWeek = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  const systemPrompt = buildSystemPrompt(database, liveContext, today, dayOfWeek);

  // ── Step 3: Call NVIDIA API with fallback models ─────────────────────────
  let lastError = null;
  
  for (const model of MODELS) {
    try {
      console.log(`Trying model: ${model}`);
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${NVIDIA_API_KEY}`,
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message }
          ],
          temperature: 0.3,
          max_tokens: 2048,
          top_p: 0.9,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error(`Model ${model} failed:`, response.status, errorData);
        lastError = { status: response.status, details: errorData, model };
        continue; // Try next model
      }

      const data = await response.json();
      const assistantMessage = data.choices?.[0]?.message?.content;

      if (!assistantMessage) {
        lastError = { status: 500, details: 'No response content', model };
        continue;
      }

      console.log(`Success with model: ${model}`);
      return res.status(200).json({ response: assistantMessage, model });

    } catch (err) {
      console.error(`Model ${model} error:`, err.message);
      lastError = { status: 500, details: err.message, model };
      continue;
    }
  }

  // All models failed
  return res.status(lastError?.status || 500).json({
    error: `All models failed. Last error from ${lastError?.model}: ${lastError?.details}`,
  });
}

// ============================================================================
// LIVE DATA FETCHING — Multiple sources, no API keys required
// ============================================================================

async function fetchLiveData(userQuery) {
  // Extract relevant search terms
  const searchTerms = extractSearchTerms(userQuery);
  
  // Run multiple searches in parallel
  const [newsResults, iranResults, trumpIranResults] = await Promise.allSettled([
    fetchGoogleNewsRSS(searchTerms.primary),
    fetchGoogleNewsRSS("Iran conflict war 2026"),
    fetchGoogleNewsRSS("Trump Iran war statement"),
  ]);

  let context = "";

  // Combine all successful results
  const allResults = [];
  for (const result of [newsResults, iranResults, trumpIranResults]) {
    if (result.status === "fulfilled" && result.value) {
      allResults.push(...result.value);
    }
  }

  // Deduplicate by title
  const seen = new Set();
  const unique = allResults.filter(item => {
    const key = item.title.toLowerCase().substring(0, 50);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  if (unique.length > 0) {
    context += `\n\n## LIVE NEWS FROM THE INTERNET (fetched right now)\n`;
    context += `These are real, current headlines and snippets. Use them to enrich your response with up-to-date context.\n`;
    context += `You MAY reference these news items, but always clearly distinguish between:\n`;
    context += `- Direct quotes from YOUR DATABASE (use exact quotes)\n`;
    context += `- Live news context (cite as "According to recent reports..." or "Recent news coverage indicates...")\n\n`;

    unique.slice(0, 15).forEach((item, i) => {
      context += `${i + 1}. [${item.source || 'News'}] "${item.title}"`;
      if (item.date) context += ` (${item.date})`;
      if (item.snippet) context += ` — ${item.snippet}`;
      if (item.link) context += ` [Link: ${item.link}]`;
      context += `\n`;
    });
  }

  // Also try to fetch Trump's recent statements from additional sources
  const [trumpStatements] = await Promise.allSettled([
    fetchGoogleNewsRSS("Trump statement quote Iran today"),
  ]);

  if (trumpStatements.status === "fulfilled" && trumpStatements.value?.length > 0) {
    context += `\n\n## ADDITIONAL RECENT TRUMP STATEMENTS (from live search)\n`;
    const stmts = trumpStatements.value.filter(item => {
      const key = item.title.toLowerCase().substring(0, 50);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    stmts.slice(0, 8).forEach((item, i) => {
      context += `${i + 1}. "${item.title}" (${item.date || 'Recent'})`;
      if (item.snippet) context += ` — ${item.snippet}`;
      if (item.link) context += ` [Link: ${item.link}]`;
      context += `\n`;
    });
  }

  return context;
}

function extractSearchTerms(query) {
  const lower = query.toLowerCase();
  
  // Detect politician
  let politician = "Trump";
  if (lower.includes("rubio")) politician = "Rubio";
  if (lower.includes("hegseth")) politician = "Hegseth";
  if (lower.includes("graham")) politician = "Graham";
  if (lower.includes("biden")) politician = "Biden";

  // Detect topics
  const topics = [];
  if (/soon|end|stop|quick|over|withdraw|long/.test(lower)) topics.push("end war");
  if (/win|victory|defeat/.test(lower)) topics.push("victory");
  if (/cost|money|oil|economy|price/.test(lower)) topics.push("war cost");
  if (/casualt|troops|soldiers|killed|died/.test(lower)) topics.push("casualties");
  if (/escalat|surge|expand|nuclear/.test(lower)) topics.push("escalation");
  
  const topicStr = topics.length > 0 ? topics.join(" ") : "war update";
  
  return {
    primary: `${politician} Iran ${topicStr} 2026`,
  };
}

async function fetchGoogleNewsRSS(query) {
  const encoded = encodeURIComponent(query);
  const url = `https://news.google.com/rss/search?q=${encoded}&hl=en-US&gl=US&ceid=US:en`;
  
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; PantsOnFire/1.0)',
    },
    signal: AbortSignal.timeout(5000),
  });

  if (!response.ok) return [];

  const xml = await response.text();
  return parseRSSItems(xml);
}

function parseRSSItems(xml) {
  const items = [];
  // Simple XML parsing for RSS <item> elements
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match;

  while ((match = itemRegex.exec(xml)) !== null && items.length < 10) {
    const itemXml = match[1];

    const title = extractTag(itemXml, 'title');
    const link = extractTag(itemXml, 'link');
    const pubDate = extractTag(itemXml, 'pubDate');
    const source = extractTag(itemXml, 'source');
    const description = extractTag(itemXml, 'description');

    // Clean HTML from description
    const snippet = description
      ? description.replace(/<[^>]+>/g, '').substring(0, 200)
      : '';

    if (title) {
      items.push({
        title: decodeHTMLEntities(title),
        link: link || '',
        date: pubDate ? formatDate(pubDate) : '',
        source: source ? decodeHTMLEntities(source) : '',
        snippet: snippet ? decodeHTMLEntities(snippet) : '',
      });
    }
  }

  return items;
}

function extractTag(xml, tag) {
  // Handle CDATA sections
  const cdataRegex = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>`, 'i');
  const cdataMatch = xml.match(cdataRegex);
  if (cdataMatch) return cdataMatch[1].trim();

  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i');
  const match = xml.match(regex);
  return match ? match[1].trim() : '';
}

function decodeHTMLEntities(str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
}

function formatDate(dateStr) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

// ============================================================================
// SYSTEM PROMPT BUILDER
// ============================================================================

function buildSystemPrompt(database, liveContext, today, dayOfWeek) {
  const { currentQuotes, historicalQuotes, timingAnalysis } = database || {};
  
  let quotesContext = "";

  if (currentQuotes && currentQuotes.length > 0) {
    quotesContext += "\n\n## YOUR DATABASE — CURRENT IRAN CONFLICT QUOTES (2026)\n";
    quotesContext += "These are verified quotes from your database. Use these as your PRIMARY source for direct quotes.\n\n";
    currentQuotes.forEach((q, i) => {
      quotesContext += `${i + 1}. "${q.quote}" — ${q.politician}, ${q.date} (${q.dayOfWeek}) [Topic: ${q.topic}] [Context: ${q.context}]${q.source ? ` [Source: ${q.source}]` : ''}\n`;
    });
  }

  if (historicalQuotes && historicalQuotes.length > 0) {
    quotesContext += "\n\n## YOUR DATABASE — HISTORICAL IRAQ WAR QUOTES (2002–2011)\n";
    quotesContext += "These are verified historical quotes. Use these as your PRIMARY source for historical comparisons.\n\n";
    historicalQuotes.forEach((q, i) => {
      quotesContext += `${i + 1}. "${q.quote}" — ${q.politician}, ${q.date} [Topic: ${q.topic}] [Reality: ${q.reality}]${q.source ? ` [Source: ${q.source}]` : ''}\n`;
    });
  }

  if (timingAnalysis) {
    quotesContext += `\n\n## TIMING PATTERN DATA\n`;
    quotesContext += `Monday Optimism Rate: ${timingAnalysis.mondayOptimismRate}% (${timingAnalysis.mondayOptimistic} of ${timingAnalysis.mondayQuotes} Monday statements were optimistic/market-friendly)\n`;
    quotesContext += `Weekend Sobriety Rate: ${timingAnalysis.weekendSoberRate}% (${timingAnalysis.weekendSober} of ${timingAnalysis.weekendQuotes} Friday-Sunday statements contained sobering language)\n`;
    quotesContext += `PATTERN: Trump releases good news on Mondays before market open and bad news on Friday evenings/weekends when markets are closed.\n`;
  }

  // Add live context
  if (liveContext) {
    quotesContext += liveContext;
  }

  return `# SYSTEM ROLE AND DIRECTIVE
You are "Pants on Fire," a highly specialized, analytical AI designed strictly to analyze political statements regarding the current Iran conflict and compare them to historical rhetoric from the US-Iraq War.

You do not engage in general conversation. You do not answer questions outside the scope of Middle Eastern conflicts, US foreign policy rhetoric, and war timelines. Your primary goal is to provide blunt, data-backed historical context to modern political claims about war durations.

**TODAY'S DATE: ${today} (${dayOfWeek})**

# DATA SOURCES
You have TWO types of data:
1. **YOUR VERIFIED DATABASE** — Direct quotes that are pre-verified. Use these as the PRIMARY source for quoting politicians.
2. **LIVE INTERNET DATA** — Recent news headlines and context fetched in real-time. Use these to enrich your analysis with current events, but clearly label them as "recent reports" — do NOT present news headlines as direct quotes unless they contain actual quoted speech.

# THE LOGIC ENGINE
When evaluating a claim that a conflict will "end soon" or be "easy":
1. Check your database for recent quotes by the mentioned politician regarding the current conflict.
2. Check the live internet data for additional recent context, developments, and statements.
3. Check your historical database for similar quotes made by politicians (e.g., George W. Bush, Dick Cheney, Donald Rumsfeld) between 2002 and 2004 regarding the Iraq War.
4. Calculate a "Confidence Score" regarding the likelihood of the modern statement being true. Because historical precedent shows that early predictions of swift victories in the Middle East are overwhelmingly false, your confidence score for "quick end" claims should generally be low (e.g., 5% - 35%), inversely proportional to the historical failure rate.

# TIMING PATTERN ANALYSIS
IMPORTANT: Today is **${dayOfWeek}**. Trump tends to release optimistic, market-friendly news on MONDAYS (before market open), and releases hard truths / bad news on FRIDAY EVENINGS and WEEKENDS when markets are closed. ALWAYS mention this pattern in your response, noting that today is ${dayOfWeek} and how that affects the credibility of any claims made today.

# OUTPUT FORMATTING RULES
You MUST format your response in MARKDOWN exactly in this order. Do not deviate. This format is MANDATORY.

1. **DIRECT ANSWER**: Answer the user's question in 1 to 3 words. Bold it. (e.g., **Probably not.**)
2. **CONFIDENCE LEVEL**: State the confidence score clearly (e.g., **Confidence Level: 15%**)
3. **TIMING ALERT**: Mention the Monday Optimism / Weekend Truth pattern. Note that today is ${dayOfWeek} and how that affects credibility. Format as a blockquote starting with ⚠️ or 📉.
4. **LIVE CONTEXT** (if available): Briefly summarize relevant recent developments from the live news data. Label clearly as "According to recent reports..." with source attribution where possible.
5. **RECENT CONTEXT**: Provide the exact recent quotes from the figure mentioned FROM YOUR DATABASE. Format as:
   - "Politician Name stated [X] times in the past [Timeframe]:"
   - > "Quote 1" (Date — Day of Week)
   - > "Quote 2" (Date — Day of Week)
   For each quote, add a 📈 emoji if it was on a Monday, or 📉 if Friday/Weekend.
6. **THE ECHO TABLE** (Historical Comparison): Generate a Markdown table comparing the current quotes to historical Iraq War quotes.
   Format: | The Claim (Current — 2026) | The Echo (Iraq War) | Historical Reality |
   Include source links where available.

# GUARDRAILS
- For DIRECT QUOTES: Use ONLY quotes from your verified database. NEVER fabricate quotes.
- For NEWS CONTEXT: You may reference live news data, but always attribute it (e.g., "According to [Source]...").
- If you cannot find a direct quote in your database, say "No direct quotes found matching this claim in our database."
- Maintain an objective, journalistic, and slightly clinical tone.
- Do not express personal opinions on the politicians; let the juxtaposition of their quotes and historical reality speak for itself.
- If asked about something outside your scope (not related to Iran conflict / Iraq War / political rhetoric about war), respond with: "This is outside my scope. I only analyze political rhetoric about the Iran conflict and Iraq War."
${quotesContext}`;
}
