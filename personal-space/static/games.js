// ===== PERSONAL SPACE — Games Logic =====

/* ─────────────────────────────────────────
   GAME TAB SWITCHER
───────────────────────────────────────── */
function switchGame(gameId) {
  document.querySelectorAll('.game-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.game-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('panel-' + gameId).classList.add('active');
  document.querySelector('[data-game="' + gameId + '"]').classList.add('active');

  // Stop other games cleanly
  if (gameId !== 'star' && starGame) starGame.stop();
  if (gameId !== 'bubble' && bubbleGame) bubbleGame.stop();
}

/* ─────────────────────────────────────────
   GAME 1 — STAR CATCHER (Canvas)
───────────────────────────────────────── */
let starGame = null;

class StarCatcher {
  constructor() {
    this.canvas = document.getElementById('star-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.running = false;
    this.raf = null;
    this.bindEvents();
    this.drawIdle();
  }

  reset() {
    this.basket = { x: this.canvas.width / 2 - 44, y: this.canvas.height - 62, w: 88, h: 28 };
    this.stars = [];
    this.particles = [];
    this.score = 0;
    this.lives = 3;
    this.speed = 1.8;
    this.frame = 0;
    this.spawnEvery = 75;
    this.leftDown = false;
    this.rightDown = false;
  }

  bindEvents() {
    this.canvas.addEventListener('mousemove', (e) => {
      const r = this.canvas.getBoundingClientRect();
      this.basket && (this.basket.x = Math.max(0, Math.min(
        this.canvas.width - this.basket.w,
        (e.clientX - r.left) * (this.canvas.width / r.width) - this.basket.w / 2
      )));
    });
    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const r = this.canvas.getBoundingClientRect();
      this.basket && (this.basket.x = Math.max(0, Math.min(
        this.canvas.width - this.basket.w,
        (e.touches[0].clientX - r.left) * (this.canvas.width / r.width) - this.basket.w / 2
      )));
    }, { passive: false });
    this._keyDown = (e) => {
      if (e.key === 'ArrowLeft') this.leftDown = true;
      if (e.key === 'ArrowRight') this.rightDown = true;
    };
    this._keyUp = (e) => {
      if (e.key === 'ArrowLeft') this.leftDown = false;
      if (e.key === 'ArrowRight') this.rightDown = false;
    };
    document.addEventListener('keydown', this._keyDown);
    document.addEventListener('keyup', this._keyUp);
    this.canvas.addEventListener('click', () => {
      if (!this.running) this.start();
    });
  }

  spawnStar() {
    const types = [
      { emoji: '⭐', pts: 1 },
      { emoji: '🌟', pts: 1 },
      { emoji: '💫', pts: 1 },
      { emoji: '🌸', pts: 2 },
      { emoji: '💖', pts: 2 },
      { emoji: '🦋', pts: 3 },
    ];
    const t = types[Math.floor(Math.random() * types.length)];
    this.stars.push({
      x: 20 + Math.random() * (this.canvas.width - 40),
      y: -30, size: 26,
      speed: this.speed + Math.random() * 1.2,
      emoji: t.emoji, pts: t.pts,
      rot: Math.random() * Math.PI * 2
    });
  }

  addParticles(x, y, emoji) {
    for (let i = 0; i < 6; i++) {
      this.particles.push({
        x, y, 
        vx: (Math.random() - 0.5) * 5,
        vy: -Math.random() * 4 - 1,
        life: 1,
        emoji
      });
    }
  }

  update() {
    this.frame++;
    // Keyboard basket move
    if (this.leftDown)  this.basket.x = Math.max(0, this.basket.x - 6);
    if (this.rightDown) this.basket.x = Math.min(this.canvas.width - this.basket.w, this.basket.x + 6);

    // Spawn
    if (this.frame % this.spawnEvery === 0) {
      this.spawnStar();
      if (this.speed < 5) this.speed += 0.06;
      if (this.spawnEvery > 28) this.spawnEvery--;
    }

    // Update stars
    for (let i = this.stars.length - 1; i >= 0; i--) {
      const s = this.stars[i];
      s.y += s.speed;
      s.rot += 0.04;

      // Catch check
      const caught = s.y + s.size / 2 >= this.basket.y &&
                     s.y - s.size / 2 <= this.basket.y + this.basket.h &&
                     s.x > this.basket.x - 10 &&
                     s.x < this.basket.x + this.basket.w + 10;
      if (caught) {
        this.addParticles(s.x, s.y, s.emoji);
        this.stars.splice(i, 1);
        this.score += s.pts;
        continue;
      }
      // Missed
      if (s.y > this.canvas.height + 20) {
        this.stars.splice(i, 1);
        this.lives--;
        if (this.lives <= 0) { this.running = false; }
      }
    }

    // Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx; p.y += p.vy; p.vy += 0.15; p.life -= 0.05;
      if (p.life <= 0) this.particles.splice(i, 1);
    }
  }

  draw() {
    const ctx = this.ctx, W = this.canvas.width, H = this.canvas.height;
    // BG
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, '#f0ecff'); bg.addColorStop(1, '#fde8f0');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

    // Stars
    this.stars.forEach(s => {
      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate(s.rot);
      ctx.font = s.size + 'px serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(s.emoji, 0, 0);
      ctx.restore();
    });

    // Particles
    this.particles.forEach(p => {
      ctx.save();
      ctx.globalAlpha = p.life;
      ctx.font = '18px serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(p.emoji, p.x, p.y);
      ctx.restore();
    });

    // Basket
    const bx = this.basket.x, by = this.basket.y, bw = this.basket.w, bh = this.basket.h;
    const bGrad = ctx.createLinearGradient(bx, by, bx + bw, by);
    bGrad.addColorStop(0, '#ef7fa5'); bGrad.addColorStop(1, '#9b87fb');
    ctx.fillStyle = bGrad;
    ctx.beginPath();
    ctx.roundRect(bx, by, bw, bh, 10);
    ctx.fill();
    ctx.font = '18px serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('🧺', bx + bw / 2, by + bh / 2 + 1);

    // HUD
    ctx.fillStyle = '#3a2d4e';
    ctx.font = 'bold 15px Nunito, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('⭐ ' + this.score, 12, 26);
    ctx.textAlign = 'right';
    ctx.fillText('❤️ ' + '💖'.repeat(Math.max(0, this.lives)), W - 12, 26);

    // Game over overlay
    if (!this.running && this.frame > 0) {
      ctx.fillStyle = 'rgba(240,236,255,0.88)';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#3a2d4e';
      ctx.font = 'bold 28px Playfair Display, serif';
      ctx.textAlign = 'center';
      ctx.fillText('Game Over! 🌸', W / 2, H / 2 - 50);
      ctx.font = '18px Nunito, sans-serif';
      ctx.fillStyle = '#6b5b7e';
      ctx.fillText('You caught ' + this.score + ' stars ⭐', W / 2, H / 2 - 10);
      ctx.font = '15px Nunito, sans-serif';
      ctx.fillStyle = '#9b87fb';
      ctx.fillText('Click to play again 💫', W / 2, H / 2 + 30);
    }
  }

  drawIdle() {
    const ctx = this.ctx, W = this.canvas.width, H = this.canvas.height;
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, '#f0ecff'); bg.addColorStop(1, '#fde8f0');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#3a2d4e';
    ctx.font = 'bold 24px Playfair Display, serif';
    ctx.textAlign = 'center';
    ctx.fillText('⭐ Star Catcher ⭐', W / 2, H / 2 - 30);
    ctx.font = '16px Nunito, sans-serif';
    ctx.fillStyle = '#6b5b7e';
    ctx.fillText('Click to Start!', W / 2, H / 2 + 10);
    ctx.font = '14px Nunito, sans-serif';
    ctx.fillStyle = '#b0a0c5';
    ctx.fillText('Move mouse or use ← → keys to catch stars', W / 2, H / 2 + 38);
  }

  loop() {
    this.update();
    this.draw();
    if (this.running) this.raf = requestAnimationFrame(() => this.loop());
  }

  start() {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.reset();
    this.running = true;
    this.loop();
  }

  stop() {
    this.running = false;
    if (this.raf) cancelAnimationFrame(this.raf);
  }
}

/* ─────────────────────────────────────────
   GAME 2 — MEMORY BLOOM (Card Flip)
───────────────────────────────────────── */
let memoryGame = null;

class MemoryBloom {
  constructor() {
    this.board = document.getElementById('memory-board');
    this.movesEl = document.getElementById('memory-moves');
    this.timerEl = document.getElementById('memory-timer');
    this.msgEl = document.getElementById('memory-msg');
    if (!this.board) return;
    this.emojis = ['🌸','💖','✨','🦋','🌙','🌟','🎀','🍓','🌺','💜'];
    this.reset();
  }

  reset() {
    this.cards = [];
    this.flipped = [];
    this.matched = 0;
    this.moves = 0;
    this.locked = false;
    this.seconds = 0;
    clearInterval(this.timerInterval);
    this.timerInterval = null;
    if (this.movesEl) this.movesEl.textContent = '0';
    if (this.timerEl) this.timerEl.textContent = '0s';
    if (this.msgEl) { this.msgEl.textContent = ''; this.msgEl.style.display = 'none'; }
    this.render();
  }

  shuffle(arr) {
    return [...arr].sort(() => Math.random() - 0.5);
  }

  render() {
    const pairs = this.emojis.slice(0, 8);
    const deck = this.shuffle([...pairs, ...pairs]);
    this.board.innerHTML = '';
    this.board.style.gridTemplateColumns = 'repeat(4, 1fr)';
    deck.forEach((emoji, i) => {
      const card = document.createElement('div');
      card.className = 'mem-card';
      card.dataset.emoji = emoji;
      card.dataset.index = i;
      card.innerHTML = `<div class="mem-inner"><div class="mem-front">🌸</div><div class="mem-back">${emoji}</div></div>`;
      card.addEventListener('click', () => this.flip(card));
      this.board.appendChild(card);
    });
  }

  startTimer() {
    if (this.timerInterval) return;
    this.timerInterval = setInterval(() => {
      this.seconds++;
      if (this.timerEl) this.timerEl.textContent = this.seconds + 's';
    }, 1000);
  }

  flip(card) {
    if (this.locked || card.classList.contains('flipped') || card.classList.contains('matched')) return;
    this.startTimer();
    card.classList.add('flipped');
    this.flipped.push(card);

    if (this.flipped.length === 2) {
      this.moves++;
      if (this.movesEl) this.movesEl.textContent = this.moves;
      this.locked = true;
      const [a, b] = this.flipped;
      if (a.dataset.emoji === b.dataset.emoji) {
        a.classList.add('matched'); b.classList.add('matched');
        this.flipped = [];
        this.locked = false;
        this.matched += 2;
        if (this.matched === 16) this.win();
      } else {
        setTimeout(() => {
          a.classList.remove('flipped'); b.classList.remove('flipped');
          this.flipped = []; this.locked = false;
        }, 1000);
      }
    }
  }

  win() {
    clearInterval(this.timerInterval);
    if (this.msgEl) {
      this.msgEl.style.display = 'block';
      this.msgEl.innerHTML = `🎉 You matched all pairs!<br>Moves: <b>${this.moves}</b> · Time: <b>${this.seconds}s</b>`;
    }
  }
}

/* ─────────────────────────────────────────
   GAME 3 — BUBBLE POP (Timer)
───────────────────────────────────────── */
let bubbleGame = null;

class BubblePop {
  constructor() {
    this.arena = document.getElementById('bubble-arena');
    this.scoreEl = document.getElementById('bubble-score');
    this.timerEl = document.getElementById('bubble-timer');
    this.msgEl = document.getElementById('bubble-msg');
    if (!this.arena) return;
    this.running = false;
    this.score = 0;
    this.timeLeft = 30;
    this.interval = null;
    this.spawnInterval = null;
    this.gradients = [
      ['#ef7fa5','#f9c6d8'],['#9b87fb','#d9d0ff'],['#ffb999','#ffd8c0'],
      ['#5ec9a0','#c0f0de'],['#ffe066','#fff3b0'],['#74b9ff','#c8e6ff']
    ];
  }

  reset() {
    this.score = 0;
    this.timeLeft = 30;
    clearInterval(this.interval);
    clearInterval(this.spawnInterval);
    this.arena.innerHTML = '';
    if (this.scoreEl) this.scoreEl.textContent = '0';
    if (this.timerEl) this.timerEl.textContent = '30';
    if (this.msgEl) { this.msgEl.textContent = ''; this.msgEl.style.display = 'none'; }
  }

  spawnBubble() {
    const size = 44 + Math.random() * 50;
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    const [c1, c2] = this.gradients[Math.floor(Math.random() * this.gradients.length)];
    const areaW = this.arena.clientWidth - size;
    const areaH = this.arena.clientHeight - size;
    const emojis = ['✨','💖','🌸','⭐','🦋','🌙','💫','🎀'];
    bubble.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random() * areaW}px;
      top:${Math.random() * areaH}px;
      background: radial-gradient(circle at 35% 35%, ${c1}, ${c2});
      font-size:${size * 0.38}px;
    `;
    bubble.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    bubble.addEventListener('click', () => {
      if (!this.running) return;
      bubble.classList.add('popped');
      this.score++;
      if (this.scoreEl) this.scoreEl.textContent = this.score;
      setTimeout(() => bubble.remove(), 350);
    });
    this.arena.appendChild(bubble);
    // Auto remove after 3-5 seconds
    setTimeout(() => { if (bubble.parentNode) bubble.remove(); }, 3000 + Math.random() * 2000);
  }

  start() {
    this.reset();
    this.running = true;
    this.spawnInterval = setInterval(() => this.spawnBubble(), 600);
    this.interval = setInterval(() => {
      this.timeLeft--;
      if (this.timerEl) this.timerEl.textContent = this.timeLeft;
      if (this.timeLeft <= 0) this.end();
    }, 1000);
    // Spawn first few immediately
    for (let i = 0; i < 5; i++) {
      setTimeout(() => this.spawnBubble(), i * 120);
    }
  }

  end() {
    this.running = false;
    clearInterval(this.interval);
    clearInterval(this.spawnInterval);
    this.arena.innerHTML = '';
    if (this.msgEl) {
      this.msgEl.style.display = 'block';
      const rank = this.score >= 40 ? '🏆 Legend!' : this.score >= 25 ? '⭐ Amazing!' : this.score >= 15 ? '💖 Great!' : '🌸 Keep trying!';
      this.msgEl.innerHTML = `${rank}<br>You popped <b>${this.score}</b> bubbles!`;
    }
  }

  stop() {
    this.running = false;
    clearInterval(this.interval);
    clearInterval(this.spawnInterval);
  }
}

/* ─────────────────────────────────────────
   INIT ALL GAMES
───────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  starGame = new StarCatcher();
  memoryGame = new MemoryBloom();
  bubbleGame = new BubblePop();

  // Tab switching
  document.querySelectorAll('.game-tab').forEach(tab => {
    tab.addEventListener('click', () => switchGame(tab.dataset.game));
  });
});
