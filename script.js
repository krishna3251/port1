/* ===== KRISHNA PORTFOLIO — PREMIUM MOTION DESIGN ===== */

// ─── Custom Cursor ───
(function initCursor()
{
  const cursor = document.createElement('div');
  const cursorDot = document.createElement('div');
  cursor.className = 'cursor-ring';
  cursorDot.className = 'cursor-dot';
  document.body.appendChild(cursor);
  document.body.appendChild(cursorDot);

  let mx = -100, my = -100, cx = -100, cy = -100;
  let isHovering = false;

  document.addEventListener('mousemove', (e) =>
  {
    mx = e.clientX; my = e.clientY;
    cursorDot.style.transform = `translate(${mx - 4}px, ${my - 4}px)`;
  });

  // Lag the ring
  (function animateRing()
  {
    cx += (mx - cx) * 0.12;
    cy += (my - cy) * 0.12;
    cursor.style.transform = `translate(${cx - 22}px, ${cy - 22}px) ${isHovering ? 'scale(1.8)' : 'scale(1)'}`;
    requestAnimationFrame(animateRing);
  })();

  // Hover expand on interactive elements
  document.querySelectorAll('a, button, .passion-card, .project-card, .social-icon').forEach(el =>
  {
    el.addEventListener('mouseenter', () => { isHovering = true; cursor.classList.add('hovered'); });
    el.addEventListener('mouseleave', () => { isHovering = false; cursor.classList.remove('hovered'); });
  });
})();

// ─── Music Player ───
(function initMusicPlayer()
{
  const audio = document.getElementById('bgMusic');
  const btn = document.getElementById('musicBtn');
  const icon = document.getElementById('musicIcon');
  const label = document.getElementById('musicLabel');
  const progress = document.getElementById('musicProgress');
  if (!audio || !btn) return;
  audio.volume = 0.35;
  let playing = false;
  function setPlaying(state)
  {
    playing = state;
    if (state) {
      btn.classList.add('playing');
      icon.className = 'fas fa-pause music-play-icon';
      label.textContent = '♪ Now Playing';
    } else {
      btn.classList.remove('playing');
      icon.className = 'fas fa-play music-play-icon';
      label.textContent = 'Play Vibes';
      progress.style.width = '0%';
    }
  }
  btn.addEventListener('click', () =>
  {
    if (playing) { audio.pause(); setPlaying(false); }
    else { audio.play().then(() => setPlaying(true)).catch(() => { }); }
  });
  audio.addEventListener('timeupdate', () =>
  {
    if (!audio.duration) return;
    progress.style.width = (audio.currentTime / audio.duration * 100) + '%';
  });
  audio.addEventListener('ended', () => setPlaying(false));
})();

// ─── Particle Background ───
(function initParticles()
{
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [], mouse = { x: -999, y: -999 };
  let w, h;
  const COUNT = 90;

  window.addEventListener('resize', () =>
  {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  });
  window.dispatchEvent(new Event('resize'));

  document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

  for (let i = 0; i < COUNT; i++) particles.push({
    x: Math.random() * w, y: Math.random() * h,
    vx: (Math.random() - .5) * .45, vy: (Math.random() - .5) * .45,
    r: Math.random() * 1.8 + .4, alpha: Math.random() * .5 + .15
  });

  function draw()
  {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      // Mouse repel
      const dx = p.x - mouse.x, dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        const force = (100 - dist) / 100;
        p.vx += (dx / dist) * force * .4;
        p.vy += (dy / dist) * force * .4;
      }
      p.vx *= .98; p.vy *= .98;
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;

      // Connect
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx2 = p.x - q.x, dy2 = p.y - q.y;
        const d2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
        if (d2 < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0,255,234,${(1 - d2 / 120) * .15})`;
          ctx.lineWidth = .6;
          ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
        }
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,255,234,${p.alpha})`;
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

// ─── Aurora Background ───
(function initAurora()
{
  const canvas = document.createElement('canvas');
  canvas.id = 'auroraCanvas';
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:-2;pointer-events:none;opacity:.6;';
  document.body.prepend(canvas);
  const ctx = canvas.getContext('2d');
  let w, h, t = 0;
  function resize() { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }
  window.addEventListener('resize', resize); resize();

  function draw()
  {
    ctx.clearRect(0, 0, w, h);
    t += .004;
    const blobs = [
      { x: .2 + Math.sin(t) * .15, y: .3 + Math.cos(t * .7) * .15, r: .4, c: [255, 215, 0] },     // Gold
      { x: .8 + Math.cos(t * .8) * .12, y: .2 + Math.sin(t * 1.1) * .12, r: .35, c: [255, 107, 0] }, // Orange
      { x: .5 + Math.sin(t * 1.3) * .2, y: .8 + Math.cos(t) * .1, r: .3, c: [255, 34, 34] },       // Red
      { x: .1 + Math.cos(t * 1.6) * .08, y: .7 + Math.sin(t * .9) * .12, r: .25, c: [255, 180, 50] }, // Warm gold
    ];
    blobs.forEach(b =>
    {
      const grd = ctx.createRadialGradient(b.x * w, b.y * h, 0, b.x * w, b.y * h, b.r * Math.min(w, h));
      grd.addColorStop(0, `rgba(${b.c[0]},${b.c[1]},${b.c[2]},.18)`);
      grd.addColorStop(1, `rgba(${b.c[0]},${b.c[1]},${b.c[2]},0)`);
      ctx.beginPath();
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, w, h);
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

// ─── Scroll Progress Bar ───
(function initScrollProgress()
{
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  window.addEventListener('scroll', () =>
  {
    const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
    bar.style.width = Math.min(pct, 100) + '%';
  });
})();

// ─── Navbar Scroll Effect ───
(function initNavbar()
{
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () =>
  {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });
  // Active link
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  window.addEventListener('scroll', () =>
  {
    let current = 'hero';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 200) current = s.id; });
    navLinks.forEach(l =>
    {
      l.classList.toggle('active', l.getAttribute('href') === '#' + current || (current === 'hero' && l.getAttribute('href') === '#hero'));
    });
  });
})();

// ─── Mobile Menu ───
(function initMobileMenu()
{
  const btn = document.getElementById('mobileMenuBtn');
  const links = document.getElementById('navLinks');
  if (!btn || !links) return;
  btn.addEventListener('click', () =>
  {
    btn.classList.toggle('open');
    links.classList.toggle('open');
    document.body.style.overflow = links.classList.contains('open') ? 'hidden' : '';
  });
  links.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () =>
  {
    btn.classList.remove('open'); links.classList.remove('open'); document.body.style.overflow = '';
  }));
})();

// ─── Smooth Scroll ───
document.querySelectorAll('a[href^="#"]').forEach(a =>
{
  a.addEventListener('click', e =>
  {
    e.preventDefault();
    const t = document.querySelector(a.getAttribute('href'));
    if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ─── Cinematic Hero Entrance ───
(function initHeroEntrance()
{
  const items = [
    document.querySelector('.avatar-wrapper'),
    document.querySelector('.hero-title'),
    document.querySelector('.hero-subtitle'),
    document.querySelector('.hero-socials'),
    document.querySelector('.cta-button'),
    document.querySelector('.scroll-indicator'),
  ];
  items.forEach((el, i) =>
  {
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(40px)';
    el.style.transition = `opacity .9s ease ${i * .15 + .2}s, transform .9s cubic-bezier(.175,.885,.32,1.275) ${i * .15 + .2}s`;
    requestAnimationFrame(() =>
    {
      setTimeout(() => { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; }, 100);
    });
  });
})();

// ─── Typewriter Effect ───
(function initTypewriter()
{
  const el = document.getElementById('typewriterText');
  if (!el) return;
  const phrases = ['BCA Student', 'Developer', 'Tech Enthusiast', 'Discord Bot Dev', 'Gamer', 'Builder'];
  let pi = 0, ci = 0, deleting = false;
  function tick()
  {
    const phrase = phrases[pi];
    el.textContent = deleting ? phrase.slice(0, ci--) : phrase.slice(0, ci++);
    const speed = deleting ? 60 : 100;
    if (!deleting && ci > phrase.length) { deleting = true; setTimeout(tick, 1500); return; }
    if (deleting && ci < 0) { deleting = false; pi = (pi + 1) % phrases.length; ci = 0; }
    setTimeout(tick, speed);
  }
  tick();
})();

// ─── Text Scramble on Section Titles ───
(function initScramble()
{
  const CHARS = 'アイウエオカキクケコサシスセソ0123456789ABCDEF!@#$%^&*';
  function scramble(el)
  {
    const original = el.textContent;
    let frame = 0;
    const interval = setInterval(() =>
    {
      el.textContent = original.split('').map((ch, i) =>
      {
        if (ch === ' ') return ' ';
        return frame / 2 > i ? original[i] : CHARS[Math.floor(Math.random() * CHARS.length)];
      }).join('');
      frame++;
      if (frame > original.length * 2) { el.textContent = original; clearInterval(interval); }
    }, 40);
  }
  document.querySelectorAll('.section-title').forEach(el =>
  {
    const obs = new IntersectionObserver(entries =>
    {
      entries.forEach(e => { if (e.isIntersecting) { scramble(e.target); obs.unobserve(e.target); } });
    }, { threshold: .6 });
    obs.observe(el);
  });
})();

// ─── Magnetic Button Effect ───
(function initMagnetic()
{
  document.querySelectorAll('.cta-button, .project-link, .music-btn').forEach(btn =>
  {
    btn.addEventListener('mousemove', e =>
    {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * .35, dy = (e.clientY - cy) * .35;
      btn.style.transform = `translate(${dx}px, ${dy}px) scale(1.05)`;
    });
    btn.addEventListener('mouseleave', () =>
    {
      btn.style.transition = 'transform .5s cubic-bezier(.175,.885,.32,1.275)';
      btn.style.transform = 'translate(0,0) scale(1)';
      setTimeout(() => btn.style.transition = '', 500);
    });
  });
})();

// ─── 3D Tilt Effect ───
(function initTilt()
{
  document.querySelectorAll('[data-tilt]').forEach(el =>
  {
    el.addEventListener('mousemove', e =>
    {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      el.style.transform = `perspective(900px) rotateX(${-y * 10}deg) rotateY(${x * 10}deg) scale(1.03)`;
      // Glow follows cursor
      el.style.setProperty('--glow-x', ((e.clientX - r.left) / r.width * 100) + '%');
      el.style.setProperty('--glow-y', ((e.clientY - r.top) / r.height * 100) + '%');
    });
    el.addEventListener('mouseleave', () =>
    {
      el.style.transition = 'transform .6s cubic-bezier(.215,.61,.355,1)';
      el.style.transform = 'perspective(900px) rotateX(0) rotateY(0) scale(1)';
      setTimeout(() => el.style.transition = '', 600);
    });
    el.addEventListener('mouseenter', () => el.style.transition = 'none');
  });
})();

// ─── Scroll Reveal (fixed) ───
(function initReveal()
{
  const elements = document.querySelectorAll(
    '.passion-card, .project-card, .section-header, .footer-content, .footer-bottom'
  );

  // Stagger delays
  document.querySelectorAll('.passions-grid .passion-card').forEach((el, i) =>
  {
    el.style.transitionDelay = (i * 0.13) + 's';
  });
  document.querySelectorAll('.projects-grid .project-card').forEach((el, i) =>
  {
    el.style.transitionDelay = (i * 0.15) + 's';
  });

  elements.forEach(el => el.classList.add('will-reveal'));

  const obs = new IntersectionObserver(
    (entries) =>
    {
      entries.forEach((entry) =>
      {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.05, rootMargin: '0px 0px 80px 0px' }
  );

  elements.forEach(el => obs.observe(el));

  // Immediately reveal anything already in the viewport
  setTimeout(() =>
  {
    elements.forEach(el =>
    {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('revealed');
        obs.unobserve(el);
      }
    });
  }, 300);
})();

// ─── Counter Animation ───
(function initCounters()
{
  document.querySelectorAll('[data-count]').forEach(el =>
  {
    const target = +el.dataset.count;
    const obs = new IntersectionObserver(entries =>
    {
      entries.forEach(e =>
      {
        if (!e.isIntersecting) return;
        let n = 0;
        const step = target / 60;
        const t = setInterval(() =>
        {
          n = Math.min(n + step, target);
          el.textContent = Math.floor(n) + (el.dataset.suffix || '');
          if (n >= target) clearInterval(t);
        }, 16);
        obs.unobserve(el);
      });
    }, { threshold: .8 });
    obs.observe(el);
  });
})();

// ─── Parallax Sections ───
(function initParallax()
{
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const orbs = hero.querySelectorAll('.hero-orb');

  window.addEventListener('scroll', () =>
  {
    const sy = window.scrollY;
    // Hero parallax on scroll
    const heroBg = hero.querySelector('.hero-bg-effects');
    if (heroBg) heroBg.style.transform = `translateY(${sy * .4}px)`;

    // Avatar subtle float up on scroll
    const av = hero.querySelector('.avatar-wrapper');
    if (av) av.style.transform = `translateY(${sy * .15}px)`;
  });

  // Mouse parallax on orbs
  document.addEventListener('mousemove', e =>
  {
    const px = (e.clientX / window.innerWidth - .5);
    const py = (e.clientY / window.innerHeight - .5);
    orbs.forEach((orb, i) =>
    {
      const spd = (i + 1) * 18;
      orb.style.transform = `translate(${px * spd}px, ${py * spd}px)`;
    });
  });
})();

// ─── Hero Glitch Text ───
(function initGlitch()
{
  const title = document.querySelector('.hero-title');
  if (!title) return;
  title.addEventListener('mouseenter', () =>
  {
    title.classList.add('glitching');
    setTimeout(() => title.classList.remove('glitching'), 800);
  });
})();

// ─── Cursor Trail Sparks ───
(function initSparks()
{
  const COLORS = ['#00ffea', '#ff00ff', '#00ff41', '#ff4466'];
  let lastTime = 0;
  document.addEventListener('mousemove', e =>
  {
    const now = Date.now();
    if (now - lastTime < 50) return;
    lastTime = now;
    const spark = document.createElement('div');
    spark.className = 'cursor-spark';
    spark.style.cssText = `left:${e.clientX}px;top:${e.clientY}px;background:${COLORS[Math.floor(Math.random() * COLORS.length)]}`;
    document.body.appendChild(spark);
    setTimeout(() => spark.remove(), 700);
  });
})();

// ─── Theme Color Cycling ───
(function initTheme()
{
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  const themes = [
    { p: '#00ffea', s: '#ff00ff', a: '#00ff41' },
    { p: '#ffd700', s: '#ff6b35', a: '#ffcc00' },
    { p: '#ff4488', s: '#aa00ff', a: '#ff88cc' },
    { p: '#8b5cf6', s: '#06b6d4', a: '#a78bfa' },
    { p: '#10b981', s: '#3b82f6', a: '#34d399' },
  ];
  let idx = 0;
  btn.addEventListener('click', () =>
  {
    idx = (idx + 1) % themes.length;
    const t = themes[idx];
    const r = document.documentElement.style;
    r.setProperty('--primary', t.p);
    r.setProperty('--secondary', t.s);
    r.setProperty('--accent', t.a);
    r.setProperty('--primary-glow', t.p + '80');
    r.setProperty('--secondary-glow', t.s + '59');
    r.setProperty('--border-subtle', t.p + '26');
    r.setProperty('--border-glow', t.p + '66');
    btn.style.transform = 'rotate(360deg)';
    setTimeout(() => btn.style.transform = '', 500);
  });
})();

// ─── Scroll-triggered Section Line Grow ───
(function initLineGrow()
{
  document.querySelectorAll('.section-line').forEach(el =>
  {
    el.style.transform = 'scaleX(0)';
    el.style.transformOrigin = 'left';
    el.style.transition = 'transform 1.2s cubic-bezier(.215,.61,.355,1)';
    const obs = new IntersectionObserver(entries =>
    {
      entries.forEach(e =>
      {
        if (e.isIntersecting) { e.target.style.transform = 'scaleX(1)'; obs.unobserve(e.target); }
      });
    }, { threshold: .5 });
    obs.observe(el);
  });
})();

// ─── Float Animation on Avatar ───
(function initAvatarFloat()
{
  const av = document.querySelector('.avatar-wrapper');
  if (!av) return;
  av.style.animation = 'avatarFloat 6s ease-in-out infinite';
})();

console.log('%c✨ KRISHNA PORTFOLIO — PREMIUM MOTION EDITION', 'color:#00ffea;font-family:monospace;font-size:14px;font-weight:bold');
