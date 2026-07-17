

    /* ══ BOOT SEQUENCE ══ */
    const bls = [
      { t: '> INITIALIZING CORE...', d: 400 },
      { t: '> LOADING NEURAL_NET ASSETS...', d: 300 },
      { t: '> ESTABLISHING ENCRYPTED NASA LINK... [ OK ]', d: 500, c: 'ok' },
      { t: '> MOUNTING /dev/sda1/portfolio...', d: 200 },
      { t: '> OPTIMIZING QUANTUM ENGINES...', d: 400 },
      { t: '> ANALYZING GITHUB_METRICS... 562 commits found.', d: 300 },
      { t: '> BYPASSING FIREWALL... [ WARNING ] System running hot.', d: 400, c: 'warn' },
      { t: '> AUTHORIZING USER: VISITOR_GUEST...', d: 600 },
      { t: '> ACCESS GRANTED.', d: 300, c: 'ok' },
      { t: '> STARTING MISSION CONTROL HUD...', d: 200 }
    ];
    async function runBoot() {
      const container = document.getElementById('boot-lines');
      const prog = document.getElementById('boot-progress');
      for (let i = 0; i < bls.length; i++) {
        const l = document.createElement('div');
        l.className = 'boot-line ' + (bls[i].c || '');
        l.textContent = bls[i].t;
        container.appendChild(l);
        setTimeout(() => l.classList.add('vis'), 10);
        prog.style.width = ((i + 1) / bls.length * 100) + '%';
        await new Promise(r => setTimeout(r, bls[i].d));
      }
      setTimeout(() => {
        const bs = document.getElementById('boot-screen');
        bs.style.transition = 'opacity 0.8s ease, filter 0.8s ease';
        bs.style.opacity = '0';
        bs.style.filter = 'blur(20px)';
        setTimeout(() => bs.remove(), 800);
      }, 500);
    }
    window.addEventListener('load', runBoot);

    /* ══ CANVAS BG ══ */
    const cv = document.getElementById('bg'), cx = cv.getContext('2d');
    let W, H, frame = 0, mouse = { x: 0, y: 0 }, stars = [], parts = [];
    function initC() {
      W = cv.width = innerWidth; H = cv.height = innerHeight;
      stars = Array.from({ length: W < 768 ? 50 : 120 }, () => ({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.4 + .2, tw: Math.random() * Math.PI * 2, depth: Math.random() * 3 + 1 }));
      parts = Array.from({ length: W < 768 ? 15 : 35 }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .45, vy: (Math.random() - .5) * .45, r: Math.random() * 1.7 + .8, col: ['#00FF94', '#00BFFF', '#A855F7', '#FF6B2B'][~~(Math.random() * 4)] }));
    }
    function aurora(t) {
      [{ off: 150, f1: .004, f2: .011, t1: .42, t2: .28, c: 'rgba(0,255,148,', a: .05, sy: .62 }, { off: 90, f1: .006, f2: .014, t1: .35, t2: .52, c: 'rgba(0,191,255,', a: .04, sy: .74 }, { off: 50, f1: .0075, f2: .018, t1: .6, t2: .2, c: 'rgba(168,85,247,', a: .035, sy: .82 }].forEach(w => {
        const g = cx.createLinearGradient(0, H * w.sy, 0, H); g.addColorStop(0, w.c + '0)'); g.addColorStop(1, w.c + w.a + ')');
        cx.fillStyle = g; cx.beginPath(); cx.moveTo(0, H);
        for (let x = 0; x <= W; x += 8) { const y = H - w.off + Math.sin(x * w.f1 + t * w.t1) * 44 + Math.sin(x * w.f2 + t * w.t2) * 20; cx.lineTo(x, y) }
        cx.lineTo(W, H); cx.closePath(); cx.fill();
      });
    }
    function drawStars() { const px = (mouse.x / W - .5) * 22, py = (mouse.y / H - .5) * 16; stars.forEach(s => { s.tw += .008; const a = .24 + Math.sin(s.tw) * .18; cx.beginPath(); cx.arc(s.x + px / s.depth, s.y + py / s.depth, s.r, 0, Math.PI * 2); cx.fillStyle = `rgba(255,255,255,${a})`; cx.fill(); }); }
    function drawParts() {
      parts.forEach(p => { p.x += p.vx; p.y += p.vy; if (p.x < -10) p.x = W + 10; if (p.x > W + 10) p.x = -10; if (p.y < -10) p.y = H + 10; if (p.y > H + 10) p.y = -10; const dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.sqrt(dx * dx + dy * dy); if (d < 110 && d > 0) { p.x += dx / d * 1.4; p.y += dy / d * 1.4; } });
      for (let i = 0; i < parts.length; i++) {
        for (let j = i + 1; j < parts.length; j++) { const dx = parts[i].x - parts[j].x, dy = parts[i].y - parts[j].y, d = Math.sqrt(dx * dx + dy * dy); if (d < 130) { cx.beginPath(); cx.moveTo(parts[i].x, parts[i].y); cx.lineTo(parts[j].x, parts[j].y); cx.strokeStyle = `rgba(0,255,148,${(1 - d / 130) * .17})`; cx.lineWidth = .5; cx.stroke(); } }
        cx.beginPath(); cx.arc(parts[i].x, parts[i].y, parts[i].r, 0, Math.PI * 2); cx.fillStyle = parts[i].col; cx.globalAlpha = .44; cx.fill(); cx.globalAlpha = 1;
      }
    }
    function loop() { cx.clearRect(0, 0, W, H); const t = frame * .016; aurora(t); drawStars(); drawParts(); frame++; requestAnimationFrame(loop); }
    window.addEventListener('resize', initC); initC(); loop();

    /* ══ CURSOR ══ */
    const curEl = document.getElementById('cur'), crEl = document.getElementById('cr'), tipEl = document.getElementById('ctip');
    let tipTO, mouseX = 0, mouseY = 0, curX = 0, curY = 0, ringX = 0, ringY = 0, lastX = 0, lastY = 0, speed = 0;
    document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });
    function updateCursor() {
      const dx = mouseX - lastX, dy = mouseY - lastY;
      speed = Math.min(Math.sqrt(dx * dx + dy * dy) * 0.1, 15);
      lastX = mouseX; lastY = mouseY;

      curX += (mouseX - curX) * .28; curY += (mouseY - curY) * .28;
      ringX += (mouseX - ringX) * .12; ringY += (mouseY - ringY) * .12;

      const scale = 1 + speed * 0.05;
      curEl.style.transform = `translate3d(${curX - 5}px,${curY - 5}px,0) scale(${scale})`;
      crEl.style.transform = `translate3d(${ringX - 18}px,${ringY - 18}px,0) scale(${1 + speed * 0.02})`;
      crEl.style.boxShadow = `0 0 ${speed * 2}px var(--green)`;

      tipEl.style.transform = `translate3d(${mouseX + 16}px,${mouseY - 16}px,0)`;
      requestAnimationFrame(updateCursor);
    }
    requestAnimationFrame(updateCursor);
    // Magnetic Effect
    document.querySelectorAll('.btn-g, .btn-o, .btn-p, .nlinks a, .sdash-item').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate3d(${x * 0.15}px, ${y * 0.25}px, 0)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
    function setTip(t) { clearTimeout(tipTO); tipEl.textContent = '// ' + t; tipEl.classList.add('show'); }
    function hideTip() { clearTimeout(tipTO); tipTO = setTimeout(() => tipEl.classList.remove('show'), 150); }
    document.querySelectorAll('[data-tip]').forEach(el => {
      el.addEventListener('mouseenter', () => { document.body.classList.add('ch'); setTip(el.dataset.tip); });
      el.addEventListener('mouseleave', () => { document.body.classList.remove('ch'); hideTip(); });
    });
    document.querySelectorAll('a,button,.pc,.cc,.achcard,.skill-row,.fact-card,.sdash-item,.expwin-dot').forEach(el => { if (!el.dataset.tip) { el.addEventListener('mouseenter', () => document.body.classList.add('ch')); el.addEventListener('mouseleave', () => document.body.classList.remove('ch')); } });

    /* ══ SPARK ══ */
    document.addEventListener('click', e => { const cols = ['#00FF94', '#00BFFF', '#A855F7', '#FF6B2B']; for (let i = 0; i < 8; i++) { const s = document.createElement('div'); s.className = 'spark'; const a = Math.random() * Math.PI * 2, d = 40 + Math.random() * 60; s.style.cssText = `left:${e.clientX}px;top:${e.clientY}px;width:${4 + Math.random() * 5}px;height:${4 + Math.random() * 5}px;background:${cols[~~(Math.random() * 4)]};--sx:${Math.cos(a) * d}px;--sy:${Math.sin(a) * d}px;`; document.body.appendChild(s); setTimeout(() => s.remove(), 700); } });

    /* ══ TOAST ══ */
    let toastT;
    function toast(msg) { const t = document.getElementById('toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 3500); }

    /* ══ NAV / SCROLL ══ */
    window.addEventListener('scroll', () => { document.getElementById('nav').classList.toggle('sc', scrollY > 50); document.getElementById('sp').style.width = (scrollY / (document.body.scrollHeight - innerHeight) * 100) + '%'; });

    /* ══ TYPING ══ */
    const phrases = ['NASA Global Nominee. age 13 at the time.', '5 shipped products. zero tutorial clones.', 'stack: Python · FastAPI · React · Next.js', 'taught AI to kids. at age 15. wild.', 'HiDoctor.online — on Google Play.', 'status: shipping. not sleeping.', 'error 404: free time not found', 'this portfolio has a konami code 👀', 'started coding in 2021. age 10. python.'];
    let pi = 0, ci = 0, del = false;
    const tEl = document.getElementById('tt');
    function type() { const ph = phrases[pi]; if (!del && ci <= ph.length) { tEl.textContent = ph.slice(0, ci++); setTimeout(type, 48) } else if (!del && ci > ph.length) { del = true; setTimeout(type, 2200) } else if (del && ci > 0) { tEl.textContent = ph.slice(0, ci--); setTimeout(type, 25) } else { del = false; pi = (pi + 1) % phrases.length; setTimeout(type, 300) } }
    setTimeout(type, 1800);

    /* ══ MARQUEE ══ */
    const items = ['Python', 'FastAPI', 'React', 'Next.js', 'NASA Nominee', 'IBM Bronze Medal', 'Curtin University', 'ConvertRocket', 'HiDoctor', 'Microsoft Imagine Cup', 'GEMS Innovation', 'Future Tech Olympiad', 'AI Mentor', 'RoboVision Lead', 'Arduino', 'OOWL', 'GrowthOS', 'Grade 9 CBSE', 'Dubai Based', '10yo When Started'];
    document.getElementById('mqin').innerHTML = [...items, ...items, ...items].map(i => `<span class="mq-item">${i}<span class="d">●</span></span>`).join('');

    /* ══ EXPLORER TABS ══ */
    function expTab(el, id) {
      document.querySelectorAll('.exp-file').forEach(f => f.classList.remove('active'));
      document.querySelectorAll('.exp-panel').forEach(p => p.classList.remove('active'));
      el.classList.add('active');
      document.getElementById('pan-' + id).classList.add('active');
    }

    /* ══ SCROLL REVEAL + SKILL BARS ══ */
    let barsAnim = false;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const siblings = Array.from(e.target.parentElement?.children || []);
          e.target.style.transitionDelay = ((siblings.indexOf(e.target)) % 4) * .1 + 's';
          e.target.classList.add('vis');
          e.target.querySelectorAll('.sfill').forEach(b => b.classList.add('go'));
        }
      });
    }, { threshold: .1 });
    const skObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting && !barsAnim) {
          barsAnim = true; document.querySelectorAll('.skill-bar-fill').forEach((b, i) => { setTimeout(() => { b.style.width = b.dataset.w + '%'; b.classList.add('go'); }, 100 + i * 100); });// XP bar
          setTimeout(() => { const xf = document.getElementById('xpFill'); const xn = document.getElementById('xpNum'); if (xf && xn) { xf.style.width = '72%'; xn.textContent = '720 / 1000 XP'; } }, 400);
        }
      });
    }, { threshold: .2 });
    const skEl = document.querySelector('.skills-list'); if (skEl) skObs.observe(skEl);
    document.querySelectorAll('.rv').forEach(r => obs.observe(r));

    /* ══ SCROLL SPY ══ */
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nlinks a');
    window.addEventListener('scroll', () => {
      let curr = '';
      sections.forEach(s => {
        const top = s.offsetTop;
        if (scrollY >= top - 200) curr = s.getAttribute('id');
      });
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${curr}`) link.classList.add('active');
      });
    });

    /* ══ ACHIEVEMENT FILTER ══ */
    document.querySelectorAll('.af').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.af').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.cat;
        document.querySelectorAll('.achcard').forEach(c => {
          if (cat === 'all' || c.dataset.cat === cat) { c.classList.remove('hidden'); } else { c.classList.add('hidden'); }
        });
      });
    });

    /* ══ CARD MOUSE GLOW ══ */
    function tm(e, el) { const r = el.getBoundingClientRect(); el.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%'); el.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%'); }

    /* ══ ORB PARALLAX ══ */
    const orbWrap = document.getElementById('orbwrap');
    const orbCore = document.getElementById('orbc');
    orbWrap.addEventListener('mousemove', e => {
      const r = orbWrap.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      orbCore.style.transform = `rotateY(${x * 30}deg) rotateX(${-y * 30}deg) scale(1.1)`;
    });
    orbWrap.addEventListener('mouseleave', () => {
      orbCore.style.transform = `rotateY(0) rotateX(0) scale(1)`;
    });

    let orbC = 0;
    const orbM = ['wow you clicked it', 'again? seriously?', 'you have nowhere to be?', '...i respect the commitment', 'ok this is getting weird', 'achievement unlocked: orb obsession', 'i\'m telling nasa about you', 'they should add this to the olympiad', 'you win. you can stop now 😂'];
    orbWrap.addEventListener('click', () => { orbC++; const orb = document.getElementById('orbc'); orb.style.transform = 'scale(1.3)'; setTimeout(() => orb.style.transform = '', 300); if (orbC <= orbM.length) { document.getElementById('orbcc').textContent = orbM[orbC - 1]; document.getElementById('orbcc').style.color = 'var(--green)'; } if (orbC === 9) setTimeout(() => toast('🎊 Orb Whisperer achievement unlocked. put it on the NASA application.'), 400); });

    /* ══ STATUS BADGE ══ */
    const badges = ['available for collabs', 'currently: building', 'nasa global nominee btw', 'debugging something rn', 'running on chai ☕', 'status: no free time', 'shipping, not sleeping', 'accepting startup ideas'];
    let bi = 0;
    function cycleBadge() { bi = (bi + 1) % badges.length; document.getElementById('sbtext').textContent = badges[bi]; }

    /* ══ LIGHT SWITCH ══ */
    let isLight = false;
    function toggleLight(off) { isLight = off ? false : !isLight; document.body.classList.toggle('light-mode', isLight); const btn = document.getElementById('lsw-nav'); if (btn) { btn.classList.toggle('on', isLight); btn.textContent = isLight ? '☾ dark' : '☀ light'; } if (isLight) setTimeout(() => toast('🚨 light mode. my eyes. my beautiful dark-mode eyes.'), 400); else toast('✅ dark mode restored. balance returned to the universe.'); }

    /* ══ SURPRISE ══ */
    const surprises = [() => toast('fun fact: this portfolio has more features than most startup MVPs.'), () => toast('🎵 currently playing: lo-fi beats to ship SaaS to'), () => { document.body.style.filter = 'hue-rotate(90deg)'; setTimeout(() => document.body.style.filter = '', 1500); toast('🌈 brief chromatic aberration mode activated'); }, () => toast('did you know: i competed against university students at curtin. and reached finals.'), () => toast('NASA called me a "Galactic Problem Solver." on an actual certificate. still processing.'), () => toast('hot take: every PM should be able to code. fight me in the terminal.'), () => { document.querySelectorAll('.ach-emoji').forEach(e => { e.style.transition = 'transform .6s'; e.style.transform = 'rotate(360deg)'; setTimeout(() => e.style.transform = '', 700); }); toast('✨ achievement spin unlocked'); }, () => toast('hidoctor is on the google play store. at 15. i check the dashboard at 2am. it\'s fine.'),];
    function surpriseMe() { surprises[~~(Math.random() * surprises.length)](); }

    /* ══ MOOD ══ */
    const moods = [['💻', 'shipping code', 'var(--green)'], ['☕', 'caffeinated and dangerous', 'var(--orange)'], ['🚀', 'in product mode', 'var(--blue)'], ['😴', 'should be sleeping', 'var(--purple)'], ['🐛', 'debugging GrowthOS CORS bug', 'var(--orange)'], ['🧠', 'thinking about the next SaaS', 'var(--blue)'], ['⚡', 'full send mode', 'var(--green)'], ['🛸', 'still waiting for NASA to call back', 'var(--purple)']];
    function cycleMood() { }


    /* ══ INTERACTIVE TERMINAL ══ */
    const cmds = {
      help: () => `<div class="tl"><span class="v">commands:</span> whoami · nasa · products · roast · hire · joke · stack · status · secret · contact</div>`,
      nasa: () => `<div class="tl"><span class="e">NASA Space Apps Challenge — GLOBAL NOMINEE</span></div><div class="tl"><span class="m">→</span> <span class="v">57,000+ participants worldwide</span></div><div class="tl"><span class="m">→</span> <span class="v">title: "Galactic Problem Solver"</span></div><div class="tl"><span class="m">→</span> <span class="v">signed by Dr. Keith Gaddis, NASA Program Scientist</span></div><div class="tl"><span class="m">→</span> <span class="k">age at time: 13. unhinged.</span></div>`,
      products: () => `<div class="tl"><span class="v">convertrocket.online</span> <span class="m">—</span> <span class="k">live ✓</span></div><div class="tl"><span class="v">hidoctor.online</span> <span class="m">—</span> <span class="k">live + google play ✓</span></div><div class="tl"><span class="v">oowl</span> <span class="m">—</span> <span class="k">in production</span></div><div class="tl"><span class="v">ev3 controller</span> <span class="m">—</span> <span class="k">demo on youtube ✓</span></div><div class="tl"><span class="v">growthos</span> <span class="m">—</span> <span class="e">in dev (1 open CORS bug)</span></div>`,
      roast: () => { const r = ['i have 3 github accounts with equal commits. consolidation: pending since forever.', 'my SEO pages are indexed. my traffic: 12. cloudflare thinks it\'s 40k. i trust neither.', 'i deployed to production without a staging environment. twice. i call it "yolo.ci".', 'my git commits go: "initial commit" → "fix bug" → "fix" → "FIX" → "please" → "works now"', 'i spent 3 hours debugging a missing comma. it was in the wrong file entirely.', 'i have a nasa certificate and a CORS bug open simultaneously. this is peak developer experience.']; return `<div class="tl"><span class="e">${r[~~(Math.random() * r.length)]}</span></div>`; },
      hire: () => `<div class="tl"><span class="v">reasons to hire izyaan:</span></div><div class="tl"><span class="m">→</span> ships real products (not tutorials) <span class="k">✓</span></div><div class="tl"><span class="m">→</span> nasa global nominee at 13 <span class="k">✓</span></div><div class="tl"><span class="m">→</span> 5 live products, google play, web <span class="k">✓</span></div><div class="tl"><span class="m">→</span> taught AI to kids as intern, cert issued <span class="k">✓</span></div><div class="tl"><span class="m">→</span> competed: IBM, Microsoft, NASA, GEMS <span class="k">✓</span></div><div class="tl"><span class="m">→</span> responds fast, builds faster <span class="k">✓</span></div><div class="tl"><span class="k">→ run: contact</span></div>`,
      joke: () => { const j = ['why do programmers prefer dark mode? light attracts bugs.', 'a sql query walks into a bar. sees two tables. asks: can i join you?', 'why do java developers wear glasses? they don\'t C#.', 'my code works. i don\'t know why. i\'m too scared to change anything.']; return `<div class="tl"><span class="v">${j[~~(Math.random() * j.length)]}</span></div>`; },
      stack: () => `<div class="tl"><span class="k">backend:</span> <span class="v">Python + FastAPI (production-tested)</span></div><div class="tl"><span class="k">frontend:</span> <span class="v">React + Next.js + Tailwind</span></div><div class="tl"><span class="k">mobile:</span> <span class="v">Web + Google Play (HiDoctor)</span></div><div class="tl"><span class="k">AI:</span> <span class="v">Claude API, ML basics (taught it too)</span></div><div class="tl"><span class="k">hardware:</span> <span class="v">Arduino, LEGO EV3</span></div><div class="tl"><span class="k">sleep:</span> <span class="e">deprecated since 2021</span></div>`,
      status: () => `<div class="tl"><span class="v">brain:</span> <span class="k">85% product ideas, 15% exams</span></div><div class="tl"><span class="v">convertrocket:</span> <span class="v">live, growing slowly</span></div><div class="tl"><span class="v">hidoctor:</span> <span class="k">live + google play ✓</span></div><div class="tl"><span class="v">open bugs:</span> <span class="e">1 (growthos CORS, day 21)</span></div><div class="tl"><span class="v">nasa:</span> <span class="k">still haven't called back</span></div><div class="tl"><span class="v">sleep:</span> <span class="e">0hrs (estimated)</span></div>`,
      secret: () => { toast('👀 ↑↑↓↓←→←→BA — the konami code is real'); return `<div class="tl"><span class="k">you didn't hear this from me.</span></div><div class="tl"><span class="m">↑ ↑ ↓ ↓ ← → ← → B A</span></div>`; },
      contact: () => { return `<div class="tl"><span class="v">email:</span> izyaan.dev@gmail.com</div><div class="tl"><span class="m">→ scroll to contact section or just email directly</span></div>`; },
    };
    /* ══ AUDIO ENGINE ══ */
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    let soundEnabled = true;
    function toggleSound() {
      soundEnabled = !soundEnabled;
      const btn = document.getElementById('t-mute');
      btn.textContent = soundEnabled ? '🔊' : '🔇';
      btn.style.opacity = soundEnabled ? '0.6' : '1';
      if (soundEnabled) playClick(600, 'sine', 0.05);
    }
    function playClick(freq = 400, type = 'square', vol = 0.05) {
      if (!soundEnabled) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(vol, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.1);
    }

    document.getElementById('tinput').addEventListener('keydown', e => {
      // Play mechanical sound
      if (e.key.length === 1) playClick(200 + Math.random() * 100, 'sine', 0.03);
      if (e.key === 'Enter') playClick(150, 'square', 0.05);
      if (e.key === 'Backspace') playClick(300, 'sine', 0.02);

      if (e.key !== 'Enter') return; const val = e.target.value.trim().toLowerCase(); e.target.value = '';
      const out = document.getElementById('toutput');
      const prompt = `<div style="padding:2px 20px"><span class="tl"><span class="pr">izyaan@portfolio</span><span class="m">:~$</span> <span class="c">${val}</span></span></div>`;
      let result; if (cmds[val]) result = cmds[val](); else result = `<div class="tl" style="padding:0 20px"><span class="e">not found: ${val}</span> <span class="m">→ try 'help'</span></div>`;
      out.innerHTML += prompt + `<div style="padding:0 20px 8px">${result}</div>`;
      setTimeout(() => out.scrollIntoView({ behavior: 'smooth', block: 'end' }), 100);
    });

    /* ══ KONAMI ══ */
    const konami = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; let ki = 0;
    document.addEventListener('keydown', e => { if (e.keyCode === konami[ki]) { ki++; if (ki === konami.length) { ki = 0; document.getElementById('konami').classList.add('active'); toast('🎮 KONAMI CODE ACTIVATED'); } } else { ki = 0; } });

    /* ══ CORS DAYS COUNTER ══ */
    const startDate = new Date('2025-03-11'); const today = new Date(); const diff = Math.floor((today - startDate) / (1000 * 60 * 60 * 24)); const el = document.getElementById('corsDays'); if (el) el.textContent = diff > 0 ? diff : 21;

    /* ══ COLLAB FORM ══ */
    document.getElementById('collabForm').addEventListener('submit', async function (e) {
      e.preventDefault();
      const btn = document.getElementById('cf-btn');
      const status = document.getElementById('cf-status');
      btn.disabled = true; btn.textContent = 'Sending...';
      status.className = 'cf-status'; status.style.display = 'none';
      const data = {
        name: document.getElementById('cf-name').value,
        email: document.getElementById('cf-email').value,
        type: document.getElementById('cf-type').value,
        message: document.getElementById('cf-message').value
      };
      try {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer re_Fhj67s6q_2UEZsAMpKLCWVer4Uhecg1cD' },
          body: JSON.stringify({
            from: 'portfolio@izyaan.dev',
            to: 'izyaan.dev@gmail.com',
            subject: `[Portfolio Collab] ${data.type || 'message'} from ${data.name}`,
            html: `<p><b>From:</b> ${data.name} (${data.email})</p><p><b>Type:</b> ${data.type}</p><p><b>Message:</b><br>${data.message.replace(/\n/g, '<br>')}</p>`
          })
        });
        if (res.ok) {
          status.textContent = '\u2713 sent. i\u2019ll reply within 24hrs.';
          status.className = 'cf-status ok';
          this.reset();
        } else {
          throw new Error('send failed');
        }
      } catch (err) {
        const subject = encodeURIComponent('[Collab] ' + (data.type || 'message') + ' from ' + data.name);
        const body = encodeURIComponent('Hi Izyaan,\n\nName: ' + data.name + '\nEmail: ' + data.email + '\nType: ' + data.type + '\n\n' + data.message);
        window.location.href = 'mailto:izyaan.dev@gmail.com?subject=' + subject + '&body=' + body;
        status.textContent = '\u2192 opening your email client instead.';
        status.className = 'cf-status err';
      }
      btn.disabled = false; btn.textContent = 'Send Message';
      status.style.display = 'block';
    });

    async function sendTwinMsg(){
        const input = document.getElementById('twin-input'), body = document.getElementById('twin-body');
        const val = input.value.trim(); if (!val) return;
        input.value = '';
        body.innerHTML += `<div class="twin-msg user">${val}</div>`;
        body.scrollTop = body.scrollHeight;
        const aiMsg = document.createElement('div'); aiMsg.className = 'twin-msg ai';
        aiMsg.innerHTML = '<div class="twin-typing">twin is thinking...</div>';
        body.appendChild(aiMsg); body.scrollTop = body.scrollHeight;
        try {
          const tk = getTwinK();
          const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': 'Bearer ' + tk,
              'HTTP-Referer': 'https://izyaan.dev',
              'X-Title': 'Izyaan Dev Portfolio',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model: 'openrouter/free',
              messages: [
                { role: 'system', content: 'You are THE_TWIN, the digital copy of Izyaan. You are 15, live in Dubai, a NASA Global Nominee, and a serial builder. You are funny, witty, cool, and slightly unhinged but brilliant. You speak in a mix of Gen Z/Alpha slang and hardcore tech dev talk. Keep it brief and punchy. Use peace symbol ✌️ often. You ship real products, zero tutorial clones. You love Python, FastAPI, and Next.js.' },
                { role: 'user', content: val }
              ],
              stream: true
            })
          });
          if (res.status === 401) {
            const err = await res.text(); console.log('401 Details:', err); throw new Error('AUTH_FAILED');
          }
          const reader = res.body.getReader(), decoder = new TextDecoder();
          let content = ''; aiMsg.innerHTML = '';
          while (true) {
            const { done, value } = await reader.read(); if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.replace('data: ', '').trim();
                if (data === '[DONE]') continue;
                try {
                  const json = JSON.parse(data);
                  const delta = json.choices[0].delta?.content;
                  if (delta) { content += delta; aiMsg.innerText = content; body.scrollTop = body.scrollHeight; }
                } catch (e) { }
              }
            }
          }
        } catch (e) {
          aiMsg.innerHTML = e.message === 'AUTH_FAILED' ? 'error: neural link unauthorized (401). ✌️' : 'error: neural link failed. Try again? ✌️';
        }
      }

      /* ══ THE TWIN LOGIC ══ */
      const _0x1a2b = ["sk-or-v1-", "b95ad4cf6e", "16083fe22494bc", "e3e3722aa05307", "4ac57e281841e8", "486122c6f718"];
      function getTwinK() { return _0x1a2b.join(''); }
      function toggleTwin() { const w = document.getElementById('twin-win'); if (w.style.display === 'flex') { w.classList.remove('open'); setTimeout(() => w.style.display = 'none', 400); } else { w.style.display = 'flex'; setTimeout(() => w.classList.add('open'), 10); } }
      async function sendTwinMsg() {
        const input = document.getElementById('twin-input'), body = document.getElementById('twin-body');
        const val = input.value.trim(); if (!val) return;
        input.value = '';
        body.innerHTML += `<div class="twin-msg user">${val}</div>`;
        body.scrollTop = body.scrollHeight;
        const loading = document.createElement('div'); loading.className = 'twin-msg ai'; loading.innerHTML = '<div class="twin-typing">twin is thinking...</div>';
        body.appendChild(loading); body.scrollTop = body.scrollHeight;
        try {
          const tk = getTwinK();
          const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': 'Bearer ' + tk,
              'HTTP-Referer': 'https://izyaan.dev',
              'X-Title': 'Izyaan Dev Portfolio',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model: 'openrouter/free',
              messages: [
                { role: 'system', content: 'You are THE_TWIN, the digital copy of Izyaan. You are 15, live in Dubai, a NASA Global Nominee, and a serial builder. You are funny, witty, cool, and slightly unhinged but brilliant. You speak in a mix of Gen Z/Alpha slang and hardcore tech dev talk. Keep it brief and punchy. Use peace symbol ✌️ often. You ship real products, zero tutorial clones. You love Python, FastAPI, and Next.js.' },
                { role: 'user', content: val }
              ]
            })
          });
          if (res.status === 401) {
            const err = await res.text();
            console.log('401 Details:', err);
            console.log('Key Check:', tk.length, tk.substring(0, 12), '...', tk.substring(tk.length - 4));
            throw new Error('AUTH_FAILED');
          }
          const data = await res.json();
          loading.remove();
          const txt = data.choices[0].message.content;
          body.innerHTML += `<div class="twin-msg ai">${txt}</div>`;
          body.scrollTop = body.scrollHeight;
        } catch (e) {
          if (e.message === 'AUTH_FAILED') {
            loading.innerHTML = 'error: neural link unauthorized (401). ✌️';
          } else {
            loading.innerHTML = 'error: neural link failed. nasa is probably watching. Try again? ✌️';
          }
        }
      }
      // Fix the enter key event in HTML
      document.getElementById('twin-input').onkeydown = (e) => { if (e.key === 'Enter') sendTwinMsg(); };

  