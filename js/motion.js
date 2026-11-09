/**
 * نبض — طبقة الحركة السينمائية (GSAP)
 * Frontend-Only Prototype (HTML5, CSS3, Vanilla JS, LocalStorage)
 * Part of the modular build. Load order is defined in index.html.
 */

'use strict';

  const Motion = {
    ok: false,
    reduced: false,
    ctx: null,

    isOk() { return this.ok && !this.reduced; },

    init() {
      this.reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (typeof gsap === 'undefined') return;
      if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
      this.ok = true;

      // Cinematic transit overlay lives outside #app so route re-renders never kill it
      if (!document.getElementById('transit-overlay')) {
        const overlay = document.createElement('div');
        overlay.id = 'transit-overlay';
        overlay.className = 'transit-overlay';
        overlay.innerHTML = '<div class="transit-overlay__brand"><svg viewBox="0 0 64 64" fill="none"><path d="M12 34h11l6-17 9 31 6-22 4 8h9" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg></div><div class="transit-overlay__label">عيادة نبض…</div>';
        document.body.appendChild(overlay);
      }

      this.attachMicro();
      this.initMedicalCursor();
    },

    /* ---------- shared helpers ---------- */

    reset() {
      if (this.ctx) { try { this.ctx.revert(); } catch (e) { /* noop */ } }
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.getAll().forEach(t => t.kill());
      gsap.killTweensOf('#app, #app *');
      gsap.set('[data-motion]', { clearProps: 'all' });
    },

    $view() { return document.getElementById('app'); },

    /* route entrance: global reveal */
    enter(container, delay = 0) {
      if (!this.isOk()) { gsap.set('[data-motion]', { opacity: 1, y: 0, scale: 1, clearProps: 'transform' }); return; }
      const items = container.querySelectorAll('[data-motion]');
      if (!items.length) return;
      gsap.fromTo(items,
        { opacity: 0, y: 34, scale: 0.985, filter: 'blur(6px)' },
        {
          opacity: 1, y: 0, scale: 1, filter: 'blur(0px)',
          duration: 0.9, delay, ease: 'power3.out',
          stagger: 0.055,
          onComplete: () => gsap.set(items, { filter: 'none', clearProps: 'scale' })
        });
    },

    stagger(selector, options = {}) {
      const container = this.$view();
      if (!container) return;
      const nodes = container.querySelectorAll(selector);
      if (!nodes.length) return;
      const cfg = Object.assign({ y: 26, duration: 0.62, stagger: 0.07, start: 0.05 }, options);
      if (!this.isOk()) { return; }
      gsap.fromTo(nodes,
        { opacity: 0, y: cfg.y },
        { opacity: 1, y: 0, duration: cfg.duration, stagger: cfg.stagger, delay: cfg.start, ease: 'power3.out', clearProps: 'transform' });
    },

    /* count-up numbers inside stat cards */
    counters() {
      if (!this.isOk()) return;
      this.$view().querySelectorAll('.stat-value').forEach(el => {
        const strong = el.querySelector('strong') || el;
        const raw = String(strong.textContent).trim();
        const match = raw.match(/-?\d[\d,]*(\.\d+)?/);
        if (!match) return;
        const end = parseFloat(match[0].replace(/,/g, ''));
        if (!isFinite(end)) return;
        const obj = { v: 0 };
        gsap.to(obj, {
          v: end, duration: 1.15, ease: 'power2.out',
          onUpdate: () => {
            const shown = Math.round(obj.v).toLocaleString('en-US');
            strong.textContent = raw.replace(match[0], shown);
          }
        });
      });
    },

    /* scroll-triggered reveals for any [data-reveal] blocks */
    reveals() {
      if (!this.isOk()) { gsap.set('[data-reveal]', { opacity: 1, y: 0 }); return; }
      gsap.fromTo('[data-reveal]',
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.85, ease: 'power3.out',
          stagger: 0.08,
          scrollTrigger: { trigger: this.$view(), start: 'top 85%', once: true }
        });
    },

    /* ---------- route transitions ---------- */

    /* route exit: cover with strips (doctor) or quick fade (others) */
    leave(cb) {
      if (!this.isOk()) { cb(); return; }
      if (this._leaving) { this._leaving = null; cb(); return; }
      const done = () => {
        clearTimeout(this._leaveGuard);
        this._leaving = null;
        cb();
      };
      this._leaving = true;
      // rAF-driven tweens never finish while the tab is hidden: always allow render
      this._leaveGuard = setTimeout(done, 900);

      if (App.currentRoute === 'doctor') {
        const wipe = document.getElementById('transit-wipe');
        if (wipe) {
          gsap.set(wipe, { display: 'block' });
          gsap.fromTo(wipe.children,
            { scaleY: 0, transformOrigin: 'top center' },
            { scaleY: 1, duration: 0.42, ease: 'power3.inOut', stagger: 0.08, onComplete: done });
          return;
        }
      }
      const shell = this.$view();
      if (shell && shell.children.length) {
        gsap.to(shell.children, { opacity: 0, y: -16, duration: 0.22, ease: 'power1.in', onComplete: done });
      } else {
        done();
      }
    },

    showWipe(optionalLabel) {
      const overlay = document.getElementById('transit-overlay');
      if (overlay) overlay.remove();
    },

    /* ---------- micro interactions ---------- */

    attachMicro() {
      const zone = this.$view();
      if (!zone || !this.isOk()) return;

      // one delegated ripple listener per container lifetime
      if (!zone.dataset.microBound) {
        zone.dataset.microBound = '1';
        zone.addEventListener('click', (e) => {
          const btn = e.target.closest('.btn');
          if (!btn) return;
          const rect = btn.getBoundingClientRect();
          gsap.fromTo(btn, { scale: 0.965 }, { scale: 1, duration: 0.42, ease: 'power2.out' });
          const ripple = document.createElement('span');
          ripple.className = 'btn-ripple';
          const size = Math.max(rect.width, rect.height) * 2.2;
          ripple.style.width = ripple.style.height = size + 'px';
          ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
          ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
          btn.appendChild(ripple);
          gsap.fromTo(ripple, { scale: 0, opacity: 0.38 }, { scale: 1, opacity: 0, duration: 0.68, ease: 'power2.out', onComplete: () => ripple.remove() });
        });
      }

      // magnetic hover, rebound on fresh nodes each render
      zone.querySelectorAll('.btn--accent, .btn--primary, .btn--danger').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
          const rect = btn.getBoundingClientRect();
          gsap.to(btn, {
            x: (e.clientX - rect.left - rect.width / 2) * 0.14,
            y: (e.clientY - rect.top - rect.height / 2) * 0.2,
            duration: 0.4, ease: 'power2.out'
          });
        });
        btn.addEventListener('mouseleave', () => {
          gsap.to(btn, { x: 0, y: 0, duration: 0.55, ease: 'elastic.out(1,0.45)' });
        });
      });

      // page-wide scroll progress film bar
      this.scrollFx();
    },

    scrollFx() {
      if (!this.isOk() || typeof ScrollTrigger === 'undefined') return;
      let bar = document.getElementById('scroll-progress');
      if (!bar) {
        bar = document.createElement('div');
        bar.id = 'scroll-progress';
        document.body.appendChild(bar);
      }
      gsap.to(bar, {
        scaleX: 1, ease: 'none',
        scrollTrigger: {
          trigger: document.body, start: 'top top', end: 'bottom bottom',
          scrub: 0.6, invalidateOnRefresh: true
        }
      });
      gsap.set(bar, { scaleX: 0 });
    },

    /* if the frame loop never runs (hidden panes), jump animations to their end so UI stays usable */
    watchdog() {
      if (!this.ok) return;
      const before = gsap.ticker.time;
      const d = new Date();
      setTimeout(() => {
        try {
          if (gsap.ticker.time === before) {
            gsap.globalTimeline.getChildren(true, true, true).forEach(t => {
              try { if (!t.vars.repeat) t.progress(1); } catch (e) { /* ignore */ }
            });
            const wipe = document.getElementById('transit-wipe');
            if (wipe) wipe.style.display = 'none';
            const overlay = document.getElementById('transit-overlay');
            if (overlay) overlay.style.display = 'none';
            const bar = document.getElementById('scroll-progress');
            if (bar) gsap.set(bar, { scaleX: 1 });
          }
        } catch (e) { /* ignore */ }
      }, 1100);
    },

    /* per-route choreography */
    run(route, subView) {
      const container = this.$view();
      if (!container) return;
      this.reset();
      window.scrollTo(0, 0);
      this.attachMicro();

      if (route === 'landing') return; // landing owns its own GSAP timeline
      if (route === 'doctor') return; // doctor dashboard: no animations (avoid double-load issue)

      var baseDelay = 0.15;

      // content choreography
      const units = this.collectUnits(container);
      if (units.length && this.isOk()) {
        units.forEach((el, i) => {
          gsap.fromTo(el,
            { opacity: 0, y: 30, filter: 'blur(4px)' },
            { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7, ease: 'power3.out',
              delay: baseDelay + i * 0.06, clearProps: 'filter' });
        });
      }

      // extra flourishes per view
      if (this.isOk()) {
        if (route === 'doctor' && subView === 'overview') this.counters();
        if (route === 'patient') this.patientFlair(container, subView);
      }
      this.watchdog();
    },

    /* ordered list of choreographable blocks in a view */
    collectUnits(container) {
      const selectors = '.page-heading, .stats-grid > .stat-card, .dashboard-stack > *, .week-card, .day-panel, .filter-card, .table-card, .setting-card, .settings-card, .profile-card, .backup-card, .danger-card, .clinic-summary, .order-summary, .booking-stage-card, .success-card, .session-empty, .unavailable-card, .auth-card, .auth-visual__center';
      const seen = new Set();
      const ordered = [];
      // treat each direct child of layout grids as one unit, then siblings
      container.querySelectorAll(selectors).forEach(el => {
        if (seen.has(el)) return;
        seen.add(el);
        ordered.push(el);
      });
      return ordered;
    },

    /* patient specific extras (dates ribbon, session cards, receipt rows) */
    patientFlair(container) {
      const dates = container.querySelectorAll('.booking-date');
      if (dates.length) {
        gsap.fromTo(dates, { opacity: 0, y: 22, scale: 0.94 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.06, ease: 'back.out(1.6)', delay: 0.5, clearProps: 'transform' });
      }
      const sessions = container.querySelectorAll('.session-option');
      if (sessions.length) {
        gsap.fromTo(sessions, { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.6, stagger: 0.07, ease: 'power3.out', delay: 0.65, clearProps: 'transform' });
      }
      const receiptRows = container.querySelectorAll('.receipt-row');
      if (receiptRows.length) {
        gsap.fromTo(receiptRows, { opacity: 0, x: 26 }, { opacity: 1, x: 0, duration: 0.55, stagger: 0.085, ease: 'power2.out', delay: 0.55, clearProps: 'transform' });
      }
      const processing = container.querySelector('.payment-processing');
      if (processing) {
        gsap.fromTo(processing.querySelectorAll('.processing-step'), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.12, delay: 0.25 });
      }
      const progressChildren = container.querySelector('.booking-progress') && container.querySelector('.booking-progress').children;
      if (progressChildren && progressChildren.length) {
        gsap.fromTo(progressChildren, { opacity: 0, y: 18, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.55, stagger: 0.08, ease: 'back.out(1.7)', delay: 0.2, clearProps: 'transform' });
      }
      // success icon celebratory pop
      const successIcon = container.querySelector('.success-icon');
      if (successIcon) {
        gsap.fromTo(successIcon, { scale: 0, rotate: -30 }, { scale: 1, rotate: 0, duration: 0.9, ease: 'elastic.out(1,0.55)', delay: 0.5 });
        gsap.fromTo(successIcon, { boxShadow: '0 0 0 0 rgba(27,79,198,0.4)' }, { boxShadow: '0 0 0 26px rgba(27,79,198,0)', duration: 1.4, repeat: 1, delay: 0.7, ease: 'power1.out' });
      }
    },

    /* light re-render animation for same-route updates */
    onSameRoute(route, subView) {
      const container = this.$view();
      if (!container) return;
      if (route === 'patient') {
        // new step content: slide the fresh card in like a film cut
        const fresh = container.querySelector('.booking-stage-card, .checkout-layout, .payment-layout, .success-card');
        if (fresh && this.isOk()) {
          gsap.fromTo(fresh,
            { opacity: 0, y: 46, scale: 0.985, filter: 'blur(5px)' },
            { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.75, ease: 'power3.out', clearProps: 'filter' });
        }
      }
      // no animations for doctor route (avoid double-load issue)
      this.attachMicro();
      this.initMedicalCursor();
    },

    /* modal entrance/exit driven by GSAP */
    modalIn(backdrop, panel) {
      if (!this.isOk()) return;
      gsap.fromTo(backdrop, { opacity: 0, filter: 'blur(0px)' }, { opacity: 1, filter: 'blur(6px)', duration: 0.5, ease: 'power3.out' });
      gsap.fromTo(panel,
        { opacity: 0, y: 70, scale: 0.94, rotateX: 10, transformPerspective: 900 },
        { opacity: 1, y: 0, scale: 1, rotateX: 0, duration: 0.66, ease: 'power4.out',
          onComplete: () => {
            const body = panel.querySelector('.modal__body');
            if (body && body.children.length) gsap.from(body.children, { opacity: 0, y: 22, duration: 0.5, stagger: 0.06, ease: 'power2.out' });
          } });
      // rAF can stall inside hidden panes: make sure the modal is always visible
      setTimeout(() => {
        try {
          if (getComputedStyle(panel).opacity === '0') {
            gsap.killTweensOf([panel, backdrop]);
            gsap.set(backdrop, { opacity: 1, clearProps: 'filter' });
            gsap.set(panel, { opacity: 1, y: 0, scale: 1, rotateX: 0 });
          }
        } catch (e) { /* ignore */ }
      }, 700);
    },

    modalOut(backdrop, panel, onDone) {
      gsap.to(panel, { opacity: 0, y: 46, scale: 0.96, duration: 0.32, ease: 'power2.in' });
      gsap.to(backdrop, { opacity: 0, duration: 0.28, delay: 0.1, onComplete: onDone });
      // never trap the user inside a frozen modal
      setTimeout(() => {
        try { gsap.killTweensOf([panel, backdrop]); } catch (e) { /* ignore */ }
        onDone();
      }, 650);
    },

    /* toast slide-in */
    toastIn(toast) {
      if (!this.isOk()) return;
      gsap.fromTo(toast, { x: 44, opacity: 0, scale: 0.92 }, { x: 0, opacity: 1, scale: 1, duration: 0.72, ease: 'back.out(1.55)' });
    },

    /* ══════════════════════════════════════════════════════════════════════
       CLINICAL GSAP MEDICAL CURSOR & ACOUSTIC SHOCKWAVE SYSTEM
       ══════════════════════════════════════════════════════════════════════ */
    initMedicalCursor() {
      if (this.reduced) return;
      if (document.getElementById('med-cursor-wrap')) return;

      const wrap = document.createElement('div');
      wrap.id = 'med-cursor-wrap';
      wrap.className = 'med-cursor-wrap';
      wrap.setAttribute('aria-hidden', 'true');
      wrap.style.opacity = '0';
      wrap.innerHTML = `
        <div class="med-cursor-ring" id="med-cursor-ring">
          <div class="med-clinic-badge" id="med-clinic-badge" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M9 3a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 3v5h5a1.5 1.5 0 0 1 1.5 1.5v3A1.5 1.5 0 0 1 20 14h-5v5a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 19v-5H4a1.5 1.5 0 0 1-1.5-1.5v-3A1.5 1.5 0 0 1 4 8h5V3z"/>
            </svg>
          </div>
          <div class="med-cursor-label" id="med-cursor-label"></div>
        </div>
        <div class="med-cursor-dot" id="med-cursor-dot"></div>
      `;
      document.body.appendChild(wrap);

      const ring = document.getElementById('med-cursor-ring');
      const dot = document.getElementById('med-cursor-dot');
      const label = document.getElementById('med-cursor-label');

      if (!ring || !dot) return;

      let targetX = -100;
      let targetY = -100;
      let ringX = -100;
      let ringY = -100;
      let ringScale = 1;
      let targetScale = 1;
      let isVisible = false;
      let currentHoverTarget = null;
      let isInsideWindow = false;
      let mobileHideTimeout = null;

      const isFinePointer = () => {
        return window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
      };

      // Ultrasound Acoustic Click Shockwave
      const triggerShockwave = (x, y) => {
        const ripple = document.createElement('div');
        ripple.className = 'med-cursor-shockwave';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        document.body.appendChild(ripple);

        if (typeof gsap !== 'undefined') {
          gsap.fromTo(ripple,
            { scale: 0.2, opacity: 0.85 },
            {
              scale: 2.8,
              opacity: 0,
              duration: 0.6,
              ease: 'power2.out',
              onComplete: () => ripple.remove()
            }
          );
        } else {
          setTimeout(() => ripple.remove(), 600);
        }
      };

      // Mobile Touch Tap handler: shows cursor at tap point and auto disappears after a moment (phones only)
      const handleMobileTap = (clientX, clientY) => {
        targetX = clientX;
        targetY = clientY;
        ringX = clientX;
        ringY = clientY;
        isInsideWindow = true;

        dot.style.transform = `translate3d(${clientX}px, ${clientY}px, 0) translate(-50%, -50%)`;
        ring.style.transform = `translate3d(${clientX}px, ${clientY}px, 0) translate(-50%, -50%) scale(1.15)`;

        wrap.style.transition = 'opacity 0.15s ease';
        wrap.style.opacity = '1';
        isVisible = true;

        triggerShockwave(clientX, clientY);

        if (mobileHideTimeout) clearTimeout(mobileHideTimeout);
        mobileHideTimeout = setTimeout(() => {
          wrap.style.transition = 'opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1)';
          wrap.style.opacity = '0';
          isVisible = false;
        }, 750);
      };

      // Unbreakable RAF render loop (100% immune to GSAP timeline kills or router resets)
      function renderCursorLoop() {
        if (isInsideWindow && targetX >= 0 && targetY >= 0) {
          // Smooth fluid trailing physics for the stethoscope ring
          ringX += (targetX - ringX) * 0.25;
          ringY += (targetY - ringY) * 0.25;
          ringScale += (targetScale - ringScale) * 0.2;

          ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${ringScale})`;
        }
        requestAnimationFrame(renderCursorLoop);
      }
      requestAnimationFrame(renderCursorLoop);

      // Instant hardware-rate pointer tracking
      const onPointerMove = (e) => {
        if (e.pointerType === 'touch') {
          handleMobileTap(e.clientX, e.clientY);
          return;
        }

        targetX = e.clientX;
        targetY = e.clientY;
        isInsideWindow = true;

        // Position the central precision dot synchronously with zero lag
        dot.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%)`;

        if (!isVisible) {
          isVisible = true;
          wrap.style.transition = 'opacity 0.2s ease';
          wrap.style.opacity = '1';
          if (isFinePointer()) {
            document.body.classList.add('has-custom-cursor');
          }
          // Start ring directly at mouse position so it never jumps from (0,0)
          ringX = targetX;
          ringY = targetY;
          ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${ringScale})`;
        }

        // Contextual medical hover detection
        const target = e.target.closest(
          'button, a, input, textarea, select, [data-cursor], .mont-doctor-img, .mont-doctor-frame, .mont-bento-card, .mont-review-card, .mont-journey-step, .mont-faq-trigger, .mont-metric-item'
        );

        if (target !== currentHoverTarget) {
          currentHoverTarget = target;
          if (target) {
            let labelText = target.getAttribute('data-cursor') || '';
            const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);

            if (isInput) {
              targetScale = 0.5;
              labelText = '';
              ring.classList.add('is-input');
            } else {
              ring.classList.remove('is-input');
              targetScale = 1.45;
              if (!labelText) {
                if (target.closest('#mont-cta-consultation, #mont-nav-consultation, #mobile-nav-consultation, #mont-hero-consultation, .mont-btn-primary, .mont-btn-reserve')) {
                  labelText = 'احجز الآن';
                  targetScale = 1.7;
                } else if (target.closest('.mont-doctor-frame, .mont-doctor-img')) {
                  labelText = 'د. أحمد';
                  targetScale = 1.9;
                } else if (target.closest('.mont-review-card')) {
                  labelText = 'رأي موثق ★';
                  targetScale = 1.4;
                } else if (target.closest('.mont-bento-card')) {
                  labelText = 'فحص سريري';
                  targetScale = 1.35;
                } else if (target.closest('.mont-journey-step')) {
                  labelText = 'خطوة الكشف';
                  targetScale = 1.3;
                } else if (target.closest('.mont-faq-trigger')) {
                  labelText = 'استفسار';
                  targetScale = 1.3;
                } else if (target.closest('.mont-metric-item')) {
                  labelText = 'إحصائية';
                  targetScale = 1.3;
                }
              }
            }

            if (label) {
              if (labelText) {
                label.textContent = labelText;
                label.style.opacity = '1';
                label.style.transform = 'scale(1)';
              } else {
                label.style.opacity = '0';
                label.style.transform = 'scale(0.7)';
              }
            }
          } else {
            // Revert to normal
            targetScale = 1;
            ring.classList.remove('is-input');
            if (label) {
              label.style.opacity = '0';
              label.style.transform = 'scale(0.7)';
            }
          }
        }
      };

      window.addEventListener('pointermove', onPointerMove, { passive: true });
      window.addEventListener('mousemove', onPointerMove, { passive: true });

      // Mobile Touch Listeners (phones only: auto-disappear after a moment)
      window.addEventListener('touchstart', (e) => {
        if (e.touches && e.touches[0]) {
          handleMobileTap(e.touches[0].clientX, e.touches[0].clientY);
        }
      }, { passive: true });

      window.addEventListener('pointerdown', (e) => {
        if (e.pointerType === 'touch') {
          handleMobileTap(e.clientX, e.clientY);
        }
      }, { passive: true });

      window.addEventListener('mouseleave', () => {
        isInsideWindow = false;
        isVisible = false;
        wrap.style.opacity = '0';
        document.body.classList.remove('has-custom-cursor');
      });

      window.addEventListener('mouseenter', (e) => {
        if (!isFinePointer()) return;
        isInsideWindow = true;
        targetX = e.clientX;
        targetY = e.clientY;
        ringX = targetX;
        ringY = targetY;
        wrap.style.opacity = '1';
        isVisible = true;
        document.body.classList.add('has-custom-cursor');
      });

      // Desktop Click Shockwave
      window.addEventListener('click', (e) => {
        if (!isFinePointer()) return;

        targetScale = 0.85;
        setTimeout(() => { targetScale = currentHoverTarget ? 1.45 : 1; }, 130);
        triggerShockwave(e.clientX, e.clientY);
      });
    }
  };
