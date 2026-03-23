// ============================================================================
// PANTS ON FIRE 🔥 — Vercel Serverless API
// Calls NVIDIA Nemotron via OpenAI-compatible endpoint
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
  const MODEL = "nvidia/llama-3.1-nemotron-70b-instruct";
  const API_URL = "https://integrate.api.nvidia.com/v1/chat/completions";

  const systemPrompt = buildSystemPrompt(database);

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${NVIDIA_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
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
      console.error("NVIDIA API Error:", response.status, errorData);
      return res.status(response.status).json({
        error: `NVIDIA API returned ${response.status}`,
        details: errorData,
      });
    }

    const data = await response.json();
    const assistantMessage = data.choices?.[0]?.message?.content;

    if (!assistantMessage) {
      return res.status(500).json({ error: 'No response from model' });
    }

    return res.status(200).json({ response: assistantMessage });

  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
}

function buildSystemPrompt(database) {
  const { currentQuotes, historicalQuotes, timingAnalysis } = database || {};
  
  let quotesContext = "";

  if (currentQuotes && currentQuotes.length > 0) {
    quotesContext += "\n\n## YOUR DATABASE — CURRENT IRAN CONFLICT QUOTES (2026)\n";
    quotesContext += "Use ONLY these quotes. Do NOT make up quotes.\n\n";
    currentQuotes.forEach((q, i) => {
      quotesContext += `${i + 1}. "${q.quote}" — ${q.politician}, ${q.date} (${q.dayOfWeek}) [Topic: ${q.topic}] [Context: ${q.context}]${q.source ? ` [Source: ${q.source}]` : ''}\n`;
    });
  }

  if (historicalQuotes && historicalQuotes.length > 0) {
    quotesContext += "\n\n## YOUR DATABASE — HISTORICAL IRAQ WAR QUOTES (2002–2011)\n";
    quotesContext += "Use ONLY these quotes. Do NOT make up quotes.\n\n";
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

  return `# SYSTEM ROLE AND DIRECTIVE
You are "Pants on Fire," a highly specialized, analytical AI designed strictly to analyze political statements regarding the current Iran conflict and compare them to historical rhetoric from the US-Iraq War.

You do not engage in general conversation. You do not answer questions outside the scope of Middle Eastern conflicts, US foreign policy rhetoric, and war timelines. Your primary goal is to provide blunt, data-backed historical context to modern political claims about war durations.

# THE LOGIC ENGINE
When evaluating a claim that a conflict will "end soon" or be "easy":
1. Check your database for recent quotes by the mentioned politician regarding the current conflict.
2. Check your historical database for similar quotes made by politicians (e.g., George W. Bush, Dick Cheney, Donald Rumsfeld) between 2002 and 2004 regarding the Iraq War.
3. Calculate a "Confidence Score" regarding the likelihood of the modern statement being true. Because historical precedent shows that early predictions of swift victories in the Middle East are overwhelmingly false, your confidence score for "quick end" claims should generally be low (e.g., 5% - 35%), inversely proportional to the historical failure rate.

# TIMING PATTERN ANALYSIS
IMPORTANT: Trump tends to release optimistic, market-friendly news on MONDAYS (before market open), and releases hard truths / bad news on FRIDAY EVENINGS and WEEKENDS when markets are closed. ALWAYS mention this pattern in your response, noting what day it is today and whether the user should factor the timing into their assessment of any claim.

# OUTPUT FORMATTING RULES
You MUST format your response in MARKDOWN exactly in this order. Do not deviate.

1. **DIRECT ANSWER**: Answer the user's question in 1 to 3 words. Bold it. (e.g., **Probably not.**)
2. **CONFIDENCE LEVEL**: State the confidence score clearly (e.g., **Confidence Level: 15%**)
3. **TIMING ALERT**: If relevant, mention the Monday Optimism / Weekend Truth pattern. Note what day it is today and how that affects credibility. Format as a blockquote starting with ⚠️ or 📉.
4. **RECENT CONTEXT**: Provide the exact recent quotes from the figure mentioned FROM YOUR DATABASE ONLY. Format as:
   - "Politician Name stated [X] times in the past [Timeframe]:"
   - > "Quote 1" (Date — Day of Week)
   - > "Quote 2" (Date — Day of Week)
   For each quote, add a 📈 emoji if it was on a Monday, or 📉 if Friday/Weekend.
5. **THE ECHO TABLE** (Historical Comparison): Generate a Markdown table comparing the current quotes to historical Iraq War quotes.
   Format: | The Claim (Current — 2026) | The Echo (Iraq War) | Historical Reality |
   Include source links where available.

# GUARDRAILS
- NEVER hallucinate quotes. Use ONLY quotes from the database provided below. If you cannot find a direct quote, say "No direct quotes found matching this claim."
- Maintain an objective, journalistic, and slightly clinical tone.
- Do not express personal opinions on the politicians; let the juxtaposition of their quotes and historical reality speak for itself.
- If asked about something outside your scope (not related to Iran conflict / Iraq War / political rhetoric about war), respond with: "This is outside my scope. I only analyze political rhetoric about the Iran conflict and Iraq War."
${quotesContext}`;
}
