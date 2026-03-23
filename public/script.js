// ============================================================================
// PANTS ON FIRE 🔥 — Frontend Chat Logic (LLM-Powered)
// ============================================================================

// ── Loading Steps Configuration ───────────────────────────────────────────
const LOADING_STEPS = [
  { text: "Searching news sources...", duration: 2000, sites: ["Google News", "Reuters RSS", "AP News"] },
  { text: "Scanning Trump statements...", duration: 2000, sites: ["Truth Social", "White House Archives", "Fox News"] },
  { text: "Analyzing quote database...", duration: 1500, sites: ["65+ verified quotes", "Iraq War records"] },
  { text: "Computing confidence score...", duration: 1000, sites: ["Historical failure rate analysis"] },
  { text: "Generating analysis with Nemotron LLM...", duration: 15000, sites: ["NVIDIA AI Cloud"] },
];

const ESTIMATED_TIME = 15; // seconds

// ── API Call to NVIDIA Nemotron via our serverless backend ─────────────────

async function callNemotron(userMessage) {
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
  const lines = text.split('\n');
  let html = '';
  let inTable = false;
  let isFirstTableRow = true;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Table detection
    if (line.startsWith('|') && line.endsWith('|')) {
      if (!inTable) {
        html += '<div class="table-wrapper"><table><thead>';
        inTable = true;
        isFirstTableRow = true;
      }

      // Skip separator rows
      if (/^\|[\s\-:]+\|$/.test(line.replace(/[^|:\-\s]/g, ''))) {
        if (isFirstTableRow) { html += '</thead><tbody>'; isFirstTableRow = false; }
        continue;
      }

      const cells = line.split('|').slice(1, -1).map(c => c.trim());
      const tag = isFirstTableRow ? 'th' : 'td';
      html += '<tr>';
      cells.forEach((cell, idx) => {
        const cls = idx === cells.length - 1 && !isFirstTableRow ? ' class="reality"' : '';
        html += `<${tag}${cls}>${renderInline(cell)}</${tag}>`;
      });
      html += '</tr>';
      continue;
    } else if (inTable) {
      html += '</tbody></table></div>';
      inTable = false;
      isFirstTableRow = true;
    }

    if (line.startsWith('>')) {
      html += `<blockquote>${renderInline(line.replace(/^>\s*/, ''))}</blockquote>`;
      continue;
    }
    if (line.startsWith('### ')) { html += `<h3 class="section-header">${renderInline(line.slice(4))}</h3>`; continue; }
    if (line.startsWith('## ')) { html += `<div class="section-header">${renderInline(line.slice(3))}</div>`; continue; }
    if (/^---+$/.test(line)) { html += '<hr>'; continue; }
    if (line.startsWith('- ')) { html += `<div class="list-item">• ${renderInline(line.slice(2))}</div>`; continue; }
    if (line === '') { html += '<br>'; continue; }
    html += `<p>${renderInline(line)}</p>`;
  }

  if (inTable) html += '</tbody></table></div>';
  return html;
}

function renderInline(text) {
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
  text = text.replace(/`(.*?)`/g, '<code>$1</code>');
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  text = text.replace(/📈/g, '<span class="day-tag monday">📈 Mon</span>');
  text = text.replace(/📉/g, '<span class="day-tag weekend">📉 Wknd</span>');
  return text;
}

// ── Progress Loading Indicator ────────────────────────────────────────────

function createProgressIndicator() {
  const container = document.createElement('div');
  container.className = 'message bot';
  container.id = 'progress-indicator';

  const bubble = document.createElement('div');
  bubble.className = 'bubble progress-bubble';

  bubble.innerHTML = `
    <div class="progress-header">
      <span class="progress-fire">🔥</span>
      <span class="progress-title">Analyzing claim...</span>
      <span class="progress-timer" id="progress-timer">~${ESTIMATED_TIME}s</span>
    </div>
    <div class="progress-steps" id="progress-steps"></div>
    <div class="progress-bar-container">
      <div class="progress-bar" id="progress-bar"></div>
    </div>
    <div class="progress-sources" id="progress-sources"></div>
  `;

  container.appendChild(bubble);
  return container;
}

function startProgressAnimation() {
  const messagesContainer = document.getElementById("messages");
  const indicator = createProgressIndicator();
  messagesContainer.appendChild(indicator);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  const stepsEl = document.getElementById('progress-steps');
  const barEl = document.getElementById('progress-bar');
  const timerEl = document.getElementById('progress-timer');
  const sourcesEl = document.getElementById('progress-sources');

  let currentStep = 0;
  let startTime = Date.now();
  let totalDuration = LOADING_STEPS.reduce((sum, s) => sum + s.duration, 0);

  // Timer countdown
  const timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const remaining = Math.max(0, ESTIMATED_TIME - elapsed);
    if (remaining > 0) {
      timerEl.textContent = `~${remaining}s`;
    } else {
      timerEl.textContent = 'finalizing...';
    }
  }, 1000);

  // Step animations
  function showStep(index) {
    if (index >= LOADING_STEPS.length) return;
    const step = LOADING_STEPS[index];

    // Add step to list
    const stepEl = document.createElement('div');
    stepEl.className = 'progress-step active';
    stepEl.innerHTML = `
      <span class="step-spinner"></span>
      <span class="step-text">${step.text}</span>
    `;
    stepsEl.appendChild(stepEl);

    // Show sources being scraped
    sourcesEl.innerHTML = step.sites.map(s =>
      `<span class="source-tag">${s}</span>`
    ).join('');

    // Update progress bar
    const progressPct = Math.min(100, ((index + 1) / LOADING_STEPS.length) * 90);
    barEl.style.width = progressPct + '%';

    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Mark previous step as done
    if (index > 0) {
      const prevStep = stepsEl.children[index - 1];
      if (prevStep) {
        prevStep.classList.remove('active');
        prevStep.classList.add('done');
        prevStep.querySelector('.step-spinner').innerHTML = '✓';
      }
    }

    // Schedule next step
    setTimeout(() => showStep(index + 1), step.duration);
  }

  showStep(0);

  return {
    element: indicator,
    stop: () => {
      clearInterval(timerInterval);
    }
  };
}

// ── Chat UI Controller ─────────────────────────────────────────────────────

function initChat() {
  const input = document.getElementById("chat-input");
  const sendBtn = document.getElementById("send-btn");
  const messagesContainer = document.getElementById("messages");

  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    const welcome = document.querySelector('.welcome');
    if (welcome) welcome.remove();

    addMessage(text, "user");
    input.value = "";
    input.disabled = true;
    sendBtn.disabled = true;

    // Show progress indicator instead of simple dots
    const progress = startProgressAnimation();

    try {
      const response = await callNemotron(text);
      progress.stop();
      progress.element.remove();

      const htmlContent = renderMarkdown(response);
      addMessage(htmlContent, "bot", true);

    } catch (err) {
      progress.stop();
      progress.element.remove();
      addMessage(
        `<div class="error-msg">⚠️ ${err.message}<br><small>Please try again — the LLM service may be busy.</small></div>`,
        "bot", true
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

  if (isHTML) { bubble.innerHTML = content; } else { bubble.textContent = content; }

  msgEl.appendChild(bubble);
  messagesContainer.appendChild(msgEl);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
  return msgEl;
}

function useExample(btn) {
  const text = btn.textContent.replace(/^[🔍📊💰⚔️]\s*/, '').trim();
  document.getElementById('chat-input').value = text;
  document.getElementById('send-btn').click();
}

document.addEventListener("DOMContentLoaded", initChat);
