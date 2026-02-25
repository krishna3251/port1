/* boxes.js — Black 3D Grid with Star Sparkle Hover Effect */
(function initBoxes()
{
    const canvas = document.getElementById('boxesCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W, H;
    let mouse = { x: -9999, y: -9999 };

    // ── Config ──
    const COLS = 24;
    const ROWS = 15;
    const GAP = 3;
    const GLOW_RADIUS = 160;   // px radius of hover effect
    const STAR_COLORS = ['#ffffff', '#FFD700', '#FFF0A0', '#FF6B00', '#FFE566'];

    // ── Resize ──
    function resize()
    {
        const hero = document.querySelector('.hero') || document.body;
        W = canvas.width = hero.offsetWidth || window.innerWidth;
        H = canvas.height = hero.offsetHeight || window.innerHeight;
        buildGrid();
    }
    window.addEventListener('resize', resize);

    // ── Grid ──
    let boxes = [];

    function buildGrid()
    {
        boxes = [];
        const cellW = (W - GAP * (COLS + 1)) / COLS;
        const cellH = (H - GAP * (ROWS + 1)) / ROWS;
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                const x = GAP + col * (cellW + GAP);
                const y = GAP + row * (cellH + GAP);
                boxes.push({
                    x, y,
                    w: cellW, h: cellH,
                    cx: x + cellW / 2,
                    cy: y + cellH / 2,
                    rise: 0,      // 0–1 animation
                    stars: [],    // live sparkle particles
                });
            }
        }
    }

    // ── Star (sparkle) particle ──
    function spawnStar(b)
    {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 1.5 + 0.5;
        b.stars.push({
            x: b.cx + (Math.random() - 0.5) * b.w * 0.8,
            y: b.cy + (Math.random() - 0.5) * b.h * 0.8,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 0.8, // bias upward
            life: 1,
            decay: Math.random() * 0.03 + 0.02,
            size: Math.random() * 3 + 1.5,
            color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
            twinkle: Math.random() * Math.PI * 2, // phase offset
        });
    }

    // ── Draw 4-point star shape ──
    function drawStar4(cx, cy, r, brightness)
    {
        ctx.beginPath();
        const pts = 4;
        for (let i = 0; i < pts * 2; i++) {
            const angle = (i * Math.PI) / pts - Math.PI / pts;
            const radius = i % 2 === 0 ? r : r * 0.2;
            const px = cx + Math.cos(angle) * radius;
            const py = cy + Math.sin(angle) * radius;
            i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fillStyle = `rgba(255,255,255,${brightness})`;
        ctx.fill();
    }

    // ── Draw one box ──
    function drawBox(b, dt)
    {
        const liftY = -b.rise * 18;
        const scale = 1 + b.rise * 0.12;

        ctx.save();
        ctx.translate(b.cx, b.cy);
        ctx.scale(scale, scale);
        ctx.translate(-b.cx, -b.cy);

        const x = b.x, y = b.y, w = b.w, h = b.h;

        // ── Box face: black with subtle top-edge glow when risen ──
        const baseAlpha = 0.18 + b.rise * 0.22;

        // Side extrude (very subtle, dark grey)
        if (b.rise > 0.05) {
            const depth = b.rise * 10;
            ctx.beginPath();
            ctx.moveTo(x, y + liftY + h);
            ctx.lineTo(x, y + liftY);
            ctx.lineTo(x - depth * 0.4, y + liftY - depth * 0.3);
            ctx.lineTo(x - depth * 0.4, y + liftY + h - depth * 0.3);
            ctx.closePath();
            ctx.fillStyle = `rgba(20,20,30,${b.rise * 0.5})`;
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(x + w, y + liftY + h);
            ctx.lineTo(x + w, y + liftY);
            ctx.lineTo(x + w + depth * 0.4, y + liftY - depth * 0.3);
            ctx.lineTo(x + w + depth * 0.4, y + liftY + h - depth * 0.3);
            ctx.closePath();
            ctx.fillStyle = `rgba(30,30,45,${b.rise * 0.4})`;
            ctx.fill();
        }

        // Top face — black/dark
        ctx.beginPath();
        ctx.roundRect(x, y + liftY, w, h, 3);
        ctx.fillStyle = `rgba(8, 8, 18, ${baseAlpha})`;
        ctx.fill();

        // Bright top-edge when risen (star-like gleam)
        if (b.rise > 0.15) {
            ctx.beginPath();
            ctx.roundRect(x, y + liftY, w, 1.5, 1);
            ctx.fillStyle = `rgba(255,255,255,${b.rise * 0.6})`;

            ctx.shadowColor = '#ffffff';
            ctx.shadowBlur = 8 * b.rise;
            ctx.fill();
            ctx.shadowBlur = 0;
        }

        ctx.restore();

        // ── Sparkle stars ──
        // Spawn new stars while hovering
        if (b.rise > 0.3 && Math.random() < b.rise * 0.4) {
            spawnStar(b);
        }

        // Update & draw existing stars
        const TWINKLE_SPEED = 8;
        for (let i = b.stars.length - 1; i >= 0; i--) {
            const s = b.stars[i];
            s.x += s.vx * dt * 60;
            s.y += s.vy * dt * 60;
            s.vy += 0.02;          // slight gravity
            s.life -= s.decay;
            s.twinkle += TWINKLE_SPEED * dt;

            if (s.life <= 0) { b.stars.splice(i, 1); continue; }

            const twinkleFactor = (Math.sin(s.twinkle) * 0.3 + 0.7); // 0.4–1.0
            const alpha = s.life * twinkleFactor;
            const size = s.size * s.life * twinkleFactor;

            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.shadowColor = s.color;
            ctx.shadowBlur = size * 4;

            // 4-point star sparkle
            drawStar4(s.x, s.y, size, alpha);

            // Also draw a small dot center
            ctx.beginPath();
            ctx.arc(s.x, s.y, size * 0.3, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.fill();

            ctx.restore();
        }
    }

    // ── Mouse tracking ──
    // Since canvas has pointer-events:none, track on the hero element
    const hero = document.querySelector('.hero') || document.body;

    function toCanvasCoords(e)
    {
        const rect = canvas.getBoundingClientRect();
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }

    hero.addEventListener('mousemove', e =>
    {
        const pos = toCanvasCoords(e);
        mouse.x = pos.x; mouse.y = pos.y;
    });
    hero.addEventListener('mouseleave', () =>
    {
        mouse.x = -9999; mouse.y = -9999;
    });

    // ── Animation loop ──
    let lastTime = 0;
    function animate(ts)
    {
        const dt = Math.min((ts - lastTime) / 1000, 0.05);
        lastTime = ts;

        ctx.clearRect(0, 0, W, H);

        for (const b of boxes) {
            const dx = mouse.x - b.cx;
            const dy = mouse.y - b.cy;
            const dist = Math.sqrt(dx * dx + dy * dy);

            const targetRise = dist < GLOW_RADIUS
                ? Math.pow(1 - dist / GLOW_RADIUS, 1.8)
                : 0;

            // Spring: fast rise, slower fall
            const speed = targetRise > b.rise ? 10 : 6;
            b.rise += (targetRise - b.rise) * speed * dt;

            if (b.rise < 0.001) b.rise = 0;

            drawBox(b, dt);
        }

        requestAnimationFrame(animate);
    }

    // ── Init ──
    resize();
    requestAnimationFrame(animate);
})();
