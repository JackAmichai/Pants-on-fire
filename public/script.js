// ============================================================================
// PANTS ON FIRE 🔥 — Frontend Chat Logic (LLM-Powered)
// ============================================================================

// ── API Call to NVIDIA Nemotron via our serverless backend ─────────────────

async function callNemotron(userMessage) {
  // Build the database context to send to the API
  const timingData = TIMING_ANALYSIS.analyzeQuotes(
    CURRENT_QUOTES.filter(q => q.politician === "Donald Trump")
  );

  const database = {
    currentQuotes: CURRENT_QUOTES,
    historicalQuotes: HISTORICAL_QUOTES,
    timingAnalysis: timingData,
  };

  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: userMessage, database }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || `API returned ${response.status}`);
  }

  const data = await response.json();
  return data.response;
}

// ── Markdown → HTML Renderer ──────────────────────────────────────────────

function renderMarkdown(text) {
  // Tables
  text = text.replace(/^\|(.+)\|$/gm, (match) => match); // keep pipes
  const lines = text.split('\n');
  let html = '';
  let inTable = false;
  let tableHeader = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Table detection
    if (line.startsWith('|') && line.endsWith('|')) {
      if (!inTable) {
        html += '<div class="table-wrapper"><table>';
        inTable = true;
        tableHeader = true;
      }

      // Skip separator rows (|---|---|---|)
      if (/^\|[\s\-:]+\|$/.test(line.replace(/\|/g, '|').replace(/[^|:\-\s]/g, ''))) {
        tableHeader = false;
        continue;
      }

      const cells = line.split('|').slice(1, -1).map(c => c.trim());
      const tag = tableHeader ? 'th' : 'td';
      const rowClass = !tableHeader && cells[2] ? ' class="reality-row"' : '';
      html += `<tr${rowClass}>`;
      cells.forEach((cell, idx) => {
        const cellClass = idx === 2 ? ' class="reality"' : '';
        html += `<${tag}${cellClass}>${renderInlineMarkdown(cell)}</${tag}>`;
      });
      html += '</tr>';

      if (tableHeader) {
        html += '</thead><tbody>';
        tableHeader = false;
      }
      continue;
    } else if (inTable) {
      html += '</tbody></table></div>';
      inTable = false;
    }

    // Blockquotes
    if (line.startsWith('>')) {
      const content = line.replace(/^>\s*/, '');
      html += `<blockquote>${renderInlineMarkdown(content)}</blockquote>`;
      continue;
    }

    // Headers
    if (line.startsWith('### ')) {
      html += `<h3 class="section-header">${renderInlineMarkdown(line.slice(4))}</h3>`;
      continue;
    }
    if (line.startsWith('## ')) {
      html += `<div class="section-header">${renderInlineMarkdown(line.slice(3))}</div>`;
      continue;
    }

    // Horizontal rules
    if (/^---+$/.test(line)) {
      html += '<hr>';
      continue;
    }

    // List items
    if (line.startsWith('- ')) {
      html += `<div class="list-item">• ${renderInlineMarkdown(line.slice(2))}</div>`;
      continue;
    }

    // Empty lines
    if (line === '') {
      html += '<br>';
      continue;
    }

    // Regular paragraphs
    html += `<p>${renderInlineMarkdown(line)}</p>`;
  }

  if (inTable) {
    html += '</tbody></table></div>';
  }

  return html;
}

function renderInlineMarkdown(text) {
  // Bold
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // Italic
  text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
  // Inline code
  text = text.replace(/`(.*?)`/g, '<code>$1</code>');
  // Links
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  // Emojis for day tags
  text = text.replace(/📈/g, '<span class="day-tag monday">📈 Monday</span>');
  text = text.replace(/📉/g, '<span class="day-tag weekend">📉 Weekend/Close</span>');
  return text;
}

// ── Chat UI Controller ─────────────────────────────────────────────────────

function initChat() {
  const input = document.getElementById("chat-input");
  const sendBtn = document.getElementById("send-btn");
  const messagesContainer = document.getElementById("messages");

  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    // Remove welcome screen
    const welcome = document.querySelector('.welcome');
    if (welcome) welcome.remove();

    // Add user message
    addMessage(text, "user");
    input.value = "";
    input.disabled = true;
    sendBtn.disabled = true;

    // Show typing indicator
    const typingEl = addTypingIndicator();

    try {
      const response = await callNemotron(text);
      typingEl.remove();

      // Render the markdown response as HTML
      const htmlContent = renderMarkdown(response);
      addMessage(htmlContent, "bot", true);

    } catch (err) {
      typingEl.remove();
      addMessage(
        `<div class="error-msg">⚠️ Error: ${err.message}<br><small>The LLM service may be temporarily unavailable. Please try again.</small></div>`,
        "bot",
        true
      );
    }

    input.disabled = false;
    sendBtn.disabled = false;
    input.focus();
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  sendBtn.addEventListener("click", sendMessage);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  input.focus();
}

function addMessage(content, type, isHTML = false) {
  const messagesContainer = document.getElementById("messages");
  const msgEl = document.createElement("div");
  msgEl.className = `message ${type}`;

  const bubble = document.createElement("div");
  bubble.className = "bubble";

  if (isHTML) {
    bubble.innerHTML = content;
  } else {
    bubble.textContent = content;
  }

  msgEl.appendChild(bubble);
  messagesContainer.appendChild(msgEl);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
  return msgEl;
}

function addTypingIndicator() {
  const messagesContainer = document.getElementById("messages");
  const typingEl = document.createElement("div");
  typingEl.className = "message bot typing";
  typingEl.innerHTML = `<div class="bubble"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>`;
  messagesContainer.appendChild(typingEl);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
  return typingEl;
}

// ── Example Button Handler ─────────────────────────────────────────────────

function useExample(btn) {
  const text = btn.textContent.replace(/^[🔍📊💰⚔️]\s*/, '').trim();
  document.getElementById('chat-input').value = text;
  document.getElementById('send-btn').click();
}

// ── Initialize ─────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", initChat);
