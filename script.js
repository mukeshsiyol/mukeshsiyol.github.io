// ── MUKESH SIYOL PORTFOLIO SCRIPTS ──

document.addEventListener('DOMContentLoaded', () => {

  // ── Typing Effect ──
  const phrases = ['Backend Engineer', 'Competitive Programmer', 'AI Tool Builder', 'FastAPI Developer', 'IIT Delhi Student'];
  let phraseIdx = 0, charIdx = 0, deleting = false;
  const typedEl = document.getElementById('typed-text');
  
  if (typedEl) {
    function type() {
      const word = phrases[phraseIdx];
      typedEl.textContent = deleting ? word.slice(0, --charIdx) : word.slice(0, ++charIdx);
      let delay = deleting ? 55 : 100;
      if (!deleting && charIdx === word.length) { delay = 2000; deleting = true; }
      else if (deleting && charIdx === 0) { deleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; delay = 350; }
      setTimeout(type, delay);
    }
    type();
  }

  // ── Scroll Reveal ──
  const revealEls = document.querySelectorAll('.reveal');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); revealObs.unobserve(e.target); } });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => revealObs.observe(el));

  // ── Navbar Scroll ──
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 60), { passive: true });
  }

  // ── Hamburger ──
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      hamburger.classList.toggle('active', open);
      hamburger.setAttribute('aria-expanded', open);
    });
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', false);
    }));
  }

  // ── Scroll Progress ──
  const bar = document.querySelector('.scroll-progress-bar');
  if (bar) {
    window.addEventListener('scroll', () => {
      bar.style.width = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100) + '%';
    }, { passive: true });
  }

  // ── Particle Canvas ──
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize(); window.addEventListener('resize', resize);
    const pts = Array.from({ length: 55 }, () => ({
      x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
      r: Math.random() * 1.4 + 0.3, dx: (Math.random() - 0.5) * 0.35, dy: (Math.random() - 0.5) * 0.35,
      o: Math.random() * 0.45 + 0.08
    }));
    (function anim() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach(p => {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99,102,241,${p.o})`; ctx.fill();
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      requestAnimationFrame(anim);
    })();
  }

  // ── Skill meter animation ──
  const meters = document.querySelectorAll('.skill-meter span');
  const meterObs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.style.width = e.target.style.width; meterObs.unobserve(e.target); }});
  }, { threshold: 0.5 });
  meters.forEach(m => { const w = m.style.width; m.style.width = '0'; setTimeout(() => m.style.width = w, 100); meterObs.observe(m); });

  // ── Copyright Year ──
  const yr = document.getElementById('copyright-year');
  if (yr) yr.textContent = new Date().getFullYear();

  // ── LeetCode Live Stats ──
  // Uses alfa-leetcode-api (actively maintained, replaces dead Heroku API)
  const lcContainer = document.getElementById('leetcode-stats-container');
  if (lcContainer) {
    const renderStats = (easy, totalEasy, medium, totalMedium, hard, totalHard, total) => {
      lcContainer.innerHTML = `
        <div class="lc-stat lc-easy">
          <span class="lc-label">Easy</span>
          <span class="lc-val">${easy} <span style="font-size:0.7em;color:var(--txt-3)">/ ${totalEasy}</span></span>
        </div>
        <div class="lc-stat lc-med">
          <span class="lc-label">Medium</span>
          <span class="lc-val">${medium} <span style="font-size:0.7em;color:var(--txt-3)">/ ${totalMedium}</span></span>
        </div>
        <div class="lc-stat lc-hard">
          <span class="lc-label">Hard</span>
          <span class="lc-val">${hard} <span style="font-size:0.7em;color:var(--txt-3)">/ ${totalHard}</span></span>
        </div>
        <div class="lc-stat lc-total">
          <span class="lc-label">Total Solved</span>
          <span class="lc-val">${total}</span>
        </div>
      `;
    };

    const showError = () => {
      lcContainer.innerHTML = `<div style="font-size:0.9rem;color:var(--txt-2);font-family:var(--mono);">Stats unavailable right now.<br>Visit <a href="https://leetcode.com/u/monu_siyol/" target="_blank" style="color:var(--accent-light)">my LeetCode profile</a>.</div>`;
    };

    // Primary API: alfa-leetcode-api (no Heroku, actively maintained)
    fetch('https://alfa-leetcode-api.onrender.com/monu_siyol/solved')
      .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(data => {
        if (data && data.easySolved !== undefined) {
          renderStats(
            data.easySolved, data.totalEasy,
            data.mediumSolved, data.totalMedium,
            data.hardSolved, data.totalHard,
            data.solvedProblem ?? (data.easySolved + data.mediumSolved + data.hardSolved)
          );
        } else {
          throw new Error('Unexpected response format');
        }
      })
      .catch(() => {
        // Fallback: leetcode-query (second backup API)
        fetch('https://leetcode-api-faisalshohag.vercel.app/monu_siyol')
          .then(r => r.json())
          .then(data => {
            if (data && data.totalSolved !== undefined) {
              renderStats(
                data.easySolved, data.totalEasy,
                data.mediumSolved, data.totalMedium,
                data.hardSolved, data.totalHard,
                data.totalSolved
              );
            } else throw new Error();
          })
          .catch(showError);
      });
  }
});

// ── Modal Logic (Global Scope) ──
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.classList.add('modal-open');
  }
}

function closeModal(event, modalId) {
  if (event.target.id === modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      document.body.classList.remove('modal-open');
    }
  }
}

function closeModalClick(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.classList.remove('modal-open');
  }
}

// Close active modal on Escape key press
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const activeModal = document.querySelector('.modal-overlay.active');
    if (activeModal) {
      activeModal.classList.remove('active');
      document.body.classList.remove('modal-open');
    }
  }
});
