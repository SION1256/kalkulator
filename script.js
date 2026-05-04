// ===== PARTICLES =====
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

for (let i = 0; i < 60; i++) {
  particles.push({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    size: Math.random() * 1.5 + 0.5,
    alpha: Math.random() * 0.5 + 0.1
  });
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0) p.x = canvas.width;
    if (p.x > canvas.width) p.x = 0;
    if (p.y < 0) p.y = canvas.height;
    if (p.y > canvas.height) p.y = 0;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,255,255,${p.alpha})`;
    ctx.fill();
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ===== LANGUAGE TOGGLE =====
const LANG = {
  id: {
    appSub: '// SISTEM ONLINE — KALKULATOR BERTENAGA AI',
    keyLabel: 'OR-KEY:',
    keyPlaceholder: 'sk-or-v1-xxxxxxxx (OpenRouter API Key)',
    tabCalc: '⌨ KALKULATOR',
    tabConvert: '◈ KONVERSI',
    tabAI: '◈ AI MATH',
    calcStatus: '// SIAP',
    calcCleared: '// DIHAPUS',
    calcInput: '// INPUT',
    calcComputed: '// SELESAI',
    calcErr: '// ERROR SINTAKS',
    aiWelcome: `Halo! Gw AI Math Assistant lo. Tanya aja soal matematika dalam bahasa apapun — gw jelasin langkah-langkahnya.\n\nContoh:\n• "berapa 15% dari 240?"\n• "kalau gw punya 3 apel dan dikasih 7 lagi..."\n• "hitung luas lingkaran dengan jari-jari 5"`,
    aiPlaceholder: 'Tanya soal matematika...',
    aiSend: 'KIRIM',
    aiNoKey: '⚠ Isi dulu OpenRouter API Key di atas ya!',
    aiSysPrompt: `Kamu adalah AI Math Assistant yang helpful dan friendly. 
Jawab pertanyaan matematika dalam bahasa yang sama dengan user (Indonesia atau English).
Selalu tunjukkan langkah-langkah penyelesaiannya dengan jelas.
Format jawaban dengan rapi. Gunakan angka dan simbol matematika yang mudah dibaca.
Jika bukan soal matematika, tetap bantu tapi ingatkan kamu spesialis matematika.`,
    historyEmpty: '// riwayat kosong',
    footer: 'SION — CALC.EXE v1.0',
    convertFrom: 'DARI:',
    convertTo: 'KE:',
    convertEnterValue: '// Masukkan nilai',
  },
  en: {
    appSub: '// SYSTEM ONLINE — AI-POWERED CALCULATOR',
    keyLabel: 'OR-KEY:',
    keyPlaceholder: 'sk-or-v1-xxxxxxxx (OpenRouter API Key)',
    tabCalc: '⌨ CALCULATOR',
    tabConvert: '◈ CONVERTER',
    tabAI: '◈ AI MATH',
    calcStatus: '// READY',
    calcCleared: '// CLEARED',
    calcInput: '// INPUT',
    calcComputed: '// COMPUTED',
    calcErr: '// SYNTAX ERROR',
    aiWelcome: `Hey! I'm your AI Math Assistant. Ask me anything math-related — I'll walk you through the steps.\n\nExamples:\n• "what is 15% of 240?"\n• "if I have 3 apples and get 7 more..."\n• "calculate the area of a circle with radius 5"`,
    aiPlaceholder: 'Ask a math question...',
    aiSend: 'SEND',
    aiNoKey: '⚠ Please enter your OpenRouter API Key above!',
    aiSysPrompt: `You are a helpful and friendly AI Math Assistant.
Answer math questions clearly and show step-by-step solutions.
Match the language of the user (English or Indonesian).
Format answers neatly with numbers and math symbols.
If not a math question, still help but note you specialize in math.`,
    historyEmpty: '// history empty',
    footer: 'SION — CALC.EXE v1.0',
    convertFrom: 'FROM:',
    convertTo: 'TO:',
    convertEnterValue: '// Enter value',
  }
};

let currentLang = 'id';

function toggleLang() {
  currentLang = currentLang === 'id' ? 'en' : 'id';
  applyLang();
}

function applyLang() {
  const L = LANG[currentLang];
  document.getElementById('langBtn').textContent = currentLang === 'id' ? '🌐 EN' : '🌐 ID';
  document.querySelector('.app-sub').textContent = L.appSub;
  document.querySelector('.or-key-label').textContent = L.keyLabel;
  document.getElementById('orKey').placeholder = L.keyPlaceholder;
  document.getElementById('tab-calc').textContent = L.tabCalc;
  document.getElementById('tab-convert').textContent = L.tabConvert;
  document.getElementById('tab-ai').textContent = L.tabAI;
  document.getElementById('calcStatus').textContent = L.calcStatus;
  document.getElementById('aiInput').placeholder = L.aiPlaceholder;
  document.getElementById('aiSendBtn').textContent = L.aiSend;
  document.querySelector('#calcHistory').innerHTML = `<div class="history-item">${L.historyEmpty}</div>`;
  calcState.history = [];
  // Reset AI welcome msg
  const msgs = document.getElementById('aiMessages');
  msgs.innerHTML = `
    <div class="msg ai">
      <span class="msg-label">// AI</span>
      <div class="msg-bubble">${L.aiWelcome.replace(/\n/g, '<br>')}</div>
    </div>`;
  aiHistory.length = 0;
}

// ===== TAB SWITCH =====
function switchTab(tab) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn:not(.lang-toggle)').forEach(b => b.classList.remove('active'));
  document.getElementById('panel-' + tab).classList.add('active');
  document.getElementById('tab-' + tab).classList.add('active');
}

// ===== CALCULATOR (SIMPLE VERSION) =====
let displayValue = '0';
let expression = '';
let shouldResetDisplay = false;
let calcHistory = [];
let angleMode = 'deg';
let calcMode = 'basic';

function setMode(m) {
  calcMode = m;
  document.getElementById('gridBasic').style.display = m === 'basic' ? 'grid' : 'none';
  document.getElementById('gridSci').style.display = m === 'sci' ? 'grid' : 'none';
  document.getElementById('modeBasic').classList.toggle('active', m === 'basic');
  document.getElementById('modeSci').classList.toggle('active', m === 'sci');
}

function toggleAngle() {
  angleMode = angleMode === 'deg' ? 'rad' : 'deg';
  document.getElementById('angleMode').textContent = angleMode.toUpperCase();
}

function toRad(deg) { return deg * Math.PI / 180; }
function toDeg(rad) { return rad * 180 / Math.PI; }

function prettyDisplay(expr) {
  return expr.replace(/\*/g, '×').replace(/\//g, '÷');
}

function updateDisplay() {
  document.getElementById('calcResult').textContent = displayValue;
  document.getElementById('calcExpr').textContent = prettyDisplay(expression);
}

// Input angka - SIMPLE & LANGSUNG
function calcNum(v) {
  if (shouldResetDisplay) {
    displayValue = v;
    expression = '';
    shouldResetDisplay = false;
  } else {
    displayValue = displayValue === '0' && v !== '.' ? v : displayValue + v;
  }
  if (displayValue.length > 16) displayValue = displayValue.slice(0, 16);
  document.getElementById('calcStatus').textContent = '// INPUT';
  updateDisplay();
}

// Titik desimal
function calcDot() {
  if (shouldResetDisplay) {
    displayValue = '0.';
    expression = '';
    shouldResetDisplay = false;
  } else if (!displayValue.includes('.')) {
    displayValue += '.';
  }
  updateDisplay();
}

// Operator (+ - * / ^)
function calcOp(op) {
  const value = displayValue;
  if (expression && shouldResetDisplay) {
    // Ganti operator terakhir jika user ganti pikiran
    expression = expression.slice(0, -1) + op;
  } else {
    expression += value + op;
    shouldResetDisplay = true;
  }
  document.getElementById('calcStatus').textContent = '// INPUT';
  updateDisplay();
}

// Fungsi scientific (sin, cos, tan, dll)
function calcFn(fn) {
  const val = parseFloat(displayValue);
  const isDeg = angleMode === 'deg';
  let result;
  
  switch(fn) {
    case 'sin':  result = Math.sin(isDeg ? toRad(val) : val); break;
    case 'cos':  result = Math.cos(isDeg ? toRad(val) : val); break;
    case 'tan':  result = Math.tan(isDeg ? toRad(val) : val); break;
    case 'asin': result = isDeg ? toDeg(Math.asin(val)) : Math.asin(val); break;
    case 'acos': result = isDeg ? toDeg(Math.acos(val)) : Math.acos(val); break;
    case 'log':  result = Math.log10(val); break;
    case 'ln':   result = Math.log(val); break;
    case 'sqrt': result = Math.sqrt(val); break;
    case 'pow2': result = val * val; break;
    case 'abs':  result = Math.abs(val); break;
    case 'inv':  result = 1 / val; break;
    case 'fact':
      if (val < 0 || !Number.isInteger(val)) { 
        displayValue = 'ERR'; 
        updateDisplay(); 
        return; 
      }
      result = 1; 
      for (let i = 2; i <= val; i++) result *= i; 
      break;
    default: return;
  }
  
  const labels = {sin:'sin',cos:'cos',tan:'tan',asin:'sin⁻¹',acos:'cos⁻¹',log:'log',ln:'ln',sqrt:'√',pow2:'x²',abs:'|x|',inv:'1/x',fact:'n!'};
  const display = parseFloat(result.toFixed(10)).toString();
  
  // Simpan ke history
  calcHistory.unshift(`${labels[fn]}(${val}) = ${display}`);
  if (calcHistory.length > 8) calcHistory.pop();
  
  expression = `${labels[fn]}(${val}) =`;
  displayValue = display;
  shouldResetDisplay = true;
  
  document.getElementById('calcStatus').textContent = '// COMPUTED';
  updateHistory();
  updateDisplay();
}

// Konstanta (π, e)
function calcConst(c) {
  displayValue = c === 'pi' ? String(Math.PI) : String(Math.E);
  shouldResetDisplay = true;
  updateDisplay();
}

// Persen
function calcPercent() {
  displayValue = String(parseFloat(displayValue) / 100);
  updateDisplay();
}

// Plus/Minus
function calcPlusMinus() {
  if (displayValue === '0') return;
  displayValue = displayValue.startsWith('-') ? displayValue.slice(1) : '-' + displayValue;
  updateDisplay();
}

// Delete satu karakter
function calcDel() {
  if (shouldResetDisplay) {
    calcAC();
    return;
  }
  displayValue = displayValue.length > 1 ? displayValue.slice(0, -1) : '0';
  updateDisplay();
}

// Hitung hasil (=)
function calcEquals() {
  try {
    const full = expression + displayValue;
    if (!full || full === '0') return;
    
    // Convert ^ ke ** untuk JavaScript
    const safe = full.replace(/\^/g, '**').replace(/[^0-9+\-*/().e]/g, '');
    const result = Function('"use strict"; return (' + safe + ')')();
    
    if (!isFinite(result)) throw new Error('Not finite');
    
    const display = parseFloat(result.toFixed(10)).toString();
    
    // Simpan ke history
    calcHistory.unshift(prettyDisplay(full) + ' = ' + display);
    if (calcHistory.length > 8) calcHistory.pop();
    
    expression = prettyDisplay(full) + ' =';
    displayValue = display;
    shouldResetDisplay = true;
    
    document.getElementById('calcStatus').textContent = '// COMPUTED';
    updateHistory();
    updateDisplay();
  } catch(e) {
    displayValue = 'ERR';
    document.getElementById('calcStatus').className = 'status-text err';
    document.getElementById('calcStatus').textContent = '// ERROR';
    updateDisplay();
    setTimeout(() => { 
      calcAC(); 
      document.getElementById('calcStatus').className = 'status-text'; 
    }, 1200);
  }
}

// All Clear
function calcAC() {
  displayValue = '0';
  expression = '';
  shouldResetDisplay = false;
  document.getElementById('calcStatus').className = 'status-text';
  document.getElementById('calcStatus').textContent = '// CLEARED';
  updateDisplay();
}

// Update history display
function updateHistory() {
  const el = document.getElementById('calcHistory');
  const L = LANG[currentLang];
  if (!calcHistory.length) { 
    el.innerHTML = `<div class="history-item">${L.historyEmpty}</div>`; 
    return; 
  }
  el.innerHTML = calcHistory.map((h, i) =>
    `<div class="history-item">${i === 0 ? '► ' : '  '}${h}</div>`
  ).join('');
}

// Keyboard support - SIMPLE & INTUITIVE
document.addEventListener('keydown', e => {
  const activePanel = document.querySelector('.panel.active');
  if (!activePanel || activePanel.id !== 'panel-calc') return;
  
  if ('0123456789'.includes(e.key)) {
    calcNum(e.key);
  } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
    calcOp(e.key);
  } else if (e.key === '/') {
    e.preventDefault();
    calcOp('/');
  } else if (e.key === '^') {
    calcOp('^');
  } else if (e.key === '(' || e.key === ')') {
    calcOp(e.key);
  } else if (e.key === '.' || e.key === ',') {
    calcDot();
  } else if (e.key === 'Enter' || e.key === '=') {
    e.preventDefault();
    calcEquals();
  } else if (e.key === 'Escape' || e.key === 'Delete') {
    calcAC();
  } else if (e.key === 'Backspace') {
    calcDel();
  }
});

// ===== OPENROUTER HELPER =====
const DEFAULT_KEY = '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';

function getKey() {
  const custom = document.getElementById('orKey').value.trim();
  const statusEl = document.getElementById('keyStatus');
  if (custom) {
    statusEl.textContent = 'CUSTOM';
    statusEl.className = 'or-key-status custom';
    return custom;
  }
  statusEl.textContent = 'DEFAULT';
  statusEl.className = 'or-key-status';
  return DEFAULT_KEY;
}

async function callOR(messages, systemPrompt) {
  const key = getKey();
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`,
      'HTTP-Referer': window.location.href,
      'X-Title': 'CALC.EXE by SION'
    },
    body: JSON.stringify({
      model: 'openrouter/auto',
      messages: systemPrompt
        ? [{ role: 'system', content: systemPrompt }, ...messages]
        : messages,
      max_tokens: 512
    })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `HTTP ${res.status}`);
  }

  const data = await res.json();
  return data.choices[0].message.content;
}

// ===== AI MATH =====
const aiHistory = [];

async function sendAI() {
  const input = document.getElementById('aiInput');
  const text = input.value.trim();
  if (!text) return;

  appendMsg('user', text);
  input.value = '';
  aiHistory.push({ role: 'user', content: text });

  const btn = document.getElementById('aiSendBtn');
  btn.disabled = true;
  const typingEl = showTyping();

  try {
    const reply = await callOR(aiHistory, LANG[currentLang].aiSysPrompt);
    typingEl.remove();
    aiHistory.push({ role: 'assistant', content: reply });
    appendMsg('ai', reply);
  } catch(e) {
    typingEl.remove();
    appendMsg('ai', `⚠ Error: ${e.message}`);
  }

  btn.disabled = false;
}

function appendMsg(role, text) {
  const container = document.getElementById('aiMessages');
  const el = document.createElement('div');
  el.className = `msg ${role}`;
  el.innerHTML = `
    <span class="msg-label">// ${role === 'user' ? 'YOU' : 'AI'}</span>
    <div class="msg-bubble">${text.replace(/</g, '&lt;').replace(/\n/g, '<br>')}</div>
  `;
  container.appendChild(el);
  container.scrollTop = container.scrollHeight;
}

function showTyping() {
  const container = document.getElementById('aiMessages');
  const el = document.createElement('div');
  el.className = 'msg ai';
  el.innerHTML = `
    <span class="msg-label">// AI</span>
    <div class="typing-indicator">
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    </div>
  `;
  container.appendChild(el);
  container.scrollTop = container.scrollHeight;
  return el;
}

document.getElementById('aiInput').addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendAI(); }
});

// ===== UNIT CONVERTER =====
const unitData = {
  currency: {
    units: ['USD', 'IDR', 'EUR', 'GBP', 'JPY', 'CNY', 'SGD', 'AUD', 'CAD', 'CHF'],
    rates: { USD: 1, IDR: 15650, EUR: 0.92, GBP: 0.79, JPY: 149.5, CNY: 7.23, SGD: 1.34, AUD: 1.53, CAD: 1.36, CHF: 0.88 }
  },
  length: {
    units: ['Meter', 'Kilometer', 'Centimeter', 'Millimeter', 'Inch', 'Foot', 'Yard', 'Mile', 'Nautical Mile'],
    rates: { Meter: 1, Kilometer: 0.001, Centimeter: 100, Millimeter: 1000, Inch: 39.3701, Foot: 3.28084, Yard: 1.09361, Mile: 0.000621371, 'Nautical Mile': 0.000539957 }
  },
  area: {
    units: ['Square Meter', 'Square Kilometer', 'Square Centimeter', 'Hectare', 'Acre', 'Square Foot', 'Square Inch', 'Square Mile'],
    rates: { 'Square Meter': 1, 'Square Kilometer': 0.000001, 'Square Centimeter': 10000, Hectare: 0.0001, Acre: 0.000247105, 'Square Foot': 10.7639, 'Square Inch': 1550, 'Square Mile': 3.861e-7 }
  },
  volume: {
    units: ['Liter', 'Milliliter', 'Cubic Meter', 'Gallon (US)', 'Quart (US)', 'Pint (US)', 'Cup (US)', 'Fluid Ounce (US)'],
    rates: { Liter: 1, Milliliter: 1000, 'Cubic Meter': 0.001, 'Gallon (US)': 0.264172, 'Quart (US)': 1.05669, 'Pint (US)': 2.11338, 'Cup (US)': 4.22675, 'Fluid Ounce (US)': 33.814 }
  },
  weight: {
    units: ['Kilogram', 'Gram', 'Milligram', 'Ton (Metric)', 'Pound', 'Ounce', 'Stone'],
    rates: { Kilogram: 1, Gram: 1000, Milligram: 1000000, 'Ton (Metric)': 0.001, Pound: 2.20462, Ounce: 35.274, Stone: 0.157473 }
  },
  temperature: {
    units: ['Celsius', 'Fahrenheit', 'Kelvin'],
    rates: null // Special handling
  },
  time: {
    units: ['Second', 'Minute', 'Hour', 'Day', 'Week', 'Month', 'Year', 'Millisecond'],
    rates: { Second: 1, Minute: 1/60, Hour: 1/3600, Day: 1/86400, Week: 1/604800, Month: 1/2628000, Year: 1/31536000, Millisecond: 1000 }
  },
  speed: {
    units: ['m/s', 'km/h', 'mph', 'knot', 'ft/s'],
    rates: { 'm/s': 1, 'km/h': 3.6, mph: 2.23694, knot: 1.94384, 'ft/s': 3.28084 }
  },
  data: {
    units: ['Byte', 'Kilobyte', 'Megabyte', 'Gigabyte', 'Terabyte', 'Petabyte', 'Bit', 'Kilobit', 'Megabit', 'Gigabit'],
    rates: { Byte: 1, Kilobyte: 0.001, Megabyte: 0.000001, Gigabyte: 1e-9, Terabyte: 1e-12, Petabyte: 1e-15, Bit: 8, Kilobit: 0.008, Megabit: 8e-6, Gigabit: 8e-9 }
  }
};

let currentCategory = 'currency';

function changeCategory() {
  currentCategory = document.getElementById('convertCategory').value;
  const fromSelect = document.getElementById('convertFromUnit');
  const toSelect = document.getElementById('convertToUnit');
  
  fromSelect.innerHTML = '';
  toSelect.innerHTML = '';
  
  unitData[currentCategory].units.forEach((unit, index) => {
    fromSelect.innerHTML += `<option value="${unit}">${unit}</option>`;
    toSelect.innerHTML += `<option value="${unit}" ${index === 1 ? 'selected' : ''}>${unit}</option>`;
  });
  
  convertFrom();
}

function convertTemperature(value, fromUnit, toUnit, direction) {
  let celsius;
  if (direction === 'from') {
    // Convert to Celsius first
    if (fromUnit === 'Celsius') celsius = value;
    else if (fromUnit === 'Fahrenheit') celsius = (value - 32) * 5/9;
    else if (fromUnit === 'Kelvin') celsius = value - 273.15;
    
    // Then convert to target unit
    if (toUnit === 'Celsius') return celsius;
    else if (toUnit === 'Fahrenheit') return celsius * 9/5 + 32;
    else if (toUnit === 'Kelvin') return celsius + 273.15;
  } else {
    // Reverse conversion
    if (toUnit === 'Celsius') celsius = value;
    else if (toUnit === 'Fahrenheit') celsius = (value - 32) * 5/9;
    else if (toUnit === 'Kelvin') celsius = value - 273.15;
    
    if (fromUnit === 'Celsius') return celsius;
    else if (fromUnit === 'Fahrenheit') return celsius * 9/5 + 32;
    else if (fromUnit === 'Kelvin') return celsius + 273.15;
  }
  return value;
}

function convertFrom() {
  const fromValue = parseFloat(document.getElementById('convertFromValue').value);
  const fromUnit = document.getElementById('convertFromUnit').value;
  const toUnit = document.getElementById('convertToUnit').value;
  const toInput = document.getElementById('convertToValue');
  const resultDiv = document.getElementById('convertResult');
  
  if (isNaN(fromValue)) {
    toInput.value = '';
    resultDiv.textContent = '// Masukkan nilai';
    return;
  }
  
  let result;
  
  if (currentCategory === 'temperature') {
    result = convertTemperature(fromValue, fromUnit, toUnit, 'from');
  } else {
    const rates = unitData[currentCategory].rates;
    const baseValue = fromValue / rates[fromUnit];
    result = baseValue * rates[toUnit];
  }
  
  // Format result
  let displayResult;
  if (Math.abs(result) < 0.000001 || Math.abs(result) > 1000000) {
    displayResult = result.toExponential(6);
  } else {
    displayResult = parseFloat(result.toFixed(6)).toString();
  }
  
  toInput.value = displayResult;
  resultDiv.textContent = `${fromValue} ${fromUnit} = ${displayResult} ${toUnit}`;
}

function convertTo() {
  const toValue = parseFloat(document.getElementById('convertToValue').value);
  const fromUnit = document.getElementById('convertFromUnit').value;
  const toUnit = document.getElementById('convertToUnit').value;
  const fromInput = document.getElementById('convertFromValue');
  const resultDiv = document.getElementById('convertResult');
  
  if (isNaN(toValue)) {
    fromInput.value = '';
    resultDiv.textContent = '// Masukkan nilai';
    return;
  }
  
  let result;
  
  if (currentCategory === 'temperature') {
    result = convertTemperature(toValue, fromUnit, toUnit, 'to');
  } else {
    const rates = unitData[currentCategory].rates;
    const baseValue = toValue / rates[toUnit];
    result = baseValue * rates[fromUnit];
  }
  
  // Format result
  let displayResult;
  if (Math.abs(result) < 0.000001 || Math.abs(result) > 1000000) {
    displayResult = result.toExponential(6);
  } else {
    displayResult = parseFloat(result.toFixed(6)).toString();
  }
  
  fromInput.value = displayResult;
  resultDiv.textContent = `${toValue} ${toUnit} = ${displayResult} ${fromUnit}`;
}

// Initialize converter on load
changeCategory();
