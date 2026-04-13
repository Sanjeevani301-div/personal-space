// ===== PERSONAL SPACE — Main Script =====

// --- Floating Particles ---
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  const colors = [
    'rgba(239,127,165,0.5)', 'rgba(155,135,251,0.5)',
    'rgba(255,154,112,0.5)', 'rgba(94,201,160,0.4)', 'rgba(248,198,216,0.6)',
  ];
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    const size = Math.random() * 10 + 5;
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random() * 100}%;
      background:${colors[Math.floor(Math.random() * colors.length)]};
      animation-duration:${Math.random() * 12 + 10}s;
      animation-delay:${Math.random() * 10}s;
    `;
    container.appendChild(p);
  }
}

// --- Date Display ---
function setCurrentDate() {
  const el = document.getElementById('current-date');
  if (!el) return;
  const opts = { weekday:'long', year:'numeric', month:'long', day:'numeric' };
  el.textContent = new Date().toLocaleDateString('en-US', opts) + ' ✨';
}

// --- Daily Inspirational Quotes ---
const quotes = [
  '"She believed she could, so she did." 🌸',
  '"You are enough, always." 💖',
  '"Every day is a new beginning." ✨',
  '"Your only limit is your mind." 🌟',
  '"Be yourself; everyone else is already taken." 🦋',
  '"Small steps every day lead to big changes." 🌙',
  '"Write your own story, make it beautiful." 📖',
  '"Happiness is found in the little moments." 💫',
  '"You deserve all the good things life has to offer." 🌺',
  '"Trust the process. Beautiful things take time." ⏳',
];

function setDailyQuote() {
  const el = document.getElementById('daily-quote');
  if (!el) return;
  el.textContent = quotes[new Date().getDate() % quotes.length];
}

// --- Mood Emoji Picker ---
function addMood(el, emoji) {
  document.querySelectorAll('.mood-emoji').forEach(e => e.classList.remove('active'));
  el.classList.add('active');
  const textarea = document.getElementById('entry-textarea');
  if (textarea) {
    const mood = `Mood: ${emoji}\n\n`;
    textarea.value = textarea.value.startsWith('Mood:')
      ? textarea.value.replace(/^Mood: .+\n\n/, mood)
      : mood + textarea.value;
    updateCharCounter();
    textarea.focus();
  }
}

// --- Character Counter ---
function updateCharCounter() {
  const textarea = document.getElementById('entry-textarea') || document.getElementById('edit-content');
  const counter  = document.getElementById('char-counter');
  if (!textarea || !counter) return;
  const words = textarea.value.trim() ? textarea.value.trim().split(/\s+/).length : 0;
  counter.textContent = `${textarea.value.length} characters · ${words} words`;
}

// --- Insert Text into Textarea ---
function insertText(text) {
  const textarea = document.getElementById('entry-textarea');
  if (!textarea) return;
  const s = textarea.selectionStart, e = textarea.selectionEnd;
  textarea.value = textarea.value.substring(0, s) + text + textarea.value.substring(e);
  textarea.selectionStart = textarea.selectionEnd = s + text.length;
  textarea.focus();
  updateCharCounter();
}

// --- Toggle Read More / Less ---
function toggleEntry(id, btn) {
  const content = document.getElementById('entry-content-' + id);
  if (!content) return;
  const collapsed = content.classList.toggle('truncated');
  btn.textContent = collapsed ? 'Read more →' : '← Show less';
}

// --- Flash auto-dismiss ---
function initFlashDismiss() {
  document.querySelectorAll('.flash').forEach(f => {
    setTimeout(() => {
      f.style.transition = 'opacity 0.4s, transform 0.4s';
      f.style.opacity = '0';
      f.style.transform = 'translateX(120%)';
      setTimeout(() => f.remove(), 400);
    }, 3200);
  });
}

// --- Button loading state (skip delete forms) ---
function initFormLoading() {
  document.querySelectorAll('form:not(.delete-form)').forEach(form => {
    form.addEventListener('submit', () => {
      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.disabled = true;
        btn.style.opacity = '0.7';
        btn.innerHTML = '⏳ Saving...';
      }
    });
  });
}

// --- Entry card stagger animation ---
function animateEntryCards() {
  document.querySelectorAll('.entry-card').forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    setTimeout(() => {
      card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, i * 80 + 100);
  });
}

// =============================================
// SINGLE-SCROLL LANDING LOGIC
// =============================================

function initScrollPage() {
  const body = document.body;
  if (!body.classList.contains('scroll-page')) return;

  const sections   = document.querySelectorAll('.scroll-section');
  const dots       = document.querySelectorAll('.sdot');
  const navLinks   = document.querySelectorAll('.nav-dot-link');
  const container  = body; // body itself scrolls

  // --- Smooth scroll on nav/dot click ---
  document.querySelectorAll('.scroll-link, .sdot').forEach(el => {
    el.addEventListener('click', (e) => {
      const target = el.dataset.target || el.getAttribute('href')?.replace('#','');
      const section = document.getElementById(target);
      if (section) {
        e.preventDefault();
        section.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // --- Update active dot on scroll ---
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        dots.forEach(d => d.classList.toggle('active', d.dataset.target === id));
        navLinks.forEach(l => l.classList.toggle('active', l.dataset.target === id));

        // Trigger animate-on-scroll items inside this section
        entry.target.querySelectorAll('.animate-on-scroll').forEach((el, i) => {
          setTimeout(() => el.classList.add('visible'), i * 110);
        });
      }
    });
  }, { threshold: 0.45 });

  sections.forEach(s => observer.observe(s));
}

// =============================================
// INIT
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  createParticles();
  setCurrentDate();
  setDailyQuote();
  updateCharCounter();
  initFlashDismiss();
  initFormLoading();
  animateEntryCards();
  initScrollPage();
});
