// Shared bits for the Free Arcade games: storage that never throws,
// tiny square-wave beeps, and a canvas that stays crisp at any size.
// Nothing here talks to the network. The only thing kept is a best time
// and the sound setting, in this browser's own storage.
window.Arcade = (() => {
  'use strict';

  const store = {
    get(key) { try { return window.localStorage.getItem(key); } catch (e) { return null; } },
    set(key, value) { try { window.localStorage.setItem(key, value); } catch (e) { /* private mode: fine */ } },
  };

  const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const Sound = {
    ac: null,
    muted: store.get('pnw-arcade-muted') === '1',
    unlock() {
      if (!this.ac) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (AC) { try { this.ac = new AC(); } catch (e) { this.ac = null; } }
      }
      if (this.ac && this.ac.state === 'suspended') this.ac.resume();
    },
    tone(freq, dur = 0.08, { type = 'square', vol = 0.05, when = 0, to = 0 } = {}) {
      if (this.muted || !this.ac) return;
      const t = this.ac.currentTime + when;
      const o = this.ac.createOscillator();
      const g = this.ac.createGain();
      o.type = type;
      o.frequency.setValueAtTime(freq, t);
      if (to) o.frequency.exponentialRampToValueAtTime(to, t + dur);
      g.gain.setValueAtTime(vol, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g).connect(this.ac.destination);
      o.start(t);
      o.stop(t + dur + 0.03);
    },
    tune(freqs, step = 0.09, opts = {}) {
      freqs.forEach((f, i) => this.tone(f, step * 0.95, { ...opts, when: i * step }));
    },
  };

  function bindMute(button) {
    const show = () => {
      button.textContent = Sound.muted ? '🔇 Sound off' : '🔊 Sound on';
      button.setAttribute('aria-pressed', String(!Sound.muted));
    };
    button.addEventListener('click', () => {
      Sound.muted = !Sound.muted;
      store.set('pnw-arcade-muted', Sound.muted ? '1' : '0');
      show();
    });
    show();
  }

  // A canvas drawn in fixed "logical" units (W x H) that fills its box sharply.
  function crisp(canvas, W, H) {
    const ctx = canvas.getContext('2d');
    const fit = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.round(r.width * dpr));
      const h = Math.max(1, Math.round(r.height * dpr));
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    };
    fit();
    if ('ResizeObserver' in window) new ResizeObserver(fit).observe(canvas);
    else window.addEventListener('resize', fit);
    return {
      ctx,
      begin() { ctx.setTransform(canvas.width / W, 0, 0, canvas.height / H, 0, 0); },
      toLogical(e) {
        const r = canvas.getBoundingClientRect();
        return { x: (e.clientX - r.left) / r.width * W, y: (e.clientY - r.top) / r.height * H };
      },
    };
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  const time = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  const randInt = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const shuffle = (list) => {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  };

  return { store, Sound, bindMute, crisp, roundRect, time, randInt, shuffle, reducedMotion };
})();
