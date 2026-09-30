/**
 * Naija Pop - Mobile-First Bubble Shooter Engine
 * Lightweight, 60fps HTML5 Canvas & Web Audio Implementation
 */

(() => {
  'use strict';

  // --- AUDIO SYNTHESIZER (Web Audio API) ---
  class SoundController {
    constructor() {
      this.ctx = null;
      this.enabled = true;
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playShoot() {
      if (!this.enabled || !this.ctx) return;
      this.init();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(700, now + 0.12);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    }

    playBounce() {
      if (!this.enabled || !this.ctx) return;
      this.init();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    }

    playPop(combo = 1) {
      if (!this.enabled || !this.ctx) return;
      this.init();
      const now = this.ctx.currentTime;
      const baseFreq = 400 * Math.pow(1.12, Math.min(combo, 8));
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.08);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    }

    playDrop() {
      if (!this.enabled || !this.ctx) return;
      this.init();
      const now = this.ctx.currentTime;
      const freqs = [523.25, 659.25, 783.99, 1046.50];
      freqs.forEach((f, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + i * 0.04);
        gain.gain.setValueAtTime(0.2, now + i * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.04 + 0.15);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.04);
        osc.stop(now + i * 0.04 + 0.15);
      });
    }

    playBomb() {
      if (!this.enabled || !this.ctx) return;
      this.init();
      const now = this.ctx.currentTime;
      // Sub bass hit
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.35);
      gain.gain.setValueAtTime(0.7, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);

      // Noise burst simulation
      try {
        const bufferSize = this.ctx.sampleRate * 0.2;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.3, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        noise.connect(noiseGain);
        noiseGain.connect(this.ctx.destination);
        noise.start(now);
      } catch (_) {}
    }

    playRainbow() {
      if (!this.enabled || !this.ctx) return;
      this.init();
      const now = this.ctx.currentTime;
      const notes = [587.33, 739.99, 880.00, 1174.66];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);
        gain.gain.setValueAtTime(0.25, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.06 + 0.2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.2);
      });
    }

    playWin() {
      if (!this.enabled || !this.ctx) return;
      this.init();
      const now = this.ctx.currentTime;
      const melody = [
        { f: 523.25, t: 0 },
        { f: 659.25, t: 0.12 },
        { f: 783.99, t: 0.24 },
        { f: 1046.50, t: 0.36 },
        { f: 1318.51, t: 0.52 }
      ];
      melody.forEach(m => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(m.f, now + m.t);
        gain.gain.setValueAtTime(0.3, now + m.t);
        gain.gain.exponentialRampToValueAtTime(0.01, now + m.t + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + m.t);
        osc.stop(now + m.t + 0.25);
      });
    }

    playGameOver() {
      if (!this.enabled || !this.ctx) return;
      this.init();
      const now = this.ctx.currentTime;
      const sadMelody = [
        { f: 440, t: 0 },
        { f: 415.3, t: 0.2 },
        { f: 392, t: 0.4 },
        { f: 329.6, t: 0.65 }
      ];
      sadMelody.forEach(m => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(m.f, now + m.t);
        gain.gain.setValueAtTime(0.2, now + m.t);
        gain.gain.exponentialRampToValueAtTime(0.01, now + m.t + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + m.t);
        osc.stop(now + m.t + 0.3);
      });
    }

    playClick() {
      if (!this.enabled || !this.ctx) return;
      this.init();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.03);
    }
  }

  // --- HAPTIC CONTROLLER (Web & Android Native Bridge) ---
  class HapticController {
    constructor() {
      this.enabled = true;
    }

    vibrate(ms = 30) {
      if (!this.enabled) return;
      try {
        if (window.AndroidBridge && typeof window.AndroidBridge.vibrate === 'function') {
          window.AndroidBridge.vibrate(ms);
          return;
        }
        if (navigator.vibrate) {
          navigator.vibrate(ms);
        }
      } catch (_) {}
    }
  }

  // --- STORAGE & PROGRESS SYSTEM ---
  const STORAGE_KEY = 'naija_pop_data_v1';
  const MAX_LIVES = 5;
  const REFILL_INTERVAL_MS = 20 * 60 * 1000; // 20 minutes

  class DataManager {
    constructor() {
      this.data = this.load();
      this.checkLivesRefill();
    }

    getDefaults() {
      return {
        coins: 250,
        lives: 5,
        lastLifeTimestamp: Date.now(),
        unlockedLevel: 1,
        levelStars: {},
        levelScores: {},
        powerups: {
          bomb: 3,
          rainbow: 2,
          aim: 3
        },
        dailyStreak: 0,
        lastDailyClaimDate: '',
        settings: {
          sound: true,
          vibration: true
        }
      };
    }

    load() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return { ...this.getDefaults(), ...parsed };
        }
      } catch (e) {
        console.warn('Storage read error:', e);
      }
      return this.getDefaults();
    }

    save() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
      } catch (e) {
        console.warn('Storage write error:', e);
      }
    }

    checkLivesRefill() {
      if (this.data.lives >= MAX_LIVES) {
        this.data.lastLifeTimestamp = Date.now();
        return;
      }
      const now = Date.now();
      const elapsed = now - (this.data.lastLifeTimestamp || now);
      const livesToAdd = Math.floor(elapsed / REFILL_INTERVAL_MS);

      if (livesToAdd > 0) {
        this.data.lives = Math.min(MAX_LIVES, this.data.lives + livesToAdd);
        this.data.lastLifeTimestamp = now - (elapsed % REFILL_INTERVAL_MS);
        this.save();
      }
    }

    getTimeUntilNextLife() {
      if (this.data.lives >= MAX_LIVES) return 0;
      const now = Date.now();
      const elapsed = now - (this.data.lastLifeTimestamp || now);
      const remaining = Math.max(0, REFILL_INTERVAL_MS - (elapsed % REFILL_INTERVAL_MS));
      return remaining;
    }

    consumeLife() {
      this.checkLivesRefill();
      if (this.data.lives > 0) {
        if (this.data.lives === MAX_LIVES) {
          this.data.lastLifeTimestamp = Date.now();
        }
        this.data.lives--;
        this.save();
        return true;
      }
      return false;
    }

    addLives(count) {
      this.data.lives = Math.min(MAX_LIVES, this.data.lives + count);
      this.save();
    }

    addCoins(amount) {
      this.data.coins += amount;
      this.save();
    }

    spendCoins(amount) {
      if (this.data.coins >= amount) {
        this.data.coins -= amount;
        this.save();
        return true;
      }
      return false;
    }

    addPowerup(type, count = 1) {
      if (!this.data.powerups[type]) this.data.powerups[type] = 0;
      this.data.powerups[type] += count;
      this.save();
    }

    usePowerup(type) {
      if (this.data.powerups[type] && this.data.powerups[type] > 0) {
        this.data.powerups[type]--;
        this.save();
        return true;
      }
      return false;
    }

    recordLevelWin(levelNum, score, stars) {
      const prevStars = this.data.levelStars[levelNum] || 0;
      if (stars > prevStars) {
        this.data.levelStars[levelNum] = stars;
      }
      const prevScore = this.data.levelScores[levelNum] || 0;
      if (score > prevScore) {
        this.data.levelScores[levelNum] = score;
      }
      if (levelNum === this.data.unlockedLevel && levelNum < 50) {
        this.data.unlockedLevel = levelNum + 1;
      }
      this.save();
    }

    resetAll() {
      this.data = this.getDefaults();
      this.save();
    }
  }

  // --- 50 LEVELS CONFIGURATION & GENERATOR ---
  const BUBBLE_COLORS = [
    { id: 'green', hex: '#10b981', dark: '#047857', light: '#a7f3d0', symbol: '🍃' },
    { id: 'yellow', hex: '#f59e0b', dark: '#b45309', light: '#fde68a', symbol: '⭐' },
    { id: 'red', hex: '#ef4444', dark: '#b91c1c', light: '#fecaca', symbol: '🔥' },
    { id: 'blue', hex: '#3b82f6', dark: '#1d4ed8', light: '#bfdbfe', symbol: '💧' },
    { id: 'purple', hex: '#8b5cf6', dark: '#6d28d9', light: '#ddd6fe', symbol: '💎' },
    { id: 'orange', hex: '#f97316', dark: '#c2410c', light: '#fed7aa', symbol: '☀️' }
  ];

  const ZONES = [
    { id: 1, name: 'Lagos Island', range: [1, 10], desc: 'Bustling streets, danfo vibes, and tropical ocean warmth.' },
    { id: 2, name: 'Zuma Rock Gateway', range: [11, 20], desc: 'Ancient solid stone monoliths and rocky plateaus.' },
    { id: 3, name: 'Kano Ancient Citadel', range: [21, 30], desc: 'Historic desert gates, dye pits, and golden sands.' },
    { id: 4, name: 'Port Harcourt Creeks', range: [31, 40], desc: 'Lush delta waterways, oil lights, and bole hubs.' },
    { id: 5, name: 'Calabar Carnival', range: [41, 50], desc: 'Africa\'s biggest street party, colors, and rhythm!' }
  ];

  const LEVEL_NAMES = [
    "Eko Atlantic", "Danfo Drive", "Balogun Market", "Lekki Toll", "Third Mainland",
    "Marina Breeze", "Victoria Crest", "Fela Shrine", "Bar Beach Waves", "Lagos Nightlife",
    "Zuma Gateway", "Aso Rock Peak", "Millennium Park", "Maitama Hills", "Wuse Night Market",
    "Jabi Lake Shore", "Central Mosque", "National Stadium", "Eagle Square", "Federal Capital",
    "Dambe Arena", "Ancient City Walls", "Kurmi Bazaar", "Dye Pits", "Gidan Rumfa",
    "Sahel Dunes", "Savannah Sun", "Emir Palace", "Groundnut Pyramids", "Kano Citadel",
    "Bonny River", "Oil City Flow", "Bole & Fish Haven", "Delta Mangrove", "Trans-Amadi Hub",
    "Mile 1 Market", "Aggrey Road", "Creek Waters", "Garden City", "Rivers Supreme",
    "Tinapa Resort", "Obudu Cattle Ranch", "Mary Slessor Walk", "Calabar River", "Ekpe Secret Society",
    "Carnival Costume", "Afang Pot", "Marina Resort", "Masquerade Dance", "Grand Carnival Finale"
  ];

  function getLevelConfig(levelNum) {
    const zoneIdx = Math.min(4, Math.floor((levelNum - 1) / 10));
    const zone = ZONES[zoneIdx];
    const name = LEVEL_NAMES[levelNum - 1] || `Level ${levelNum}`;

    // Color variety increases with level
    let colorCount = 3;
    if (levelNum > 10) colorCount = 4;
    if (levelNum > 20) colorCount = 5;
    if (levelNum > 35) colorCount = 6;

    // Shot limits (challenging but fair)
    const shots = Math.max(18, 30 - Math.floor((levelNum - 1) / 3));

    // Star score thresholds
    const baseTarget = 1000 + (levelNum * 120);
    const starThresholds = [
      Math.floor(baseTarget * 0.7),
      baseTarget,
      Math.floor(baseTarget * 1.45)
    ];

    // Blocker bubble probability (starts from Level 11)
    const hasBlockers = levelNum >= 11;
    const blockerChance = hasBlockers ? Math.min(0.25, 0.05 + ((levelNum - 10) * 0.01)) : 0;

    return {
      levelNum,
      zone,
      name,
      colorCount,
      shots,
      starThresholds,
      hasBlockers,
      blockerChance,
      initialRows: Math.min(10, 6 + Math.floor(levelNum / 8))
    };
  }

  // --- FLOATING TEXT & PARTICLE SYSTEM ---
  const NAIJA_PRAISES = [
    "SWEET!", "OSHEY!", "NO DULLING!", "E CHOKE!", "CORRECT!", 
    "AGBA COOK!", "ODOGWU!", "TOO CLEAN!", "CHOP LIFE!"
  ];

  class FloatingText {
    constructor(text, x, y, color = '#fef08a', size = 20) {
      this.text = text;
      this.x = x;
      this.y = y;
      this.color = color;
      this.size = size;
      this.alpha = 1.0;
      this.vy = -1.8;
      this.life = 0;
      this.maxLife = 45;
    }

    update() {
      this.y += this.vy;
      this.vy *= 0.95;
      this.life++;
      this.alpha = Math.max(0, 1 - (this.life / this.maxLife));
      return this.life < this.maxLife;
    }

    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.font = `900 ${this.size}px -apple-system, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#000';
      ctx.fillText(this.text, this.x + 1.5, this.y + 1.5);
      ctx.fillStyle = this.color;
      ctx.fillText(this.text, this.x, this.y);
      ctx.restore();
    }
  }

  class Particle {
    constructor(x, y, color, size = 5) {
      this.x = x;
      this.y = y;
      this.color = color;
      this.size = size;
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 5;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.gravity = 0.15;
      this.alpha = 1.0;
      this.life = 0;
      this.maxLife = 25 + Math.floor(Math.random() * 20);
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += this.gravity;
      this.life++;
      this.alpha = Math.max(0, 1 - (this.life / this.maxLife));
      return this.life < this.maxLife;
    }

    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * (this.alpha), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  class FallingBubble {
    constructor(bubble, x, y, radius) {
      this.bubble = bubble;
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.vx = (Math.random() - 0.5) * 4;
      this.vy = -2 - Math.random() * 3;
      this.gravity = 0.55;
      this.rotation = 0;
      this.rotSpeed = (Math.random() - 0.5) * 0.1;
      this.alpha = 1;
    }

    update(height) {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += this.gravity;
      this.rotation += this.rotSpeed;
      if (this.y > height + 50) {
        return false;
      }
      return true;
    }

    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      drawSingleBubble(ctx, 0, 0, this.radius, this.bubble);
      ctx.restore();
    }
  }

  // Helper function to draw bubble with high-fidelity glossy gradients
  function drawSingleBubble(ctx, x, y, r, bubble) {
    if (!bubble) return;

    if (bubble.type === 'stone') {
      // Unbreakable Rock / Stone Blocker
      const grad = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r);
      grad.addColorStop(0, '#94a3b8');
      grad.addColorStop(0.7, '#475569');
      grad.addColorStop(1, '#1e293b');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, r - 1, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Stone cracks
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x - r * 0.4, y - r * 0.2);
      ctx.lineTo(x, y);
      ctx.lineTo(x + r * 0.3, y + r * 0.4);
      ctx.stroke();
      return;
    }

    if (bubble.type === 'bomb') {
      // Bomb Bubble
      const grad = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r);
      grad.addColorStop(0, '#f87171');
      grad.addColorStop(0.5, '#dc2626');
      grad.addColorStop(1, '#450a0a');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, r - 1, 0, Math.PI * 2);
      ctx.fill();

      // Gold pulsing rim
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Bomb emoji/fuse
      ctx.font = `${Math.floor(r * 1.1)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('💣', x, y + 1);
      return;
    }

    if (bubble.type === 'rainbow') {
      // Afro Rainbow Bubble
      const grad = ctx.createConicGradient(0, x, y);
      grad.addColorStop(0, '#ef4444');
      grad.addColorStop(0.2, '#f59e0b');
      grad.addColorStop(0.4, '#10b981');
      grad.addColorStop(0.6, '#3b82f6');
      grad.addColorStop(0.8, '#8b5cf6');
      grad.addColorStop(1, '#ef4444');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, r - 1, 0, Math.PI * 2);
      ctx.fill();

      // Inner gloss center
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.beginPath();
      ctx.arc(x - r * 0.3, y - r * 0.3, r * 0.3, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = `${Math.floor(r * 1.0)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🌈', x, y);
      return;
    }

    // Standard Colored Bubble
    const col = bubble.colorObj || BUBBLE_COLORS[0];
    const grad = ctx.createRadialGradient(x - r * 0.35, y - r * 0.35, r * 0.05, x, y, r);
    grad.addColorStop(0, col.light);
    grad.addColorStop(0.4, col.hex);
    grad.addColorStop(0.9, col.dark);
    grad.addColorStop(1, '#000000');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r - 1, 0, Math.PI * 2);
    ctx.fill();

    // Top-left glossy highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.beginPath();
    ctx.ellipse(x - r * 0.32, y - r * 0.32, r * 0.35, r * 0.2, Math.PI * 0.25, 0, Math.PI * 2);
    ctx.fill();

    // Subtle bottom bounce light
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath();
    ctx.ellipse(x + r * 0.2, y + r * 0.35, r * 0.35, r * 0.15, -Math.PI * 0.25, 0, Math.PI * 2);
    ctx.fill();

    // Accessibility icon/symbol in center
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.font = `bold ${Math.floor(r * 0.75)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(col.symbol, x, y + 1);
  }

  // --- MAIN GAME ENGINE ---
  class GameEngine {
    constructor() {
      this.canvas = document.getElementById('game-canvas');
      this.ctx = this.canvas.getContext('2d');
      this.audio = new SoundController();
      this.haptics = new HapticController();
      this.storage = new DataManager();

      // Viewport & Scale
      this.width = 400;
      this.height = 700;
      this.dpr = window.devicePixelRatio || 1;

      // Hex Grid Dimensions
      this.cols = 8;
      this.maxRows = 14;
      this.radius = 24;
      this.rowHeight = this.radius * Math.sqrt(3);
      this.topOffset = 58; // Room for top HUD
      this.foulLineY = 0; // Calculated based on height

      // Game State
      this.grid = []; // 2D array [row][col] = bubble or null
      this.currentLevel = 1;
      this.levelConfig = null;
      this.score = 0;
      this.shotsRemaining = 25;
      this.comboCount = 0;
      this.missesBeforeDescent = 5;
      this.currentMisses = 0;

      // Shooter Cannon
      this.shooterX = 0;
      this.shooterY = 0;
      this.aimAngle = -Math.PI / 2; // Point straight up
      this.aiming = false;
      this.activeBubble = null; // currently loaded
      this.nextBubble = null;   // queued in side cradle
      this.flyingBubble = null; // bubble in motion
      this.aimHelperActive = false;
      this.aimHelperShotsLeft = 0;

      // Visual effects & lists
      this.particles = [];
      this.floatingTexts = [];
      this.fallingBubbles = [];

      // Loop & State Machine
      this.state = 'MAP'; // 'MAP', 'PLAYING', 'PAUSED', 'WIN', 'GAMEOVER'
      this.lastFrameTime = performance.now();

      this.initEvents();
      this.resize();
      window.addEventListener('resize', () => this.resize());

      // Sync settings with UI
      this.audio.enabled = this.storage.data.settings.sound;
      this.haptics.enabled = this.storage.data.settings.vibration;
      document.getElementById('setting-sound').checked = this.audio.enabled;
      document.getElementById('setting-vibration').checked = this.haptics.enabled;

      this.renderLevelMap();
      this.updateCurrencyDisplays();
      this.startLivesTimer();

      // Check daily reward
      this.checkDailyRewardPrompt();

      // Start game loop
      requestAnimationFrame(time => this.gameLoop(time));
    }

    resize() {
      const rect = this.canvas.parentElement.getBoundingClientRect();
      this.width = rect.width;
      this.height = rect.height;

      this.canvas.width = this.width * this.dpr;
      this.canvas.height = this.height * this.dpr;
      this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

      // Compute bubble radius to cleanly fit 8 columns
      this.radius = Math.floor(this.width / (this.cols * 2 + 0.5));
      this.rowHeight = this.radius * Math.sqrt(3);

      this.shooterX = this.width / 2;
      this.shooterY = this.height - 75;
      this.foulLineY = this.shooterY - this.radius * 2.8;
    }

    // --- GAME LOOP ---
    gameLoop(time) {
      const dt = Math.min((time - this.lastFrameTime) / 1000, 0.1);
      this.lastFrameTime = time;

      this.update(dt);
      this.render();

      requestAnimationFrame(t => this.gameLoop(t));
    }

    update(dt) {
      // Update flying bubble
      if (this.flyingBubble) {
        this.flyingBubble.x += this.flyingBubble.vx;
        this.flyingBubble.y += this.flyingBubble.vy;

        // Bounce off left/right side walls
        if (this.flyingBubble.x - this.radius <= 0) {
          this.flyingBubble.x = this.radius;
          this.flyingBubble.vx *= -1;
          this.audio.playBounce();
          this.haptics.vibrate(15);
        } else if (this.flyingBubble.x + this.radius >= this.width) {
          this.flyingBubble.x = this.width - this.radius;
          this.flyingBubble.vx *= -1;
          this.audio.playBounce();
          this.haptics.vibrate(15);
        }

        // Check collision against top ceiling or existing bubbles
        this.checkBubbleCollision();
      }

      // Update falling bubbles
      for (let i = this.fallingBubbles.length - 1; i >= 0; i--) {
        if (!this.fallingBubbles[i].update(this.height)) {
          this.fallingBubbles.splice(i, 1);
        }
      }

      // Update particles
      for (let i = this.particles.length - 1; i >= 0; i--) {
        if (!this.particles[i].update()) {
          this.particles.splice(i, 1);
        }
      }

      // Update floating score texts
      for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
        if (!this.floatingTexts[i].update()) {
          this.floatingTexts.splice(i, 1);
        }
      }
    }

    render() {
      const ctx = this.ctx;
      ctx.clearRect(0, 0, this.width, this.height);

      if (this.state !== 'PLAYING' && this.state !== 'PAUSED') {
        return; // UI overlays handle rendering for map/modals
      }

      // 1. Draw Background grid & African pattern accents
      this.drawGameBackground(ctx);

      // 2. Draw Foul line (Danger threshold)
      ctx.save();
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.45)';
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 8]);
      ctx.beginPath();
      ctx.moveTo(12, this.foulLineY);
      ctx.lineTo(this.width - 12, this.foulLineY);
      ctx.stroke();
      ctx.restore();

      // 3. Draw Grid Bubbles
      for (let r = 0; r < this.grid.length; r++) {
        for (let c = 0; c < this.grid[r].length; c++) {
          const b = this.grid[r][c];
          if (b) {
            const { x, y } = this.getHexCenter(r, c);
            drawSingleBubble(ctx, x, y, this.radius, b);
          }
        }
      }

      // 4. Draw Falling / Dropped Bubbles
      for (const fb of this.fallingBubbles) {
        fb.draw(ctx);
      }

      // 5. Draw Aim Trajectory Line
      if (this.aiming && !this.flyingBubble) {
        this.drawAimLine(ctx);
      }

      // 6. Draw Shooter Base & Next Bubble Cradle
      this.drawShooter(ctx);

      // 7. Draw Flying Bubble
      if (this.flyingBubble) {
        drawSingleBubble(ctx, this.flyingBubble.x, this.flyingBubble.y, this.radius, this.flyingBubble.bubble);
      }

      // 8. Draw Particles & Floating Texts
      for (const p of this.particles) {
        p.draw(ctx);
      }
      for (const ft of this.floatingTexts) {
        ft.draw(ctx);
      }
    }

    drawGameBackground(ctx) {
      // Subtle background grid mesh
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      for (let y = this.topOffset; y < this.foulLineY; y += this.rowHeight) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(this.width, y);
        ctx.stroke();
      }
      ctx.restore();
    }

    drawAimLine(ctx) {
      ctx.save();
      const speed = 20;
      let curX = this.shooterX;
      let curY = this.shooterY;
      let vx = Math.cos(this.aimAngle) * speed;
      let vy = Math.sin(this.aimAngle) * speed;

      const dots = [];
      const maxBounces = this.aimHelperActive ? 3 : 1;
      let bounces = 0;
      let collisionPoint = null;

      for (let step = 0; step < 160; step++) {
        curX += vx;
        curY += vy;

        // Bounce walls
        if (curX - this.radius <= 0) {
          curX = this.radius;
          vx *= -1;
          bounces++;
          if (bounces > maxBounces) break;
        } else if (curX + this.radius >= this.width) {
          curX = this.width - this.radius;
          vx *= -1;
          bounces++;
          if (bounces > maxBounces) break;
        }

        // Check if hit top
        if (curY <= this.topOffset + this.radius) {
          collisionPoint = { x: curX, y: curY };
          break;
        }

        // Check if hit grid bubble
        let hit = false;
        for (let r = 0; r < this.grid.length; r++) {
          for (let c = 0; c < this.grid[r].length; c++) {
            if (this.grid[r][c]) {
              const { x, y } = this.getHexCenter(r, c);
              const dist = Math.hypot(curX - x, curY - y);
              if (dist <= this.radius * 1.85) {
                collisionPoint = { x: curX, y: curY };
                hit = true;
                break;
              }
            }
          }
          if (hit) break;
        }

        if (hit) break;
        if (step % 4 === 0) {
          dots.push({ x: curX, y: curY, idx: step });
        }
      }

      // Draw dotted laser line
      const colorHex = this.activeBubble?.colorObj?.hex || '#facc15';
      dots.forEach(d => {
        ctx.fillStyle = this.aimHelperActive ? '#38bdf8' : colorHex;
        ctx.beginPath();
        ctx.arc(d.x, d.y, this.aimHelperActive ? 3.5 : 2.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // If aim helper active, draw destination landing target ghost circle
      if (this.aimHelperActive && collisionPoint) {
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(collisionPoint.x, collisionPoint.y, this.radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();
    }

    drawShooter(ctx) {
      ctx.save();

      // Next Bubble Cradle (Left of shooter)
      const cradleX = this.shooterX - 60;
      const cradleY = this.shooterY;
      ctx.fillStyle = 'rgba(30, 41, 59, 0.8)';
      ctx.beginPath();
      ctx.arc(cradleX, cradleY, this.radius * 0.9, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      if (this.nextBubble) {
        drawSingleBubble(ctx, cradleX, cradleY, this.radius * 0.75, this.nextBubble);
      }

      // Shooter Pedestal & Turret Ring
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(this.shooterX, this.shooterY, this.radius * 1.35, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Rotating Pointer Arrow
      ctx.translate(this.shooterX, this.shooterY);
      ctx.rotate(this.aimAngle);

      ctx.fillStyle = 'rgba(52, 211, 153, 0.4)';
      ctx.beginPath();
      ctx.moveTo(this.radius * 1.1, -6);
      ctx.lineTo(this.radius * 1.7, 0);
      ctx.lineTo(this.radius * 1.1, 6);
      ctx.closePath();
      ctx.fill();

      ctx.rotate(-this.aimAngle);
      ctx.translate(-this.shooterX, -this.shooterY);

      // Active Loaded Bubble (Ready to fire)
      if (this.activeBubble && !this.flyingBubble) {
        drawSingleBubble(ctx, this.shooterX, this.shooterY, this.radius, this.activeBubble);
      }

      ctx.restore();
    }

    // --- HEXAGONAL GRID MATH ---
    getHexCenter(row, col) {
      const isOdd = row % 2 === 1;
      const xOffset = isOdd ? this.radius * 2 : this.radius;
      const x = col * (this.radius * 2) + xOffset;
      const y = row * this.rowHeight + this.topOffset + this.radius;
      return { x, y };
    }

    getClosestHexCell(x, y) {
      // Find the grid slot (r, c) closest to (x, y)
      let bestR = 0;
      let bestC = 0;
      let minDist = Infinity;

      for (let r = 0; r < this.maxRows; r++) {
        const colCount = (r % 2 === 1) ? this.cols - 1 : this.cols;
        for (let c = 0; c < colCount; c++) {
          const center = this.getHexCenter(r, c);
          const dist = Math.hypot(center.x - x, center.y - y);
          if (dist < minDist) {
            minDist = dist;
            bestR = r;
            bestC = c;
          }
        }
      }
      return { row: bestR, col: bestC };
    }

    getNeighbors(r, c) {
      const neighbors = [];
      const isOdd = r % 2 === 1;

      const deltas = isOdd ? [
        { dr: 0, dc: -1 }, { dr: 0, dc: 1 },
        { dr: -1, dc: 0 }, { dr: -1, dc: 1 },
        { dr: 1, dc: 0 },  { dr: 1, dc: 1 }
      ] : [
        { dr: 0, dc: -1 }, { dr: 0, dc: 1 },
        { dr: -1, dc: -1 }, { dr: -1, dc: 0 },
        { dr: 1, dc: -1 },  { dr: 1, dc: 0 }
      ];

      for (const d of deltas) {
        const nr = r + d.dr;
        const nc = c + d.dc;
        if (nr >= 0 && nr < this.maxRows) {
          const colLimit = (nr % 2 === 1) ? this.cols - 1 : this.cols;
          if (nc >= 0 && nc < colLimit) {
            neighbors.push({ row: nr, col: nc });
          }
        }
      }
      return neighbors;
    }

    // --- COLLISION & MATCHING ---
    checkBubbleCollision() {
      const fb = this.flyingBubble;
      if (!fb) return;

      let collided = false;

      // 1. Top ceiling contact
      if (fb.y - this.radius <= this.topOffset) {
        collided = true;
      } else {
        // 2. Contact with any active grid bubble
        for (let r = 0; r < this.grid.length; r++) {
          for (let c = 0; c < this.grid[r].length; c++) {
            if (this.grid[r][c]) {
              const center = this.getHexCenter(r, c);
              const dist = Math.hypot(fb.x - center.x, fb.y - center.y);
              if (dist <= this.radius * 1.85) {
                collided = true;
                break;
              }
            }
          }
          if (collided) break;
        }
      }

      if (collided) {
        this.snapBubbleToGrid(fb);
      }
    }

    snapBubbleToGrid(fb) {
      const target = this.getClosestHexCell(fb.x, fb.y);
      let r = target.row;
      let c = target.col;

      // If cell already occupied, find the closest unoccupied neighbor
      if (this.grid[r] && this.grid[r][c]) {
        const neighbors = this.getNeighbors(r, c);
        let bestNeighbor = null;
        let minD = Infinity;
        for (const n of neighbors) {
          if (!this.grid[n.row] || !this.grid[n.row][n.col]) {
            const center = this.getHexCenter(n.row, n.col);
            const d = Math.hypot(center.x - fb.x, center.y - fb.y);
            if (d < minD) {
              minD = d;
              bestNeighbor = n;
            }
          }
        }
        if (bestNeighbor) {
          r = bestNeighbor.row;
          c = bestNeighbor.col;
        }
      }

      // Ensure row array exists
      while (this.grid.length <= r) {
        this.grid.push([]);
      }

      // Attach bubble
      this.grid[r][c] = fb.bubble;
      this.flyingBubble = null;
      this.audio.playBounce();
      this.haptics.vibrate(20);

      // Handle special power-ups vs standard color matching
      if (fb.bubble.type === 'bomb') {
        this.handleBombExplosion(r, c);
      } else if (fb.bubble.type === 'rainbow') {
        this.handleRainbowMatch(r, c);
      } else {
        this.handleColorMatch(r, c, fb.bubble.colorObj.id);
      }

      // Decrement aim helper if used
      if (this.aimHelperActive) {
        this.aimHelperShotsLeft--;
        if (this.aimHelperShotsLeft <= 0) {
          this.aimHelperActive = false;
          document.getElementById('btn-powerup-aim').classList.remove('active');
        }
      }

      // Reload next bubble for shooter
      this.reloadShooter();
    }

    handleBombExplosion(r, c) {
      this.audio.playBomb();
      this.haptics.vibrate(80);

      // Explode all bubbles in radius of 2 steps
      const toDestroy = new Set();
      toDestroy.add(`${r},${c}`);

      const firstRing = this.getNeighbors(r, c);
      for (const n1 of firstRing) {
        toDestroy.add(`${n1.row},${n1.col}`);
        const secondRing = this.getNeighbors(n1.row, n1.col);
        for (const n2 of secondRing) {
          toDestroy.add(`${n2.row},${n2.col}`);
        }
      }

      let poppedCount = 0;
      toDestroy.forEach(key => {
        const [row, col] = key.split(',').map(Number);
        if (this.grid[row] && this.grid[row][col]) {
          const bubble = this.grid[row][col];
          const center = this.getHexCenter(row, col);
          this.spawnPopParticles(center.x, center.y, bubble.colorObj?.hex || '#fbbf24', 8);
          this.grid[row][col] = null;
          poppedCount++;
        }
      });

      const pts = poppedCount * 50;
      this.addScore(pts);
      const center = this.getHexCenter(r, c);
      this.floatingTexts.push(new FloatingText("BOOM! +" + pts, center.x, center.y, '#f87171', 22));

      // Drop any newly unsupported bubbles
      this.dropFloatingBubbles();

      // Check win/loss
      this.checkLevelConditions();
    }

    handleRainbowMatch(r, c) {
      this.audio.playRainbow();
      this.haptics.vibrate(40);

      // Look at all neighbors to adopt the color with the biggest cluster
      const neighbors = this.getNeighbors(r, c);
      let bestColor = null;
      let maxClusterSize = 0;

      for (const n of neighbors) {
        const neighborBubble = this.grid[n.row]?.[n.col];
        if (neighborBubble && neighborBubble.colorObj) {
          const colorId = neighborBubble.colorObj.id;
          const cluster = this.findCluster(n.row, n.col, colorId);
          if (cluster.length > maxClusterSize) {
            maxClusterSize = cluster.length;
            bestColor = neighborBubble.colorObj;
          }
        }
      }

      if (bestColor) {
        this.grid[r][c].colorObj = bestColor;
        this.handleColorMatch(r, c, bestColor.id);
      } else {
        // Fallback: pick any random active color
        this.grid[r][c].colorObj = BUBBLE_COLORS[0];
        this.handleColorMatch(r, c, BUBBLE_COLORS[0].id);
      }
    }

    handleColorMatch(r, c, colorId) {
      const cluster = this.findCluster(r, c, colorId);

      if (cluster.length >= 3) {
        this.comboCount++;
        const pts = cluster.length * 30 * this.comboCount;
        this.addScore(pts);

        // Pop sound with pitch scaled by combo
        this.audio.playPop(this.comboCount);
        this.haptics.vibrate(35);

        // Spawn particles and clear cells
        const praise = this.comboCount > 1 ? NAIJA_PRAISES[(this.comboCount - 2) % NAIJA_PRAISES.length] : null;
        let avgX = 0;
        let avgY = 0;

        for (const cell of cluster) {
          const b = this.grid[cell.row][cell.col];
          const center = this.getHexCenter(cell.row, cell.col);
          this.spawnPopParticles(center.x, center.y, b?.colorObj?.hex || '#34d399', 6);
          this.grid[cell.row][cell.col] = null;
          avgX += center.x;
          avgY += center.y;
        }

        avgX /= cluster.length;
        avgY /= cluster.length;

        if (praise) {
          this.floatingTexts.push(new FloatingText(praise, avgX, avgY - 15, '#fbbf24', 24));
        }
        this.floatingTexts.push(new FloatingText(`+${pts}`, avgX, avgY + 10, '#ffffff', 18));

        // Drop floating/unanchored bubbles
        this.dropFloatingBubbles();
      } else {
        // No match 3
        this.comboCount = 0;
        this.currentMisses++;
        if (this.currentMisses >= this.missesBeforeDescent) {
          this.currentMisses = 0;
          this.descendNewRow();
        }
      }

      this.checkLevelConditions();
    }

    findCluster(startR, startC, targetColorId) {
      const matched = [];
      const visited = new Set();
      const queue = [{ row: startR, col: startC }];
      visited.add(`${startR},${startC}`);

      while (queue.length > 0) {
        const curr = queue.shift();
        matched.push(curr);

        const neighbors = this.getNeighbors(curr.row, curr.col);
        for (const n of neighbors) {
          const key = `${n.row},${n.col}`;
          if (!visited.has(key)) {
            const b = this.grid[n.row]?.[n.col];
            if (b && b.type !== 'stone' && b.colorObj && b.colorObj.id === targetColorId) {
              visited.add(key);
              queue.push(n);
            }
          }
        }
      }
      return matched;
    }

    dropFloatingBubbles() {
      // Find all bubbles connected to ceiling (row 0)
      const connected = new Set();
      const queue = [];

      // Row 0 bubbles are anchors
      if (this.grid[0]) {
        for (let c = 0; c < this.cols; c++) {
          if (this.grid[0][c]) {
            connected.add(`0,${c}`);
            queue.push({ row: 0, col: c });
          }
        }
      }

      // BFS to mark all connected bubbles
      while (queue.length > 0) {
        const curr = queue.shift();
        const neighbors = this.getNeighbors(curr.row, curr.col);
        for (const n of neighbors) {
          const key = `${n.row},${n.col}`;
          if (!connected.has(key) && this.grid[n.row]?.[n.col]) {
            connected.add(key);
            queue.push(n);
          }
        }
      }

      // Any active bubble not in connected set is floating!
      let droppedCount = 0;
      for (let r = 0; r < this.grid.length; r++) {
        for (let c = 0; c < this.grid[r].length; c++) {
          if (this.grid[r][c] && !connected.has(`${r},${c}`)) {
            const b = this.grid[r][c];
            const center = this.getHexCenter(r, c);
            this.fallingBubbles.push(new FallingBubble(b, center.x, center.y, this.radius));
            this.grid[r][c] = null;
            droppedCount++;
          }
        }
      }

      if (droppedCount > 0) {
        this.audio.playDrop();
        const bonus = droppedCount * 100;
        this.addScore(bonus);
        this.floatingTexts.push(new FloatingText(`DROPPED ${droppedCount}! +${bonus}`, this.width / 2, this.shooterY - 80, '#6ee7b7', 22));
      }
    }

    descendNewRow() {
      // Move all rows down by 1
      this.grid.unshift([]);
      // Generate new top row with active colors
      const activeColors = this.getActiveGridColors();
      for (let c = 0; c < this.cols; c++) {
        const randColor = activeColors[Math.floor(Math.random() * activeColors.length)];
        this.grid[0][c] = {
          type: 'color',
          colorObj: randColor
        };
      }
      this.floatingTexts.push(new FloatingText("ROW DOWN!", this.width / 2, this.topOffset + 40, '#f87171', 18));
      this.audio.playBounce();
      this.haptics.vibrate(40);
    }

    spawnPopParticles(x, y, color, count = 8) {
      for (let i = 0; i < count; i++) {
        this.particles.push(new Particle(x, y, color, 4));
      }
    }

    // --- RELOADING & SELECTION ---
    reloadShooter() {
      this.shotsRemaining--;
      this.updateHud();

      // Shift next to active, generate new next
      this.activeBubble = this.nextBubble || this.generateShooterBubble();
      this.nextBubble = this.generateShooterBubble();
    }

    generateShooterBubble() {
      const activeColors = this.getActiveGridColors();
      const color = activeColors.length > 0 
        ? activeColors[Math.floor(Math.random() * activeColors.length)]
        : BUBBLE_COLORS[Math.floor(Math.random() * Math.min(this.levelConfig?.colorCount || 3, BUBBLE_COLORS.length))];

      return {
        type: 'color',
        colorObj: color
      };
    }

    getActiveGridColors() {
      const colorsSet = new Map();
      for (let r = 0; r < this.grid.length; r++) {
        for (let c = 0; c < this.grid[r].length; c++) {
          const b = this.grid[r][c];
          if (b && b.type === 'color' && b.colorObj) {
            colorsSet.set(b.colorObj.id, b.colorObj);
          }
        }
      }
      const list = Array.from(colorsSet.values());
      return list.length > 0 ? list : BUBBLE_COLORS.slice(0, 3);
    }

    swapBubbles() {
      if (this.flyingBubble || !this.activeBubble || !this.nextBubble) return;
      const temp = this.activeBubble;
      this.activeBubble = this.nextBubble;
      this.nextBubble = temp;
      this.audio.playClick();
      this.haptics.vibrate(15);
    }

    // --- SCORE & STARS ---
    addScore(amount) {
      this.score += amount;
      this.updateHud();
    }

    getStarsEarned() {
      if (!this.levelConfig) return 1;
      const th = this.levelConfig.starThresholds;
      if (this.score >= th[2]) return 3;
      if (this.score >= th[1]) return 2;
      return 1;
    }

    // --- WIN / LOSS CONDITIONS ---
    checkLevelConditions() {
      // Count remaining bubbles in grid
      let remainingCount = 0;
      let foulBreached = false;

      for (let r = 0; r < this.grid.length; r++) {
        for (let c = 0; c < this.grid[r].length; c++) {
          if (this.grid[r][c]) {
            remainingCount++;
            const center = this.getHexCenter(r, c);
            if (center.y + this.radius >= this.foulLineY) {
              foulBreached = true;
            }
          }
        }
      }

      // 1. Victory: All bubbles cleared!
      if (remainingCount === 0) {
        this.triggerWin();
        return;
      }

      // 2. Game Over: Bubbles reached bottom foul line
      if (foulBreached) {
        this.triggerGameOver("Grid breached the danger line!");
        return;
      }

      // 3. Game Over: Out of shots
      if (this.shotsRemaining <= 0 && !this.flyingBubble) {
        this.triggerGameOver("You ran out of shots, chief!");
        return;
      }
    }

    triggerWin() {
      this.state = 'WIN';
      this.audio.playWin();
      this.haptics.vibrate(70);

      const stars = this.getStarsEarned();
      const bonusCoins = 50 + (stars * 25) + (this.shotsRemaining * 5);
      this.storage.addCoins(bonusCoins);
      this.storage.recordLevelWin(this.currentLevel, this.score, stars);

      // Populate Win Modal
      document.getElementById('win-score').textContent = this.score.toLocaleString();
      document.getElementById('win-coins').textContent = `+${bonusCoins} 🪙`;
      document.getElementById('win-remaining-shots').textContent = `${this.shotsRemaining} (Bonus Coins!)`;

      const starsContainer = document.getElementById('win-stars');
      starsContainer.innerHTML = '';
      for (let i = 1; i <= 3; i++) {
        const s = document.createElement('span');
        s.textContent = '★';
        s.className = (i <= stars) ? 'star-filled' : 'star-empty';
        starsContainer.appendChild(s);
      }

      document.getElementById('modal-win').classList.remove('hidden');
    }

    triggerGameOver(reason) {
      this.state = 'GAMEOVER';
      this.audio.playGameOver();
      this.haptics.vibrate(100);

      document.getElementById('gameover-reason').textContent = reason;
      document.getElementById('modal-gameover').classList.remove('hidden');
    }

    // --- LEVEL SETUP ---
    startLevel(levelNum) {
      if (!this.storage.consumeLife()) {
        alert("No lives remaining! Refill lives in shop or wait for timer.");
        return;
      }

      this.currentLevel = levelNum;
      this.levelConfig = getLevelConfig(levelNum);
      this.score = 0;
      this.shotsRemaining = this.levelConfig.shots;
      this.comboCount = 0;
      this.currentMisses = 0;
      this.aimHelperActive = false;
      this.particles = [];
      this.floatingTexts = [];
      this.fallingBubbles = [];
      this.flyingBubble = null;

      // Build grid layout
      this.grid = [];
      const numRows = this.levelConfig.initialRows;
      const palette = BUBBLE_COLORS.slice(0, this.levelConfig.colorCount);

      for (let r = 0; r < numRows; r++) {
        this.grid[r] = [];
        const colsInRow = (r % 2 === 1) ? this.cols - 1 : this.cols;
        for (let c = 0; c < colsInRow; c++) {
          // Blockers probability
          if (this.levelConfig.hasBlockers && Math.random() < this.levelConfig.blockerChance && r > 1) {
            this.grid[r][c] = { type: 'stone' };
          } else {
            const randCol = palette[Math.floor(Math.random() * palette.length)];
            this.grid[r][c] = {
              type: 'color',
              colorObj: randCol
            };
          }
        }
      }

      // Initialize shooter
      this.activeBubble = this.generateShooterBubble();
      this.nextBubble = this.generateShooterBubble();

      // UI state
      this.state = 'PLAYING';
      document.getElementById('screen-map').classList.add('hidden');
      document.getElementById('modal-level-preview').classList.add('hidden');
      document.getElementById('modal-win').classList.add('hidden');
      document.getElementById('modal-gameover').classList.add('hidden');
      document.getElementById('modal-pause').classList.add('hidden');

      this.updateHud();
      this.updatePowerupTray();
      this.updateCurrencyDisplays();
    }

    updateHud() {
      document.getElementById('hud-score').textContent = this.score.toLocaleString();
      document.getElementById('hud-shots').textContent = this.shotsRemaining;
      document.getElementById('hud-level-num').textContent = this.currentLevel;

      if (this.levelConfig) {
        const target = this.levelConfig.starThresholds[1];
        document.getElementById('hud-target-sub').textContent = `/ ${target}`;
        const stars = this.getStarsEarned();
        document.getElementById('hud-star-1').className = stars >= 1 ? 'star-filled' : 'star-empty';
        document.getElementById('hud-star-2').className = stars >= 2 ? 'star-filled' : 'star-empty';
        document.getElementById('hud-star-3').className = stars >= 3 ? 'star-filled' : 'star-empty';
      }
    }

    updatePowerupTray() {
      const p = this.storage.data.powerups;
      document.getElementById('count-powerup-bomb').textContent = p.bomb || 0;
      document.getElementById('count-powerup-rainbow').textContent = p.rainbow || 0;
      document.getElementById('count-powerup-aim').textContent = p.aim || 0;
    }

    updateCurrencyDisplays() {
      this.storage.checkLivesRefill();
      const d = this.storage.data;
      document.getElementById('map-coins-count').textContent = d.coins;
      document.getElementById('shop-coin-balance').textContent = d.coins;
      document.getElementById('map-lives-count').textContent = d.lives;

      const timerSpan = document.getElementById('map-lives-timer');
      if (d.lives >= MAX_LIVES) {
        timerSpan.textContent = 'FULL';
      } else {
        const ms = this.storage.getTimeUntilNextLife();
        const mins = Math.floor(ms / 60000);
        const secs = Math.floor((ms % 60000) / 1000);
        timerSpan.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
      }
    }

    startLivesTimer() {
      setInterval(() => {
        this.updateCurrencyDisplays();
      }, 1000);
    }

    // --- LEVEL MAP SCREEN (SAGA) ---
    renderLevelMap() {
      const container = document.getElementById('level-map-scroll');
      container.innerHTML = '';

      const unlocked = this.storage.data.unlockedLevel || 1;
      const starsMap = this.storage.data.levelStars || {};

      // Build from Level 1 to 50
      for (let i = 1; i <= 50; i++) {
        // Add zone banner before first level of each zone
        if ((i - 1) % 10 === 0) {
          const zoneIdx = (i - 1) / 10;
          const zone = ZONES[zoneIdx];
          const banner = document.createElement('div');
          banner.className = 'zone-banner';
          banner.innerHTML = `
            <div class="zone-title">📍 Region ${zone.id}: ${zone.name}</div>
            <div class="zone-desc">${zone.desc}</div>
          `;
          container.appendChild(banner);
        }

        const row = document.createElement('div');
        row.className = 'level-node-row';

        // Winding sine-wave offset to make a classic playful saga path
        const offset = Math.sin((i / 50) * Math.PI * 5) * 80;
        row.style.transform = `translateX(${offset}px)`;

        const node = document.createElement('div');
        node.className = 'level-node';
        if (i < unlocked) {
          node.classList.add('unlocked');
        } else if (i === unlocked) {
          node.classList.add('current');
        } else {
          node.classList.add('locked');
        }

        const stars = starsMap[i] || 0;
        node.innerHTML = `
          <div class="level-num">${i}</div>
          <div class="level-stars">
            <span class="${stars >= 1 ? 'star-filled' : 'star-empty'}">★</span>
            <span class="${stars >= 2 ? 'star-filled' : 'star-empty'}">★</span>
            <span class="${stars >= 3 ? 'star-filled' : 'star-empty'}">★</span>
          </div>
        `;

        node.addEventListener('click', () => {
          if (i <= unlocked) {
            this.showLevelPreview(i);
          } else {
            this.haptics.vibrate(20);
            this.audio.playBounce();
          }
        });

        row.appendChild(node);
        container.appendChild(row);
      }
    }

    showLevelPreview(levelNum) {
      this.currentLevel = levelNum;
      const cfg = getLevelConfig(levelNum);
      const stars = this.storage.data.levelStars[levelNum] || 0;

      document.getElementById('preview-title').textContent = `Level ${levelNum}: ${cfg.name}`;
      document.getElementById('preview-zone').textContent = `${cfg.zone.name} (Zone ${cfg.zone.id})`;
      document.getElementById('preview-target').textContent = `${cfg.starThresholds[1].toLocaleString()} pts`;
      document.getElementById('preview-shots').textContent = `${cfg.shots} Shots`;
      document.getElementById('preview-stars').textContent = `${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}`;

      document.getElementById('modal-level-preview').classList.remove('hidden');
      this.audio.playClick();
    }

    // --- REWARDED ADS SIMULATION (Ready for AdMob SDK) ---
    showRewardedAd(rewardType, onRewarded) {
      const modal = document.getElementById('modal-ad-interstitial');
      const timerText = document.getElementById('ad-timer-text');
      const statusMsg = document.getElementById('ad-status-msg');
      const claimBtn = document.getElementById('btn-claim-ad-reward');

      // Random Nigerian sponsor
      const sponsors = [
        { emoji: '🍲', title: 'Mama Put Jollof Spot', desc: 'The real hot smoky party jollof in Ikeja!' },
        { emoji: '🚌', title: 'Danfo Express Rides', desc: 'Quickest yellow bus hop across the mainland!' },
        { emoji: '👕', title: 'Ankara Swag House', desc: 'Custom tailored fabrics for every owambe ceremony.' }
      ];
      const sp = sponsors[Math.floor(Math.random() * sponsors.length)];
      document.getElementById('ad-sponsor-emoji').textContent = sp.emoji;
      document.getElementById('ad-sponsor-title').textContent = sp.title;
      document.getElementById('ad-sponsor-desc').textContent = sp.desc;

      claimBtn.classList.add('hidden');
      statusMsg.textContent = 'Watching sponsored ad to earn reward...';
      modal.classList.remove('hidden');

      let seconds = 3;
      timerText.textContent = `${seconds}s`;

      const interval = setInterval(() => {
        seconds--;
        if (seconds > 0) {
          timerText.textContent = `${seconds}s`;
        } else {
          clearInterval(interval);
          timerText.textContent = 'Done!';
          statusMsg.textContent = 'Ad complete! Click below to claim your reward.';
          claimBtn.classList.remove('hidden');
          claimBtn.onclick = () => {
            modal.classList.add('hidden');
            if (onRewarded) onRewarded();
            this.audio.playWin();
            this.haptics.vibrate(50);
          };
        }
      }, 1000);
    }

    // --- DAILY STREAK REWARDS ---
    checkDailyRewardPrompt() {
      const today = new Date().toISOString().slice(0, 10);
      if (this.storage.data.lastDailyClaimDate !== today) {
        this.openDailyRewardModal();
      }
    }

    openDailyRewardModal() {
      const modal = document.getElementById('modal-daily');
      const grid = document.getElementById('daily-streak-container');
      grid.innerHTML = '';

      const streak = this.storage.data.dailyStreak % 7;
      const today = new Date().toISOString().slice(0, 10);
      const isClaimedToday = (this.storage.data.lastDailyClaimDate === today);

      const rewards = [
        { day: 1, icon: '🪙', text: '100 Coins' },
        { day: 2, icon: '🎯', text: '150c + Aim' },
        { day: 3, icon: '💣', text: '200c + Bomb' },
        { day: 4, icon: '🌈', text: '250c + Rainbow' },
        { day: 5, icon: '💣', text: '350c + 2 Bombs' },
        { day: 6, icon: '🌈', text: '500c + 2 Rainbows' },
        { day: 7, icon: '🎁', text: '1,000c + All Gifts!' }
      ];

      rewards.forEach((r, idx) => {
        const item = document.createElement('div');
        item.className = 'streak-item';
        if (idx < streak) {
          item.classList.add('claimed');
        } else if (idx === streak && !isClaimedToday) {
          item.classList.add('today');
        }

        item.innerHTML = `
          <div class="streak-day">Day ${r.day}</div>
          <div style="font-size: 20px;">${r.icon}</div>
          <div class="streak-reward">${r.text}</div>
        `;
        grid.appendChild(item);
      });

      const claimBtn = document.getElementById('btn-claim-daily');
      if (isClaimedToday) {
        claimBtn.disabled = true;
        claimBtn.textContent = 'Already Claimed Today!';
        claimBtn.style.opacity = '0.5';
      } else {
        claimBtn.disabled = false;
        claimBtn.textContent = `Claim Day ${streak + 1} Reward!`;
        claimBtn.style.opacity = '1';
        claimBtn.onclick = () => {
          this.storage.data.lastDailyClaimDate = today;
          this.storage.data.dailyStreak = streak + 1;

          if (streak === 0) this.storage.addCoins(100);
          else if (streak === 1) { this.storage.addCoins(150); this.storage.addPowerup('aim', 1); }
          else if (streak === 2) { this.storage.addCoins(200); this.storage.addPowerup('bomb', 1); }
          else if (streak === 3) { this.storage.addCoins(250); this.storage.addPowerup('rainbow', 1); }
          else if (streak === 4) { this.storage.addCoins(350); this.storage.addPowerup('bomb', 2); }
          else if (streak === 5) { this.storage.addCoins(500); this.storage.addPowerup('rainbow', 2); }
          else if (streak === 6) {
            this.storage.addCoins(1000);
            this.storage.addPowerup('bomb', 3);
            this.storage.addPowerup('rainbow', 3);
            this.storage.addPowerup('aim', 3);
          }
          this.storage.save();
          this.updateCurrencyDisplays();
          modal.classList.add('hidden');
          this.audio.playWin();
          this.haptics.vibrate(60);
        };
      }

      modal.classList.remove('hidden');
    }

    // --- EVENT LISTENERS & TOUCH CONTROLS ---
    initEvents() {
      // Touch & Mouse Aim Controls on Canvas
      const handleStart = (clientX, clientY) => {
        if (this.state !== 'PLAYING' || this.flyingBubble) return;
        this.aiming = true;
        this.updateAimAngle(clientX, clientY);
      };

      const handleMove = (clientX, clientY) => {
        if (!this.aiming) return;
        this.updateAimAngle(clientX, clientY);
      };

      const handleEnd = () => {
        if (!this.aiming) return;
        this.aiming = false;
        this.fireBubble();
      };

      this.canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const t = e.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        handleStart(t.clientX - rect.left, t.clientY - rect.top);
      }, { passive: false });

      this.canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const t = e.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        handleMove(t.clientX - rect.left, t.clientY - rect.top);
      }, { passive: false });

      this.canvas.addEventListener('touchend', (e) => {
        e.preventDefault();
        handleEnd();
      }, { passive: false });

      this.canvas.addEventListener('mousedown', (e) => {
        const rect = this.canvas.getBoundingClientRect();
        handleStart(e.clientX - rect.left, e.clientY - rect.top);
      });

      window.addEventListener('mousemove', (e) => {
        if (!this.aiming) return;
        const rect = this.canvas.getBoundingClientRect();
        handleMove(e.clientX - rect.left, e.clientY - rect.top);
      });

      window.addEventListener('mouseup', () => {
        handleEnd();
      });

      // Swap Bubble Click
      document.getElementById('btn-swap-bubble').addEventListener('click', () => {
        this.swapBubbles();
      });

      // Pause button
      document.getElementById('btn-pause').addEventListener('click', () => {
        if (this.state === 'PLAYING') {
          this.state = 'PAUSED';
          document.getElementById('modal-pause').classList.remove('hidden');
          this.audio.playClick();
        }
      });

      document.getElementById('btn-resume').addEventListener('click', () => {
        this.state = 'PLAYING';
        document.getElementById('modal-pause').classList.add('hidden');
        this.audio.playClick();
      });

      document.getElementById('btn-restart-pause').addEventListener('click', () => {
        document.getElementById('modal-pause').classList.add('hidden');
        this.startLevel(this.currentLevel);
      });

      document.getElementById('btn-quit-map').addEventListener('click', () => {
        this.state = 'MAP';
        document.getElementById('modal-pause').classList.add('hidden');
        document.getElementById('screen-map').classList.remove('hidden');
        this.renderLevelMap();
      });

      // Start level from preview
      document.getElementById('btn-start-level').addEventListener('click', () => {
        this.startLevel(this.currentLevel);
      });

      document.getElementById('btn-close-preview').addEventListener('click', () => {
        document.getElementById('modal-level-preview').classList.add('hidden');
      });

      // Win Modal Actions
      document.getElementById('btn-next-level').addEventListener('click', () => {
        document.getElementById('modal-win').classList.add('hidden');
        if (this.currentLevel < 50) {
          this.startLevel(this.currentLevel + 1);
        } else {
          this.state = 'MAP';
          document.getElementById('screen-map').classList.remove('hidden');
          this.renderLevelMap();
        }
      });

      document.getElementById('btn-replay-win').addEventListener('click', () => {
        document.getElementById('modal-win').classList.add('hidden');
        this.startLevel(this.currentLevel);
      });

      document.getElementById('btn-map-win').addEventListener('click', () => {
        this.state = 'MAP';
        document.getElementById('modal-win').classList.add('hidden');
        document.getElementById('screen-map').classList.remove('hidden');
        this.renderLevelMap();
      });

      // Game Over Actions
      document.getElementById('btn-try-again').addEventListener('click', () => {
        document.getElementById('modal-gameover').classList.add('hidden');
        this.startLevel(this.currentLevel);
      });

      document.getElementById('btn-map-gameover').addEventListener('click', () => {
        this.state = 'MAP';
        document.getElementById('modal-gameover').classList.add('hidden');
        document.getElementById('screen-map').classList.remove('hidden');
        this.renderLevelMap();
      });

      // Rewarded Ad Revive (+5 Extra Shots)
      document.getElementById('btn-ad-revive').addEventListener('click', () => {
        this.showRewardedAd('extra_shots', () => {
          this.shotsRemaining += 5;
          document.getElementById('modal-gameover').classList.add('hidden');
          this.state = 'PLAYING';
          this.updateHud();
          this.floatingTexts.push(new FloatingText("+5 SHOTS GRANTED!", this.width / 2, this.shooterY - 80, '#38bdf8', 22));
        });
      });

      // Shop Modal Trigger
      document.getElementById('btn-open-shop').addEventListener('click', () => {
        document.getElementById('modal-shop').classList.remove('hidden');
        this.audio.playClick();
      });

      document.getElementById('btn-close-shop').addEventListener('click', () => {
        document.getElementById('modal-shop').classList.add('hidden');
      });

      // Shop Item Buy Buttons
      document.querySelectorAll('.shop-buy-btn[data-item]').forEach(btn => {
        btn.addEventListener('click', () => {
          const item = btn.getAttribute('data-item');
          const cost = parseInt(btn.getAttribute('data-cost'), 10);
          if (this.storage.spendCoins(cost)) {
            if (item === 'bomb') this.storage.addPowerup('bomb', 3);
            else if (item === 'rainbow') this.storage.addPowerup('rainbow', 2);
            else if (item === 'aim') this.storage.addPowerup('aim', 5);
            else if (item === 'lives') this.storage.addLives(5);

            this.updatePowerupTray();
            this.updateCurrencyDisplays();
            this.audio.playWin();
            this.haptics.vibrate(40);
          } else {
            alert("Not enough coins, chief! Play levels or watch a video ad.");
            this.audio.playBounce();
          }
        });
      });

      // Shop Free Coins via Video Ad
      document.getElementById('btn-shop-ad').addEventListener('click', () => {
        this.showRewardedAd('coins', () => {
          this.storage.addCoins(100);
          this.updateCurrencyDisplays();
        });
      });

      // Daily Reward Button on Map
      document.getElementById('btn-daily-reward').addEventListener('click', () => {
        this.openDailyRewardModal();
        this.audio.playClick();
      });

      document.getElementById('btn-close-daily').addEventListener('click', () => {
        document.getElementById('modal-daily').classList.add('hidden');
      });

      // Map Lives button
      document.getElementById('btn-map-lives').addEventListener('click', () => {
        document.getElementById('modal-shop').classList.remove('hidden');
      });

      // Settings Modal
      document.getElementById('btn-map-settings').addEventListener('click', () => {
        document.getElementById('modal-settings').classList.remove('hidden');
        this.audio.playClick();
      });

      document.getElementById('btn-close-settings').addEventListener('click', () => {
        document.getElementById('modal-settings').classList.add('hidden');
      });

      document.getElementById('setting-sound').addEventListener('change', (e) => {
        this.audio.enabled = e.target.checked;
        this.storage.data.settings.sound = e.target.checked;
        this.storage.save();
      });

      document.getElementById('setting-vibration').addEventListener('change', (e) => {
        this.haptics.enabled = e.target.checked;
        this.storage.data.settings.vibration = e.target.checked;
        this.storage.save();
      });

      document.getElementById('btn-reset-data').addEventListener('click', () => {
        if (confirm("Reset all level progress and coins?")) {
          this.storage.resetAll();
          this.updateCurrencyDisplays();
          this.renderLevelMap();
          document.getElementById('modal-settings').classList.add('hidden');
        }
      });

      // Power-up Tray In-Game Buttons
      document.getElementById('btn-powerup-bomb').addEventListener('click', () => {
        if (this.flyingBubble) return;
        if (this.storage.usePowerup('bomb')) {
          this.activeBubble = { type: 'bomb' };
          this.updatePowerupTray();
          this.audio.playClick();
          this.haptics.vibrate(25);
        } else {
          document.getElementById('modal-shop').classList.remove('hidden');
        }
      });

      document.getElementById('btn-powerup-rainbow').addEventListener('click', () => {
        if (this.flyingBubble) return;
        if (this.storage.usePowerup('rainbow')) {
          this.activeBubble = { type: 'rainbow' };
          this.updatePowerupTray();
          this.audio.playRainbow();
          this.haptics.vibrate(25);
        } else {
          document.getElementById('modal-shop').classList.remove('hidden');
        }
      });

      document.getElementById('btn-powerup-aim').addEventListener('click', () => {
        if (this.aimHelperActive) return;
        if (this.storage.usePowerup('aim')) {
          this.aimHelperActive = true;
          this.aimHelperShotsLeft = 3;
          document.getElementById('btn-powerup-aim').classList.add('active');
          this.updatePowerupTray();
          this.audio.playClick();
          this.haptics.vibrate(25);
        } else {
          document.getElementById('modal-shop').classList.remove('hidden');
        }
      });
    }

    updateAimAngle(clientX, clientY) {
      const dx = clientX - this.shooterX;
      const dy = clientY - this.shooterY;
      let angle = Math.atan2(dy, dx);

      // Clamp angle so bubble only shoots upwards (between -170 deg and -10 deg)
      const minAngle = -Math.PI * 0.95;
      const maxAngle = -Math.PI * 0.05;
      this.aimAngle = Math.max(minAngle, Math.min(maxAngle, angle));
    }

    fireBubble() {
      if (this.flyingBubble || !this.activeBubble) return;

      const speed = 22; // Smooth 60fps velocity
      this.flyingBubble = {
        bubble: this.activeBubble,
        x: this.shooterX,
        y: this.shooterY,
        vx: Math.cos(this.aimAngle) * speed,
        vy: Math.sin(this.aimAngle) * speed
      };

      this.audio.playShoot();
      this.haptics.vibrate(15);
    }
  }

  // Boot the engine when window loads
  window.addEventListener('load', () => {
    window.gameEngine = new GameEngine();
  });
})();
