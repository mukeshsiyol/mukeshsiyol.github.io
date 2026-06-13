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

  // ── Navbar Scroll + Scroll Progress + Active Nav ──
  const navbar = document.getElementById('navbar');
  const scrollBar = document.getElementById('scroll-progress');
  const navLinksAll = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  if (navbar) {
    window.addEventListener('scroll', () => {
      // Navbar shrink
      navbar.classList.toggle('scrolled', window.scrollY > 60);
      
      // Scroll progress bar
      if (scrollBar) {
        const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        scrollBar.style.width = pct + '%';
      }

      // Active nav link highlighting
      let currentSection = '';
      sections.forEach(sec => {
        const top = sec.offsetTop - 120;
        if (window.scrollY >= top) currentSection = sec.getAttribute('id');
      });
      navLinksAll.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + currentSection) link.classList.add('active');
      });
    }, { passive: true });
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
  // ── Preloader ──
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => preloader.classList.add('loaded'), 400);
    });
  }

  // ── Animated Counters ──
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const counterObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-count'), 10);
          const duration = 1500;
          const start = performance.now();
          
          function animate(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out quad
            const eased = 1 - (1 - progress) * (1 - progress);
            el.textContent = Math.floor(eased * target);
            if (progress < 1) requestAnimationFrame(animate);
            else el.textContent = target;
          }
          requestAnimationFrame(animate);
          counterObs.unobserve(el);
        }
      });
    }, { threshold: 0.3 });
    counters.forEach(c => counterObs.observe(c));
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

// ── AI Chatbot Logic (Simulated Rule-Based Engine) ──
document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('chat-toggle');
  const chatWin = document.getElementById('chat-window');
  const closeChat = document.getElementById('close-chat');
  const chatInput = document.getElementById('chat-input');
  const sendChat = document.getElementById('send-chat');
  const chatBody = document.getElementById('chat-body');

  if(toggleBtn && chatWin) {
    toggleBtn.addEventListener('click', () => chatWin.classList.remove('hidden'));
    closeChat.addEventListener('click', () => chatWin.classList.add('hidden'));

    const addMessage = (text, sender) => {
      const div = document.createElement('div');
      div.className = `chat-message ${sender}`;
      div.innerHTML = `<p>${text}</p>`;
      chatBody.appendChild(div);
      chatBody.scrollTop = chatBody.scrollHeight;
    };

    const getBotResponse = (input) => {
      const lower = input.toLowerCase();
      if(lower.includes('hi') || lower.includes('hello')) return "Hi there! I can answer questions about Mukesh's skills, projects, and education. What would you like to know?";
      if(lower.includes('c++') || lower.includes('dsa') || lower.includes('competitive')) return "Mukesh is highly proficient in C++! He uses it primarily for Competitive Programming and Data Structures & Algorithms. Check out his LeetCode stats above!";
      if(lower.includes('python') || lower.includes('fastapi')) return "Mukesh loves Python! He has built scalable REST APIs using FastAPI and complex NLP pipelines using NLTK and Pandas.";
      if(lower.includes('ai') || lower.includes('agent') || lower.includes('llm')) return "Mukesh is deeply interested in AI infrastructure. He built 'Hive', an evolutionary LLM agent framework, and the 'COREP Assistant' which uses RAG for regulatory reporting.";
      if(lower.includes('physics') || lower.includes('research') || lower.includes('deepak')) return "Under Prof. Deepak at IIT Delhi, Mukesh conducts research on Motility-Induced Phase Separation in active matter using OpenCV and computer vision.";
      if(lower.includes('contact') || lower.includes('email') || lower.includes('hire')) return "You can reach Mukesh directly at mukeshsiyol2006@gmail.com, or fill out the contact form at the bottom of the page!";
      return "That's an interesting question! While I don't know the exact answer, you can email Mukesh directly at mukeshsiyol2006@gmail.com to ask him personally.";
    };

    const handleSend = () => {
      const val = chatInput.value.trim();
      if(!val) return;
      addMessage(val, 'user');
      chatInput.value = '';
      
      // Simulate thinking delay
      setTimeout(() => {
        const response = getBotResponse(val);
        addMessage(response, 'bot');
      }, 600 + Math.random() * 500);
    };

    sendChat.addEventListener('click', handleSend);
    chatInput.addEventListener('keypress', (e) => {
      if(e.key === 'Enter') handleSend();
    });
  }
});

// ── Global Hacker Terminal Mode (Ctrl+K) ──
document.addEventListener('DOMContentLoaded', () => {
  const terminal = document.getElementById('global-terminal');
  const termInput = document.getElementById('term-input');
  const termOutput = document.getElementById('term-output');
  const closeTerm = document.getElementById('close-terminal');
  const openTermBtn = document.getElementById('open-terminal-btn');

  if(terminal && termInput) {
    // Open via button
    if(openTermBtn) {
      openTermBtn.addEventListener('click', (e) => {
        e.preventDefault();
        terminal.classList.remove('hidden');
        setTimeout(() => termInput.focus(), 100);
      });
    }

    // Open via Ctrl+K
    document.addEventListener('keydown', (e) => {
      if(e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        terminal.classList.remove('hidden');
        setTimeout(() => termInput.focus(), 100);
      }
    });
    
    closeTerm.addEventListener('click', () => terminal.classList.add('hidden'));

    const addLine = (text, colorClass = '') => {
      const p = document.createElement('p');
      if(colorClass) p.className = colorClass;
      p.innerHTML = text;
      termOutput.appendChild(p);
      termOutput.scrollTop = termOutput.scrollHeight;
    };

    termInput.addEventListener('keypress', (e) => {
      if(e.key === 'Enter') {
        const cmd = termInput.value.trim();
        termInput.value = '';
        addLine(`<span class="t-prompt">guest@mukesh-server:~$</span> ${cmd}`);
        
        if(!cmd) return;
        const lower = cmd.toLowerCase();

        if(lower === 'help') {
          addLine('Available commands: help, whoami, ls, cat skills, cat contact, clear, exit');
        } else if(lower === 'whoami') {
          addLine('Mukesh Kumar - Backend & AI Engineer studying at IIT Delhi.', 't-green');
        } else if(lower === 'ls') {
          addLine('projects/  resume.pdf  skills.txt  contact.txt', 't-green');
        } else if(lower === 'cat skills' || lower === 'cat skills.txt') {
          addLine('[*] C++, Python, TypeScript<br>[*] FastAPI, LLM Agents, OpenCV, DSA', 't-yellow');
        } else if(lower === 'cat contact' || lower === 'cat contact.txt') {
          addLine('Email: mukeshsiyol2006@gmail.com<br>LinkedIn: linkedin.com/in/mukesh-kumar06', 't-green');
        } else if(lower === 'clear') {
          termOutput.innerHTML = '';
        } else if(lower === 'exit') {
          terminal.classList.add('hidden');
        } else {
          addLine(`bash: ${cmd}: command not found`, 't-red');
        }
      }
    });
  }
});

// ── ARCHITECTURE TABS ──
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.arch-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const archId = tab.dataset.arch;
      
      // Update tabs
      document.querySelectorAll('.arch-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Update panels
      document.querySelectorAll('.arch-panel').forEach(p => p.classList.remove('active'));
      const target = document.getElementById(`arch-${archId}`);
      if (target) target.classList.add('active');
    });
  });
});

// ── BLOG MODAL LOGIC ──
const blogsData = {
  'blog-1': {
    title: 'Evolution of LLM Agents: From RAG to Hive',
    meta: 'AI Engineering • Oct 12, 2025',
    content: `
      <p>When I first started building AI applications, standard Retrieval-Augmented Generation (RAG) was the cutting edge. You embed a document, stick it in a vector database, and perform a cosine similarity search before passing the context to an LLM. Simple, effective, but ultimately limited.</p>
      <p>The problem with basic RAG is reasoning depth. A single LLM call cannot reliably research, formulate a complex plan, execute code, and self-correct all at once.</p>
      <h3>Enter the Hive Framework</h3>
      <p>This limitation inspired me to build the <strong>Hive Agent Framework</strong>. Instead of one monolithic LLM call, Hive orchestrates a <em>swarm</em> of specialized agents:</p>
      <ul>
        <li><strong>Research Agent:</strong> Dedicated solely to querying vector stores and summarizing context.</li>
        <li><strong>Coding Agent:</strong> Given the context, this agent generates Python code.</li>
        <li><strong>Reviewer Agent:</strong> Executes the code in a sandbox, catches exceptions, and passes feedback back to the Coding Agent.</li>
      </ul>
      <p>By splitting the cognitive load, the overall system achieves significantly higher accuracy on complex tasks. The multi-agent paradigm isn't just a trend; it's the required architecture for building robust AI software.</p>
    `
  },
  'blog-2': {
    title: 'Why C++ is Still King for Competitive Programming',
    meta: 'Algorithms • Sep 05, 2025',
    content: `
      <p>As a backend engineer who uses Python and Node.js daily for building REST APIs, people often ask me why I stick to C++ for Competitive Programming and LeetCode.</p>
      <p>The answer comes down to three things: <strong>Speed, STL, and Granular Control.</strong></p>
      <h3>The 1-Second Constraint</h3>
      <p>In platforms like Codeforces or LeetCode, algorithms are often tested against a strict 1-second execution time limit. Python's dynamic typing and interpreter overhead often result in Time Limit Exceeded (TLE) verdicts, even when the underlying algorithmic complexity is optimal.</p>
      <h3>The Standard Template Library (STL)</h3>
      <p>C++'s STL is a masterpiece for competitive programming. Need a priority queue? <code>std::priority_queue</code>. Need a balanced BST? <code>std::set</code> or <code>std::map</code>. The implementations are heavily optimized and drastically reduce the lines of code needed during a high-pressure contest.</p>
      <p>While Python will always be my choice for AI and web servers, C++ remains the undisputed king of the algorithmic arena.</p>
    `
  },
  'blog-3': {
    title: 'Tracking Active Matter with OpenCV',
    meta: 'Research • Aug 20, 2025',
    content: `
      <p>During my research at IIT Delhi under Prof. Deepak, I encountered a fascinating problem in Physics: <strong>Motility-Induced Phase Separation (MIPS)</strong> in active matter.</p>
      <p>Active matter consists of particles that consume energy to move (like bacteria or artificial micro-swimmers). At high densities, they spontaneously cluster together without any attractive forces. But how do you quantify this clustering from raw microscopic video footage?</p>
      <h3>Computer Vision to the Rescue</h3>
      <p>I utilized <strong>OpenCV</strong> and Python to build an automated tracking pipeline.</p>
      <ul>
        <li>First, I applied Gaussian blurring and thresholding to isolate the particles from the noisy background.</li>
        <li>Then, I used contour detection (<code>cv2.findContours</code>) to identify individual particles.</li>
        <li>Finally, I implemented a custom tracking algorithm to calculate their velocity vectors and cluster sizes over time.</li>
      </ul>
      <p>This intersection of Physics and Computer Science allowed us to extract meaningful quantitative data from raw visual experiments, proving the incredible versatility of software engineering in scientific research.</p>
    `
  }
};

window.openBlogModal = function(blogId) {
  const modal = document.getElementById('blog-modal');
  const body = document.getElementById('blog-modal-body');
  const data = blogsData[blogId];
  
  if(data) {
    body.innerHTML = `
      <h1>${data.title}</h1>
      <div class="blog-meta">${data.meta}</div>
      ${data.content}
    `;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // Close Blog Modal logic
  const closeBlogBtn = document.getElementById('close-blog');
  const blogModal = document.getElementById('blog-modal');
  
  if (closeBlogBtn && blogModal) {
    closeBlogBtn.addEventListener('click', () => {
      blogModal.classList.remove('active');
      document.body.style.overflow = '';
    });
    
    // Close on click outside
    blogModal.addEventListener('click', (e) => {
      if (e.target === blogModal) {
        blogModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
});
